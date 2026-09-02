export type SourceType = 'textbook' | 'workbook' | 'class_presentation' | 'phonetics_presentation' | 'hanzi_worksheet';

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
  lessonId: string;
  hanzi: string;
  pinyin: string;
  meaning: string;
  strokeCount: number;
  radical: string;
  components: string[];
  structure?: string;
  example?: string;
  pedagogicalNote?: string;
  recognitionRequired: boolean;
  writingRequired: boolean;
  source: SourceRef;
  sources?: SourceRef[];
  sourceGroups?: HanziSourceCode[];
  primaryStage?: HanziStageId;
  curricular?: boolean;
  radicalAudited?: boolean;
  componentsAudited?: boolean;
  words?: CharacterWord[];
};

export type HanziStageId = 1 | 2 | 3 | 4 | 5 | 6;

export type HanziSourceCode = 'hanzi-1.1' | 'hanzi-1.2' | 'hanzi-1.3' | 'hanzi-1.4' | 'hanzi-1.5';

export type CharacterWord = {
  hanzi: string;
  pinyin: string;
  translation: string;
  stage: HanziStageId;
  href?: string;
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

export type ListeningEntry = {
  id: string;
  lessonId: number;
  hanzi: string;
  pinyin: string;
  translation: string;
  audioSrc: string;
};
