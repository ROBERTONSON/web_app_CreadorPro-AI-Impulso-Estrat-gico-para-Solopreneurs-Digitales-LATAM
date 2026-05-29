import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: "CreadorPro AI — Impulso Estratégico para Solopreneurs LATAM",
  description: "Genera tu plan estratégico personalizado con IA. Para freelancers, creadores y micro-agencias de LATAM.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={cn("dark font-sans", inter.variable)}>
      <body className="antialiased bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
