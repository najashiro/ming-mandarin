#!/usr/bin/env python3
"""Build auditable Mix priorities from registered material, never learner history.

The output is an editorial sampling policy, not measured cognitive difficulty.
Original corpus records and lexical/example links are never rewritten.
"""
from __future__ import annotations

import argparse
from collections import Counter, defaultdict
from copy import deepcopy
import hashlib
import json
import math
from pathlib import Path
import re
import sys

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "MING_KNOWLEDGE/v2"))
import query  # noqa: E402

CATEGORIES = ("dialogue", "grammar", "reading", "exercise", "editorialGrammar")
GROUPS = ("core", "consolidation", "extension")
SCOPES = {f"l{lesson}": [lesson] for lesson in range(1, 7)}
SCOPES.update({"-".join(f"l{n}" for n in range(1, last + 1)): list(range(1, last + 1)) for last in range(2, 7)})
CONTEXT_ROLES = {"workbook_context", "phrase_context", "worksheet_sequence", "numeral_in_context", "context_only"}
EXTENSION_ROLES = {"classroom_extension", "classroom_expression", "colloquial_classroom", "proper_name", "visual_label", "supplementary_review"}


def read(relative):
    return json.loads((ROOT / relative).read_text(encoding="utf-8"))


def normalize(text):
    # Preserve word boundaries and CJK content; punctuation variants are copies.
    return re.sub(r"[\s，。！？、；：,.!?;:'\"“”‘’（）()]", "", text)


def included(link):
    return (link.get("list_type") in {"new_vocabulary", "supplementary_vocabulary"}
            or link.get("role") in {"core_review"} | CONTEXT_ROLES | EXTENSION_ROLES)


def load_catalog():
    public = {lesson: read(f"data/lesson{lesson}-public.json") for lesson in (4, 5, 6)}
    reviewed = read("data/lessons123-public.json")
    catalog = {word["id"]: deepcopy(word) for word in reviewed["vocabulary"]}
    for lesson in (4, 5, 6):
        for incoming in public[lesson]["vocabulary"]:
            if incoming["id"] in catalog:
                catalog[incoming["id"]]["curriculumLinks"] += incoming["curriculumLinks"]
            else:
                catalog[incoming["id"]] = deepcopy(incoming)
    # Follow the existing eligibility adapter, including its deliberate L1–L3
    # first-lesson partition and complete, possibly overlapping L4–L6 lists.
    assigned = set()
    exclusive = {}
    for lesson in range(1, 7):
        candidates = public[lesson]["vocabulary"] if lesson >= 4 else catalog.values()
        ids = [word["id"] for word in candidates if any(link["lesson"] == lesson and included(link) for link in word["curriculumLinks"])]
        exclusive[lesson] = [word_id for word_id in ids if word_id not in assigned]
        assigned.update(ids)
    source = (ROOT / "lib/vocabulary.ts").read_text(encoding="utf-8")
    exclusion_block = re.search(r"vocabularyMixExcludedIds = new Set\(\[(.*?)\]\)", source, re.S)
    if not exclusion_block:
        raise ValueError("Could not read the existing Mix exclusions")
    excluded = set(re.findall(r"'([^']+)'", exclusion_block.group(1)))
    scopes = {}
    for scope, lessons in SCOPES.items():
        if len(lessons) == 1 and lessons[0] >= 4:
            ids = [word["id"] for word in public[lessons[0]]["vocabulary"]]
        else:
            ids = [word_id for lesson in lessons for word_id in exclusive[lesson]]
        scopes[scope] = sorted(set(ids) - excluded)
    return catalog, scopes


def make_segmenter(catalog, source_words, aliases):
    """Non-overlapping longest lexical tokens, NOT character substring counts.

    This is a derived annotation only, needed where the source has no full
    lexical spans (L5/L6). Existing annotations are preferred elsewhere.
    Unknown runs remain gaps; no words or examples are added to the corpus.
    """
    lexicon = {word["hanzi"]: word["id"] for word in [*source_words, *catalog.values()]
               if re.fullmatch(r"[\u3400-\u9fff]+", word["hanzi"])}
    lexicon.update(aliases)
    prefixes = defaultdict(list)
    for surface in lexicon:
        prefixes[surface[0]].append(surface)
    for values in prefixes.values():
        values.sort(key=lambda surface: (-len(surface), surface))

    def segment(text):
        tokens = []
        gaps = []
        index = 0
        while index < len(text):
            surface = next((candidate for candidate in prefixes[text[index]] if text.startswith(candidate, index)), None)
            if surface is not None:
                tokens.append((lexicon[surface], surface, index, index + len(surface)))
                index += len(surface)
            else:
                if re.match(r"[\u3400-\u9fff]", text[index]):
                    gaps.append(text[index])
                index += 1
        return tokens, gaps
    return segment


