/**
 * Fluent Emoji Converter のコア変換ロジックのテスト
 */
import { describe, it, expect } from 'vitest';
import { convertEmoji } from '../src/index';

describe('convertEmoji', () => {
  it('基本的な絵文字変換ができる', () => {
    const result = convertEmoji({ emoji: '😀', style: 'flat' });
    expect(result).toContain('grinning_face_flat.svg');
  });

  it('存在しない絵文字の場合は元の絵文字を返す', () => {
    const result = convertEmoji({ emoji: 'invalid', style: 'flat' });
    expect(result).toBe('invalid');
  });

  it('スタイル指定なしの場合はデフォルトスタイルを使用', () => {
    const result = convertEmoji({ emoji: '😀' });
    expect(result).toContain('_flat.svg');
  });

  it('3Dスタイルの変換ができる', () => {
    const result = convertEmoji({ emoji: '😀', style: '3d' });
    expect(result).toContain('/3D/');
    expect(result).toContain('_3d.png');
  });

  it('colorスタイルの変換ができる', () => {
    const result = convertEmoji({ emoji: '😀', style: 'color' });
    expect(result).toContain('/Color/');
    expect(result).toContain('_color.svg');
  });

  it('high-contrastスタイルの変換ができる', () => {
    const result = convertEmoji({ emoji: '😀', style: 'high-contrast' });
    expect(result).toContain('/High Contrast/');
    expect(result).toContain('_high_contrast.svg');
  });

  it('肌色対応絵文字でdefault肌色を指定', () => {
    const result = convertEmoji({
      emoji: '👋',
      style: 'flat',
      skinTone: 'default',
    });
    expect(result).toContain('/Default/Flat/');
    expect(result).toContain('_flat_default.svg');
  });

  it('肌色対応絵文字でlight肌色を指定', () => {
    const result = convertEmoji({
      emoji: '👋',
      style: 'flat',
      skinTone: 'light',
    });
    expect(result).toContain('/Light/Flat/');
    expect(result).toContain('_flat_light.svg');
  });

  it('肌色対応絵文字でmedium-light肌色を指定', () => {
    const result = convertEmoji({
      emoji: '👋',
      style: 'flat',
      skinTone: 'medium-light',
    });
    expect(result).toContain('/Medium-Light/Flat/');
    expect(result).toContain('_flat_medium_light.svg');
  });

  it('肌色対応絵文字でmedium肌色を指定', () => {
    const result = convertEmoji({
      emoji: '👋',
      style: 'flat',
      skinTone: 'medium',
    });
    expect(result).toContain('/Medium/Flat/');
    expect(result).toContain('_flat_medium.svg');
  });

  it('肌色対応絵文字でmedium-dark肌色を指定', () => {
    const result = convertEmoji({
      emoji: '👋',
      style: 'flat',
      skinTone: 'medium-dark',
    });
    expect(result).toContain('/Medium-Dark/Flat/');
    expect(result).toContain('_flat_medium_dark.svg');
  });

  it('肌色対応絵文字でdark肌色を指定', () => {
    const result = convertEmoji({
      emoji: '👋',
      style: 'flat',
      skinTone: 'dark',
    });
    expect(result).toContain('/Dark/Flat/');
    expect(result).toContain('_flat_dark.svg');
  });

  it('ハイコントラストで肌色指定がある場合はデフォルトにフォールバック', () => {
    const result = convertEmoji({
      emoji: '👋',
      style: 'high-contrast',
      skinTone: 'light',
    });
    expect(result).toContain('/Default/High Contrast/');
    expect(result).toContain('_high_contrast_default.svg');
  });

  it('エラーが発生した場合は元の絵文字を返す', () => {
    const result = convertEmoji({ emoji: 'invalid' });
    expect(result).toBe('invalid');
  });

  it('不正なスタイル指定の場合はデフォルトスタイルにフォールバック', () => {
    // @ts-ignore - 意図的に不正な値をテスト
    const result = convertEmoji({ emoji: '😀', style: 'invalid-style' });
    expect(result).toContain('/Flat/');
    expect(result).toContain('_flat.svg');
  });

  it('不正な肌色指定の場合はデフォルト肌色にフォールバック', () => {
    const result = convertEmoji({
      emoji: '👋',
      style: 'flat',
      // @ts-ignore - 意図的に不正な値をテスト
      skinTone: 'invalid-skin-tone',
    });
    expect(result).toContain('/Default/Flat/');
    expect(result).toContain('_flat_default.svg');
  });
});
