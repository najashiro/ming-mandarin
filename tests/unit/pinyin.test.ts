import { describe,expect,it } from 'vitest';
import { comparePinyin,normalizeAnswer,numberedPinyinToMarked,numberedSyllableToMarked,pinyinTone,stripPinyinTones } from '@/lib/pinyin';
describe('pinyin',()=>{
  it('coloca la marca según a/e/ou/última vocal',()=>{expect(numberedSyllableToMarked('hao3')).toBe('hǎo');expect(numberedSyllableToMarked('xie4')).toBe('xiè');expect(numberedSyllableToMarked('liu2')).toBe('liú');expect(numberedSyllableToMarked('kou3')).toBe('kǒu');});
  it('convierte frases numeradas y ü',()=>{expect(numberedPinyinToMarked('ni3 hao3')).toBe('nǐ hǎo');expect(numberedPinyinToMarked('nv3')).toBe('nǚ');});
  it('exige tono cuando corresponde',()=>{expect(comparePinyin('ni3 hao3','nǐ hǎo',true)).toBe(true);expect(comparePinyin('ni hao','nǐ hǎo',true)).toBe(false);expect(comparePinyin('ni hao','nǐ hǎo',false)).toBe(true);});
  it('normaliza unicode, tonos y puntuación',()=>{expect(stripPinyinTones('Nǐ Hǎo')).toBe('ni hao');expect(pinyinTone('máng')).toBe(2);expect(normalizeAnswer(' 我很好！ ')).toBe('我很好');});
});
