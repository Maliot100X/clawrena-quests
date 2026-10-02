"use client";
import dynamic from "next/dynamic";
import { Loader2, Lock, Sparkles, Trophy, Zap, ExternalLink, Copy, Check } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const ClawScene = dynamic(() => import("@/components/3d/ClawScene").then(m => ({ default: m.ClawScene })), { ssr: false, loading: () => <div className="h-[280px] flex items-center justify-center"><Loader2 className="size-6 text-[#22c7b8] animate-spin" /></div> });
const CA = "7pkqvfHe6WREhvZ1ergfXtz3F6MQfXCfcAZiumCt6Ene";

export default function NFTPage() {
  const [copied, setCopied] = useState(false);
  const copy = async () => { await navigator.clipboard.writeText(CA); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  return (
    <div className="mx-auto max-w-2xl px-5 sm:px-8 py-8 space-y-5">
      <div>
        <p className="text-[11px] font-bold uppercase tracking-widest text-[#22c7b8]">NFT</p>
        <h1 className="mt-1 text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-2"><Sparkles className="size-6 text-[#22c7b8]" /> CLAWRENA Allowlist</h1>
        <p className="mt-1 text-sm text-[#8b909a]">Complete tasks and climb the rankings to earn your spot.</p>
      </div>
      <div className="rounded-3xl border border-[#22c7b8]/20 bg-[#0d0f13] glow overflow-hidden">
        <ClawScene />
        <div className="px-6 py-5 border-t border-white/5 space-y-2">
          <div className="flex items-center justify-between"><p className="font-bold text-[#eef0f3]">CLAWRENA Genesis Collection</p><span className="text-xs font-bold text-[#22c7b8] bg-[#22c7b8]/10 px-2 py-1 rounded-full border border-[#22c7b8]/20">Coming Soon</span></div>
          <p className="text-sm text-[#8b909a]">Exclusive NFT collection for the CLAWRENA arena. Every top scorer gets a guaranteed allowlist spot before public mint.</p>
        </div>
      </div>

      {/* $CLAWRENA Token — cool spot */}
      <div className="relative rounded-3xl border border-[#22c7b8]/25 bg-[#0d0f13] overflow-hidden glow">
        <div className="absolute inset-0 shimmer pointer-events-none" />
        <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-[#22c7b8]/[0.07] to-transparent pointer-events-none" />
        <div className="relative px-6 py-6 space-y-4">
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`https://images.pump.fun/coin-image/${CA}?variant=64x64&ipfs=bafkreihvfkdziia44j4bwav24bt2ii7d5cp5gis4fkeejghtw3oyi2b66m`} alt="$CLAWRENA" className="size-12 rounded-full border-2 border-[#22c7b8]/40" />
            <div>
              <div className="flex items-center gap-2"><p className="font-bold text-lg text-[#eef0f3]">$CLAWRENA</p><span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#22c7b8]/10 text-[#22c7b8] border border-[#22c7b8]/20">Solana</span></div>
              <p className="text-xs text-[#8b909a]">Official CLAWRENA arena token · pump.fun</p>
            </div>
          </div>
          <div className="space-y-1.5">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-[#8b909a]">Contract Address</p>
            <div className="flex items-center gap-2">
              <div className="flex-1 min-w-0 px-3 py-2 rounded-xl bg-[#07080b] border border-white/7 text-xs font-mono text-[#8b909a] truncate">{CA}</div>
              <button onClick={copy} className={cn("shrink-0 size-9 rounded-xl flex items-center justify-center border transition-all", copied ? "bg-[#2bd58c]/10 border-[#2bd58c]/20 text-[#2bd58c]" : "bg-[#22c7b8]/10 border-[#22c7b8]/20 text-[#22c7b8] hover:bg-[#22c7b8]/20")}>
                {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
              </button>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <a href={`https://pump.fun/coin/${CA}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 h-8 px-4 rounded-full bg-[#22c7b8]/10 text-[#22c7b8] border border-[#22c7b8]/20 text-xs font-bold hover:bg-[#22c7b8]/20 transition-all">Buy on pump.fun <ExternalLink className="size-3" /></a>
            <a href={`https://solscan.io/account/${CA}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 h-8 px-4 rounded-full bg-white/5 border border-white/7 text-xs font-semibold text-[#8b909a] hover:text-[#eef0f3] hover:border-white/15 transition-all">Solscan <ExternalLink className="size-3" /></a>
            <a href="https://x.com/CLAWRENAi" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 h-8 px-4 rounded-full bg-white/5 border border-white/7 text-xs font-semibold text-[#8b909a] hover:text-[#eef0f3] hover:border-white/15 transition-all">@CLAWRENAi</a>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-white/7 bg-[#0d0f13] p-5 space-y-3">
        <p className="font-semibold text-sm text-[#eef0f3]">How to get on the allowlist</p>
        {[{ icon: Zap, t: "Complete all 5 tasks", d: "Each task earns +10 pt", c: "text-violet-400" }, { icon: Trophy, t: "Check in daily", d: "+10 pt per day", c: "text-yellow-400" }, { icon: Lock, t: "Invite friends", d: "+20 pt per referral", c: "text-[#22c7b8]" }].map(({ icon: Icon, t, d, c }) => (
          <div key={t} className="flex items-center gap-3 p-3 rounded-xl bg-white/3 border border-white/5">
            <Icon className={cn("size-5 shrink-0", c)} /><div><p className="text-sm font-semibold text-[#eef0f3]">{t}</p><p className="text-xs text-[#8b909a]">{d}</p></div>
          </div>
        ))}
      </div>
    </div>
  );
}
