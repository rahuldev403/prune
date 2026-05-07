import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI Spend Audit | Credex",
  description: "Identify overspend in your team's AI tool stack instantly.",
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
        <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-14 max-w-screen-2xl items-center px-4 md:px-8">
            <span className="font-bold tracking-tight text-primary">
              Credex{" "}
              <span className="text-muted-foreground font-normal">Audit</span>
            </span>
          </div>
        </header>

        <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-8">
          {children}
        </main>
      </body>
    </html>
  );
}
