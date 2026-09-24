export type DialogueSpeakerPresentation = {
  id: string;
  name: string;
  aliases: readonly string[];
  token: string;
  background: `#${string}`;
  accent: `#${string}`;
};

export const dialogueSpeakers = [
  { id: 'speaker-ma-dawei', name: '马大为', aliases: [], token: 'jade', background: '#E7F2E9', accent: '#2B6650' },
  { id: 'speaker-song-hua', name: '宋华', aliases: [], token: 'azul', background: '#E7EFFA', accent: '#3C6598' },
  { id: 'speaker-ding-libo', name: '丁力波', aliases: [], token: 'melocoton', background: '#FAEBDD', accent: '#965A27' },
  { id: 'speaker-lin-na', name: '林娜', aliases: [], token: 'lavanda', background: '#EFE8F7', accent: '#735598' },
  { id: 'speaker-wang-xiaoyun', name: '王小云', aliases: [], token: 'rosa', background: '#F8E7EC', accent: '#98556D' },
  { id: 'speaker-chen-laoshi', name: '陈老师', aliases: [], token: 'arena', background: '#F4EFD9', accent: '#786A30' },
  { id: 'speaker-lu-yuping', name: '陆雨平', aliases: [], token: 'azul-gris', background: '#E8EDF2', accent: '#51677A' },
] as const satisfies readonly DialogueSpeakerPresentation[];

export function normalizeDialogueSpeaker(value: string) {
  return value.normalize('NFC').trim().replace(/[：:，,。.!！?？]+$/u, '').trim();
}

const speakersByName = new Map<string, DialogueSpeakerPresentation>();
for (const speaker of dialogueSpeakers) {
  for (const name of [speaker.name, ...speaker.aliases]) {
    const normalized = normalizeDialogueSpeaker(name);
    if (speakersByName.has(normalized)) throw new Error(`Identidad de diálogo duplicada: ${normalized}`);
    speakersByName.set(normalized, speaker);
  }
}

export function dialogueSpeakerFor(name: string) {
  return speakersByName.get(normalizeDialogueSpeaker(name));
}
