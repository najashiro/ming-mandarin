"""Retain one complete utterance from a reviewed three-repetition TTS recording."""
import argparse
import array
import hashlib
import json
import math
import subprocess
from pathlib import Path

parser = argparse.ArgumentParser()
parser.add_argument('--ffmpeg', required=True)
parser.add_argument('--apply', action='store_true')
args = parser.parse_args()
plan = json.loads(Path('docs/lesson7-audio-carrier-plan.json').read_text())
rows = []
for clip in plan['clips']:
    source = Path('output/audio/lesson7-carriers') / clip['file']
    if not source.exists():
        rows.append({'id': clip['targetId'], 'error': 'carrier missing'})
        continue
    samples = array.array('f', subprocess.check_output([
        args.ffmpeg, '-v', 'error', '-i', str(source), '-f', 'f32le', '-ac', '1', '-ar', '16000', '-']))
    powers = [math.sqrt(sum(x*x for x in samples[i:i+160])/len(samples[i:i+160]))
              for i in range(0, len(samples), 160)]
    threshold = max(0.004, max(powers, default=0)*0.04)
    active = [i for i, value in enumerate(powers) if value >= threshold]
    groups = []
    for index in active:
        if groups and index-groups[-1][-1] <= 25:
            groups[-1].append(index)
        else:
            groups.append([index])
    spans = [[max(0, group[0]*0.01-0.12), min(len(samples)/16000, (group[-1]+1)*0.01+0.14)]
             for group in groups if len(group) >= 10]
    expected_segments = clip.get('expectedSegments', 3)
    row = {'id': clip['targetId'], 'input': clip.get('speechInput', clip['input']), 'pinyin': clip['expectedPinyin'],
           'carrier': str(source), 'sourceSha256': hashlib.sha256(source.read_bytes()).hexdigest(),
           'spans': spans, 'status': 'ready' if len(spans) == expected_segments else 'review_required'}
    if args.apply and len(spans) == expected_segments:
        start, end = spans[clip.get('retainedSegment', 1)]
        destination = Path('public/audio/mandarin') / clip['targetFile']
        subprocess.run([args.ffmpeg, '-y', '-v', 'error', '-ss', str(start), '-i', str(source),
                        '-t', str(end-start), '-ar', '24000', '-ac', '1', '-codec:a', 'libmp3lame',
                        '-q:a', '2', str(destination)], check=True)
        row.update(status='extracted', retainedSpan=[start, end],
                   sha256=hashlib.sha256(destination.read_bytes()).hexdigest())
    rows.append(row)
Path('docs/lesson7-audio-excerpts.json').write_text(json.dumps({
    'method': 'PCM energy segmentation of three separated repetitions; middle complete utterance retained with 120/140 ms margins. Independent transcription is run on the resulting clip.',
    'results': rows}, ensure_ascii=False, indent=2)+'\n')
print(json.dumps({row['id']: row.get('status', row.get('error')) for row in rows}, ensure_ascii=False))
