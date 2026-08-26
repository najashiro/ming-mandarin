export type SourceType = 'textbook' | 'workbook' | 'class_presentation' | 'phonetics_presentation';

export type SourceRef = {
  type: SourceType;
  file: string;
  pdfPage: number;
  printedPage?: number;
  note?: string;
};

export type VocabularyEntry = {
  id: string;
  hanzi: string;
  pinyin: string;
  translation: string;
  grammaticalType: string;
  category: 'core' | 'supplementary' | 'teacher_supplement' | 'name';
  isCore: boolean;
  example?: string;
  source: SourceRef;
};

export type SentenceEntry = {
  id: string;
  hanzi: string;
  pinyin: string;
  translation: string;
  tokens: string[];
  grammarTags: string[];
  difficulty: 1 | 2 | 3 | 4 | 5;
  source: SourceRef;
};

export type GrammarPoint = {
  id: string;
  slug: string;
  title: string;
  pattern: string;
  explanation: string;
  examples: string[];
  source: SourceRef;
};

export type CharacterEntry = {
  id: string;
  hanzi: string;
  pinyin: string;
  meaning: string;
  strokeCount: number;
  radical: string;
  components: string[];
  recognitionRequired: boolean;
  writingRequired: boolean;
  source: SourceRef;
};

export type Exercise = {
  id: string;
  type: 'choice' | 'pinyin' | 'order' | 'tone' | 'dialogue' | 'reading' | 'hanzi';
  prompt: string;
  answer: string;
  options?: string[];
  explanation: string;
  rule: string;
  itemId: string;
  dimension: 'meaning' | 'pinyin' | 'tone' | 'audio' | 'hanzi' | 'production' | 'grammar' | 'reading';
  difficulty: 1 | 2 | 3 | 4 | 5;
  source: SourceRef;
};
