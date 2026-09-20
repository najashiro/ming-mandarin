/** Stable filename shared by the browser resolver and manifest synchronization. */
export function timeAudioKey(input, kind = 's') {
  let hash = 0x811c9dc5;
  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return `time-${kind}-${(hash >>> 0).toString(16).padStart(8, '0')}`;
}
export function timeAudioFile(input, kind = 's') { return `time/${timeAudioKey(input, kind)}.mp3`; }
