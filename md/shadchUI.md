# shadcn/ui

Radix UI と Tailwind CSS を使って書かれた UI コンポーネント
TailwindCSS でスタイルをカスタマイズできる

[TailwindCSS](https://tailwindcss.com/)
[shadcn/ui 環境構築](https://ui.shadcn.com/docs/installation/next)

## 環境構築

next.js と合わせてインストールしていきます。

### インストール

```

npx create-next-app@latest my-app --typescript --tailwind --eslint

```

### shadcn-ui をセットアップ

`cd my-app`してそこでセットアップしていきます。

```

npx shadcn-ui@latest init

```

設定する為にくつかの質問が表示されます。

```

Which style would you like to use? › Default
Which color would you like to use as base color? › Slate
Do you want to use CSS variables for colors? › no / yes

```

設定が終わると追加されるファイルが`components/ui`,`lib/utils.ts`,`components.json`が作られます。

### shadcn-ui コンポーネントの追加

```

npx shadcn-ui@latest add button

```

自動で`components/ui`から`button.tsx`が追加されます。

中身は...

```ruby:button.tsx

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }

```

button.ts を使う場合

```ruby:page.tsx

import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="p-4">
      <Button size="sm" variant="link">
        クリック
      </Button>
    </div>
  );
}

```

使ってみて、簡単に導入できるしスタイルのカスタマイズが簡単だからめちゃオススメ、TailwindCSS での書き方を覚えないといけないけど,css や sass の書き方が分かれば直ぐにできる。

## Command コンポーネント使用時の Class エラー

Command コンポーネントの`CommandItem`使用時、このコンポーネントが機能しない事がありましたプロパティにイベントを追加しても機能せず色もグレーのまま、調べると`ClassName`の方に問題がありました。

```ruby

const CommandItem = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled='true']:pointer-events-none data-[disabled='true']:opacity-50",
      className

    )}
    {...props}
  />
));

```

`data-[disabled]`を`data-[disabled='true']`に修正しました。

`shadcn/ui`では Command コンポーネントに`cmdk`が採用されています。これは cmdk に v0.2.0 から v1.0.0 への重大な変更があり,
その変更内容が`data-disabled: undefined | trueとdata-disabled: true | false`
が追加され`data-[disabled='true']`という書き方に変わりましたが、`shadcn/ui`ではこれの変更が採用されてなく前のバージョンのクラスのままだったみたいです。(この問題の修正を何人も依頼したみたいですがまだ修正されていません。2024/5/1)

[Command Class エラー参考](https://github.com/shadcn-ui/ui/discussions/2976)
