"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Trophy, Crown, Medal, Loader2 } from "lucide-react";

interface Leader { id: string; username: string; displayName: string; avatar: string | null; points: number; }

export default function RankingsPage() {
  const { data: session } = useSession();
  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { fetch("/api/leaderboard").then(r => r.json()).then(d => { setLeaders(d); setLoading(false); }); }, []);

  return (
    <div className="mx-auto max-w-2xl px-5 sm:px-8 py-8">
      <p className="text-[11px] font-bold uppercase tracking-widest text-[#22c7b8]">Leaderboard</p>
      <h1 className="mt-1 text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-2 mb-6"><Trophy className="size-6 text-yellow-400" /> Rankings</h1>
      {!loading && leaders.length >= 3 && (
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[leaders[1], leaders[0], leaders[2]].map((l, i) => {
            const rank = i === 0 ? 2 : i === 1 ? 1 : 3;
            return (
              <div key={l.id} className={cn("flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all", rank === 1 ? "border-[#22c7b8]/30 bg-[#22c7b8]/5 glow-sm" : "border-white/7 bg-[#0d0f13]", rank === 2 ? "mt-4" : rank === 3 ? "mt-6" : "")}>
                <div className="relative">
                  {l.avatar ? <Image src={l.avatar} alt={l.displayName} width={48} height={48} className={cn("rounded-full border-2", rank === 1 ? "border-[#22c7b8]" : "border-white/10")} unoptimized /> : <div className={cn("size-12 rounded-full border-2 bg-white/5 flex items-center justify-center text-lg font-bold", rank === 1 ? "border-[#22c7b8]" : "border-white/10")}>{l.displayName[0]}</div>}
                  <div className={cn("absolute -top-1 -right-1 size-5 rounded-full flex items-center justify-center text-xs font-bold", rank === 1 ? "bg-yellow-400 text-yellow-900" : rank === 2 ? "bg-slate-300 text-slate-900" : "bg-amber-600 text-white")}>{rank}</div>
                </div>
                <div className="text-center"><p className="text-xs font-semibold truncate max-w-[80px] text-[#eef0f3]">{l.displayName}</p><p className="text-sm font-bold text-[#22c7b8]">{l.points} pt</p></div>
              </div>
            );
          })}
        </div>
      )}
      <div className="rounded-2xl border border-white/7 bg-[#0d0f13] overflow-hidden">
        {loading ? <div className="flex justify-center py-16"><Loader2 className="size-6 text-[#22c7b8] animate-spin" /></div>
        : leaders.length === 0 ? <p className="text-center py-16 text-[#8b909a]">No participants yet. Be the first!</p>
        : <div className="divide-y divide-white/5">{leaders.map((l, i) => {
            const isMe = session?.user?.id === l.id;
            return (
              <div key={l.id} className={cn("flex items-center gap-4 px-5 py-3.5 transition-colors", isMe ? "bg-[#22c7b8]/5" : "hover:bg-white/3")}>
                <div className="w-6 flex justify-center shrink-0">
                  {i === 0 ? <Crown className="size-4 text-yellow-400" /> : i === 1 ? <Medal className="size-4 text-slate-300" /> : i === 2 ? <Medal className="size-4 text-amber-600" /> : <span className="text-xs text-[#8b909a] font-mono">{i+1}</span>}
                </div>
                {l.avatar ? <Image src={l.avatar} alt={l.displayName} width={36} height={36} className="rounded-full border border-white/10 shrink-0" unoptimized /> : <div className="size-9 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-sm font-bold shrink-0">{l.displayName[0]}</div>}
                <div className="flex-1 min-w-0">
                  <p className={cn("text-sm font-semibold truncate", isMe && "text-[#22c7b8]")}>{l.displayName} {isMe && <span className="text-xs text-[#8b909a] font-normal">(you)</span>}</p>
                  <p className="text-xs text-[#8b909a]">@{l.username}</p>
                </div>
                <p className="text-sm font-bold tabular-nums shrink-0 text-[#eef0f3]">{l.points} <span className="text-xs font-normal text-[#8b909a]">pt</span></p>
              </div>
            );
          })}</div>}
      </div>
    </div>
  );
}
