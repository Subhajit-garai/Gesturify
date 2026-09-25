import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SignBridge AI Documentation — Architecture, Flows & API Reference",
  description:
    "Comprehensive technical documentation covering execution flows, modules, files, and function APIs across the SignBridge real-time sign language interpreter.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#060913] text-slate-100 antialiased selection:bg-cyan-500 selection:text-slate-900">
        {children}
      </body>
    </html>
  );
}
