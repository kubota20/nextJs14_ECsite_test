# Next.js 14 EC サイト

これは[youtube](https://www.youtube.com/watch?v=5miHyP6lExg&t=33915s)を見ながら作りました。`App Router, React, Tailwind, Prisma, MySQL`を使って EC サイトを構築していきます。

書くことが多く見やすくする為`/md`に分けて書きます。全体の流れはこちらで書いていきます。

## youtube の内容で違うこと

youtube みながらそっくりそのままなのは物足りなさを感じたので少し内容を変えてます。

### 違うところ

1, Next 13 じゃなく Next 14 を使用

2, 認証機能 Clerk の英語表記を`日本語表記`に変えてます

3, Clerk の v4.29 から v5 に変更

4, PlanetScale で MySQL のデータベース管理を PlanetScale 使わず`自分でデータベースを管理`

## 作成手順

1, 環境構築

next.js や shadcn/ui を使った環境構築の流れは[ここで確認](md/shadchUI.md)

2, 認証機能で Clerk を使っていきます。Clerk は[ここで確認](md/clerk.md)

3, zustand で状態管理ライブラリを使う。[ここで確認](md/zustand.md)

4, Prisma でデータベースのやり取りをより簡単かつ安全に行えるようにします。(mysql も少しだけ書いてある)[ここで確認](md/prisma.md)

5, Zod と react-hook-form を使ってスキーマ宣言とデータ検証[ここで確認](md/zod.md)

6, API route を使って Prisma で作ったテーブルを使って ID の取得や削除を作る[ここで確認](my-app/src/app/api/stores)

7, Cloudinary で保管・一元管理や変換や最適化、CDN で高速配信を行う[ここで確認](md/cloudinary.md)

8, Prisma で Billboard テーブルを作成[ここで確認](my-app/prisma/schema.prisma)

9, Billboard テーブルを使って API route を作ります[ここで確認](my-app/src/app/api/[storeId]/billboards)

## 分からないところ

- `ec-store/src/actons/get-categories.tsx`と`get-billboard.tsx`について、fetch API を使用して HTTP リクエストを送信する際に使用するリクエストオプションを定義した時に、`get-categories.tsx`ではリクエストオプションは ok でしないと Error`get-billboard.tsx`ではリクエストオプションは Error でしないと ok と違いが出ました。

`Error内容`

```
    SyntaxError: Unexpected token '<', "<!DOCTYPE "... is not valid JSON
    at JSON.parse (<anonymous>)
    at AsyncResource.runInAsyncScope (node:async_hooks:206:9)

```

このエラーは、API からのレスポンスが JSON 形式でない場合に発生するみたいです。

なので API エンドポイントを JSON 形式か調べました。どちらもレスポンスの Content-Type は application/json で JSON 形式でした。

?何が違うのか...,

`my-app/src/api`の中身を見ても問題はなく、まあ動くのでリクエストオプションはつけたり付けなかったりします。
