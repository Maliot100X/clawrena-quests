"use client";
import { useEffect, useState, Suspense } from "react";
import { useSession, signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import { TASKS } from "@/lib/tasks";
import { TaskCard } from "@/components/TaskCard";
import { ScorePanel } from "@/components/ScorePanel";
import { ReferralCard } from "@/components/ReferralCard";
import { XIcon } from "@/components/XIcon";
import { Loader2 } from "lucide-react";

const ClawScene = dynamic(() => import("@/components/3d/ClawScene").then(m => ({ default: m.ClawScene })), {
  ssr: false, loading: () => <div className="h-[320px] sm:h-[380px] flex items-center justify-center"><Loader2 className="size-6 text-[#22c7b8] animate-spin" /></div>
});

interface UserData { id: string; username: string; displayName: string; avatar: string | null; points: number; rank: number; completedTaskIds: string[]; checkedInToday: boolean; referralCode: string; }

type Tab = "all" | "todo" | "done";

function HomeInner() {
  const { data: session, status } = useSession();
  const params = useSearchParams();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkinLoading, setCheckinLoading] = useState(false);
  const [tab, setTab] = useState<Tab>("todo");

  useEffect(() => {
    const ref = params.get("ref");
    if (ref && session?.user?.id) fetch("/api/referral/apply", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ code: ref }) });
  }, [session?.user?.id, params]);

  const fetchUser = async () => {
    if (!session?.user?.id) { setLoading(false); return; }
    try { const r = await fetch("/api/user"); if (r.ok) setUserData(await r.json()); } finally { setLoading(false); }
  };

  useEffect(() => { if (status !== "loading") fetchUser(); }, [status]);

  const handleCheckin = async () => {
    setCheckinLoading(true);
    const r = await fetch("/api/checkin", { method: "POST" });
    if (r.ok) fetchUser();
    setCheckinLoading(false);
  };

  const handleComplete = async (taskId: string, proofUrl?: string) => {
    const r = await fetch("/api/tasks/complete", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ taskId, proofUrl }) });
    if (!r.ok) { const d = await r.json(); throw new Error(d.error ?? "Failed"); }
    fetchUser();
  };

  const done = userData?.completedTaskIds ?? [];
  const todoCount = TASKS.filter(t => !done.includes(t.id)).length;
  const doneCount = done.length;

  const filtered = TASKS.filter(t => {
    if (tab === "todo") return !done.includes(t.id);
    if (tab === "done") return done.includes(t.id);
    return true;
  });

  if (!session) {
    return (
      <div className="mx-auto max-w-2xl px-5 sm:px-8">
        <div className="relative">
          <ClawScene />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#07080b] pointer-events-none" />
        </div>
        <div className="relative -mt-16 z-10 rounded-3xl border border-[#22c7b8]/20 bg-[#0d0f13] glow overflow-hidden mb-10">
          <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#22c7b8]/[0.07] to-transparent pointer-events-none" />
          <div className="relative px-6 py-10 sm:px-10 sm:py-14">
            <p className="text-[11px] font-bold uppercase tracking-widest text-[#22c7b8]">Tasks</p>
            <h1 className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight text-[#eef0f3]">
              Earn points on <XIcon className="inline size-8 align-[-3px]" />
            </h1>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-[#8b909a]">
              Follow, like, repost and reply to @CLAWRENAi posts to earn points. Top scorers get the NFT allowlist.
            </p>
            <button onClick={() => signIn("twitter")}
              className="mt-7 flex items-center justify-center gap-2.5 h-12 w-fit px-8 rounded-full bg-[#22c7b8] text-[#021a18] font-bold text-base hover:brightness-110 transition-all glow pulse-glow">
              <XIcon className="size-5" /> Sign in with X
            </button>
            <ol className="mt-10 grid gap-3 sm:grid-cols-3">
              {[
                { n: 1, t: "Sign in with X", d: "Connect your X account. Read-only, we never post for you." },
                { n: 2, t: "Complete tasks", d: "Follow, like, repost, quote and reply to our posts." },
                { n: 3, t: "Climb rankings", d: "Daily check-ins add points. Top scorers get the NFT allowlist." },
              ].map(s => (
                <li key={s.n} className="rounded-2xl border border-white/7 bg-white/3 p-4">
                  <span className="grid size-7 place-items-center rounded-full bg-[#22c7b8]/15 font-mono text-xs text-[#22c7b8] font-bold">{s.n}</span>
                  <p className="mt-3 text-sm font-semibold text-[#eef0f3]">{s.t}</p>
                  <p className="mt-1 text-xs leading-relaxed text-[#8b909a]">{s.d}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-5 sm:px-8 py-8 space-y-5">
      {userData && <ScorePanel points={userData.points} rank={userData.rank} tasksDone={doneCount} totalTasks={TASKS.length} checkedInToday={userData.checkedInToday} onCheckin={handleCheckin} checkinLoading={checkinLoading} />}
      {userData && <ReferralCard referralCode={userData.referralCode} />}
      <div className="border-t border-white/5" />
      <div>
        <div className="flex items-center gap-1 bg-white/3 border border-white/7 rounded-xl p-1 w-fit mb-4">
          {(["all", "todo", "done"] as Tab[]).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${tab === t ? "bg-[#0d0f13] text-[#eef0f3] shadow-sm" : "text-[#8b909a] hover:text-[#eef0f3]"}`}>
              {t === "all" ? "All" : t === "todo" ? `To do · ${todoCount}` : `Done · ${doneCount}`}
            </button>
          ))}
        </div>
        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="size-6 text-[#22c7b8] animate-spin" /></div>
        ) : (
          <div className="space-y-3">
            {filtered.map(task => <TaskCard key={task.id} task={task} done={done.includes(task.id)} onComplete={handleComplete} />)}
            {filtered.length === 0 && <p className="text-center py-12 text-[#8b909a]">{tab === "done" ? "No tasks completed yet." : "🎉 All tasks done!"}</p>}
          </div>
        )}
      </div>
    </div>
  );
}

export default function HomePage() {
  return <Suspense fallback={<div className="flex justify-center py-20"><Loader2 className="size-6 text-[#22c7b8] animate-spin" /></div>}><HomeInner /></Suspense>;
}
