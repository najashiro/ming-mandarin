import { describe,expect,it } from 'vitest';
import { compareExerciseAnswer,comparePinyin,normalizeAnswer,normalizePinyin,normalizePinyinForComparison,numberedPinyinToMarked,numberedSyllableToMarked,pinyinTone,stripPinyinTones } from '@/lib/pinyin';
describe('pinyin',()=>{
  it('coloca la marca según a/e/ou/iu/ui',()=>{expect(numberedSyllableToMarked('hao3')).toBe('hǎo');expect(numberedSyllableToMarked('xie4')).toBe('xiè');expect(numberedSyllableToMarked('liu2')).toBe('liú');expect(numberedSyllableToMarked('gui3')).toBe('guǐ');expect(numberedSyllableToMarked('kou3')).toBe('kǒu');});
  it('convierte frases numeradas continuas o separadas y ü',()=>{expect(numberedPinyinToMarked('ni3 hao3')).toBe('nǐ hǎo');expect(numberedPinyinToMarked('zao3shang5')).toBe('zǎoshang');expect(numberedPinyinToMarked('nv3')).toBe('nǚ');expect(numberedPinyinToMarked('nu:3')).toBe('nǚ');});
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
  it.each(['zǎoshang','zǎo shang','zao3shang','zao3 shang','zao3shang5','zao3 shang5','zao3-shang'])('acepta %s como zǎoshang', (answer)=>{
    expect(comparePinyin(answer, 'zǎoshang', true)).toBe(true);
  });
  it.each(['zaoshang','zao2 shang','zao4 shang','zāoshang'])('rechaza %s como zǎoshang', (answer)=>{
    expect(comparePinyin(answer, 'zǎoshang', true)).toBe(false);
  });
  it('acepta formato mixto, separadores, tono neutro y variantes de ü',()=>{
    expect(comparePinyin('nǐ hao3', 'nǐhǎo', true)).toBe(true);
    expect(comparePinyin('peng2-you5', 'péngyou', true)).toBe(true);
    expect(comparePinyin("nu:3'er2", 'nǚʼér', true)).toBe(true);
    expect(comparePinyin('nv3 er2', 'nǚʼér', true)).toBe(true);
    expect(normalizePinyinForComparison('Xi1-ban1-ya2-yu3')).toBe('xībānyáyǔ');
  });
  it.each([
    ['ni3', 'nǐ'], ['hao3', 'hǎo'], ['wo3', 'wǒ'], ['hen3', 'hěn'], ['na3', 'nǎ'], ['you3', 'yǒu'],
    ['ji3', 'jǐ'], ['xiao3', 'xiǎo'], ['bei3jing1', 'Běijīng'], ['mei3guo2', 'Měiguó'],
    ['zhong1guo2', 'Zhōngguó'], ['lao3shi1', 'lǎoshī'], ['peng2you', 'péngyou'], ['han4yu3', 'Hànyǔ'],
    ['xi1ban1ya2yu3', 'Xībānyáyǔ'], ['jiao3zi5', 'jiǎozi'], ['mi3fan4', 'mǐfàn'], ['shui3', 'shuǐ'],
    ['ke3le4', 'kělè'], ['liang3', 'liǎng'], ['jie3jie5', 'jiějie'], ['nai3nai5', 'nǎinai'],
    ['yu3ping2', 'Yǔpíng'],
  ])('acepta el pinyin curricular %s como %s', (answer, expected)=>{
    expect(comparePinyin(answer, expected, true)).toBe(true);
  });
  it.each(['nǚ', 'nü3', 'nv3', 'nu:3'])('normaliza la variante de ü %s', (answer)=>{
    expect(comparePinyin(answer, 'nǚ', true)).toBe(true);
  });
  it.each(['shang', 'shang5', 'shang0'])('acepta el tono neutro %s cuando el esperado es neutro', (answer)=>{
    expect(comparePinyin(answer, 'shang', true)).toBe(true);
  });
  it('comparte una sola comparación para scoring online y offline',()=>{
    expect(compareExerciseAnswer('pinyin', 'zao3 shang', 'zǎoshang')).toBe(true);
    expect(compareExerciseAnswer('pinyin', 'zao2 shang', 'zǎoshang')).toBe(false);
    expect(compareExerciseAnswer('pinyin', '我很好！', '我很好')).toBe(true);
  });
});
