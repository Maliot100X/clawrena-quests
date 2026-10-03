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

const ModelViewer = dynamic(
  () => import("@/components/3d/ModelViewer").then(m => ({ default: m.ModelViewer })),
  { ssr: false, loading: () => <div className="h-[380px] flex items-center justify-center bg-[#07080b] rounded-2xl"><Loader2 className="size-8 text-[#22c7b8] animate-spin" /></div> }
);

interface UserData {
  id: string; username: string; displayName: string; avatar: string | null;
  points: number; rank: number; completedTaskIds: string[]; checkedInToday: boolean; referralCode: string;
}

type Tab = "all" | "todo" | "done";

// Real GLB from three.ws free API
const HERO_GLB = "https://pub-2534e921bf9c4314addcd4d8a6e98b7b.r2.dev/forge/e4238875c2f2/aa39815c-4363-4c97-ab3d-d33c94c85a16.glb";

function HomeInner() {
  const { data: session, status } = useSession();
  const params = useSearchParams();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkinLoading, setCheckinLoading] = useState(false);
  const [tab, setTab] = useState<Tab>("todo");

  useEffect(() => {
    const ref = params.get("ref");
    if (ref && session?.user?.id) {
      fetch("/api/referral/apply", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ code: ref }) });
    }
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
    const r = await fetch("/api/tasks/complete", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ taskId, proofUrl }),
    });
    if (!r.ok) { const d = await r.json(); throw new Error(d.error ?? "Failed"); }
    fetchUser();
  };

  const done = userData?.completedTaskIds ?? [];
  const todoCount = TASKS.filter(t => !done.includes(t.id)).length;
  const doneCount = done.length;
  const filtered = TASKS.filter(t => tab === "todo" ? !done.includes(t.id) : tab === "done" ? done.includes(t.id) : true);

  // ── LANDING ──
  if (!session) {
    return (
      <div className="mx-auto max-w-2xl px-5 sm:px-8 pb-10">
        {/* Real 3D hero from three.ws */}
        <div className="relative mt-4 rounded-3xl overflow-hidden border border-[#22c7b8]/20" style={{ boxShadow: "0 0 80px -20px rgba(34,199,184,0.4)" }}>
          <ModelViewer src={HERO_GLB} height="420px" autoRotate={true} cameraControls={true} />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#07080b] pointer-events-none" />
          <div className="absolute bottom-0 left-0 right-0 px-8 pb-8 pt-16">
            <p className="text-[11px] font-bold uppercase tracking-widest text-[#22c7b8]">Tasks</p>
            <h1 className="mt-1 text-3xl sm:text-4xl font-bold tracking-tight text-[#eef0f3]">
              Earn points on <XIcon className="inline size-8 align-[-3px]" />
            </h1>
            <p className="mt-2 text-sm text-[#8b909a] max-w-sm">
              Follow, like, repost and reply to @CLAWRENAi posts. Top scorers get the NFT allowlist.
            </p>
            <button
              onClick={() => signIn("twitter")}
              className="mt-5 flex items-center gap-2.5 h-12 px-8 rounded-full bg-[#22c7b8] text-[#021a18] font-bold text-base hover:brightness-110 transition-all"
              style={{ boxShadow: "0 0 30px -8px rgba(34,199,184,0.8)" }}
            >
              <XIcon className="size-5" /> Sign in with X
            </button>
          </div>
        </div>

        {/* Steps */}
        <ol className="mt-6 grid gap-3 sm:grid-cols-3">
          {[
            { n: 1, t: "Sign in with X", d: "Connect your account. Read-only, we never post for you." },
            { n: 2, t: "Complete tasks", d: "Follow, like, repost, quote and reply to our posts." },
            { n: 3, t: "Climb rankings", d: "Daily check-ins add points. Top scorers get the NFT allowlist." },
          ].map(s => (
            <li key={s.n} className="rounded-2xl border border-white/7 bg-[#0d0f13] p-4">
              <span className="grid size-7 place-items-center rounded-full bg-[#22c7b8]/15 font-mono text-xs text-[#22c7b8] font-bold">{s.n}</span>
              <p className="mt-3 text-sm font-semibold text-[#eef0f3]">{s.t}</p>
              <p className="mt-1 text-xs leading-relaxed text-[#8b909a]">{s.d}</p>
            </li>
          ))}
        </ol>
      </div>
    );
  }

  // ── DASHBOARD ──
  return (
    <div className="mx-auto max-w-2xl px-5 sm:px-8 py-8 space-y-5">
      {userData && (
        <ScorePanel
          points={userData.points} rank={userData.rank}
          tasksDone={doneCount} totalTasks={TASKS.length}
          checkedInToday={userData.checkedInToday}
          onCheckin={handleCheckin} checkinLoading={checkinLoading}
        />
      )}
      {userData && <ReferralCard referralCode={userData.referralCode} />}

      <div className="border-t border-white/5" />

      {/* Tabs */}
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
            {filtered.map(task => (
              <TaskCard key={task.id} task={task} done={done.includes(task.id)} onComplete={handleComplete} />
            ))}
            {filtered.length === 0 && (
              <p className="text-center py-12 text-[#8b909a]">{tab === "done" ? "No tasks completed yet." : "🎉 All tasks done!"}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-20"><Loader2 className="size-6 text-[#22c7b8] animate-spin" /></div>}>
      <HomeInner />
    </Suspense>
  );
}
