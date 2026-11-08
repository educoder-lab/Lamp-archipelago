# Supabase セットアップ（Google ログイン＋進捗同期）

アプリ名（OAuth 同意画面）: **Lumina Code**  
ログインは**任意**です。未ログインでも localStorage で学習できます。ログインすると別端末でも同じ灯が復元されます。

## 1. Google OAuth

1. [Google Cloud Console](https://console.cloud.google.com/) でプロジェクトを選び、**OAuth 同意画面**を設定（外部／テストで友人メールを追加してもよい）。
2. **認証情報 → OAuth クライアント ID** を作成（アプリケーションの種類: **ウェブ**）。
3. Supabase Dashboard → **Authentication → Providers → Google** を開き、表示されている **Callback URL**（例: `https://<ref>.supabase.co/auth/v1/callback`）を、Google 側の「承認済みのリダイレクト URI」に登録する。
4. Google の Client ID / Client Secret を Supabase の Google プロバイダに貼って保存する。

## 2. Site URL / Redirect

Supabase → **Authentication → URL Configuration**:

| 項目 | 値の例 |
|------|--------|
| Site URL | `https://educoder-lab.github.io/Lamp-archipelago/` |
| Redirect URLs | `https://educoder-lab.github.io/Lamp-archipelago/**` とローカル用 `http://localhost:**`（任意） |

## 3. テーブル（RLS）

SQL Editor で [`supabase/lamp_progress.sql`](./supabase/lamp_progress.sql) を実行する。

## 4. フロントの設定

1. Project Settings → API から **Project URL**（末尾に `/rest/v1/` は付けない）と **Publishable / anon public** キーをコピーする。
2. [`docs/supabase-config.example.js`](../docs/supabase-config.example.js) を参考に [`docs/supabase-config.js`](../docs/supabase-config.js) を編集する。

```js
window.LAMP_SUPABASE = {
  url: 'https://xxxx.supabase.co',
  anonKey: 'sb_publishable_...' // または従来の eyJ... anon JWT
};
```

- **Publishable / anon key のみ**を入れる（`service_role` / secret は絶対に入れない）。
- 友人配布のため publishable key をリポジトリにコミットしてよい（RLS で自分の行だけ読書き）。
- `url` が空、またはプレースホルダのままだとログインボタンは出ず、従来どおりローカルのみで動く。
- 本リポジトリの公開 Pages 用設定はすでに投入済みです。

## 5. 動作確認

1. Pages（またはローカル HTTP）で `map.html` を開く。
2. 「Google でログイン」→ 許可 → マップに戻る。
3. 講座を 1 つ合格する。
4. 別ブラウザ／シークレットで同じ Google アカウントでログインし、灯が復元されることを確認する。

## トラブル

| 症状 | 確認 |
|------|------|
| ログイン後すぐ戻る／エラー | Redirect URLs に Pages のオリジンが入っているか |
| `invalid request` from Google | Google 側のリダイレクト URI が Supabase Callback と一致しているか |
| 同期されない | SQL の RLS ポリシー、ブラウザのコンソール、anon key のプロジェクト一致 |
| ボタンが出ない | `supabase-config.js` の `url` / `anonKey` が埋まっているか |
