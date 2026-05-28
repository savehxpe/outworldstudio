import type { Metadata } from "next"
import { Geist, Geist_Mono, Inter, JetBrains_Mono } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/sonner"

const geistSans = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
})

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
})

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "OUTWORLD | Isolate the Infinite",
  description: "High-fidelity spatial audio manipulation powered by neural networks. Extract stems, remove artifacts, and rebuild cinematic soundscapes.",
  openGraph: {
    title: "OUTWORLD | Isolate the Infinite",
    description: "AI-powered audio processing platform for stem separation, vocal removal, and remix generation.",
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: "Outworld Studio",
    images: [{ url: "/og.png", width: 1200, height: 630 }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "OUTWORLD | Isolate the Infinite",
    description: "AI-powered audio processing platform for stem separation, vocal removal, and remix generation.",
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  keywords: ["audio processing", "stem separation", "vocal removal", "AI music", "remix studio"],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${geistSans.variable} ${inter.variable} ${jetbrainsMono.variable} min-h-dvh bg-background text-on-background antialiased`}>
        <div className="noise-overlay" />
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "rgba(18, 18, 18, 0.9)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              backdropFilter: "blur(20px)",
              color: "#e5e2e1",
            },
          }}
        />
      </body>
    </html>
  )
}
