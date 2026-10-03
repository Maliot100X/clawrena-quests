"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signIn, signOut, useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import { XIcon } from "./XIcon";
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
            <div className="size-8 overflow-hidden rounded-full border border-primary/40 transition group-hover:border-primary">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/brand/mark.jpg" alt="CLAWRENA" width={32} height={32} className="size-full object-cover" />
            </div>
            <span className="text-base font-bold tracking-tight">
              <span>CLAW</span><span className="text-primary">RENA</span>
            </span>
          </Link>
          <nav className="hidden sm:flex items-center gap-0.5">
            {nav.map(({ href, label }) => (
              <Link key={href} href={href} className={cn("rounded-lg px-3 py-1.5 text-sm font-medium transition", path === href ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-white/5 hover:text-foreground")}>
                {label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            {session?.user ? (
              <>
                <Link href="/profile" className="flex items-center gap-2 hover:opacity-80">
                  {session.user.image && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={session.user.image} alt="" width={28} height={28} className="size-7 rounded-full border border-border object-cover" />
                  )}
                  <span className="hidden text-sm text-muted-foreground sm:inline">@{session.user.username ?? session.user.name}</span>
                </Link>
                <button type="button" onClick={() => signOut({ callbackUrl: "/" })} className="hidden rounded-lg px-2 py-1 text-xs text-muted-foreground hover:text-foreground sm:block">Sign out</button>
              </>
            ) : (
              <button type="button" onClick={() => signIn("twitter", { callbackUrl: path || "/" })} className="flex h-8 items-center gap-1.5 rounded-full bg-primary px-4 text-sm font-bold text-primary-foreground hover:brightness-110">
                <XIcon className="size-3.5" /> Sign in
              </button>
            )}
            <button className="sm:hidden p-1.5 text-[#8b909a]" onClick={() => setOpen(v => !v)}>
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>
        {open && (
          <nav className="sm:hidden pb-3 pt-2 border-t border-white/5 grid grid-cols-2 gap-1">
            {nav.map(({ href, label }) => (
              <Link key={href} href={href} onClick={() => setOpen(false)} className={cn("rounded-xl px-3 py-2.5 text-sm font-medium", path === href ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-white/5 hover:text-foreground")}>
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