def collect_contexts(catalog):
    query.ensure_cache()
    evidence = query.read_table("phrase_evidence")
    sources = {row["id"]: row for row in query.read_table("sources")}
    spans = defaultdict(list)
    for row in query.read_table("word_phrase_spans"):
        if row["relation"] == "lexical_token":
            spans[row["phrase_evidence_id"]].append(row)
    grammar_evidence = {row["id"]: row for row in query.read_table("grammar_evidence")}
    grammar_phrases = set()
    for row in query.read_table("grammar_phrase_links"):
        witness = grammar_evidence.get(row.get("grammar_evidence_id"))
        if witness and sources[witness["source_id"]]["kind"] in {"textbook", "workbook"}:
            grammar_phrases.add((witness["lesson"], row["phrase_id"]))
        elif row.get("source_id") in sources and sources[row["source_id"]]["kind"] in {"textbook", "workbook"}:
            # L4 links preserve their witness/source directly, without GE IDs.
            grammar_phrases.add((row["lesson"], row["phrase_id"]))
    contexts = {}
    skipped = Counter()
    gap_counts = Counter()

    def add(lesson, category, text, tokens, reference, method):
        # A book/PPT/export copy cannot add weight. Within a category, repeated
        # identical enunciados count once; repeated tokens inside it still count.
        key = (lesson, category, normalize(text))
        if not key[2]:
            return
        counts = Counter(token[0] for token in tokens if token[0] in catalog)
        previous = contexts.get(key)
        if previous:
            previous["references"].add(reference)
            previous["methods"].add(method)
            previous["counts"] |= counts
        else:
            contexts[key] = {"counts": counts, "references": {reference}, "methods": {method}}

    for row in evidence:
        if row.get("lesson") not in (1, 2, 3, 4):
            continue
        if sources[row["source_id"]]["kind"] not in {"textbook", "workbook"}:
            skipped["non_primary_source_witnesses"] += 1
            continue
        if row.get("kind") == "counterexample" or row.get("review_status") in {"not_a_positive_example", "needs_review"}:
            skipped["counterexamples_or_unresolved"] += 1
            continue
        kind = row.get("kind", "")
        category = ("dialogue" if kind in {"dialogue_turn", "secondary_dialogue_turn"}
                    else "grammar" if kind.startswith("grammar")
                    else "reading" if kind.startswith("reading")
                    else "exercise")
        tokens = []
        for span in spans[row["id"]]:
            # The corpus is Unicode-code-point indexed. Reject inconsistent spans
            # instead of quietly treating malformed offsets as observed tokens.
            if row["hanzi"][span["start"]:span["end"]] != span["surface"]:
                skipped["inconsistent_lexical_spans"] += 1
                continue
            tokens.append((span["vocab_id"], span["surface"], span["start"], span["end"]))
        reference = f'{row["source_id"]}:p{row["page"]}:{row["id"]}'
        add(row["lesson"], category, row["hanzi"], tokens, reference, "registered_lexical_spans")
        if (row["lesson"], row["phrase_id"]) in grammar_phrases and category != "grammar":
            add(row["lesson"], "grammar", row["hanzi"], tokens, reference, "registered_grammar_link_and_lexical_spans")

    aliases = read("MING_KNOWLEDGE/v2/lesson4/lexical-links.json")["approved_surface_aliases"]
    segment = make_segmenter(catalog, query.read_table("vocabulary"), aliases)
    for lesson in (5, 6):
        source = read(f"MING_KNOWLEDGE/v2/lesson{lesson}/content.json")

        def add_derived(category, text, row, key, annotated=None):
            tokens, gaps = segment(text)
            method = "derived_nonoverlapping_lexicon"
            if annotated:
                # Explicit token boundaries are more authoritative than our derived
                # segmentation; map exact token forms only, without decomposition.
                mapping = {word["hanzi"]: word["id"] for word in catalog.values()}
                mapping.update(aliases)
                tokens = [(mapping[token], token, 0, len(token)) for token in annotated if token in mapping]
                method = "registered_sentence_tokens"
            else:
                gap_counts[lesson] += len(gaps)
            source_ref = row.get("source", {})
            reference = f'L{lesson}:{key}:{source_ref.get("file", "")}:p{source_ref.get("pdfPage", "")}'
            add(lesson, category, text, tokens, reference, method)

        for dialogue in source["dialogues"]:
            for turn in dialogue["turns"]:
                add_derived("dialogue", turn["hanzi"], turn, f'{dialogue["id"]}:turn{turn["turn"]}')
        for reading in source["readings"]:
            # Source readings have full text; split punctuation into enunciados so
            # a whole long passage does not count as just one lexical context.
            for index, sentence in enumerate(re.split(r"[。！？!?]+", reading["hanzi"])):
                if sentence.strip():
                    add_derived("reading", sentence, reading, f'{reading["id"]}:{index}')
        for sentence in source["sentences"]:
            add_derived("exercise", sentence["hanzi"], sentence, sentence["id"], sentence.get("tokens"))
        for grammar in source["grammar"]:
            # These are explicitly editorial explanations. Preserve this signal in
            # its own column, NEVER as documentary grammar frequency.
            for index, example in enumerate(grammar["examples"]):
                add_derived("editorialGrammar", example, grammar, f'{grammar["id"]}:{index}')
        skipped[f"L{lesson}_editorial_activity_records"] = len(source["documentaryExercises"])
    return contexts, dict(sorted(skipped.items())), {str(k): v for k, v in sorted(gap_counts.items())}


