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
  introducedIn: HanziUnitId;
  appearsIn: HanziUnitId[];
  sourceRole: HanziSourceRole;
  curricularOrder: number;
  curricular?: boolean;
  radicalAudited?: boolean;
  componentsAudited?: boolean;
  words?: CharacterWord[];
};

export type HanziUnitId = '1.1' | '1.2' | '2.1' | '2.2' | '3.1' | '3.2';

// Alias temporal para consumidores internos durante la migración. Ya no representa
// una etapa arbitraria: siempre contiene el identificador real Texto 1 / Texto 2.
export type HanziStageId = HanziUnitId;

export type HanziSourceRole = 'core' | 'teacherExtension' | 'support';

export type HanziSourceCode = HanziUnitId;

export type CharacterWord = {
  hanzi: string;
  pinyin: string;
  translation: string;
  stage: HanziStageId;
  href?: string;
};

export type HanziUnitDefinition = {
  id: HanziUnitId;
  lesson: LessonNumber;
  text: 1 | 2;
  title: string;
  shortTitle: string;
  chinese: string;
  description: string;
  characters: string[];
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

export type LessonNumber = 1 | 2 | 3;
export type CurriculumScope = 'l1' | 'l2' | 'l3' | 'l1-l2' | 'l1-l2-l3';
export type HanziAssessmentScope = CurriculumScope | HanziUnitId;

export type ListeningEntry = {
  id: string;
  lessonId: number;
  hanzi: string;
  pinyin: string;
  translation: string;
  audioSrc: string;
};
