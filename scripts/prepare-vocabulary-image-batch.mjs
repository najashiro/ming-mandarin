import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

const root = process.cwd();
const corpus = JSON.parse(readFileSync(join(root, 'data/corpus-v21-public.json'), 'utf8'));
const tsv = readFileSync(join(root, 'MING_KNOWLEDGE/v2/visual/vocabulary.tsv'), 'utf8').trim().split(/\r?\n/);
const headers = tsv.shift().split('\t');
const internal = new Map(tsv.map(line => {
  const cells = line.split('\t');
  const row = Object.fromEntries(headers.map((header, index) => [header, cells[index]]));
  return [row.vocab_id, row];
}));
const phrases = new Map(corpus.phrases.map(phrase => [phrase.id, phrase]));
const outDir = join(root, 'output/imagegen/vocabulary-master');
const batchPath = join(root, 'tmp/imagegen/vocabulary-batch.jsonl');
const catalogPath = join(root, 'docs/vocabulary-image-prompts.json');
mkdirSync(outDir, { recursive: true });
mkdirSync(dirname(batchPath), { recursive: true });

const modeDirection = {
  literal_photo: 'Use one concrete subject as the dominant visual. Include only props required to identify the audited meaning.',
  action_scene: 'Use one clear frozen action with the actor, hands, body and necessary object fully visible. Avoid competing actions.',
  concept_scene: 'Use one simple human gesture, relationship or emotional situation whose dominant reading matches the audited concept.',
  visual_grammar: 'Use a compact structured group or relationship that supports the grammatical idea. It is supporting context, not an image-only definition.',
  phrase_context: 'Depict a compact moment that communicates the complete audited example context. Do not reduce the word to a misleading isolated symbol.',
};

function digest(value) {
  return createHash('sha256').update(value).digest('hex');
}

function promptFor(word, note, example) {
  const special = word.id === 'v-我'
    ? 'The single adult faces mostly forward with a calm natural gaze and an assured, affirmative expression. One relaxed open hand lies flat over the center of their own chest, as if calmly saying “I am…” or “I do…”. Keep eyebrows level and the mouth neutral or gently speaking. Never show a questioning expression, raised eyebrows, head tilt, shrug, surprise, confusion, hesitation or an index-finger pointing gesture.'
    : word.id === 'v-你'
      ? 'Show one adult calmly addressing the viewer as the interlocutor, with direct natural eye contact and a relaxed open-hand gesture toward the viewer. The expression is declarative and attentive, never accusatory, surprised or interrogative.'
      : '';
  const context = example
    ? `Audited example context: ${example.hanzi} — ${example.pinyin} — ${example.spanish}.`
    : 'No audited example phrase is linked; rely only on the audited meaning and editorial guidance.';
  return `Use case: photorealistic-natural.
Asset type: Míng active Mandarin vocabulary-card cutout.
Style ID: ming-vocabulary-transparent-subject-golden-v2.

Vocabulary identity for semantic planning only: ${word.hanzi} (${word.pinyin}).
Audited meaning in Spanish: ${word.spanish}.
Visual mode: ${word.visual_ming.visual_mode}.
Editorial semantic guidance: ${note}.
${context}

Primary request: Create one memorable, pedagogically clear visual that supports exactly this audited meaning. ${modeDirection[word.visual_ming.visual_mode]} ${special}

OUTPUT AND TRANSPARENCY
Deliver a clean photorealistic PNG cutout with genuine transparent alpha. Transparent pixels must extend to every edge and corner. No white, ivory, gray, colored, studio, indoor or outdoor background; no vignette, aura, glow, fog, floor patch or broad environmental shadow. Preserve fine hair and edge detail without a white, black or colored halo. A very narrow natural contact shadow is allowed only when physically necessary.

COMPOSITION
Horizontal 1536 × 1024 canvas. Place the complete subject or compact scene toward the center-right, generally inside x=46–96% and y=3–96%. Reserve transparent negative space on the left, especially x=4–43% and y=55–94%, for live HTML text. Keep both upper corners clear for UI controls. Do not crop heads, hands, feet, tails, handles or other meaning-bearing parts. Do not distort or unnaturally miniaturize the subject.

APPEARANCE
Natural premium educational photography, realistic anatomy, proportions, materials and color, sharp subject, calm diffuse daylight and gentle contrast. The main meaning must remain legible at small card size.

STRICTLY AVOID
No text of any kind; no Hanzi, pinyin, Spanish, letters, digits, labels, signs, captions, speech bubbles, punctuation, question marks, arrows, icons, diagrams, UI, card frame, border, logo, watermark, brand, checkerboard, collage, decorative prop, duplicate subject or unrelated element. Do not infer a person’s nationality, name, family role or profession from facial appearance alone.

Deliver only the isolated transparent visual. The web application supplies the card background, typography, gradient and controls.`;
}

const eligible = corpus.vocabulary.filter(word => word.visual_ming?.visual_mode !== 'none');
if (eligible.length !== 305) throw new Error(`Expected 305 image-support entries, received ${eligible.length}`);

const catalog = eligible.map(word => {
  const editorial = internal.get(word.id);
  if (!editorial) throw new Error(`Missing visual editorial row: ${word.id}`);
  const example = word.examplePhraseIds.map(id => phrases.get(id)).find(Boolean) ?? null;
  const fileStem = `vocab-${digest(word.id).slice(0, 20)}`;
  const prompt = promptFor(word, editorial.notes, example);
  return {
    wordId: word.id,
    hanzi: word.hanzi,
    pinyin: word.pinyin,
    spanish: word.spanish,
    visual_ming: word.visual_ming,
    editorial_note: editorial.notes,
    example: example ? { id: example.id, hanzi: example.hanzi, pinyin: example.pinyin, spanish: example.spanish } : null,
    model: 'gpt-image-2.5-flare',
    quality: 'high',
    size: '1536x1024',
    background: 'transparent',
    output: `${fileStem}.png`,
    public_output: `${fileStem}.webp`,
    prompt_sha256: digest(prompt),
    prompt,
  };
});

const pending = catalog.filter(entry => !existsSync(join(outDir, entry.output)));
const jobs = pending.map(entry => JSON.stringify({
  prompt: entry.prompt,
  model: entry.model,
  quality: entry.quality,
  size: entry.size,
  background: entry.background,
  output_format: 'png',
  out: entry.output,
}));
writeFileSync(catalogPath, `${JSON.stringify({
  schema_version: 1,
  style_id: 'ming-vocabulary-transparent-subject-golden-v2',
  corpus_version: corpus.version,
  total_vocabulary: corpus.vocabulary.length,
  image_entries: catalog.length,
  excluded_visual_mode_none: corpus.vocabulary.length - catalog.length,
  entries: catalog,
}, null, 2)}\n`);
writeFileSync(batchPath, jobs.length ? `${jobs.join('\n')}\n` : '');
console.log(JSON.stringify({ total: catalog.length, existing: catalog.length - pending.length, pending: pending.length, batchPath, catalogPath }, null, 2));
