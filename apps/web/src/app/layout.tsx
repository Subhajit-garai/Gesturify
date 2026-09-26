import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import { SmoothScrollProvider } from "@/components/SmoothScrollProvider";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Gesturify — Minimalist Sign Language & Muted Communication Platform",
  description:
    "A minimalist, accessible platform designed for muted individuals and sign language learners. Real-time gesture translation, practice drills, and OpenCV landmark tracking.",
  keywords: [
    "Sign Language",
    "Indian Sign Language",
    "ISL",
    "Accessibility",
    "Assistive Technology",
    "MediaPipe",
    "OpenCV",
    "Gesture Recognition",
  ],
  authors: [{ name: "Gesturify Core Team" }],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#9c89b8",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`min-h-screen flex flex-col antialiased selection:bg-zinc-900 selection:text-white font-sans ${plusJakarta.variable} ${jetbrainsMono.variable}`}
      >
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
      </body>
    </html>
  );
}