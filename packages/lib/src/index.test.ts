/**
 * Fluent Emoji Converter 公開ライブラリのテスト
 */
import { describe, it, expect } from 'vitest';
import { convertEmoji, ConvertOptions } from './index';

describe('fluent-emoji-converter ライブラリ', () => {
  it('基本的な絵文字変換ができる', () => {
    const result = convertEmoji({ emoji: '😀', style: 'flat' });
    expect(result).toContain('grinning_face_flat.svg');
  });

  it('型定義が正しくエクスポートされている', () => {
    // TypeScriptの型チェックで確認されるため、ここではコンパイルが通ることを確認
    const options: ConvertOptions = {
      emoji: '😀',
      style: 'flat',
      skinTone: 'light',
    };
    const result = convertEmoji(options);
    expect(typeof result).toBe('string');
  });

  it('肌色バリエーション付きの変換ができる', () => {
    const result = convertEmoji({
      emoji: '👋',
      style: 'flat',
      skinTone: 'medium',
    });
    expect(result).toContain('_flat_medium.svg');
  });
});
