import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { Navbar } from "@/components/Navbar";

export const metadata: Metadata = {
  title: "CLAWRENA Quests — Earn points on X",
  description: "Sign in with X, finish real tasks for @CLAWRENAi, and climb the allowlist rankings.",
  metadataBase: new URL("https://clawrena-quests.vercel.app"),
  icons: { icon: "/brand/mark.jpg" },
  openGraph: {
    title: "CLAWRENA Quests",
    description: "Earn points on X. Top scores take the NFT allowlist.",
    images: ["/nft/hero.jpg"],
  },
  twitter: { card: "summary_large_image", creator: "@CLAWRENAi", images: ["/nft/hero.jpg"] },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable} h-full`}>
      <body className="flex min-h-full flex-col bg-[#07080b] text-[#eef0f3]">
        <Providers>
          <Navbar />
          <main className="flex-1">{children}</main>
          <footer className="border-t border-white/5 py-6 mt-12">
            <div className="mx-auto max-w-2xl px-5 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#8b909a]">
              <span>CLAWRENA · <a className="text-primary" href="https://x.com/CLAWRENAi">@CLAWRENAi</a></span>
              <span>3D models by <a className="text-primary" href="https://three.ws">three.ws</a></span>
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
