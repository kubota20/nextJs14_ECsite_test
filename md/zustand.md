# zustand で軽量なグローバル状態管理ライブラリを使う

react や next.js では状態管理ライブラリでは useContext を使う事がありますが、状態が少ないうちは大丈夫ですが、それが大きくなると Provider タワーができて Provider 同士の依存関係を管理するコストが高まったり、コード量が多かったりなど、規模が大きくなると気になる点がいくつかあると思います。

これ等を解決するのが`zustand`です

## zustand の基本的な使い方

`src/hooks`フォルダを作成し任意のファイルを作ってコードを書いていきます。

```ruby:store.tsx

import { create } from 'zustand';

type State = {
  bears: number;
  increaseBear: (by: number) => void;
};

export const useStore = create<State>((set) => ({
  bears: 0,
  increaseBear: (by) => set((state) => ({ bears: state.bears + by })),
}));

```

これを component で使うと

```ruby:component
import { useStore } from '@/store/zustand';

export const Zustand = () => {
  const bears = useStore((state) => state.bears);
  const increaseBear = useStore((state) => state.increaseBear);

  return (
    <div>
      <div>🐻: {bears}</div>
      <button onClick={() => increaseBear(1)}>+ 1</button>
    </div>
  );
};

```

### クライアント側とサーバー側での使い分け

上記のコードではサーバー側では使えますが、クライアント側`"use client"`が書いてある場所ではエラーでます。

## middleware

zustand はライブラリが用意している middleware を使用することが出来ます

[参考](https://zenn.dev/stmn_inc/articles/f1101cfa20dedc)
