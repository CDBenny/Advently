import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin", "latin-ext"],
  axes: ["opsz"],
});

export const metadata: Metadata = {
  title: "Advently",
  description: "24 de ușițe, 24 de surprize pentru cineva drag. Creezi calendarul, trimiți un link.",
};

export const viewport: Viewport = {
  themeColor: "#2a0a12",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ro">
      <body className={`${inter.variable} ${fraunces.variable} antialiased`}>{children}</body>
    </html>
  );
}
