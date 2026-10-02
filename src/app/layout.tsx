import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { Navbar } from "@/components/Navbar";

export const metadata: Metadata = {
  title: "CLAWRENA Quests — Earn Points on X",
  description: "Follow, like, repost and reply to earn points. Top scorers get the NFT allowlist.",
  metadataBase: new URL(process.env.NEXTAUTH_URL ?? "https://clawrena-quests.vercel.app"),
  openGraph: { title: "CLAWRENA Quests", description: "Earn points on X. Top scorers get the NFT allowlist.", images: ["https://pbs.twimg.com/profile_images/2086968515685154816/P5yIReTL.jpg"] },
  twitter: { card: "summary_large_image", creator: "@CLAWRENAi" },
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
              <span>© 2026 CLAWRENA · @CLAWRENAi</span>
              <span>Real tasks on X · Top scorers get NFT allowlist</span>
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
