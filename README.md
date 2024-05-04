# Next.js 14 EC サイト

これは[youtube](https://www.youtube.com/watch?v=5miHyP6lExg&t=33915s)を見ながら作りました。`App Router, React, Tailwind, Prisma, MySQL`を使って EC サイトを構築していきます。

書くことが多く見やすくする為`/md`に分けて書きます。全体の流れはこちらで書いていきます。

## 作成手順

1, 環境構築

next.js や shadcn/ui を使った環境構築の流れは[ここで確認](md/shadchUI.md)

2, 認証機能

2.1, `app/`の中に`(root)`フォルダーを作成,この`()`は URL パスに影響を与えずルートの管理ができます。大規模なサイトでは管理者用ページやクライアント用ページで分けたい場合に使ったりします。あとはコードが見やすいからです。

2.2, 認証方法は Clerk を使っていきます。Clerk は[ここで確認](md/clerk.md)

3, zustand で状態管理ライブラリを使う。[ここで確認](md/zustand.md)

4, Prisma でデータベースのやり取りをより簡単かつ安全に行えるようにします。(mysql も少しだけ書いてある)[ここで確認](md/prisma.md)

5, Cloudinary で保管・一元管理や変換や最適化、CDN で高速配信を行う
