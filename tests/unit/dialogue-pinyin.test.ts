import { describe, expect, it } from 'vitest';
import corpus from '@/lib/active-corpus';
import { dialoguePinyinByCharacter } from '@/lib/dialogue-pinyin';
import { getCurriculum } from '@/seed/curriculum';

describe('pinyin por carácter en diálogos', () => {
  it('usa la pronunciación del turno, incluidos el tono neutro y los caracteres polifónicos', () => {
    expect(dialoguePinyinByCharacter('谢谢，银行不行。', 'Xièxie, yínháng bùxíng.'))
      .toEqual(['Xiè', 'xie', undefined, 'yín', 'háng', 'bù', 'xíng', undefined]);
    expect(dialoguePinyinByCharacter('教我，教学楼。', 'Jiāo wǒ, jiàoxuélóu.'))
      .toEqual(['Jiāo', 'wǒ', undefined, 'jiào', 'xué', 'lóu', undefined]);
  });

  it('conserva las sílabas de nombres y palabras compuestas', () => {
    expect(dialoguePinyinByCharacter('王小云，你怎么样？', 'Wáng Xiǎoyún, nǐ zěnmeyàng?'))
      .toEqual(['Wáng', 'Xiǎo', 'yún', undefined, 'nǐ', 'zěn', 'me', 'yàng', undefined]);
  });

  it('distingue la sílaba compartida con 儿 del ér independiente', () => {
    expect(dialoguePinyinByCharacter('哪儿？女儿？一会儿。', 'Nǎr? Nǚ’ér? Yíhuìr.'.normalize('NFD')))
      .toEqual(['Nǎr', 'Nǎr', undefined, 'Nǚ', 'ér', undefined, 'Yí', 'huìr', 'huìr', undefined]);
  });

  it('conserva la posición de las lecturas junto a cifras', () => {
    expect(dialoguePinyinByCharacter('是35号。', 'Shì sānshíwǔ hào.'))
      .toEqual(['Shì', undefined, undefined, 'hào', undefined]);
    expect(dialoguePinyinByCharacter('二〇二〇', 'Èr líng èr líng'))
      .toEqual(['Èr', 'líng', 'èr', 'líng']);
  });

  it('omite las pistas cuando falta una sílaba o sobra texto', () => {
    expect(dialoguePinyinByCharacter('你好！', 'nǐ')).toEqual([undefined, undefined, undefined]);
    expect(dialoguePinyinByCharacter('你好', 'nǐ hǎo ma')).toEqual([undefined, undefined]);
    expect(dialoguePinyinByCharacter('你好', '')).toEqual([undefined, undefined]);
  });

  it('alinea cada hanzi con el pinyin publicado en todas las lecciones', () => {
    const turns = corpus.dialogues.flatMap(dialogue => dialogue.turns);
    const speakers = turns.flatMap(turn => turn.speakerPinyin ? [{ hanzi: turn.speaker, pinyin: turn.speakerPinyin }] : []);
    const phrases = getCurriculum('l1-l2-l3-l4-l5-l6').sentences;
    for (const { hanzi, pinyin } of [...turns, ...speakers, ...phrases]) {
      const readings = dialoguePinyinByCharacter(hanzi, pinyin ?? '');
      expect(readings.map(Boolean), `${hanzi} — ${pinyin}`)
        .toEqual(Array.from(hanzi, glyph => /\p{Script=Han}/u.test(glyph)));
    }
  });
});
