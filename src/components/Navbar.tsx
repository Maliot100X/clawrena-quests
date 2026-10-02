"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import { XIcon } from "./XIcon";
import Image from "next/image";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const nav = [
  { href: "/", label: "Tasks" },
  { href: "/rankings", label: "Rankings" },
  { href: "/nft", label: "NFT" },
  { href: "/profile", label: "Profile" },
];

export function Navbar() {
  const path = usePathname();
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-[#07080b]/80 backdrop-blur-xl">
      <div className="mx-auto max-w-2xl px-5 sm:px-8">
        <div className="flex h-14 items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="size-8 rounded-full overflow-hidden border border-[#22c7b8]/40 group-hover:border-[#22c7b8] transition-colors">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://pbs.twimg.com/profile_images/2086968515685154816/P5yIReTL.jpg" alt="CLAWRENA" width={32} height={32} className="object-cover w-full h-full" />
            </div>
            <span className="font-bold tracking-tight text-base">
              <span className="text-[#eef0f3]">CLAW</span><span className="text-[#22c7b8]">RENA</span>
            </span>
          </Link>
          <nav className="hidden sm:flex items-center gap-0.5">
            {nav.map(({ href, label }) => (
              <Link key={href} href={href} className={cn("px-3 py-1.5 rounded-lg text-sm font-medium transition-all", path === href ? "text-[#22c7b8] bg-[#22c7b8]/10" : "text-[#8b909a] hover:text-[#eef0f3] hover:bg-white/5")}>
                {label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            {session?.user ? (
              <>
                <Link href="/profile" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                  {session.user.image && <Image src={session.user.image} alt="" width={28} height={28} className="rounded-full border border-white/10" unoptimized />}
                  <span className="text-sm text-[#8b909a] hidden sm:inline">@{session.user.username ?? session.user.name}</span>
                </Link>
                <button onClick={() => signOut({ callbackUrl: "/" })} className="text-xs text-[#8b909a] hover:text-[#eef0f3] px-2 py-1 rounded-lg transition-colors hidden sm:block">Sign out</button>
              </>
            ) : (
              <Link href="/api/auth/signin" className="flex items-center gap-1.5 h-8 px-4 rounded-full bg-[#22c7b8] text-[#021a18] text-sm font-bold hover:brightness-110 transition-all glow-sm">
                <XIcon className="size-3.5" /> Sign in
              </Link>
            )}
            <button className="sm:hidden p-1.5 text-[#8b909a]" onClick={() => setOpen(v => !v)}>
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>
        {open && (
          <nav className="sm:hidden pb-3 pt-2 border-t border-white/5 grid grid-cols-2 gap-1">
            {nav.map(({ href, label }) => (
              <Link key={href} href={href} onClick={() => setOpen(false)} className={cn("px-3 py-2.5 rounded-xl text-sm font-medium transition-all", path === href ? "text-[#22c7b8] bg-[#22c7b8]/10" : "text-[#8b909a] hover:text-[#eef0f3] hover:bg-white/5")}>
                {label}
              </Link>
            ))}
            {session?.user && <button onClick={() => { signOut({ callbackUrl: "/" }); setOpen(false); }} className="col-span-2 text-sm text-[#8b909a] hover:text-[#eef0f3] px-3 py-2 rounded-xl hover:bg-white/5 transition-colors text-left">Sign out</button>}
          </nav>
        )}
      </div>
    </header>
  );
}
