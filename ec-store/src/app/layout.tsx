import type { Metadata } from "next";
import { Urbanist } from "next/font/google";
import "./globals.css";
import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import ModalProvider from "@/providers/modal-provider";
import ToastProvider from "@/providers/toast-provider";

const inter = Urbanist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ストア",
  description: "ここでいろんな商品を注文できます",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <Navbar />
        {children}
        <Footer />
        <ModalProvider />
        <ToastProvider />
      </body>
    </html>
  );
}
