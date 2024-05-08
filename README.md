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

2, 認証機能

2.1, `app/`の中に`(root)`フォルダーを作成,この`()`は URL パスに影響を与えずルートの管理ができます。大規模なサイトでは管理者用ページやクライアント用ページで分けたい場合に使ったりします。あとはコードが見やすいからです。

2.2, 認証方法は Clerk を使っていきます。Clerk は[ここで確認](md/clerk.md)

3, zustand で状態管理ライブラリを使う。[ここで確認](md/zustand.md)

4, Prisma でデータベースのやり取りをより簡単かつ安全に行えるようにします。(mysql も少しだけ書いてある)[ここで確認](md/prisma.md)

5, Zod と react-hook-form を使ってスキーマ宣言とデータ検証[ここで確認](md/zod.md)

6, API route を使って Prisma で作ったテーブルを使って ID の取得や削除を作る[ここで確認](my-app/src/app/api/stores)

6, Cloudinary で保管・一元管理や変換や最適化、CDN で高速配信を行う[ここで確認](md/cloudinary.md)

7, Prisma で Billboard テーブルを作成[ここで確認](my-app/prisma/schema.prisma)

8, Billboard テーブルを使って API route で
