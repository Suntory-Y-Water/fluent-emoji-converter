/**
 * 設定関連の型定義
 */
import type { EmojiStyle, SkinTone } from './emoji.js';

export type ConvertOptions = {
  emoji: string;
  style?: EmojiStyle;
  skinTone?: SkinTone;
};