def role_value(links):
    if any(link.get("list_type") == "new_vocabulary" for link in links):
        return 12, "principal"
    if any(link.get("role") == "core_review" for link in links):
        return 10, "repaso_esencial"
    if any(link.get("list_type") == "supplementary_vocabulary" for link in links):
        return 4, "complementario"
    return 1, "contextual"


def build():
    catalog, scopes = load_catalog()
    contexts, skipped, gaps = collect_contexts(catalog)
    by_word = defaultdict(lambda: defaultdict(lambda: {category: Counter(contexts=0, occurrences=0) for category in CATEGORIES}))
    references = defaultdict(set)
    methods = defaultdict(set)
    distinct = defaultdict(set)
    for (lesson, category, text), context in sorted(contexts.items()):
        for word_id, count in sorted(context["counts"].items()):
            by_word[word_id][lesson][category].update(contexts=1, occurrences=count)
            references[(word_id, lesson)].update(context["references"])
            methods[(word_id, lesson)].update(context["methods"])
            if category != "editorialGrammar":
                distinct[(word_id, lesson)].add(text)
    stats = {}
    for word_id in sorted(set().union(*map(set, scopes.values()))):
        word = catalog[word_id]
        lessons = {}
        for lesson in range(1, 7):
            links = [link for link in word["curriculumLinks"] if link["lesson"] == lesson]
            if not links and lesson not in by_word[word_id]:
                continue
            counts = by_word[word_id][lesson]
            role_score, role = role_value(links)
            # No observation is not proof of rarity: an unseen core word retains
            # the curricular prior, with explicit curricular_only confidence.
            score = role_score + sum(weight * math.log1p(counts[category]["contexts"])
                                     for category, weight in zip(CATEGORIES, (6, 4, 2, 1, 1)))
            score += 1.5 * sum(counts[category]["contexts"] > 0 for category in CATEGORIES[:-1])
            confidence = ("curricular_only" if not distinct[(word_id, lesson)] else
                          "derived_lexical_counts" if lesson >= 5 else "registered_lexical_counts")
            lessons[lesson] = dict(role=role, roleScore=role_score, counts=counts,
                                   contexts=len(distinct[(word_id, lesson)]), score=round(score, 6), confidence=confidence)
        stats[word_id] = lessons
    maxima = {lesson: max((values[lesson]["score"] for values in stats.values() if lesson in values), default=1)
              for lesson in range(1, 7)}
    rankings = {}
    for scope, ids in scopes.items():
        lessons = SCOPES[scope]
        values = []
        for word_id in ids:
            available = [stats[word_id][lesson] for lesson in lessons if lesson in stats[word_id]]
            score = max((100 * stats[word_id][lesson]["score"] / maxima[lesson]
                         for lesson in lessons if lesson in stats[word_id]), default=0)
            # Small, bounded breadth bonus; raw volume in a longer lesson cannot
            # overwhelm the best local relevance of a word in another lesson.
            score += min(5, max(0, sum(item["contexts"] > 0 for item in available) - 1))
            values.append((word_id, round(score, 6)))
        values.sort(key=lambda item: (-item[1], item[0]))
        first = math.ceil(len(values) * .35)
        second = math.ceil(len(values) * .70)
        rankings[scope] = {word_id: {"group": GROUPS[0 if index < first else 1 if index < second else 2], "score": score}
                           for index, (word_id, score) in enumerate(values)}
    fingerprint_data = {
        "catalog": [{"id": word_id, "links": word["curriculumLinks"]} for word_id, word in sorted(catalog.items())],
        "contexts": [{"lesson": key[0], "category": key[1], "text": key[2], "counts": sorted(value["counts"].items())}
                     for key, value in sorted(contexts.items())], "scopes": scopes,
    }
    fingerprint = hashlib.sha256(json.dumps(fingerprint_data, ensure_ascii=False, sort_keys=True).encode()).hexdigest()
    payload = {"version": 1, "method": "registered-corpus-priorities-v1", "fingerprint": fingerprint, "scopes": rankings}
    # Comprehensive audit data stays out of the client bundle.
    header = ["word_id", "hanzi", "lesson", "curricular_role", "dialogue_contexts", "dialogue_occurrences", "grammar_contexts", "grammar_occurrences", "reading_contexts", "reading_occurrences", "exercise_contexts", "exercise_occurrences", "editorial_grammar_contexts", "unique_documentary_contexts", "local_score", "confidence", "scope_groups", "methods", "evidence"]
    rows = [header]
    for word_id, lessons in stats.items():
        for lesson, item in sorted(lessons.items()):
            values = [word_id, catalog[word_id]["hanzi"], lesson, item["role"]]
            values += [item["counts"][category][metric] for category in CATEGORIES[:-1] for metric in ("contexts", "occurrences")]
            values += [item["counts"]["editorialGrammar"]["contexts"], item["contexts"], item["score"], item["confidence"],
                       ";".join(f'{scope}:{ranking[word_id]["group"]}' for scope, ranking in rankings.items() if word_id in ranking and lesson in SCOPES[scope]),
                       (";".join(sorted(methods[(word_id, lesson)])) or "none"), (";".join(sorted(references[(word_id, lesson)])) or "none")]
            rows.append([str(value).replace("\t", " ").replace("\n", " ") for value in values])
    table = "\n".join("\t".join(row) for row in rows) + "\n"
    report = {"version": 1, "fingerprint": fingerprint, "eligibleWords": len(scopes["l1-l2-l3-l4-l5-l6"]),
              "uniqueWordsAcrossAllScopes": len(stats), "wordLessonRows": len(rows) - 1,
              "groups": {scope: dict(Counter(value["group"] for value in ranking.values())) for scope, ranking in rankings.items()},
              "contextsByLesson": {str(lesson): dict(Counter(key[1] for key in contexts if key[0] == lesson)) for lesson in range(1, 7)},
              "confidence": dict(Counter(item["confidence"] for values in stats.values() for item in values.values())),
              "skipped": skipped, "unsegmentedCjkCodepointsL5L6": gaps}
    return payload, table, report


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--check", action="store_true", help="Fail if committed priorities or audit table are stale")
    args = parser.parse_args()
    payload, table, report = build()
    outputs = {
        "data/vocabulary-mix-priorities.json": json.dumps(payload, ensure_ascii=False, separators=(",", ":")) + "\n",
        "docs/vocabulary-mix-priorities.tsv": table,
        "docs/vocabulary-mix-priorities-report.json": json.dumps(report, ensure_ascii=False, indent=2) + "\n",
    }
    for path, content in outputs.items():
        destination = ROOT / path
        if args.check:
            if not destination.is_file() or destination.read_text(encoding="utf-8") != content:
                raise SystemExit(f"Stale Mix priorities: {path}. Run {Path(__file__).name}.")
        else:
            destination.write_text(content, encoding="utf-8")
    print(json.dumps({"eligibleWords": report["eligibleWords"], "wordLessonRows": report["wordLessonRows"], "groups": report["groups"], "checked": args.check}, ensure_ascii=False))


if __name__ == "__main__":
    main()
