# Fluent Emoji Converter

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg)
![pnpm](https://img.shields.io/badge/pnpm-workspace-green.svg)

OS依存の絵文字表示を統一するため、絵文字を引数に渡すとFluentEmojiのURLを返すOSSライブラリです。

> [!WARNING]
> 本リポジトリは2025年6月29日時点、npmライブラリへ公開していません

## 特徴

- 🎨 4つのスタイルをサポート (3D、Color、Flat、High Contrast)
- ✋ 6つのスキントーンバリエーションに対応
- 📦 TypeScriptで開発、型安全
- 🔄 unicode-emoji-jsonを使用したデータ取得
- ⚡ 軽量で高速

## インストール

```bash
npm install fluent-emoji-converter
# または
pnpm add fluent-emoji-converter
# または
yarn add fluent-emoji-converter
```

## 使用方法

### 基本的な使用

```typescript
import { convertEmoji } from 'fluent-emoji-converter'

// 基本的な絵文字変換
const url = convertEmoji({ emoji: '😇', style: 'flat' })
console.log(url) 

// スキントーン指定
const url = convertEmoji({ 
  emoji: '👋', 
  style: 'color', 
  skinTone: 'medium' 
})
```

### 対応スタイル

- `3d` - 3Dスタイル（PNG形式）
- `color` - カラースタイル（SVG形式）
- `flat` - フラットスタイル（SVG形式、デフォルト）
- `high-contrast` - ハイコントラストスタイル（SVG形式）

### 対応スキントーン

- `default` - デフォルト（スキントーンなし）
- `light` - ライト
- `medium-light` - ミディアムライト
- `medium` - ミディアム
- `medium-dark` - ミディアムダーク
- `dark` - ダーク

## 開発

このプロジェクトはpnpm workspaceを使用したモノレポ構成です。

### 必要環境

- Node.js 18+
- pnpm 8+

### セットアップ

```bash
# リポジトリをクローン
git clone https://github.com/Suntory-Y-Water/fluent-emoji-converter.git
cd fluent-emoji-converter

# 依存関係をインストール
pnpm install

# 全パッケージをビルド
pnpm build
```

### 開発コマンド

```bash
# 全パッケージのビルド
pnpm build

# テスト実行
pnpm test

# テストカバレッジ付きで実行
pnpm test:cov

# 型チェック
pnpm typecheck

# リント実行
pnpm lint

# 開発モード（ファイル監視）
pnpm dev
```

### パッケージ構成

```
packages/
├── types/           # @fluent-emoji-converter/types - 共通型定義
└── core/            # fluent-emoji-converter - メインロジック
```

## API リファレンス

### `convertEmoji(options, config?)`

絵文字をFluent EmojiのURLに変換します。

#### パラメータ

- `options` (ConvertOptions): 変換オプション
  - `emoji` (string): 変換する絵文字
  - `style?` (EmojiStyle): 絵文字スタイル（'3d' | 'color' | 'flat' | 'high-contrast'）デフォルト: 'flat'
  - `skinTone?` (SkinTone): スキントーン（'default' | 'light' | 'medium-light' | 'medium' | 'medium-dark' | 'dark'）
- `config?` (FluentEmojiConfig): 設定オプション（省略可能）
  - `baseUrl` (string): ベースURL
  - `defaultStyle` (EmojiStyle): デフォルトスタイル

#### 戻り値

- `string`: Fluent EmojiのURL、または変換できない場合は元の絵文字

#### 使用例

```typescript
import { convertEmoji } from 'fluent-emoji-converter'

// デフォルト設定での変換
const url1 = convertEmoji({ emoji: '😀' }) // style='flat'がデフォルト

// スタイル指定
const url2 = convertEmoji({ emoji: '😀', style: 'color' })

// スキントーン指定（対応する絵文字のみ）
const url3 = convertEmoji({ 
  emoji: '👋', 
  style: 'flat', 
  skinTone: 'medium' 
})
```

## ライセンス

MIT License - 詳細は[LICENSE](LICENSE)ファイルを参照してください。

## 注意事項

- Fluent Emojiの著作権は Microsoft Corporation に帰属します
- 絵文字画像はMITライセンスで配布されています
- 初期バージョンではGitHub Rawを使用していますが、将来的にCDNへの移行を予定しています
