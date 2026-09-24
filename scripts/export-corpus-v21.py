#!/usr/bin/env python3
"""Build the allow-listed, source-free application projection for corpus v2.1."""
from __future__ import annotations

import hashlib
import json
import subprocess
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
QUERY = ROOT / "MING_KNOWLEDGE/v2/query.py"
OUT = ROOT / "data/corpus-v21-public.json"


def first_value(rows: list[dict], key: str) -> str | None:
    return next((row.get("value") for row in rows if row.get("value")), None)


with tempfile.TemporaryDirectory(prefix="ming-corpus-v21-") as tmp:
    subprocess.run(["python3", str(QUERY), "--validate"], cwd=ROOT, check=True, stdout=subprocess.DEVNULL)
    subprocess.run(["python3", str(QUERY), "--export", tmp], cwd=ROOT, check=True, stdout=subprocess.DEVNULL)
    source = Path(tmp)
    load = lambda name: json.loads((source / f"{name}.json").read_text())
    vocabulary, phrases, dialogues = load("vocabulary"), load("phrases"), load("dialogues")
    phrase_by_id = {row["id"]: row for row in phrases}

    public_vocab = [{
        "id": row["id"], "hanzi": row["hanzi"],
        "pinyin": first_value(row.get("pinyin_variants", []), "value"),
        "spanish": first_value(row.get("spanish_variants", []), "value"),
        "lessons": row.get("lessons", []), "roles": row.get("roles", []),
    } for row in vocabulary if row.get("pinyin_variants") and row.get("spanish_variants")]

    public_phrases = [{
        "id": row["id"], "hanzi": row["hanzi"],
        "pinyin": first_value(row.get("pinyin_variants", []), "value"),
        "spanish": first_value(row.get("spanish_variants", []), "value"),
        "lessons": row.get("lessons", []), "kinds": row.get("kinds", []),
        "vocabIds": row.get("vocab_ids", []), "dialogueIds": row.get("dialogue_ids", []),
    } for row in phrases if "counterexample" not in row.get("kinds", [])]

    variants: dict[tuple[int, str], list[dict]] = {}
    for dialogue in dialogues:
        text = "Texto 2" if "T2" in dialogue["id"] else "Texto 1"
        key = (dialogue["lesson"], text)
        turns = []
        for index, turn in enumerate(dialogue["turns"]):
            phrase = phrase_by_id.get(dialogue.get("phrase_ids", [])[min(index, len(dialogue.get("phrase_ids", [])) - 1)], {})
            turns.append({"turn": turn["turn"], "speaker": turn.get("speaker_source"), "hanzi": turn["hanzi"],
                          "phraseId": phrase.get("id"), "pinyin": first_value(phrase.get("pinyin_variants", []), "value"),
                          "spanish": first_value(phrase.get("spanish_variants", []), "value")})
        variants.setdefault(key, []).append({"id": dialogue["id"], "turns": turns})
    public_dialogues = []
    for (lesson, text), rows in variants.items():
        rows.sort(key=lambda row: ("-BOOK-" not in row["id"], row["id"]))
        public_dialogues.append({"lesson": lesson, "text": text, "versions": [
            {**row, "label": "Principal" if index == 0 else f"Variante {index}"} for index, row in enumerate(rows)
        ]})

    catalog = {row["id"]: row for row in load("radical_catalog") if row.get("metadata_status") == "explicit_textbook_definition"}
    links = [row for row in load("radical_hanzi_links") if row.get("assignment_status") == "documented_in_course_source" and row["radical_id"] in catalog]
    public_radicals = []
    for rid, row in catalog.items():
        glyphs = [link["hanzi"] for link in links if link["radical_id"] == rid]
        public_radicals.append({"id": rid, "radical": row["radical"], "name": row.get("name_source"),
                                "meaning": row.get("meaning_source"), "explanation": row.get("explanation_source"),
                                "strokeCount": row.get("stroke_count_source"), "lessons": row.get("lessons", []), "hanzi": glyphs})

    payload = {"version": "2.1.0", "vocabulary": public_vocab, "phrases": public_phrases,
               "dialogues": public_dialogues, "radicals": public_radicals}
    canonical = json.dumps(payload, ensure_ascii=False, separators=(",", ":")).encode()
    payload["fingerprint"] = hashlib.sha256(canonical).hexdigest()
    OUT.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n")
    print(f"Wrote {OUT.relative_to(ROOT)} ({payload['fingerprint']})")
