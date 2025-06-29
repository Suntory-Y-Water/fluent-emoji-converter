# Fluent Emoji Converter

## プロジェクト概要
OS依存の絵文字表示を統一するため、絵文字を引数に渡すとFluentEmojiのURLを返すOSSライブラリ。

## 技術スタック
- **言語**: TypeScript
- **フレームワーク**: Hono
- **ビルド**: esbuild
- **パッケージ管理**: pnpm workspace
- **配布**: npm

## モノレポ構成
```
packages/
├── types/           # @fluent-emoji-converter/types (共通型定義)
├── core/            # @fluent-emoji-converter/core (メインロジック)
└── lib/             # fluent-emoji-converter (公開ライブラリ)
```

## 基本仕様
- **対応スタイル**: 3D、Color、Flat、High Contrast
- **肌色バリエーション**: Default、Light、Medium-Light、Medium、Medium-Dark、Dark
- **データソース**: unicode-emoji-json
- **エラー時**: 元絵文字を返却

## 使用例
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

## 開発コマンド
- `pnpm install` - 依存関係のインストール
- `pnpm build` - 全パッケージのビルド
- `pnpm test` - テスト実行
- `pnpm lint` - リント実行
- `pnpm typecheck` - 型チェック

## コード生成規約
### コメント
各ファイルの冒頭には日本語のコメントで仕様を記述する。
```ts
/**
 * 2点間のユークリッド距離を計算する
 **/
type Point = { x: number; y: number };
export function distance(a: Point, b: Point): number {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}
```

### テスト

- 各機能に対しては必ずユニットテストを実装(テストは Vitest を使用。describe/it 構文を使用。describe は日本語で記述)

```ts
function add(a: number, b: number) {
  return a + b;
}
test("1+2=3", () => {
  expect(add(1, 2)).toBe(3);
});
```

- **コードスタイル**: ESLint + Prettier で統一
- **ドキュメント**: 関数やコンポーネントには JSDoc コメントを必ず追加
- 規約: ハードコードは絶対にしないでください。環境変数や設定ファイルを使用して、柔軟に対応できるようにします。

## コード生成後の確認一覧

- [ ] `pnpm run typecheck` を行い、型エラーは発生しません
- [ ] `pnpm run lint` を行い、リントエラーは発生しません
- [ ] `pnpm run test` を行い、テストが失敗したケースはありません

## 注意事項
- 絵文字の著作権はMicrosoftにあり、MITライセンスで配布
- 初期はGitHub Raw使用、アクセス増加時にCDNへ移行予定
- 週次で自動更新CI実行
