## 要件定義

### 基本要件
- **要望ID**: Emoji-001
- **概要**: 絵文字を引数に渡すとFluentEmojiのURLを返すOSS
- **目的**: OS依存の絵文字表示を統一し、ブログ・CMS利用での作業効率化

### 技術要件
- **対応スタイル**: 3D、Color、Flat、High Contrast
- **肌色バリエーション**: 必須対応(Default、Light、Medium-Light、Medium、Medium-Dark、Dark)
- **データソース**: unicode-emoji-json
- **出力**: FluentEmojiのGitHub RawURL(将来的にはR2へ移行)
- 開発スタイル: pnpm でモノレポ開発を行う

### 提供方法
- **優先度1**: ライブラリ(npm/JSR配布)
- **将来拡張**: API → CLI

## 技術仕様

### モノレポ構成
- **パッケージ管理**: pnpm workspace
- **パッケージ構成**:
  - `@fluent-emoji-converter/types`: 共通型定義パッケージ
  - `@fluent-emoji-converter/core`: メインロジック・変換処理パッケージ
  - `fluent-emoji-converter`: 公開ライブラリパッケージ(types + coreを統合)
- **依存関係**: lib → core → types の単方向依存
- **ビルド順序**: types → core → lib の順でビルド実行
- **配布戦略**: 
  - 内部パッケージ(types, core): workspace内でのみ使用
  - 公開パッケージ(lib): npm/JSRで配布

### 技術スタック
- **言語**: TypeScript
- **フレームワーク**: Hono(将来のAPI展開対応)
- **ビルド**: esbuild
- **絵文字データ**: unicode-emoji-json
- **配布**: npm + JSR

### 型定義
```typescript
type EmojiStyle = '3d' | 'color' | 'flat' | 'high-contrast'
type SkinTone = 'default' | 'light' | 'medium-light' | 'medium' | 'medium-dark' | 'dark'

type ConvertOptions = {
  emoji: string
  style?: EmojiStyle // 指定しないとデフォルト
  skinTone?: SkinTone // これはemojiの値によって必要か変化する
}

function convertEmoji(options: ConvertOptions): string
```

### 使用例
```typescript
import { convertEmoji } from 'fluent-emoji-converter'

// 基本使用
const url = convertEmoji({ emoji: '😇', style: 'flat' })

// 肌色指定
const url = convertEmoji({ 
  emoji: '👋', 
  style: 'flat', 
  skinTone: 'medium' 
})
```

### URL構造パターン
```
// 肌色非対応
/assets/{Name}/Flat/{slug}_flat.svg

// 肌色対応(デフォルト)
/assets/{Name}/Default/Flat/{slug}_flat_default.svg

// 肌色対応(指定)
/assets/{Name}/Light/Flat/{slug}_flat_light.svg
/assets/{Name}/Medium-Dark/Flat/{slug}_flat_medium-dark.svg
```

## 実装方針

### エラーハンドリング
- **エラー時の動作**: 元絵文字を返却
- **肌色非対応絵文字にskinTone指定**: skinToneを無視して通常URL生成
- **ハイコントラスト肌色**: 動的チェック + デフォルトにフォールバック

### 自動更新戦略
- **頻度**: 週次CI実行
- **方法**: FluentEmoji更新チェック → unicode-emoji-json更新 → PR自動作成

### 開発工数見積
- **基本実装**: 4人日
- **テスト・ドキュメント**: 1.5人日  
- **CI/CD・自動更新**: 1人日
- **合計**: 6.5人日

### 段階的リリース
- **v0.1.0**: 基本機能(肌色非対応絵文字)
- **v0.2.0**: 肌色バリエーション対応
- **v0.3.0**: エラーハンドリング強化
- **v1.0.0**: 安定版リリース

### その他
絵文字の著作権は**Microsoftにあり**、MITライセンスの下で配布されていることを**READMEやLICENSEに明記**すればOSSでの利用・配布は問題なし。
`raw.githubusercontent.com` は**CDN用途や高頻度アクセスを想定していない**。OSS公開直後に使うのは可だが、**人気が出た場合には利用規約違反のリスクがある**。
初期はGitHub Rawを使用し、**アクセス量が増加したらCloudflare R2等のCDNへ移行**。URLの**ベースパスを切り替え可能に設計**しておくと安全。


## TODO
### 開発タスク
- [ ] プロジェクト初期設定
- [ ] 型定義作成
- [ ] コア変換ロジック実装
- [ ] 肌色バリエーション対応
- [ ] テスト作成
- [ ] CI/CD設定
- [ ] ドキュメント作成
- [ ] npm/JSR公開
