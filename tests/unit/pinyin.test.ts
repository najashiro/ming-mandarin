import { describe,expect,it } from 'vitest';
import { comparePinyin,normalizeAnswer,normalizePinyin,numberedPinyinToMarked,numberedSyllableToMarked,pinyinTone,stripPinyinTones } from '@/lib/pinyin';
describe('pinyin',()=>{
  it('coloca la marca según a/e/ou/iu/ui',()=>{expect(numberedSyllableToMarked('hao3')).toBe('hǎo');expect(numberedSyllableToMarked('xie4')).toBe('xiè');expect(numberedSyllableToMarked('liu2')).toBe('liú');expect(numberedSyllableToMarked('gui3')).toBe('guǐ');expect(numberedSyllableToMarked('kou3')).toBe('kǒu');});
  it('convierte frases numeradas y ü',()=>{expect(numberedPinyinToMarked('ni3 hao3')).toBe('nǐ hǎo');expect(numberedPinyinToMarked('nv3')).toBe('nǚ');});
  it('exige tono cuando corresponde',()=>{expect(comparePinyin('ni3 hao3','nǐ hǎo',true)).toBe(true);expect(comparePinyin('ni hao','nǐ hǎo',true)).toBe(false);expect(comparePinyin('ni hao','nǐ hǎo',false)).toBe(true);});
  it('normaliza unicode, tonos y puntuación',()=>{expect(stripPinyinTones('Nǐ Hǎo')).toBe('ni hao');expect(pinyinTone('máng')).toBe(2);expect(normalizeAnswer(' 我很好！ ')).toBe('我很好');});
  it('compone secuencias Unicode descompuestas sin alterar el texto',()=>{
    expect(normalizePinyin('wo\u030C')).toBe('wǒ');
    expect(normalizePinyin('Ni\u030C')).toBe('Nǐ');
    expect(normalizePinyin('na\u030C')).toBe('nǎ');
    expect(normalizePinyin('  Yü3 · Nǐmen!  ')).toBe('  Yü3 · Nǐmen!  ');
    expect(normalizePinyin('')).toBe('');
  });
  it('conserva las seis vocales y los cuatro tonos en NFC',()=>{
    const tones = 'ā á ǎ à ē é ě è ī í ǐ ì ō ó ǒ ò ū ú ǔ ù ǖ ǘ ǚ ǜ';
    expect(normalizePinyin(tones.normalize('NFD'))).toBe(tones);
    expect(normalizePinyin('nǐ hǎo wǒ hěn nǎ yǒu jǐ xiǎo Běijīng Měiguó Zhōngguó nǚ lǜ Yǔ'.normalize('NFD')))
      .toBe('nǐ hǎo wǒ hěn nǎ yǒu jǐ xiǎo Běijīng Měiguó Zhōngguó nǚ lǜ Yǔ');
  });
  it('compara respuestas NFC y NFD de forma equivalente',()=>{
    expect(comparePinyin('wo\u030C', 'wǒ', true)).toBe(true);
    expect(comparePinyin('nu\u0308\u030C', 'nǚ', true)).toBe(true);
  });
});
