import { execFileSync } from 'node:child_process';
import { extname } from 'node:path';
import { readFileSync } from 'node:fs';

const textExtensions = new Set(['.css', '.js', '.json', '.jsx', '.md', '.mjs', '.ts', '.tsx']);
const combiningMarkPattern = /[\u0300-\u036f]/gu;
const trackedFiles = execFileSync('git', ['ls-files', '--cached', '--others', '--exclude-standard', '-z'], { encoding: 'utf8' }).split('\0').filter(Boolean);
const findings = [];
const metadataOnly = [];

for (const file of trackedFiles) {
  if (!textExtensions.has(extname(file).toLowerCase())) continue;
  const lines = readFileSync(file, 'utf8').split(/\r?\n/);
  lines.forEach((line, index) => {
    const marks = [...line.matchAll(combiningMarkPattern)];
    if (!marks.length) return;
    const finding = {
      file,
      line: index + 1,
      text: line.trim(),
      codepoints: marks.map(({ 0: mark }) => `U+${mark.codePointAt(0).toString(16).toUpperCase().padStart(4, '0')}`),
    };
    if (/\.pdf(?:['"`|]|$)/i.test(line)) metadataOnly.push(finding);
    else findings.push(finding);
  });
}

for (const finding of findings) {
  console.error(`${finding.file}:${finding.line} ${finding.codepoints.join(', ')} ${finding.text}`);
}
for (const finding of metadataOnly) {
  console.log(`Metadato de fuente no renderizado: ${finding.file}:${finding.line} ${finding.codepoints.join(', ')}`);
}

if (findings.length) {
  console.error(`Auditoría pinyin: ${findings.length} secuencia(s) combinante(s) requieren normalización.`);
  process.exitCode = 1;
} else {
  console.log(`Auditoría pinyin: ${trackedFiles.length} archivos rastreados; 0 secuencias combinantes problemáticas.`);
}
