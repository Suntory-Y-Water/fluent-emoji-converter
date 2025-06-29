export type EmojiStyle = '3d' | 'color' | 'flat' | 'high-contrast';

export type SkinTone =
  | 'default'
  | 'light'
  | 'medium-light'
  | 'medium'
  | 'medium-dark'
  | 'dark';

export type ConvertOptions = {
  emoji: string;
  style?: EmojiStyle;
  skinTone?: SkinTone;
};

export interface EmojiData {
  name: string;
  slug: string;
  group: string;
  emoji: string;
  unicode: string;
  supportsSkinTone: boolean;
  supportsHighContrast: boolean;
}

export interface FluentEmojiConfig {
  baseUrl: string;
  defaultStyle: EmojiStyle;
}
