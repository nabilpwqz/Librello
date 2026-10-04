import React from "react";
import "./globals.css";
import Providers from "@/providers/theme-provider";
import { ToastContainer } from "react-toastify";
import SmoothScroll from "@/components/modules/shared/SmoothScroll";
import BiblioBot from "@/components/modules/ai/BiblioBot";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Librello: Discover. Read. Share.",
  description:
    "An editorial digital sanctuary and curated book circulation platform. Where every book finds its place and stories connect.",
  keywords: [
    "Librello",
    "Curated Library",
    "Book Exchange",
    "Rare Editions",
    "Literary Collective",
    "Publishing Platform",
  ],
  authors: [{ name: "Librello Editorial Collective" }],
  icons: {
    icon: "/images/fav.png",
  },
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className="antialiased h-full scroll-smooth"
    >
      <body
        className="min-h-full flex flex-col antialiased"
        style={{
          scrollBehavior: "smooth",
          overflowX: "hidden",
          width: "100%",
          margin: 0,
          padding: 0,
        }}
      >
        <Providers>
          <SmoothScroll>
            <main className="min-h-screen transition-colors duration-300">
              {children}
            </main>
          </SmoothScroll>
          <BiblioBot />
        </Providers>
        <ToastContainer />
      </body>
    </html>
  );
}