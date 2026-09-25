import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SignBridge AI Admin — Telemetry & Log Analytics",
  description:
    "Administrator control center for reviewing application execution logs, camera error diagnostics, model fallback events, and real-time client performance.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#060913] text-slate-100 antialiased selection:bg-rose-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
