# Stripe

## Stripe CLI

### インストール (homebrew)

`homebrew`からインストールしていきます

```

brew install stripe/stripe-cli/stripe

```

### CLI にログイン

```

stripe login

```

キーボードの Enter キーを押し、ブラウザーでの認証プロセスを完了します。

### ローカルの Webhook エンドポイントにイベントを転送する

`--forward-to` フラグを使用して、テスト環境のすべての Stripe イベントをローカルの Webhook エンドポイントに送信します。HTTPS 証明書の検証を無効にするには、`--skip-verify` フラグを使用します。

```

stripe listen --forward-to localhost:3000/api/webhook

```

これは `localhost:3000` に Webhook エンドポイントにイベントを転送したということです。

`/api/webhook`は Next.js で作った API Route のフォルダ名を入れて下さい。(`/api/webhook`/route.ts)

Enter キーを押すと

```

Ready! You are using Stripe API Version [2024-04-10]. Your webhook signing secret is {webhook signing secret} (^C to quit)

```

`{webhook signing secret}`の部分は`Webhook 署名シークレット`です。必要になるのでコピーして`.env`のに入れときましょう。

`.env`

```

STRIPE_WEBHOOK_SECRET={webhook signing secret}

```

コードを書いていく...

書いたら、`trigger CLI` コマンドを使用して模擬 Webhook イベントをトリガーします。

```

stripe trigger payment_intent.succeeded

```

### Webhook を使用する理由

自社のアプリが Stripe アカウントで発生するイベントを受信できるようにすることをお勧めします。こうすることで、バックエンドシステムは適宜アクションを実行できます

Webhook イベントの受信は、顧客の銀行が支払いを確定したとき、顧客が支払いに対して不審請求を申請したとき、継続支払いが成功したとき、サブスクリプションの支払いを回収するときなど、非同期イベントをリッスンする際に特に便利です。

[Webhook](https://docs.stripe.com/webhooks/quickstart)

webhook を使用する上で Event が重要になります

#### Event の種類

[Event](https://docs.stripe.com/api/events/object)
