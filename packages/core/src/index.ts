/**
 * Fluent Emoji Converter のコア変換ロジック
 * 絵文字を FluentEmoji の URL に変換する機能を提供
 */
import type { ConvertOptions, EmojiStyle, SkinTone, EmojiData, FluentEmojiConfig } from '@fluent-emoji-converter/types'
import emojiData from 'unicode-emoji-json'

// unicode-emoji-jsonの型定義がないため、型を定義
interface UnicodeEmojiData {
  [key: string]: {
    name: string
    slug: string
    group: string
    emoji_version: string
    unicode_version: string
    skin_tone_support: boolean
  }
}

const DEFAULT_CONFIG: FluentEmojiConfig = {
  baseUrl: 'https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets',
  defaultStyle: 'flat'
}

/**
 * 絵文字データを検索して対応する情報を取得
 */
function findEmojiData(emoji: string): EmojiData | null {
  const typedEmojiData = emojiData as UnicodeEmojiData
  const found = Object.entries(typedEmojiData).find(([key]) => key === emoji)
  if (!found) return null

  const [emojiChar, data] = found
  return {
    name: data.name || '',
    slug: data.slug || '',
    group: data.group || '',
    emoji: emojiChar,
    unicode: emojiChar,
    supportsSkinTone: data.skin_tone_support || false,
    supportsHighContrast: true // デフォルトで true とする
  }
}

/**
 * スタイル名を URL パス用の文字列に変換
 */
function styleToPath(style: EmojiStyle): string {
  switch (style) {
    case '3d':
      return '3D'
    case 'color':
      return 'Color'
    case 'flat':
      return 'Flat'
    case 'high-contrast':
      return 'High Contrast'
    default:
      return 'Flat'
  }
}

/**
 * 肌色トーンを URL パス用の文字列に変換
 */
function skinToneToPath(skinTone: SkinTone): string {
  switch (skinTone) {
    case 'default':
      return 'Default'
    case 'light':
      return 'Light'
    case 'medium-light':
      return 'Medium-Light'
    case 'medium':
      return 'Medium'
    case 'medium-dark':
      return 'Medium-Dark'
    case 'dark':
      return 'Dark'
    default:
      return 'Default'
  }
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
  const stylePath = styleToPath(style)
  const styleParam = style.replace('-', '_')

  // 肌色非対応の場合
  if (!emojiData.supportsSkinTone || !skinTone || skinTone === 'default') {
    if (emojiData.supportsSkinTone && skinTone === 'default') {
      // 肌色対応だがデフォルトを指定
      return `${config.baseUrl}/${emojiData.name}/Default/${stylePath}/${emojiData.slug}_${styleParam}_default.svg`
    } else {
      // 肌色非対応
      return `${config.baseUrl}/${emojiData.name}/${stylePath}/${emojiData.slug}_${styleParam}.svg`
    }
  }

  // 肌色対応の場合
  const skinTonePath = skinToneToPath(skinTone)
  const skinToneParam = skinTone.replace('-', '_')
  
  // ハイコントラストで肌色指定がある場合はデフォルトにフォールバック
  if (style === 'high-contrast') {
    return `${config.baseUrl}/${emojiData.name}/Default/${stylePath}/${emojiData.slug}_${styleParam}_default.svg`
  }

  return `${config.baseUrl}/${emojiData.name}/${skinTonePath}/${stylePath}/${emojiData.slug}_${styleParam}_${skinToneParam}.svg`
}

/**
 * 絵文字を FluentEmoji の URL に変換する
 */
export function convertEmoji(options: ConvertOptions, config?: FluentEmojiConfig): string {
  const { emoji, style = DEFAULT_CONFIG.defaultStyle, skinTone } = options
  const finalConfig = { ...DEFAULT_CONFIG, ...config }

  try {
    const emojiInfo = findEmojiData(emoji)
    
    if (!emojiInfo) {
      // 絵文字が見つからない場合は元の絵文字を返す
      return emoji
    }

    return generateFluentEmojiUrl(emojiInfo, style, skinTone, finalConfig)
  } catch (error) {
    // エラーが発生した場合は元の絵文字を返す
    return emoji
  }
}

export { DEFAULT_CONFIG }
