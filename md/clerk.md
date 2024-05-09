# Clerk を使って簡単に認証を行う

ここでは管理画面の作成を行なっていきます。

[Clerk ドキュメント](https://clerk.com/docs/references/nextjs/overview)で確認してください。

1, 認証ライブラリでは Clerk を使っていきます。 NextAuth.js でを使おうか迷ったのですが、こちらの方がコード内容も少なく GUI 操作で簡単にできるので選びました。(NextAuth.js では GUI 操作はできない、コードベースです)
Clerk にもデメリットがあります。小規模なら無料枠でもいけるが大規模のサイト運用するときは有料枠を選ぶ必要が出てきます。コスト面で考えるなら NextAuth.js を使用した方がいいでしょう。(Clerk:`有料: $25(3800円)/月`)

2, インストール

```

npm install @clerk/nextjs

```

3, Clerk にログインしたらアプリケーションの名前を作成し API Keys のコピーし`.env`に貼り付けます。

4, `layout.tsx`に ClerkProvider を追加

```ruby:layout.tsx

import { ClerkProvider } from '@clerk/nextjs'
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  )
}

```

5, `middleware.ts`を作ります。これが必要な理由は認証とセキュリティの為に使います。管理者用とクライアント用のページを作る上で重要なものです。

```ruby:middleware.ts

import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({});

export const config = {
  matcher: ["/((?!.+.[w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};

```

6, Clerk ではアカウントやプロフィールなど他色々が英語表記なのでこれを日本語にします。

まず、インストールします

```

npm install @clerk/localizations

```

インストールしたら import して`jaJp`を持ってきます。ClerkProvider から`localization`を追加し`jaJp`を入れたら、日本語表記になります。

[localization 参考](https://clerk.com/docs/components/customization/localization#adding-or-updating-a-localization)

```ruby:layout.tsx

 import { jaJP } from "@clerk/localizations";

 <ClerkProvider localization={jaJP}>
      <html lang="en">
        <body>{children}</body>
      </html>
 </ClerkProvider>

```

他やり方は[Clerk ドキュメント](https://clerk.com/docs/references/nextjs/overview)や[Component Reference](https://clerk.com/docs/components/overview)で確認してください。

## authMiddleware() このメソッドは現在非推奨

clerk で`authMiddleware()` このメソッドは非推奨になりました。代わりに使うのが`clerkMiddleware()`になります。
しかしこの clerkMiddleware()メソッドは`@clerk/nextjs`のバージョン４には無く`バージョン５`にアップグレードする必要があります。

```

npm install @clerk/nextjs@latest

```

これでアップグレードできました。
しかしこれで終わりじゃありません。少し書き方が変わります。

```ruby

import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();

export const config = {
  matcher: ["/((?!.+.[w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};

```

```ruby

import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";

```

以前はインポートする時`@clerk/nextjs`だけで大丈夫でしたが、今はクライアントとサーバー側に分ける必要がありクライアント側はは`@clerk/nextjs`サーバー側は`@clerk/nextjs/server`になります。

## clerkMiddleware() の使い方

`clerkMiddleware()`はミドルウェアを通じて Clerk 認証を Next.js アプリケーションに統合します。
`App router`と `Pages router`の両方に使えます

```ruby

import { clerkMiddleware } from '@clerk/nextjs/server';

export default clerkMiddleware()

export const config = {
  matcher: [ '/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};

```

### createRouteMatcher()

デフォルトでは、clerkMiddleware ルートは保護されません、ルートの保護は`createRouteMatcher()`を
使います。

`createRouteMatcher()`はルートの配列を受け入れ、ユーザーが訪問しようとしているルートが、渡されたルートの 1 つと一致するかどうかを確認します

実際の例が...

```ruby

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/forum(.*)',
]);

```

`createRouteMatcher()`で`/dashboard`と`/forum`ルートを保護しています。

### ユーザーの認証や許可のステータスに基づいてルートを保護する方法

#### ユーザーの認証

使用できる方法は 2 つあります。

1, `auth().protect()` 認証されていないユーザーをサインイン ルートに自動的にリダイレクトする場合に使用します。

2, `auth().userId` ユーザー認証ステータスに基づいてアプリの動作をより詳細に制御したい場合に使用します。

```ruby

import {
  clerkMiddleware,
  createRouteMatcher
} from '@clerk/nextjs/server';

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/forum(.*)',
]);

export default clerkMiddleware((auth, req) => {
  if (isProtectedRoute(req)) auth().protect();
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};

```

#### ユーザーの許可

使用できる方法は 2 つあります。

1, `auth().protect()`を使ってユーザーがロールまたは権限を持っていない場合に`404`を返すようにする。

2, `auth().has()` 承認ステータスに基づいてアプリの動作をより詳細に制御したい場合に使用します。

```ruby

import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isProtectedRoute = createRouteMatcher([
  '/admin(.*)',
]);

export default clerkMiddleware((auth, req) => {

  if (isProtectedRoute(req)) {
    auth().protect(has => {
      return (
        has({ permission: 'org:sys_memberships:manage' }) ||
        has({ permission: 'org:sys_domains_manage' })
      )
    })
  }
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};

```

### clerkMiddleware()オプション

| 名前              | タイプ             | 説明                                                                                                                                                                                                  |
| ----------------- | ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| audience          | string \| string[] | オーディエンスの文字列またはリスト。合格した場合は、aud トークン内のクレームと照合されます。                                                                                                          |
| authorizedParties | string[]           | サブドメイン Cookie 漏洩攻撃からアプリケーションを保護するために検証するオリジンのホワイトリスト。 例:['http://localhost:3000', 'https://example.com']                                                |
| clockSkewInMs     | number             | トークンを検証するときに、Clerk サーバー (トークンを生成する) とユーザーのアプリケーション サーバーのクロックの間の許容される時間差 (ミリ秒単位) を指定します。デフォルトは 5000 ミリ秒 (5 秒) です。 |
| domain            | string             | このアプリケーションが展開されている場所を Clerk に通知するためにサテライトに使用されるドメイン。                                                                                                     |
| isSatellite       | boolean            | Clerk のサテライト機能を使用する場合、これをセカンダリ ドメインに対して設定する必要があります。                                                                                                       |
| jwtKey            | string             | セッション トークンの検証に使用するオプションのカスタム JWT キー。                                                                                                                                    |
| proxyUrl          | string             | プロキシを使用する場合は、プロキシの URL を指定します。                                                                                                                                               |
| signInUrl         | string             | 代替サインイン URL。                                                                                                                                                                                  |
| publishableKey    | string             | インスタンスの Clerk 公開可能キー。これは、 「API キー」 ページのクラーク ダッシュボードにあります。                                                                                                  |
| secretKey         | string             | インスタンスの Clerk 秘密キー。これは、 「API キー」 ページのクラーク ダッシュボードにあります。                                                                                                      |
