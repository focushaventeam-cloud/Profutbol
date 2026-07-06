import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/layout/ToastProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Profutbol — Marcador de Fútbol en Tiempo Real",
  description: "Sigue todos los partidos de La Liga EA Sports con estadísticas detalladas, alineaciones, goleadores y mucho más.",
  keywords: ["Profutbol", "fútbol", "marcador", "La Liga", "scoreboard", "futbol en vivo"],
  authors: [{ name: "Profutbol" }],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#0a0e1a] text-white`}
      >
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}