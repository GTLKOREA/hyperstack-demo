import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HyperStack KSVF Demo",
  description: "IR-ready interactive demo for HyperStack",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
