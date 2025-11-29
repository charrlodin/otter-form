import type { Metadata } from "next";
import { Syne, Outfit } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import ConvexClientProvider from "@/components/ConvexClientProvider";
import { ClerkProvider } from "@clerk/nextjs";

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "OtterForm - AI Form Builder",
  description: "Build beautiful forms in seconds with AI. Powered by OtterForm.",
  icons: {
    icon: "/otter-logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${syne.variable} ${outfit.variable} antialiased`}
      >
        <Script
          defer
          src="https://umami-three-wheat-87.vercel.app/script.js"
          data-website-id="060b11f4-8f8a-4750-9fc1-6df744f1d672"
          strategy="afterInteractive"
        />
        <ClerkProvider dynamic>
          <ConvexClientProvider>{children}</ConvexClientProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
