"use client"
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SessionProvider } from 'next-auth/react';
import JotaiProvider from "@/components/jotai-provider";
import { Toaster } from "sonner";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const metadata: Metadata = {
  title: "Voice Note App",
  description: "let' taking note with your voice",
  icons: {
    icon: '/mic.svg', // Path to your favicon in the public directory
    // You can also define multiple icons for different purposes, e.g.,
    // apple: '/apple-touch-icon.png',
    // shortcut: '/shortcut-icon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <link rel="icon" href="/mic.svg" sizes="any" />
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Toaster richColors position="bottom-right" />
        <JotaiProvider>
          <SessionProvider baseUrl="/">
            {children}
          </SessionProvider>
        </JotaiProvider>
      </body>
    </html>
  );
}
