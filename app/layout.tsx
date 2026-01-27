import type { Metadata } from "next";
import localFont from "next/font/local";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const caooli = localFont({
  src: "./fonts/caooli.otf",
  variable: "--font-caooli",
  display: "swap",
});

const orlientPro = localFont({
  src: "./fonts/orlientprobold.otf",
  variable: "--font-heading",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Thalita Bueno | Wardrobe Stylist & Marketing Professional",
  description: "Portfolio of Thalita Bueno, specializing in fashion styling, creative direction, and marketing.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${caooli.variable} ${orlientPro.variable} antialiased`}
      >
        {children}
        <Script src="https://identity.netlify.com/v1/netlify-identity-widget.js" strategy="lazyOnload" />
      </body>
    </html >
  );
}
