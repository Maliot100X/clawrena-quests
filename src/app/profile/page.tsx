"use client";
import { useEffect, useState } from "react";
import { useSession, signIn } from "next-auth/react";
import Image from "next/image";
import { TASKS } from "@/lib/tasks";
import { ReferralCard } from "@/components/ReferralCard";
import { XIcon } from "@/components/XIcon";
import { cn } from "@/lib/utils";
import { Loader2, Star, Trophy, Zap, CheckCircle2, Clock } from "lucide-react";

interface UserData { id: string; username: string; displayName: string; avatar: string | null; points: number; rank: number; completedTaskIds: string[]; checkedInToday: boolean; referralCode: string; }

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "loading") return;
    if (!session?.user?.id) { setLoading(false); return; }
    fetch("/api/user").then(r => r.json()).then(d => { setUserData(d); setLoading(false); });
  }, [status, session?.user?.id]);

  if (status === "loading" || loading) return <div className="flex justify-center py-20"><Loader2 className="size-6 text-[#22c7b8] animate-spin" /></div>;

  if (!session) return (
    <div className="mx-auto max-w-2xl px-5 sm:px-8 py-20 flex flex-col items-center gap-5 text-center">
      <div className="size-16 rounded-full border border-[#22c7b8]/30 bg-[#22c7b8]/5 flex items-center justify-center"><XIcon className="size-7 text-[#22c7b8]" /></div>
      <div><h2 className="text-xl font-bold text-[#eef0f3]">Sign in to view your profile</h2><p className="mt-1 text-sm text-[#8b909a]">Connect your X account to track points and tasks.</p></div>
      <button onClick={() => signIn("twitter")} className="flex items-center gap-2 h-11 px-7 rounded-full bg-[#22c7b8] text-[#021a18] font-bold hover:brightness-110 transition-all"><XIcon className="size-4" /> Sign in with X</button>
    </div>
  );

  const done = TASKS.filter(t => userData?.completedTaskIds.includes(t.id));
  const totalPossible = TASKS.reduce((a, t) => a + t.points, 0) + 10;
  const pct = Math.min(100, Math.round(((userData?.points ?? 0) / totalPossible) * 100));

  return (
    <div className="mx-auto max-w-2xl px-5 sm:px-8 py-8 space-y-5">
      <div className="rounded-2xl border border-white/7 bg-[#0d0f13] p-6 flex items-center gap-5">
        <div className="relative shrink-0">
          {userData?.avatar ? <Image src={userData.avatar} alt={userData.displayName} width={72} height={72} className="rounded-full border-2 border-[#22c7b8]/40" unoptimized /> : <div className="size-[72px] rounded-full border-2 border-[#22c7b8]/40 bg-white/5 flex items-center justify-center text-2xl font-bold text-[#eef0f3]">{userData?.displayName?.[0] ?? "?"}</div>}
          <div className="absolute -bottom-1 -right-1 size-4 rounded-full bg-[#2bd58c] border-2 border-[#0d0f13]" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-lg font-bold truncate text-[#eef0f3]">{userData?.displayName}</p>
          <a href={`https://x.com/${userData?.username}`} target="_blank" rel="noopener noreferrer" className="text-sm text-[#8b909a] hover:text-[#22c7b8] transition-colors flex items-center gap-1"><XIcon className="size-3.5" /> @{userData?.username}</a>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[{ icon: Star, label: "Points", value: userData?.points ?? 0, unit: "pt", color: "text-[#22c7b8]" }, { icon: Trophy, label: "Rank", value: userData?.rank ? `#${userData.rank}` : "—", unit: "", color: "text-yellow-400" }, { icon: Zap, label: "Tasks", value: done.length, unit: `/${TASKS.length}`, color: "text-violet-400" }].map(({ icon: Icon, label, value, unit, color }) => (
          <div key={label} className="rounded-2xl border border-white/7 bg-[#0d0f13] p-4 flex flex-col items-center gap-1 text-center">
            <Icon className={cn("size-4", color)} />
            <p className="text-[10px] text-[#8b909a] uppercase tracking-wider font-medium">{label}</p>
            <p className="text-xl font-bold tabular-nums text-[#eef0f3]">{value}<span className="text-sm font-normal text-[#8b909a]">{unit}</span></p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-white/7 bg-[#0d0f13] p-5 space-y-3">
        <div className="flex justify-between text-sm"><span className="font-semibold text-[#eef0f3]">Overall progress</span><span className="text-[#22c7b8] font-bold">{pct}%</span></div>
        <div className="h-2 rounded-full bg-white/5 overflow-hidden"><div className="h-full rounded-full bg-[#22c7b8] transition-all duration-700" style={{ width: `${pct}%` }} /></div>
        <p className="text-xs text-[#8b909a]">{userData?.points} of {totalPossible} possible points earned</p>
      </div>

      <div className="rounded-2xl border border-white/7 bg-[#0d0f13] overflow-hidden">
        <div className="px-5 py-3.5 border-b border-white/5"><p className="text-sm font-semibold text-[#eef0f3]">Task history</p></div>
        <div className="divide-y divide-white/5">
          {TASKS.map(task => {
            const isDone = userData?.completedTaskIds.includes(task.id) ?? false;
            return (
              <div key={task.id} className="flex items-center gap-3 px-5 py-3.5">
                <span className="text-base">{task.icon}</span>
                <div className="flex-1 min-w-0"><p className="text-sm font-medium truncate text-[#eef0f3]">{task.title}</p><p className="text-xs text-[#8b909a]">+{task.points} pt</p></div>
                {isDone ? <CheckCircle2 className="size-5 text-[#2bd58c] shrink-0" /> : <Clock className="size-5 text-[#8b909a] shrink-0" />}
              </div>
            );
          })}
        </div>
      </div>

      {userData && <ReferralCard referralCode={userData.referralCode} />}
    </div>
  );
}
