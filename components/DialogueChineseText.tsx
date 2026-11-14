import { LinkedChineseText } from '@/components/LinkedChineseText';
import { dialoguePinyinByCharacter } from '@/lib/dialogue-pinyin';

export function DialogueChineseText({ text, pinyin, returnTo }: {
  text: string;
  pinyin?: string | null;
  returnTo?: string;
}) {
  const readings = pinyin ? dialoguePinyinByCharacter(text, pinyin) : undefined;
  return <LinkedChineseText text={text} dialogueReadings={readings} disabled={!returnTo} returnTo={returnTo}/>;
}
