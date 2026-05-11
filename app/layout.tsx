import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI Spend Audit | Prune",
  description: "Identify overspend in your team's AI tool stack instantly.",
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.className} bg-background text-foreground min-h-screen antialiased flex flex-col`}
      >
        <main className="flex-1 flex flex-col relative">{children}</main>
      </body>
    </html>
  );
}
