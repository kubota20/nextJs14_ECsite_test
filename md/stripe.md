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

stripe listen --forward-to localhost:3000/stripe_webhooks

```

これは localhost:3000 に Webhook エンドポイントにイベントを転送したということです。

Enter キーを押すと

```

Ready! You are using Stripe API Version [2024-04-10]. Your webhook signing secret is {webhook signing secret} (^C to quit)

```

`{webhook signing secret}`の部分は`Webhook 署名シークレット`です。必要になるのでコピーして`.env`のに入れときましょう。

`.env`

```

STRIPE_WEBHOOK_SECRET={webhook signing secret}

```

### Webhook を使用する理由

自社のアプリが Stripe アカウントで発生するイベントを受信できるようにすることをお勧めします。こうすることで、バックエンドシステムは適宜アクションを実行できます

Webhook イベントの受信は、顧客の銀行が支払いを確定したとき、顧客が支払いに対して不審請求を申請したとき、継続支払いが成功したとき、サブスクリプションの支払いを回収するときなど、非同期イベントをリッスンする際に特に便利です。

[Webhook](https://docs.stripe.com/webhooks/quickstart)

webhook を使用する上で Event が重要になります

#### Event の種類

[Event](https://docs.stripe.com/api/events/object)

| Event                                                      | Description                                                                                                                                                                                |
| ---------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `account.application.authorized`                           | ユーザーがアプリケーションを承認したときに発生します。関連するアプリケーションにのみ送信されます。                                                                                         |
| `account.application.deauthorized`                         | ユーザーがアプリケーションの承認を解除したときに発生します。関連するアプリケーションにのみ送信されます。                                                                                   |
| `account.external_account.created`                         | 外部アカウント（例：カードまたは銀行口座）が作成されたときに発生します。                                                                                                                   |
| `account.external_account.deleted`                         | 外部アカウント（例：カードまたは銀行口座）が削除されたときに発生します。                                                                                                                   |
| `account.external_account.updated`                         | 外部アカウント（例：カードまたは銀行口座）が更新されたときに発生します。                                                                                                                   |
| `account.updated`                                          | アカウントのステータスまたはプロパティが変更されたときに発生します。                                                                                                                       |
| `application_fee.created`                                  | チャージに対してアプリケーション手数料が作成されたときに発生します。                                                                                                                       |
| `application_fee.refund.updated`                           | アプリケーション手数料の払い戻しが更新されたときに発生します。                                                                                                                             |
| `application_fee.refunded`                                 | アプリケーション手数料が払い戻されたときに発生します。この中には部分的な払い戻しも含まれます。                                                                                             |
| `balance.available`                                        | Stripe の残高が更新されたときに発生します（例：チャージが支払可能になった場合）。デフォルトでは、Stripe は残高を毎日自動的に銀行口座に転送します。このイベントは負の取引には発生しません。 |
| `billing_portal.configuration.created`                     | ポータル設定が作成されたときに発生します。                                                                                                                                                 |
| `billing_portal.configuration.updated`                     | ポータル設定が更新されたときに発生します。                                                                                                                                                 |
| `billing_portal.session.created`                           | ポータルセッションが作成されたときに発生します。                                                                                                                                           |
| `capability.updated`                                       | 機能の要件またはステータスが新しくなったときに発生します。                                                                                                                                 |
| `cash_balance.funds_available`                             | 新しい資金が現金残高に自動的に調整された後に正の残高が残っている場合に発生します。手動調整を有効にしている場合、この Webhook は現金残高に新しい資金が追加されるたびに発生します。          |
| `charge.captured`                                          | 以前に未捕捉のチャージが捕捉されたときに発生します。                                                                                                                                       |
| `charge.dispute.closed`                                    | 争議が閉鎖され、争議のステータスが lost、warning_closed、または won に変更されたときに発生します。                                                                                         |
| `charge.dispute.created`                                   | 顧客が銀行に対してチャージを争議したときに発生します。                                                                                                                                     |
| `charge.dispute.funds_reinstated`                          | 争議が閉鎖された後に資金がアカウントに復元されたときに発生します。これには部分的な払い戻しも含まれます。                                                                                   |
| `charge.dispute.funds_withdrawn`                           | 争議のために資金がアカウントから引き出されたときに発生します。                                                                                                                             |
| `charge.dispute.updated`                                   | 争議が更新されたときに発生します（通常は証拠の提出により）。                                                                                                                               |
| `charge.expired`                                           | 未捕捉のチャージが期限切れになったときに発生します。                                                                                                                                       |
| `charge.failed`                                            | チャージの試行が失敗したときに発生します。                                                                                                                                                 |
| `charge.pending`                                           | 保留中のチャージが作成されたときに発生します。                                                                                                                                             |
| `charge.refund.updated`                                    | 払い戻しが更新されたときに発生します（選択された支払い方法で）。                                                                                                                           |
| `charge.refunded`                                          | チャージが払い戻されたときに発生します。部分的な払い戻しも含まれます。                                                                                                                     |
| `charge.succeeded`                                         | チャージが成功したときに発生します。                                                                                                                                                       |
| `charge.updated`                                           | チャージの説明またはメタデータが更新されたとき、または非同期の捕捉時に発生します。                                                                                                         |
| `checkout.session.async_payment_failed`                    | 遅延支払い方法を使用した支払い意図が失敗したときに発生します。                                                                                                                             |
| `checkout.session.async_payment_succeeded`                 | 遅延支払い方法を使用した支払い意図が最終的に成功したときに発生します。                                                                                                                     |
| `checkout.session.completed`                               | チェックアウトセッションが正常に完了したときに発生します。                                                                                                                                 |
| `checkout.session.expired`                                 | チェックアウトセッションが期限切れになったときに発生します。                                                                                                                               |
| `climate.order.canceled`                                   | クライメイトオーダーがキャンセルされたときに発生します。                                                                                                                                   |
| `climate.order.created`                                    | クライメイトオーダーが作成されたときに発生します。                                                                                                                                         |
| `climate.order.delayed`                                    | クライメイトオーダーが遅延したときに発生します。                                                                                                                                           |
| `climate.order.delivered`                                  | クライメイトオーダーが配達されたときに発生します。                                                                                                                                         |
| `climate.order.product_substituted`                        | クライメイトオーダーの製品が他の製品に代替されたときに発生します。                                                                                                                         |
| `climate.product.created`                                  | クライメイト製品が作成されたときに発生します。                                                                                                                                             |
| `climate.product.pricing_updated`                          | クライメイト製品の価格が更新されたときに発生します。                                                                                                                                       |
| `coupon.created`                                           | クーポンが作成されたときに発生します。                                                                                                                                                     |
| `coupon.deleted`                                           | クーポンが削除されたときに発生します。                                                                                                                                                     |
| `coupon.updated`                                           | クーポンが更新されたときに発生します。                                                                                                                                                     |
| `credit_note.created`                                      | クレジットノートが作成されたときに発生します。                                                                                                                                             |
| `credit_note.updated`                                      | クレジットノートが更新されたときに発生します。                                                                                                                                             |
| `credit_note.voided`                                       | クレジットノートが無効にされたときに発生します。                                                                                                                                           |
| `customer_cash_balance_transaction.created`                | 新しい顧客現金残高取引が作成されたときに発生します。                                                                                                                                       |
| `customer.created`                                         | 新しい顧客が作成されたときに発生します。                                                                                                                                                   |
| `customer.deleted`                                         | 顧客が削除されたときに発生します。                                                                                                                                                         |
| `customer.discount.created`                                | クーポンが顧客に付与されたときに発生します。                                                                                                                                               |
| `customer.discount.deleted`                                | クーポンが顧客から削除されたときに発生します。                                                                                                                                             |
| `customer.discount.updated`                                | 顧客が別のクーポンに切り替えられたときに発生します。                                                                                                                                       |
| `customer.source.created`                                  | 新しいソース（例：カード）が顧客に作成されたときに発生します。                                                                                                                             |
| `customer.source.deleted`                                  | ソース（例：カード）が顧客から削除されたときに発生します。                                                                                                                                 |
| `customer.source.expiring`                                 | カードまたはソースが月末に期限切れになるときに発生します。                                                                                                                                 |
| `customer.source.updated`                                  | ソースの詳細が変更されたときに発生します。                                                                                                                                                 |
| `customer.subscription.created`                            | 顧客が新しいプランにサインアップしたときに発生します。                                                                                                                                     |
| `customer.subscription.deleted`                            | 顧客のサブスクリプションが終了したときに発生します。                                                                                                                                       |
| `customer.subscription.paused`                             | 顧客のサブスクリプションが一時停止されたときに発生します。                                                                                                                                 |
| `customer.subscription.pending_update_applied`             | 顧客のサブスクリプションの保留中の更新が適用されたときに発生します。                                                                                                                       |
| `customer.subscription.pending_update_expired`             | 顧客のサブスクリプションの保留中の更新が支払われる前に期限切れになったときに発生します。                                                                                                   |
| `customer.subscription.resumed`                            | 顧客のサブスクリプションが一時停止状態でなくなったときに発生します。                                                                                                                       |
| `customer.subscription.trial_will_end`                     | サブスクリプションの試用期間が終了する前に発生します。                                                                                                                                     |
| `customer.subscription.updated`                            | サブスクリプションが更新されたときに発生します（例：プランの変更、クーポンの適用など）。                                                                                                   |
| `customer.tax_id.created`                                  | 顧客に新しい税 ID が追加されたときに発生します。                                                                                                                                           |
| `customer.tax_id.deleted`                                  | 顧客の税 ID が削除されたときに発生します。                                                                                                                                                 |
| `customer.tax_id.updated`                                  | 顧客の税 ID が更新されたときに発生します。                                                                                                                                                 |
| `customer.updated`                                         | 顧客の詳細が更新されたときに発生します。                                                                                                                                                   |
| `file.created`                                             | ファイルが作成されたときに発生します。                                                                                                                                                     |
| `financial_connections.account.created`                    | Financial Connections アカウントが作成されたときに発生します。                                                                                                                             |
| `financial_connections.account.deactivated`                | Financial Connections アカウントが非アクティブ化されたときに発生します。                                                                                                                   |
| `financial_connections.account.disconnected`               | Financial Connections アカウントが切断されたときに発生します。                                                                                                                             |
| `financial_connections.account.reactivated`                | Financial Connections アカウントが再アクティブ化されたときに発生します。                                                                                                                   |
| `financial_connections.account.updated`                    | Financial Connections アカウントが更新されたときに発生します。                                                                                                                             |
| `financial_connections.account.owner_identity.created`     | Financial Connections アカウントの所有者 ID が作成されたときに発生します。                                                                                                                 |
| `financial_connections.account.owner_identity.updated`     | Financial Connections アカウントの所有者 ID が更新されたときに発生します。                                                                                                                 |
| `identity.verification_session.canceled`                   | 検証セッションがキャンセルされたときに発生します。                                                                                                                                         |
| `identity.verification_session.created`                    | 検証セッションが作成されたときに発生します。                                                                                                                                               |
| `identity.verification_session.processing`                 | 検証セッションが処理されているときに発生します。                                                                                                                                           |
| `identity.verification_session.redacted`                   | 検証セッションが編集されたときに発生します。                                                                                                                                               |
| `identity.verification_session.requires_input`             | 検証セッションが入力を必要としているときに発生します。                                                                                                                                     |
| `identity.verification_session.verified`                   | 検証セッションが検証されたときに発生します。                                                                                                                                               |
| `invoice.created`                                          | 新しい請求書が作成されたときに発生します。                                                                                                                                                 |
| `invoice.deleted`                                          | 請求書が削除されたときに発生します。                                                                                                                                                       |
| `invoice.finalization_failed`                              | 請求書の最終化が失敗したときに発生します。                                                                                                                                                 |
| `invoice.finalized`                                        | 請求書が最終化されたときに発生します。                                                                                                                                                     |
| `invoice.marked_uncollectible`                             | 請求書が回収不能とマークされたときに発生します。                                                                                                                                           |
| `invoice.paid`                                             | 請求書が支払われたときに発生します。                                                                                                                                                       |
| `invoice.payment_action_required`                          | 請求書の支払いにアクションが必要なときに発生します。                                                                                                                                       |
| `invoice.payment_failed`                                   | 請求書の支払いが失敗したときに発生します。                                                                                                                                                 |
| `invoice.payment_succeeded`                                | 請求書の支払いが成功したときに発生します。                                                                                                                                                 |
| `invoice.sent`                                             | 請求書が顧客に送信されたときに発生します。                                                                                                                                                 |
| `invoice.upcoming`                                         | 次回の請求書が間もなく発行されるときに発生します。                                                                                                                                         |
| `invoice.updated`                                          | 請求書が更新されたときに発生します。                                                                                                                                                       |
| `invoice.voided`                                           | 請求書が無効にされたときに発生します。                                                                                                                                                     |
| `invoiceitem.created`                                      | 請求書項目が作成されたときに発生します。                                                                                                                                                   |
| `invoiceitem.deleted`                                      | 請求書項目が削除されたときに発生します。                                                                                                                                                   |
| `invoiceitem.updated`                                      | 請求書項目が更新されたときに発生します。                                                                                                                                                   |
| `issuing_authorization.created`                            | 発行されたカードの承認が作成されたときに発生します。                                                                                                                                       |
| `issuing_authorization.request`                            | 発行されたカードの承認リクエストが行われたときに発生します。                                                                                                                               |
| `issuing_authorization.updated`                            | 発行されたカードの承認が更新されたときに発生します。                                                                                                                                       |
| `issuing_card.created`                                     | 発行されたカードが作成されたときに発生します。                                                                                                                                             |
| `issuing_card.updated`                                     | 発行されたカードが更新されたときに発生します。                                                                                                                                             |
| `issuing_cardholder.created`                               | 発行されたカードのカードホルダーが作成されたときに発生します。                                                                                                                             |
| `issuing_cardholder.updated`                               | 発行されたカードのカードホルダーが更新されたときに発生します。                                                                                                                             |
| `issuing_dispute.created`                                  | 発行されたカードの争議が作成されたときに発生します。                                                                                                                                       |
| `issuing_dispute.funds_reinstated`                         | 発行されたカードの争議が解決され、資金が復元されたときに発生します。                                                                                                                       |
| `issuing_dispute.submitted`                                | 発行されたカードの争議が提出されたときに発生します。                                                                                                                                       |
| `issuing_dispute.updated`                                  | 発行されたカードの争議が更新されたときに発生します。                                                                                                                                       |
| `issuing_transaction.created`                              | 発行されたカードの取引が作成されたときに発生します。                                                                                                                                       |
| `issuing_transaction.updated`                              | 発行されたカードの取引が更新されたときに発生します。                                                                                                                                       |
| `mandate.updated`                                          | マンダートが更新されたときに発生します。                                                                                                                                                   |
| `order.created`                                            | 新しい注文が作成されたときに発生します。                                                                                                                                                   |
| `order.payment_succeeded`                                  | 注文の支払いが成功したときに発生します。                                                                                                                                                   |
| `order.processing`                                         | 注文が処理されているときに発生します。                                                                                                                                                     |
| `order.shipping.created`                                   | 注文の配送が作成されたときに発生します。                                                                                                                                                   |
| `order.shipping.updated`                                   | 注文の配送が更新されたときに発生します。                                                                                                                                                   |
| `payment_intent.amount_capturable_updated`                 | 支払い意図のキャプチャ可能な金額が更新されたときに発生します。                                                                                                                             |
| `payment_intent.canceled`                                  | 支払い意図がキャンセルされたときに発生します。                                                                                                                                             |
| `payment_intent.created`                                   | 新しい支払い意図が作成されたときに発生します。                                                                                                                                             |
| `payment_intent.partially_funded`                          | 支払い意図が部分的に資金供給されたときに発生します。                                                                                                                                       |
| `payment_intent.payment_failed`                            | 支払い意図の支払いが失敗したときに発生します。                                                                                                                                             |
| `payment_intent.processing`                                | 支払い意図が処理中のときに発生します。                                                                                                                                                     |
| `payment_intent.requires_action`                           | 支払い意図が追加のアクションを必要とするときに発生します。                                                                                                                                 |
| `payment_intent.succeeded`                                 | 支払い意図の支払いが成功したときに発生します。                                                                                                                                             |
| `payment_link.created`                                     | 支払いリンクが作成されたときに発生します。                                                                                                                                                 |
| `payment_link.updated`                                     | 支払いリンクが更新されたときに発生します。                                                                                                                                                 |
| `payment_method.attached`                                  | 支払い方法が顧客にアタッチされたときに発生します。                                                                                                                                         |
| `payment_method.automatically_updated`                     | 支払い方法が自動的に更新されたときに発生します。                                                                                                                                           |
| `payment_method.detached`                                  | 支払い方法が顧客からデタッチされたときに発生します。                                                                                                                                       |
| `payment_method.updated`                                   | 支払い方法が更新されたときに発生します。                                                                                                                                                   |
| `payout.canceled`                                          | 出金がキャンセルされたときに発生します。                                                                                                                                                   |
| `payout.created`                                           | 新しい出金が作成されたときに発生します。                                                                                                                                                   |
| `payout.failed`                                            | 出金が失敗したときに発生します。                                                                                                                                                           |
| `payout.paid`                                              | 出金が成功したときに発生します。                                                                                                                                                           |
| `payout.updated`                                           | 出金が更新されたときに発生します。                                                                                                                                                         |
| `person.created`                                           | 連絡先が作成されたときに発生します。                                                                                                                                                       |
| `person.deleted`                                           | 連絡先が削除されたときに発生します。                                                                                                                                                       |
| `person.updated`                                           | 連絡先が更新されたときに発生します。                                                                                                                                                       |
| `plan.created`                                             | プランが作成されたときに発生します。                                                                                                                                                       |
| `plan.deleted`                                             | プランが削除されたときに発生します。                                                                                                                                                       |
| `plan.updated`                                             | プランが更新されたときに発生します。                                                                                                                                                       |
| `price.created`                                            | 価格が作成されたときに発生します。                                                                                                                                                         |
| `price.deleted`                                            | 価格が削除されたときに発生します。                                                                                                                                                         |
| `price.updated`                                            | 価格が更新されたときに発生します。                                                                                                                                                         |
| `product.created`                                          | 商品が作成されたときに発生します。                                                                                                                                                         |
| `product.deleted`                                          | 商品が削除されたときに発生します。                                                                                                                                                         |
| `product.updated`                                          | 商品が更新されたときに発生します。                                                                                                                                                         |
| `promotion_code.created`                                   | プロモーションコードが作成されたときに発生します。                                                                                                                                         |
| `promotion_code.updated`                                   | プロモーションコードが更新されたときに発生します。                                                                                                                                         |
| `quote.accepted`                                           | 見積もりが承認されたときに発生します。                                                                                                                                                     |
| `quote.canceled`                                           | 見積もりがキャンセルされたときに発生します。                                                                                                                                               |
| `quote.created`                                            | 見積もりが作成されたときに発生します。                                                                                                                                                     |
| `quote.finalized`                                          | 見積もりが最終化されたときに発生します。                                                                                                                                                   |
| `radar.early_fraud_warning.created`                        | 早期不正警告が作成されたときに発生します。                                                                                                                                                 |
| `radar.early_fraud_warning.updated`                        | 早期不正警告が更新されたときに発生します。                                                                                                                                                 |
| `recipient.created`                                        | 受取人が作成されたときに発生します。                                                                                                                                                       |
| `recipient.deleted`                                        | 受取人が削除されたときに発生します。                                                                                                                                                       |
| `recipient.updated`                                        | 受取人が更新されたときに発生します。                                                                                                                                                       |
| `reporting.report_run.failed`                              | レポートの実行が失敗したときに発生します。                                                                                                                                                 |
| `reporting.report_run.succeeded`                           | レポートの実行が成功したときに発生します。                                                                                                                                                 |
| `reporting.report_type.updated`                            | レポートタイプが更新されたときに発生します。                                                                                                                                               |
| `review.closed`                                            | レビューがクローズされたときに発生します。                                                                                                                                                 |
| `review.opened`                                            | レビューがオープンされたときに発生します。                                                                                                                                                 |
| `setup_intent.canceled`                                    | 設定意図がキャンセルされたときに発生します。                                                                                                                                               |
| `setup_intent.created`                                     | 設定意図が作成されたときに発生します。                                                                                                                                                     |
| `setup_intent.requires_action`                             | 設定意図が追加のアクションを必要とするときに発生します。                                                                                                                                   |
| `setup_intent.setup_failed`                                | 設定意図の設定が失敗したときに発生します。                                                                                                                                                 |
| `setup_intent.succeeded`                                   | 設定意図の設定が成功したときに発生します。                                                                                                                                                 |
| `sigma.scheduled_query_run.created`                        | スケジュールされたクエリランが作成されたときに発生します。                                                                                                                                 |
| `source.canceled`                                          | ソースがキャンセルされたときに発生します。                                                                                                                                                 |
| `source.chargeable`                                        | ソースがチャージ可能になったときに発生します。                                                                                                                                             |
| `source.failed`                                            | ソースが失敗したときに発生します。                                                                                                                                                         |
| `source.mandate_notification`                              | ソースのマンダート通知が行われたときに発生します。                                                                                                                                         |
| `source.refund_attributes_required`                        | ソースの返金属性が必要なときに発生します。                                                                                                                                                 |
| `source.transaction.created`                               | ソースのトランザクションが作成されたときに発生します。                                                                                                                                     |
| `source.transaction.updated`                               | ソースのトランザクションが更新されたときに発生します。                                                                                                                                     |
| `subscription_schedule.aborted`                            | サブスクリプションスケジュールが中止されたときに発生します。                                                                                                                               |
| `subscription_schedule.canceled`                           | サブスクリプションスケジュールがキャンセルされたときに発生します。                                                                                                                         |
| `subscription_schedule.completed`                          | サブスクリプションスケジュールが完了したときに発生します。                                                                                                                                 |
| `subscription_schedule.created`                            | サブスクリプションスケジュールが作成されたときに発生します。                                                                                                                               |
| `subscription_schedule.expiring`                           | サブスクリプションスケジュールが期限切れになりかけているときに発生します。                                                                                                                 |
| `subscription_schedule.released`                           | サブスクリプションスケジュールが解放されたときに発生します。                                                                                                                               |
| `subscription_schedule.updated`                            | サブスクリプションスケジュールが更新されたときに発生します。                                                                                                                               |
| `tax_rate.created`                                         | 税率が作成されたときに発生します。                                                                                                                                                         |
| `tax_rate.updated`                                         | 税率が更新されたときに発生します。                                                                                                                                                         |
| `terminal.configuration.created`                           | 端末設定が作成されたときに発生します。                                                                                                                                                     |
| `terminal.configuration.deleted`                           | 端末設定が削除されたときに発生します。                                                                                                                                                     |
| `terminal.configuration.updated`                           | 端末設定が更新されたときに発生します。                                                                                                                                                     |
| `terminal.connection_token.created`                        | 端末接続トークンが作成されたときに発生します。                                                                                                                                             |
| `terminal.location.created`                                | 端末の場所が作成されたときに発生します。                                                                                                                                                   |
| `terminal.location.deleted`                                | 端末の場所が削除されたときに発生します。                                                                                                                                                   |
| `terminal.location.updated`                                | 端末の場所が更新されたときに発生します。                                                                                                                                                   |
| `test_helpers.test_clock.advancing`                        | テスト時計が進行中のときに発生します。                                                                                                                                                     |
| `test_helpers.test_clock.created`                          | テスト時計が作成されたときに発生します。                                                                                                                                                   |
| `test_helpers.test_clock.deleted`                          | テスト時計が削除されたときに発生します。                                                                                                                                                   |
| `test_helpers.test_clock.internal_failure`                 | テスト時計が内部エラーを起こしたときに発生します。                                                                                                                                         |
| `test_helpers.test_clock.ready`                            | テスト時計が準備完了状態になったときに発生します。                                                                                                                                         |
| `topup.canceled`                                           | トップアップがキャンセルされたときに発生します。                                                                                                                                           |
| `topup.created`                                            | トップアップが作成されたときに発生します。                                                                                                                                                 |
| `topup.failed`                                             | トップアップが失敗したときに発生します。                                                                                                                                                   |
| `topup.reversed`                                           | トップアップが取り消されたときに発生します。                                                                                                                                               |
| `topup.succeeded`                                          | トップアップが成功したときに発生します。                                                                                                                                                   |
| `transfer.created`                                         | 転送が作成されたときに発生します。                                                                                                                                                         |
| `transfer.failed`                                          | 転送が失敗したときに発生します。                                                                                                                                                           |
| `transfer.paid`                                            | 転送が成功したときに発生します。                                                                                                                                                           |
| `transfer.reversed`                                        | 転送が取り消されたときに発生します。                                                                                                                                                       |
| `transfer.updated`                                         | 転送が更新されたときに発生します。                                                                                                                                                         |
| `treasury.credit_reversal.created`                         | 財務クレジットの取消が作成されたときに発生します。                                                                                                                                         |
| `treasury.credit_reversal.posted`                          | 財務クレジットの取消が投稿されたときに発生します。                                                                                                                                         |
| `treasury.debit_reversal.completed`                        | 財務デビットの取消が完了したときに発生します。                                                                                                                                             |
| `treasury.debit_reversal.created`                          | 財務デビットの取消が作成されたときに発生します。                                                                                                                                           |
| `treasury.debit_reversal.initial_credit_granted`           | 財務デビットの取消が初期クレジットを付与したときに発生します。                                                                                                                             |
| `treasury.financial_account.closed`                        | 財務口座が閉鎖されたときに発生します。                                                                                                                                                     |
| `treasury.financial_account.created`                       | 財務口座が作成されたときに発生します。                                                                                                                                                     |
| `treasury.financial_account.features_status_updated`       | 財務口座の機能ステータスが更新されたときに発生します。                                                                                                                                     |
| `treasury.inbound_transfer.canceled`                       | 財務インバウンド転送がキャンセルされたときに発生します。                                                                                                                                   |
| `treasury.inbound_transfer.created`                        | 財務インバウンド転送が作成されたときに発生します。                                                                                                                                         |
| `treasury.inbound_transfer.failed`                         | 財務インバウンド転送が失敗したときに発生します。                                                                                                                                           |
| `treasury.inbound_transfer.succeeded`                      | 財務インバウンド転送が成功したときに発生します。                                                                                                                                           |
| `treasury.outbound_payment.canceled`                       | 財務アウトバウンド支払いがキャンセルされたときに発生します。                                                                                                                               |
| `treasury.outbound_payment.created`                        | 財務アウトバウンド支払いが作成されたときに発生します。                                                                                                                                     |
| `treasury.outbound_payment.expected_arrival_date_updated`  | 財務アウトバウンド支払いの予想到着日が更新されたときに発生します。                                                                                                                         |
| `treasury.outbound_payment.failed`                         | 財務アウトバウンド支払いが失敗したときに発生します。                                                                                                                                       |
| `treasury.outbound_payment.posted`                         | 財務アウトバウンド支払いが投稿されたときに発生します。                                                                                                                                     |
| `treasury.outbound_payment.returned`                       | 財務アウトバウンド支払いが返金されたときに発生します。                                                                                                                                     |
| `treasury.outbound_transfer.canceled`                      | 財務アウトバウンド転送がキャンセルされたときに発生します。                                                                                                                                 |
| `treasury.outbound_transfer.created`                       | 財務アウトバウンド転送が作成されたときに発生します。                                                                                                                                       |
| `treasury.outbound_transfer.expected_arrival_date_updated` | 財務アウトバウンド転送の予想到着日が更新されたときに発生します。                                                                                                                           |
| `treasury.outbound_transfer.failed`                        | 財務アウトバウンド転送が失敗したときに発生します。                                                                                                                                         |
| `treasury.outbound_transfer.posted`                        | 財務アウトバウンド転送が投稿されたときに発生します。                                                                                                                                       |
| `treasury.outbound_transfer.returned`                      | 財務アウトバウンド転送が返金されたときに発生します。                                                                                                                                       |
| `treasury.received_credit.created`                         | 受領したクレジットが作成されたときに発生します。                                                                                                                                           |
| `treasury.received_credit.failed`                          | 受領したクレジットが失敗したときに発生します。                                                                                                                                             |
| `treasury.received_credit.succeeded`                       | 受領したクレジットが成功したときに発生します。                                                                                                                                             |
| `treasury.received_debit.created`                          | 受領したデビットが作成されたときに発生します。                                                                                                                                             |
