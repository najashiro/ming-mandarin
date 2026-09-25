#!/usr/bin/env python3
"""Build the allow-listed, source-free application projection for corpus v2.1."""
from __future__ import annotations

import hashlib
import json
import subprocess
import tempfile
import sys
from pathlib import Path
from vocabulary_projection import enrich_vocabulary

ROOT = Path(__file__).resolve().parents[1]
QUERY = ROOT / "MING_KNOWLEDGE/v2/query.py"
OUT = ROOT / "data/corpus-v21-public.json"


def first_value(rows: list[dict], key: str) -> str | None:
    return next((row.get("value") for row in rows if row.get("value")), None)


with tempfile.TemporaryDirectory(prefix="ming-corpus-v21-") as tmp:
    subprocess.run([sys.executable, str(QUERY), "--validate"], cwd=ROOT, check=True, stdout=subprocess.DEVNULL)
    subprocess.run([sys.executable, str(QUERY), "--export", tmp], cwd=ROOT, check=True, stdout=subprocess.DEVNULL)
    source = Path(tmp)
    load = lambda name: json.loads((source / f"{name}.json").read_text(encoding="utf-8"))
    vocabulary, phrases, dialogues = load("vocabulary"), load("phrases"), load("dialogues")
    phrase_evidence, hanzi = load("phrase_evidence"), load("hanzi")
    vocabulary_by_hanzi = {row["hanzi"]: row for row in vocabulary}
    hanzi_by_id = {row["id"]: row for row in hanzi}

    public_vocab = [{
        "id": row["id"], "hanzi": row["hanzi"],
        "pinyin": first_value(row.get("pinyin_variants", []), "value"),
        "spanish": first_value(row.get("spanish_variants", []), "value"),
        "lessons": row.get("lessons", []), "roles": row.get("roles", []),
    } for row in vocabulary if row.get("pinyin_variants") and row.get("spanish_variants")]
    enrich_vocabulary(public_vocab, load)

    public_phrases = [{
        "id": row["id"], "hanzi": row["hanzi"],
        "pinyin": first_value(row.get("pinyin_variants", []), "value"),
        "spanish": first_value(row.get("spanish_variants", []), "value"),
        "lessons": row.get("lessons", []), "kinds": row.get("kinds", []),
        "vocabIds": row.get("vocab_ids", []), "dialogueIds": row.get("dialogue_ids", []),
    } for row in phrases if "counterexample" not in row.get("kinds", [])]

    public_dialogues = []
    for dialogue in dialogues:
        # The learner-facing dialogue is specifically the textbook witness. PPT
        # variants remain intact in the internal corpus and never enter this projection.
        if "-BOOK-" not in dialogue["id"]:
            continue
        text = "Texto 2" if "T2" in dialogue["id"] else "Texto 1"
        turns = []
        for turn in dialogue["turns"]:
            matches = [row for row in phrase_evidence
                       if row.get("dialogue_id") == dialogue["id"]
                       and row.get("turn") == turn["turn"]
                       and row.get("hanzi") == turn["hanzi"]
                       and row.get("speaker_source") == turn.get("speaker_source")]
            if len(matches) != 1:
                raise RuntimeError(f"Expected one exact witness for {dialogue['id']} turn {turn['turn']}; got {len(matches)}")
            witness = matches[0]
            speaker = turn.get("speaker_source")
            speaker_vocab = vocabulary_by_hanzi.get(speaker, {})
            speaker_pinyin = first_value(speaker_vocab.get("pinyin_variants", []), "value")
            turns.append({"turn": turn["turn"], "speaker": turn.get("speaker_source"), "hanzi": turn["hanzi"],
                          "speakerPinyin": speaker_pinyin, "phraseId": witness["phrase_id"],
                          "pinyin": witness.get("pinyin_source"), "spanish": witness.get("spanish_source")})
        public_dialogues.append({"id": dialogue["id"], "lesson": dialogue["lesson"], "text": text, "turns": turns})

    catalog = {row["id"]: row for row in load("radical_catalog") if row.get("metadata_status") == "explicit_textbook_definition"}
    evidence = {row["id"]: row for row in load("radical_evidence")}
    links = [row for row in load("radical_hanzi_links") if row.get("assignment_status") == "documented_in_course_source" and row["radical_id"] in catalog]
    public_radicals = []
    for rid, row in catalog.items():
        examples = []
        for link in links:
            if link["radical_id"] != rid:
                continue
            lessons = sorted({evidence[eid]["lesson"] for eid in link.get("source_evidence_ids", []) if eid in evidence and evidence[eid].get("lesson")})
            readings = hanzi_by_id.get(link["hanzi_id"], {}).get("readings", [])
            pinyin = first_value(readings, "value")
            if pinyin and lessons:
                examples.append({"hanzi": link["hanzi"], "pinyin": pinyin, "lessons": lessons})
        public_radicals.append({"id": rid, "radical": row["radical"], "name": row.get("name_source"),
                                "meaning": row.get("meaning_source"), "explanation": row.get("explanation_source"),
                                "strokeCount": row.get("stroke_count_source"), "lessons": row.get("lessons", []), "examples": examples})

    payload = {"version": "2.1.0", "vocabulary": public_vocab, "phrases": public_phrases,
               "dialogues": public_dialogues, "radicals": public_radicals}
    canonical = json.dumps(payload, ensure_ascii=False, separators=(",", ":")).encode()
    payload["fingerprint"] = hashlib.sha256(canonical).hexdigest()
    OUT.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Wrote {OUT.relative_to(ROOT)} ({payload['fingerprint']})")
