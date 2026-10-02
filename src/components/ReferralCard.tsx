"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Copy, Check, Users } from "lucide-react";

export function ReferralCard({ referralCode }: { referralCode: string }) {
  const [copied, setCopied] = useState(false);
  const url = typeof window !== "undefined" ? `${window.location.origin}/?ref=${referralCode}` : `https://clawrena-quests.vercel.app/?ref=${referralCode}`;
  const copy = async () => { await navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  return (
    <div className="rounded-2xl border border-white/7 bg-[#0d0f13] p-5 space-y-3">
      <div className="flex items-center gap-3">
        <Users className="size-4 text-[#22c7b8]" />
        <div>
          <p className="text-sm font-semibold text-[#eef0f3]">Invite friends <span className="text-[#22c7b8]">+20 pt</span></p>
          <p className="text-xs text-[#8b909a]">Earn 20 pt when a friend you invite completes their first task.</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex-1 min-w-0 px-3 py-2 rounded-xl bg-[#07080b] border border-white/7 text-xs text-[#8b909a] font-mono truncate">{url}</div>
        <button onClick={copy} className={cn("shrink-0 size-9 rounded-xl flex items-center justify-center border transition-all", copied ? "bg-[#2bd58c]/10 border-[#2bd58c]/20 text-[#2bd58c]" : "bg-[#22c7b8]/10 border-[#22c7b8]/20 text-[#22c7b8] hover:bg-[#22c7b8]/20")}>
          {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
        </button>
      </div>
    </div>
  );
}
