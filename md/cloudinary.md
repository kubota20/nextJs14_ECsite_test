# Cloudinary

Cloudinary とは画像や動画、他あらゆるアセットを保管・一元管理でき、変換や最適化を即座に行え、CDN で高速配信できるサービスです。

[Cloudinary](https://cloudinary.com/)

## 環境構築

next も一緒にやっていくのでパッケージをインストールしていきます

[インストール](https://next.cloudinary.dev/installation)

```

npm install next-cloudinary

```

次に Cloudinary にある API をコピーし`.env`に貼り付けます

```
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="<Your Cloud Name>"
NEXT_PUBLIC_CLOUDINARY_API_KEY="<Your API Key>"
CLOUDINARY_API_SECRET="<Your API Secret>"

NEXT_PUBLIC_CLOUDINARY_SECURE_DISTRIBUTION="<Your Secure Distribution / CNAME>"
NEXT_PUBLIC_CLOUDINARY_PRIVATE_CDN="<true|false>"

```

[参考](https://next.cloudinary.dev/nextjs-14)
