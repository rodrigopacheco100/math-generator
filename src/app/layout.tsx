import type { Metadata } from "next";
import { Geist, Geist_Mono, Roboto } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "@/components/SessionProvider";
import { auth } from "@/lib/auth/auth";
import { cn } from "@/lib/utils";
import { TRPCReactProvider } from "@/trpc/client";

const roboto = Roboto({ subsets: ["latin"], variable: "--font-sans" });

const _geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const _geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Gerador de contas matemáticas",
  description: "Gerador de contas matemáticas",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html
      lang="pt-BR"
      className={cn("h-full antialiased", "font-sans", roboto.variable)}
    >
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
        />
        <meta name="theme-color" content="#3b82f6" />
      </head>
      <body className="min-h-full flex flex-col">
        <TRPCReactProvider>
          <SessionProvider session={session}>{children}</SessionProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
