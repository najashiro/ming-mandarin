export const communitySections = ['home', 'route', 'pinyin', 'pronunciation', 'vocabulary', 'grammar', 'dialogues', 'listening', 'reading', 'production', 'hanzi', 'practice', 'games', 'exam'] as const;
export const communitySkills = ['vocabulary', 'grammar', 'pronunciation', 'tones', 'pinyin', 'listening', 'reading', 'writing', 'hanzi-recognition', 'stroke-order', 'hanzi-writing', 'communication'] as const;
export const communityStatuses = ['active', 'hidden', 'deleted', 'deleted_by_author'] as const;
export const reportReasons = ['offensive', 'spam', 'harassment', 'off_topic', 'other'] as const;

export type CommunitySection = typeof communitySections[number];
export type CommunitySkill = typeof communitySkills[number];
export type CommunityStatus = typeof communityStatuses[number];
export type CommunityScope = 'context' | 'lesson' | 'general';
export type CommunitySort = 'recent' | 'unanswered' | 'helpful';
export type CommunityTargetType = 'thread' | 'reply';
export type CommunityReportReason = typeof reportReasons[number];

export type CommunityContext = {
  lessonId: number;
  section: CommunitySection;
  concept?: string;
  skill?: CommunitySkill;
  route: string;
};

export type CommunityThread = CommunityContext & {
  id: string;
  title: string;
  body: string;
  authorDisplayName: string;
  status: CommunityStatus;
  createdAt: string;
  updatedAt: string;
  lastActivityAt: string;
  replyCount: number;
  helpfulCount: number;
  canEdit: boolean;
};

export type CommunityReply = {
  id: string;
  threadId: string;
  body: string;
  authorDisplayName: string;
  status: CommunityStatus;
  createdAt: string;
  updatedAt: string;
  helpfulCount: number;
  userHelpful: boolean;
  canEdit: boolean;
};

export const sectionLabels: Record<CommunitySection, string> = {
  home: 'Inicio', route: 'Ruta', pinyin: 'Pinyin', pronunciation: 'Pronunciación', vocabulary: 'Vocabulario', grammar: 'Gramática', dialogues: 'Diálogos', listening: 'Escucha', reading: 'Lectura', production: 'Producción', hanzi: 'Hanzi', practice: 'Práctica', games: 'Juegos', exam: 'Examen',
};

export const skillLabels: Record<CommunitySkill, string> = {
  vocabulary: 'Vocabulario', grammar: 'Gramática', pronunciation: 'Pronunciación', tones: 'Tonos', pinyin: 'Pinyin', listening: 'Escucha', reading: 'Lectura', writing: 'Escritura', 'hanzi-recognition': 'Reconocimiento Hanzi', 'stroke-order': 'Orden de trazos', 'hanzi-writing': 'Escritura Hanzi', communication: 'Comunicación',
};

export const reportReasonLabels: Record<CommunityReportReason, string> = {
  offensive: 'Contenido ofensivo', spam: 'Spam', harassment: 'Acoso', off_topic: 'Fuera de tema', other: 'Otro',
};
