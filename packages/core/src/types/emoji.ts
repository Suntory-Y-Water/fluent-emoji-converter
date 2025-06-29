/**
 * 絵文字関連の型定義
 */

export type EmojiStyle = '3d' | 'color' | 'flat' | 'high-contrast';

export type SkinTone =
  | 'default'
  | 'light'
  | 'medium-light'
  | 'medium'
  | 'medium-dark'
  | 'dark';

export interface EmojiData {
  name: string;
  slug: string;
  group: string;
  emoji: string;
  unicode: string;
  supportsSkinTone: boolean;
  supportsHighContrast: boolean;
}