"use client";
import { cn } from "@/lib/utils";
import { Star, Trophy, Zap, Calendar } from "lucide-react";

interface Props { points: number; rank: number | null; tasksDone: number; totalTasks: number; checkedInToday: boolean; onCheckin: () => void; checkinLoading: boolean; }

export function ScorePanel({ points, rank, tasksDone, totalTasks, checkedInToday, onCheckin, checkinLoading }: Props) {
  const pct = totalTasks > 0 ? Math.round((tasksDone / totalTasks) * 100) : 0;
  return (
    <div className="rounded-2xl border border-white/7 bg-[#0d0f13] p-5 space-y-5">
      <div className="grid grid-cols-3 divide-x divide-white/7">
        {[
          { label: "Score", value: points, unit: "pt", icon: Star, color: "text-[#22c7b8]" },
          { label: "Rank", value: rank ? `#${rank}` : "—", unit: "", icon: Trophy, color: "text-yellow-400" },
          { label: "Tasks", value: tasksDone, unit: `/${totalTasks}`, icon: Zap, color: "text-violet-400" },
        ].map(({ label, value, unit, icon: Icon, color }) => (
          <div key={label} className="flex flex-col items-center gap-1 px-3 first:pl-0 last:pr-0">
            <Icon className={cn("size-4", color)} />
            <p className="text-[10px] text-[#8b909a] font-medium uppercase tracking-wider">{label}</p>
            <p className="text-xl font-bold tabular-nums text-[#eef0f3]">{value}<span className="text-sm font-normal text-[#8b909a]">{unit}</span></p>
          </div>
        ))}
      </div>
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs text-[#8b909a]"><span>Progress</span><span className="text-[#22c7b8] font-semibold">{pct}%</span></div>
        <div className="h-1.5 rounded-full bg-white/5 overflow-hidden"><div className="h-full rounded-full bg-[#22c7b8] transition-all duration-700" style={{ width: `${pct}%` }} /></div>
      </div>
      <button onClick={onCheckin} disabled={checkedInToday || checkinLoading}
        className={cn("w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-all", checkedInToday ? "border-[#2bd58c]/20 bg-[#2bd58c]/5 cursor-default" : "border-white/7 bg-white/3 hover:border-[#22c7b8]/30 hover:bg-[#22c7b8]/5 cursor-pointer")}>
        <div className="flex items-center gap-3">
          <Calendar className={cn("size-4", checkedInToday ? "text-[#2bd58c]" : "text-[#22c7b8]")} />
          <div className="text-left">
            <p className="text-sm font-semibold text-[#eef0f3]">{checkedInToday ? "Checked in today ✓" : "Daily check-in"}</p>
            <p className="text-xs text-[#8b909a]">{checkedInToday ? "Come back tomorrow" : "Claim +10 pt"}</p>
          </div>
        </div>
        {!checkedInToday && <span className="text-xs font-bold text-[#021a18] bg-[#22c7b8] px-2.5 py-1 rounded-full">{checkinLoading ? "…" : "+10"}</span>}
      </button>
    </div>
  );
}
