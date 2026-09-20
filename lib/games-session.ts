/** Finite spaced practice. No immediate repeats, including an error on the last card. */
export function sessionOrder(size: number, random: () => number = Math.random) {
  const tail = Array.from({ length: Math.max(0,size - 1) }, (_,index) => index + 1);
  for (let index = tail.length - 1; index > 0; index--) {
    const other = Math.floor(random() * (index + 1));
    [tail[index],tail[other]] = [tail[other],tail[index]];
  }
  // Keep the first recommended item; sample every other item without replacement.
  return size ? [0,...tail] : [];
}
export function retryQueue(queue: number[], index: number, total: number) {
  if (total < 2) return queue;
  const next = [...queue];
  if (next.length === 0 && index === total - 1) next.push((index + total - 1) % total);
  if (next.at(-1) !== index) next.push(index);
  return next;
}
export function gameEventId(game: string, scope: string, level: number, mode: string, contentId: string) {
  return `${game}:${scope}:level-${level}:${mode}:${contentId}`;
}
export function parseGameEventId(value: string) {
  const [game, scope, difficulty, modality, ...content] = value.split(':');
  return { game, scope, difficulty_level: Number(difficulty?.replace('level-', '')), modality, content_id: content.join(':') };
}
