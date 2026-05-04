export interface BibleVerse {
  text: string;
  reference: string;
}

export type UpdateInterval = 1 | 5;

export type ThemeType = 'spring' | 'summer' | 'autumn' | 'winter' | 'rain' | 'forest' | 'classic';

export interface AppSettings {
  backgroundColor: string;
  textColor: string;
  interval: UpdateInterval;
  customVerses: BibleVerse[];
  theme: ThemeType;
}
