/**
 * Fluent Emoji Converter のコア変換ロジック
 * 絵文字を FluentEmoji の URL に変換する機能を提供
 */
import type {
  ConvertOptions,
  EmojiStyle,
  SkinTone,
  EmojiData,
} from './types/index.js';
import emojiData from 'unicode-emoji-json/data-by-emoji.json' with { type: 'json' };

// Constants
const BASE_URL =
  'https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets';
const DEFAULT_STYLE: EmojiStyle = 'flat';
const FILE_EXTENSION_3D = 'png';
const FILE_EXTENSION_DEFAULT = 'svg';
const SLUG_FIXES: Record<string, string> = {
  smiling_face_with_heart_eyes: 'smiling_face_with_heart-eyes',
};
const FALLBACK_SKIN_TONE: SkinTone = 'default';
const HIGH_CONTRAST_STYLE: EmojiStyle = 'high-contrast';
const THREED_STYLE: EmojiStyle = '3d';

/**
 * 絵文字データを検索して対応する情報を取得
 * @param emoji - 検索対象の絵文字
 * @returns 絵文字データまたはnull
 */
function findEmojiData(emoji: string): EmojiData | null {
  const typedEmojiData = emojiData;
  const found = Object.entries(typedEmojiData).find(([key]) => key === emoji);
  if (!found) return null;

  const [emojiChar, data] = found;
  return {
    name: data.name || '',
    slug: data.slug || '',
    group: data.group || '',
    emoji: emojiChar,
    unicode: emojiChar,
    supportsSkinTone: data.skin_tone_support || false,
    supportsHighContrast: true, // デフォルトで true とする
  };
}

/**
 * スタイル名を URL パス用の文字列に変換
 * @param style - 絵文字スタイル
 * @returns URLパス用の文字列
 */
function convertStyleToPathFormat(style: EmojiStyle): string {
  switch (style) {
    case '3d':
      return '3D';
    case 'color':
      return 'Color';
    case 'flat':
      return 'Flat';
    case 'high-contrast':
      return 'High Contrast';
    default:
      return 'Flat';
  }
}

/**
 * 肌色トーンを URL パス用の文字列に変換
 * @param skinTone - 肌色トーン
 * @returns URLパス用の文字列
 */
function convertSkinToneToPathFormat(skinTone: SkinTone): string {
  switch (skinTone) {
    case 'default':
      return 'Default';
    case 'light':
      return 'Light';
    case 'medium-light':
      return 'Medium-Light';
    case 'medium':
      return 'Medium';
    case 'medium-dark':
      return 'Medium-Dark';
    case 'dark':
      return 'Dark';
    default:
      return 'Default';
  }
}

/**
 * スタイル値を正規化してパラメータ用の文字列に変換
 * @param style - 絵文字スタイル
 * @returns 正規化されたパラメータ用文字列
 */
function normalizeStyleForParam(style: EmojiStyle): string {
  switch (style) {
    case '3d':
      return '3d';
    case 'color':
      return 'color';
    case 'flat':
      return 'flat';
    case 'high-contrast':
      return 'high_contrast';
    default:
      return 'flat';
  }
}

/**
 * 肌色値を正規化してパラメータ用の文字列に変換
 * @param skinTone - 肌色トーン
 * @returns 正規化されたパラメータ用文字列
 */
function normalizeSkinToneForParam(skinTone: SkinTone): string {
  switch (skinTone) {
    case 'default':
      return 'default';
    case 'light':
      return 'light';
    case 'medium-light':
      return 'medium_light';
    case 'medium':
      return 'medium';
    case 'medium-dark':
      return 'medium_dark';
    case 'dark':
      return 'dark';
    default:
      return 'default';
  }
}

/**
 * FluentEmoji の URL を生成
 * @param emojiData - 絵文字データ
 * @param style - 絵文字スタイル
 * @param skinTone - 肌色トーン
 * @returns 生成されたURL
 */
function generateFluentEmojiUrl(
  emojiData: EmojiData,
  style: EmojiStyle,
  skinTone?: SkinTone
): string {
  // 適切な肌色トーンを決定
  const effectiveSkinTone = !emojiData.supportsSkinTone
    ? undefined
    : skinTone || FALLBACK_SKIN_TONE;

  // URL生成のためのパラメータを準備
  const stylePath = convertStyleToPathFormat(style);
  const styleParam = normalizeStyleForParam(style);
  // 先頭を大文字にして、スペースをURLエンコード
  const capitalized =
    emojiData.name.charAt(0).toUpperCase() + emojiData.name.slice(1);
  const encodedName = encodeURIComponent(capitalized);
  const extension =
    style === THREED_STYLE ? FILE_EXTENSION_3D : FILE_EXTENSION_DEFAULT;
  const fixedSlug = SLUG_FIXES[emojiData.slug] || emojiData.slug;

  // 肌色非対応絵文字の場合
  if (!emojiData.supportsSkinTone) {
    return `${BASE_URL}/${encodedName}/${stylePath}/${fixedSlug}_${styleParam}.${extension}`;
  }

  // 肌色対応絵文字の場合
  const skinTonePath = convertSkinToneToPathFormat(effectiveSkinTone!);
  const skinToneParam = normalizeSkinToneForParam(effectiveSkinTone!);

  // ハイコントラストで肌色指定がある場合はデフォルトにフォールバック
  if (style === HIGH_CONTRAST_STYLE) {
    return `${BASE_URL}/${encodedName}/Default/${stylePath}/${fixedSlug}_${styleParam}_default.${extension}`;
  }

  return `${BASE_URL}/${encodedName}/${skinTonePath}/${stylePath}/${fixedSlug}_${styleParam}_${skinToneParam}.${extension}`;
}

/**
 * 絵文字を FluentEmoji の URL に変換する
 * @param options - 変換オプション
 * @returns FluentEmojiのURLまたは元の絵文字
 */
export function convertEmoji(options: ConvertOptions): string {
  const { emoji, style = DEFAULT_STYLE, skinTone } = options;

  const emojiInfo = findEmojiData(emoji);

  if (!emojiInfo) {
    // 絵文字が見つからない場合は元の絵文字を返す
    return emoji;
  }

  return generateFluentEmojiUrl(emojiInfo, style, skinTone);
}

// 型定義のエクスポート
export type {
  ConvertOptions,
  EmojiStyle,
  SkinTone,
  EmojiData,
} from './types/index.js';
