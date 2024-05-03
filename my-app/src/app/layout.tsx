import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { ModalProvider } from "@/providers/modal-provider";
import { ToasterProvider } from "@/providers/toast-provider";

import { jaJP } from "@clerk/localizations";

import { cn } from "@/lib/utils";
import "./globals.css";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "管理画面",
  description: "管理者専用画面です",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider localization={jaJP}>
      <html lang="ja">
        <body
          className={cn(
            "min-h-screen bg-background font-sans antialiased",
            fontSans.variable
          )}
        >
          {children}
          <ToasterProvider />
          <ModalProvider />
        </body>
      </html>
    </ClerkProvider>
  );
}
