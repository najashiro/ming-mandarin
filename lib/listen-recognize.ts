export function shuffleWithoutImmediateRepeat<T extends { id: string }>(
  entries: readonly T[],
  previousId?: string,
  random: () => number = Math.random,
): T[] {
  const shuffled = [...entries];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapWith = Math.floor(random() * (index + 1));
    [shuffled[index], shuffled[swapWith]] = [shuffled[swapWith], shuffled[index]];
  }
  if (shuffled.length > 1 && shuffled[0]?.id === previousId) {
    [shuffled[0], shuffled[1]] = [shuffled[1], shuffled[0]];
  }
  return shuffled;
}

export function hanziOptions<T extends { id: string; hanzi: string }>(
  answer: T,
  entries: readonly T[],
  random: () => number = Math.random,
): string[] {
  const distractors = shuffleWithoutImmediateRepeat(entries.filter((entry) => entry.id !== answer.id), undefined, random)
    .slice(0, 3)
    .map((entry) => entry.hanzi);
  return shuffleWithoutImmediateRepeat(
    [answer.hanzi, ...distractors].map((hanzi, index) => ({ id: `${index}-${hanzi}`, hanzi })),
    undefined,
    random,
  ).map((entry) => entry.hanzi);
}
