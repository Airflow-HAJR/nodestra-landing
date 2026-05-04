export type ChapterMoment = {
  id: string;
  label: string;
  /** 0-1 progress checkpoint within the pinned hero where this moment becomes active. */
  at: number;
  caption: string;
  /** Non-visual narration for assistive tech. */
  srSummary: string;
};

export type LandingChapter = {
  id: string;
  eyebrow: string;
  title: string;
  /** One-line cinematic caption shown below the title in the chapter stage. */
  caption?: string;
  copy: string;
  command: string;
  response: string;
  stats: ChapterMetric[];
  accent: string;
  moments: ChapterMoment[];
};

export type ProofCard = {
  id: string;
  label: string;
  value: string;
  description: string;
};

export type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

export type DemoLead = {
  name: string;
  workEmail: string;
  airport: string;
  teamSize: string;
  notes: string;
};

export type ChapterMetric = {
  label: string;
  value: string;
  delta?: string;
};
