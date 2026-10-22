export type UserRole = 'aprendiz' | 'instructor';

export type ApprenticeInfo = {
  fullName: string;
  documentType: 'C.C.' | 'T.I.' | 'C.E.' | 'P.E.P.';
  documentNumber: string;
  programName: string;
  fichaNumber: string;
  regional: string;
  centerName: string;
};

export type RegulationArticle = {
  id: string;
  chapter: string;
  chapterNumber: number;
  category: 'derecho' | 'deber' | 'prohibicion' | 'falta_sancion' | 'novedad';
  title: string;
  summary: string;
  details: string[];
  practicalTip: string;
  badge?: string;
  isRecent2024Highlight?: boolean;
};

export type CaseScenario = {
  id: string;
  title: string;
  context: string;
  problem: string;
  category: 'derechos' | 'deberes' | 'convivencia' | 'seguridad' | 'academico';
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
    explanation: string;
    points: number;
  }[];
};

export type QuizQuestion = {
  id: string;
  question: string;
  category: 'derechos' | 'deberes' | 'prohibiciones' | 'sanciones' | 'general';
  options: string[];
  correctIndex: number;
  justification: string;
  acuerdoRef: string;
};

export type BadgeItem = {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
};

export type InductionState = {
  apprentice: ApprenticeInfo;
  xp: number;
  level: number;
  completedSections: string[];
  scenariosCompleted: string[];
  quizScore: number;
  quizPassed: boolean;
  quizAttempts: number;
  certificateCode: string;
  completionDate: string | null;
  unlockedBadges: string[];
};
