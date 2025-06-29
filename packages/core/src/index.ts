/**
 * Fluent Emoji Converter のコア変換ロジック
 * 絵文字を FluentEmoji の URL に変換する機能を提供
 */
import type {
  ConvertOptions,
  EmojiStyle,
  SkinTone,
  EmojiData,
  FluentEmojiConfig,
} from '@fluent-emoji-converter/types';
import emojiData from 'unicode-emoji-json';

const DEFAULT_CONFIG: FluentEmojiConfig = {
  baseUrl:
    'https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets',
  defaultStyle: 'flat',
};

/**
 * 絵文字データを検索して対応する情報を取得
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
 */
function styleToPath(style: EmojiStyle): string {
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
 */
function skinToneToPath(skinTone: SkinTone): string {
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
 * 絵文字名をURL用にフォーマット（先頭大文字 + URLエンコード）
 */
function formatEmojiNameForUrl(name: string): string {
  // 先頭を大文字にして、スペースをURLエンコード
  const capitalized = name.charAt(0).toUpperCase() + name.slice(1);
  return encodeURIComponent(capitalized);
}

/**
 * ファイル拡張子を取得（3Dはpng、その他はsvg）
 */
function getFileExtension(style: EmojiStyle): string {
  return style === '3d' ? 'png' : 'svg';
}

/**
 * 特定の絵文字のslugを修正
 */
function fixEmojiSlug(slug: string): string {
  // 既知の差異を修正
  const fixes: Record<string, string> = {
    smiling_face_with_heart_eyes: 'smiling_face_with_heart-eyes',
  };

  return fixes[slug] || slug;
}

/**
 * FluentEmoji の URL を生成
 */
function generateFluentEmojiUrl(
  emojiData: EmojiData,
  style: EmojiStyle,
  skinTone?: SkinTone,
  config: FluentEmojiConfig = DEFAULT_CONFIG
): string {
  const stylePath = styleToPath(style);
  const styleParam = style.replace('-', '_');
  const encodedName = formatEmojiNameForUrl(emojiData.name);
  const extension = getFileExtension(style);
  const fixedSlug = fixEmojiSlug(emojiData.slug);

  // 肌色対応絵文字の場合、skinToneが未指定なら'default'を使用
  if (emojiData.supportsSkinTone && (!skinTone || skinTone === 'default')) {
    skinTone = 'default';
  }

  // 肌色非対応の場合
  if (!emojiData.supportsSkinTone) {
    return `${config.baseUrl}/${encodedName}/${stylePath}/${fixedSlug}_${styleParam}.${extension}`;
  }

  // 肌色対応の場合（必ずskinToneが存在）
  const skinTonePath = skinToneToPath(skinTone!);
  const skinToneParam = skinTone!.replace('-', '_');

  // ハイコントラストで肌色指定がある場合はデフォルトにフォールバック
  if (style === 'high-contrast') {
    return `${config.baseUrl}/${encodedName}/Default/${stylePath}/${fixedSlug}_${styleParam}_default.${extension}`;
  }

  return `${config.baseUrl}/${encodedName}/${skinTonePath}/${stylePath}/${fixedSlug}_${styleParam}_${skinToneParam}.${extension}`;
}

/**
 * 絵文字を FluentEmoji の URL に変換する
 */
export function convertEmoji(
  options: ConvertOptions,
  config?: FluentEmojiConfig
): string {
  const { emoji, style = DEFAULT_CONFIG.defaultStyle, skinTone } = options;
  const finalConfig = { ...DEFAULT_CONFIG, ...config };

  try {
    const emojiInfo = findEmojiData(emoji);

    if (!emojiInfo) {
      // 絵文字が見つからない場合は元の絵文字を返す
      return emoji;
    }

    return generateFluentEmojiUrl(emojiInfo, style, skinTone, finalConfig);
  } catch (error) {
    // エラーが発生した場合は元の絵文字を返す
    return emoji;
  }
}

export { DEFAULT_CONFIG };
