# Prisma

## 環境構築

### インストール

```

npm i -D prisma

npm i @prisma/client

```

### Prisma CLI

Prisma CLI で Prisma プロジェクトを作成し、管理します。

```

npx prisma init

```

prisma ディレクトリが作成され、`prisma/schema.prisma`という名前のファイルが作成されます

## Prisma クライアント

データベースへのアクセスの管理をしやすくする為,'lib/prismadb.ts'を作成。

```

import { PrismaClient } from "@prisma/client";

<!-- Prisma Clientのインスタンスを格納 -->
declare global {
  var prisma: PrismaClient | undefined;
}

const prismadb = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalThis.prisma = prismadb;

export default prismadb;

```

### PlanetScale で MySQL を簡単に...

自分の PC に MySQL のデータベース管理をするのもいいですが、それだとセキュリティやなん等かの理由で中身が消えたり(使ってみて何回かありました)、と色々問題点があります。なので PlanetScale で MySQL のデータベース管理したいと思います。

メリットとしては管理しやすいのとバックアップも簡単にできるなど色々...

｀※2024 年 4 月 8 日 PlanetScale の無料プランがなくなりました｀その為 PlanetScale 使わず `普通に MySQL を使います`

[ドキュメント](https://planetscale.com/docs/concepts/what-is-planetscale)

### PlanetScale の代わりに 普通に MySQL を使います

MySQL の環境構築のやり方はネットで調べてください

環境構築が終わったら、

1, ユーザー作成

`'user' 'localhost'`と`'password'`は自分で決められます

```

mysql> CREATE USER 'user'@'localhost' IDENTIFIED BY 'password';

```

2, 権限を与える

権限を与えないとデータベースの作成ができません。

```

mysql> GRANT ALL PRIVILEGES ON * . * TO 'user'@'localhost';

```

3, 反映する

これをしないとユーザーのログインができません

```

mysql> FLUSH PRIVILEGES;

```

4, データベースを作成

```

mysql> CREATE DATABASE データベース名;

```

### .env で mysql の情報を入力

```

DATABASE_URL="mysql://user:password@localhost:5432/mydb"

```

`user`はユーザー名、`password`はユーザー作成時のパスワード`localhost`はホスト名、`mydb`はデータベース名になります。

詳しい内容は[prisma MySQL](https://www.prisma.io/docs/orm/overview/databases/mysql)で確認してください。

### schema.prisma

初期設定は postgresql を...

```

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

```

mysql に変更

```

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

```
