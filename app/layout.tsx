import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LayoutClientShell } from "@/components/layout-client-shell";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "QOS ET Quality Report",
  description: "Quality management dashboard for manufacturing plants",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <LayoutClientShell>{children}</LayoutClientShell>
      </body>
    </html>
  );
}

