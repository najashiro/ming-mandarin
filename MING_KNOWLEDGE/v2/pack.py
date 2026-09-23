"""Load the source-only archive. Standard library; JSON only, never eval/pickle."""
from __future__ import annotations
import argparse, base64, hashlib, json, lzma
from pathlib import Path
ROOT = Path(__file__).resolve().parent

def load_pack() -> dict[str, list[dict]]:
    manifest = json.loads((ROOT / 'source/manifest.json').read_text(encoding='utf-8'))
    chunks = []
    for part in manifest['parts']:
        path = (ROOT / part['path']).resolve()
        if not path.is_relative_to(ROOT):
            raise ValueError('Source part escapes corpus directory')
        data = path.read_bytes()
        if hashlib.sha256(data).hexdigest() != part['sha256']:
            raise ValueError(f"Source checksum mismatch: {part['path']}")
        chunks.append(data.strip())
    compressed = base64.b64decode(b''.join(chunks), validate=True)
    if hashlib.sha256(compressed).hexdigest() != manifest['compressed_sha256']:
        raise ValueError('Compressed archive checksum mismatch')
    raw = lzma.decompress(compressed, memlimit=128 * 1024 * 1024)
    if len(raw) != manifest['uncompressed_bytes'] or hashlib.sha256(raw).hexdigest() != manifest['uncompressed_sha256']:
        raise ValueError('Source JSON checksum mismatch')
    tables = json.loads(raw)
    for name, count in manifest['tables'].items():
        if not isinstance(tables.get(name), list) or len(tables[name]) != count:
            raise ValueError(f'Source row count mismatch: {name}')
    return tables

def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument('--unpack', type=Path, help='Export source JSON tables to this directory')
    args = ap.parse_args()
    tables = load_pack()
    if args.unpack:
        args.unpack.mkdir(parents=True, exist_ok=True)
        for name, rows in tables.items():
            (args.unpack / f'{name}.json').write_text(json.dumps(rows, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(json.dumps({'verified': True, 'tables': {name: len(rows) for name, rows in tables.items()}}, ensure_ascii=False))

if __name__ == '__main__':
    main()
