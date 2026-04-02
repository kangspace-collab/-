export interface BibleVerse {
  text: string;
  reference: string;
}

export type UpdateInterval = 1 | 5;

export interface AppSettings {
  backgroundColor: string;
  textColor: string;
  interval: UpdateInterval;
  customVerses: BibleVerse[];
}
