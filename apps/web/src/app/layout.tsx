import type { Metadata, Viewport } from "next";
import { SmoothScrollProvider } from "@/components/SmoothScrollProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Gesturify AI - Real-Time Indian Sign Language (ISL) Interpreter",
  description:
    "Web-based real-time Indian Sign Language (ISL) interpreter converting rear-camera hand and body gestures into text and spoken voice with 100% on-device privacy.",
  keywords: [
    "Indian Sign Language",
    "ISL",
    "Sign Language Interpreter",
    "MediaPipe",
    "Real-Time",
    "Accessibility",
    "Assistive Technology",
  ],
  authors: [{ name: "Gesturify AI Team" }],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#060913",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#060913] text-slate-100 antialiased selection:bg-cyan-500 selection:text-surface-darker">
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
      </body>
    </html>
  );
}
