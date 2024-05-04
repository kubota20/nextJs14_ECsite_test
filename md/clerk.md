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
