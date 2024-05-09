"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const pathName = usePathname();
  const params = useParams();

  const routes = [
    {
      href: `/${params.storeId}`,
      label: "概要",
      active: pathName === `/${params.storeId}`,
    },
    {
      href: `/${params.storeId}/billboards`,
      label: "画像",
      active: pathName === `/${params.storeId}/billboards`,
    },
    {
      href: `/${params.storeId}/caregories`,
      label: "カテゴリ",
      active: pathName === `/${params.storeId}/caregories`,
    },
    {
      href: `/${params.storeId}/settings`,
      label: "設定",
      active: pathName === `/${params.storeId}/setting`,
    },
  ];

  return (
    <nav className={cn("flex item-center space-x-4 lg:space-x-6", className)}>
      {routes.map((route) => (
        <Link
          key={route.href}
          href={route.href}
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            route.active
              ? "text-black derk:text-white"
              : "text-muted-foreground"
          )}
        >
          {route.label}
        </Link>
      ))}
    </nav>
  );
}
