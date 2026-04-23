
export type ThemeMode = 'light' | 'dark' | 'brutalist' | 'minimal' | 'modern' | 'bold-typography';

export interface Section {
  id: string;
  type: 'hero' | 'features' | 'cta' | 'content' | 'gallery' | 'contact' | 'prices';
  data: any;
  config?: {
    alignment?: 'left' | 'center' | 'right';
    padding?: 'small' | 'medium' | 'large';
    background?: string;
  };
}

export interface PageBlueprint {
  name: string;
  tagline: string;
  theme: {
    mode: ThemeMode;
    fontFamily: 'sans' | 'serif' | 'mono';
    accentColor: string;
  };
  sections: Section[];
}

export interface MorphUpdate {
  instruction: string;
  previousBlueprint: PageBlueprint;
}
