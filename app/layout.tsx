import type { Metadata } from "next";
import { Inter } from "next/font/google";
import ClientHeader from "@/components/ClientHeader";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "AI Creator — Genera imagenes y videos con IA",
  description: "Genera imagenes y videos increibles con inteligencia artificial. El estudio creativo de tu comunidad.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className="dark">
      <body className={`${inter.variable} font-sans antialiased min-h-screen`}>
        <ClientHeader />
        {children}
      </body>
    </html>
  );
}
