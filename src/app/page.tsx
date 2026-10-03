"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { TASKS } from "@/lib/tasks";
import { NFTS } from "@/lib/nfts";
import { HERO_MODEL } from "@/lib/models";
import { TaskCard } from "@/components/TaskCard";
import { ScorePanel } from "@/components/ScorePanel";
import { ReferralCard } from "@/components/ReferralCard";
import { XIcon } from "@/components/XIcon";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ThreeViewer = dynamic(() => import("@/components/3d/ThreeViewer").then((mod) => mod.ThreeViewer), {
  ssr: false,
  loading: () => <div className="grid h-[380px] place-items-center bg-background"><Loader2 className="size-7 animate-spin text-primary" /></div>,
});

interface UserData {
  id: string;
  username: string;
  displayName: string;
  avatar: string | null;
  points: number;
  rank: number;
  completedTaskIds: string[];
  checkedInToday: boolean;
  referralCode: string;
}

interface ArenaStats {
  players: number;
  points: number;
  tasks: number;
}

const steps = [
  { n: "01", title: "Sign in with X", body: "Read-only access. CLAWRENA never posts for you." },
  { n: "02", title: "Do the tasks", body: "Follow, like, repost, quote, and reply on the live post." },
  { n: "03", title: "Climb the board", body: "Daily check-ins and referrals stack points toward the allowlist." },
];

function HomeInner() {
  const { data: session, status } = useSession();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkinLoading, setCheckinLoading] = useState(false);
  const [tab, setTab] = useState("todo");
  const [stats, setStats] = useState<ArenaStats | null>(null);
  const [authReady, setAuthReady] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const ref = query.get("ref");
    if (ref) localStorage.setItem("clawrena_ref", ref);
    setAuthError(query.get("error"));
  }, []);

  useEffect(() => {
    fetch("/api/stats").then((response) => response.json()).then(setStats).catch(() => setStats(null));
    fetch("/api/health").then((response) => response.json()).then((body) => setAuthReady(Boolean(body.authReady))).catch(() => setAuthReady(false));
  }, []);

  useEffect(() => {
    if (!session?.user?.id) return;
    const ref = new URLSearchParams(window.location.search).get("ref") || localStorage.getItem("clawrena_ref");
    if (!ref) return;
    fetch("/api/referral/apply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: ref }),
    }).finally(() => localStorage.removeItem("clawrena_ref"));
  }, [session?.user?.id]);

  const fetchUser = async () => {
    if (!session?.user?.id) {
      setLoading(false);
      return;
    }
    try {
      const response = await fetch("/api/user");
      if (response.ok) setUserData(await response.json());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status !== "loading") fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, session?.user?.id]);

  const handleCheckin = async () => {
    setCheckinLoading(true);
    const response = await fetch("/api/checkin", { method: "POST" });
    if (response.ok) await fetchUser();
    setCheckinLoading(false);
  };

  const handleComplete = async (taskId: string, proofUrl?: string) => {
    const response = await fetch("/api/tasks/complete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ taskId, proofUrl }),
    });
    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      throw new Error(body.error ?? "Could not complete that task.");
    }
    await fetchUser();
  };

  const signInWithX = () => {
    const ref = new URLSearchParams(window.location.search).get("ref") || localStorage.getItem("clawrena_ref");
    signIn("twitter", { callbackUrl: ref ? `/?ref=${encodeURIComponent(ref)}` : "/" });
  };

  const done = userData?.completedTaskIds ?? [];
  const todoCount = TASKS.filter((task) => !done.includes(task.id)).length;
  const doneCount = done.length;
  const filtered = TASKS.filter((task) => (tab === "todo" ? !done.includes(task.id) : tab === "done" ? done.includes(task.id) : true));

  if (!session) {
    return (
      <div className="mx-auto w-full max-w-2xl px-5 pb-12 sm:px-8">
        <Card className="mt-6 overflow-hidden border-primary/25">
          <ThreeViewer src={HERO_MODEL.src} alt="CLAWRENA claw model" className="h-[340px] sm:h-[440px]" />
          <div className="relative px-6 py-8 sm:px-10">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-primary/10 to-transparent" />
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-primary">Tasks</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
              Earn points on <XIcon className="inline size-8 align-[-4px]" />
            </h1>
            <p className="mt-3 max-w-md text-sm leading-6 text-muted-foreground">
              Follow, like, repost, quote, and reply to @CLAWRENAi. Points are real. The top of the board takes the NFT allowlist.
            </p>
            <Button type="button" size="lg" className="mt-6" onClick={signInWithX}>
              <XIcon className="size-5" /> Sign in with X
            </Button>
            {!authReady && (
              <p className="mt-3 max-w-md text-xs leading-5 text-down">
                X sign-in is waiting on TWITTER_CLIENT_ID and TWITTER_CLIENT_SECRET in the Vercel project. Create the app at developer.x.com with callback https://clawrena-quests.vercel.app/api/auth/callback/twitter.
              </p>
            )}
            {authError && (
              <p className="mt-3 text-xs text-down">Sign-in did not finish ({authError}). Check the X app callback URL and keys, then try again.</p>
            )}
          </div>
        </Card>

        <ol className="mt-4 grid gap-3 sm:grid-cols-3">
          {steps.map((step, index) => (
            <motion.li
              key={step.n}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.06 }}
              className="rounded-2xl border border-border bg-card-raised p-4"
            >
              <span className="font-mono text-xs text-primary">{step.n}</span>
              <p className="mt-2 text-sm font-semibold">{step.title}</p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">{step.body}</p>
            </motion.li>
          ))}
        </ol>

        <div className="mt-4 grid grid-cols-3 gap-2">
          {[
            { label: "Players", value: stats?.players ?? "—" },
            { label: "Points", value: stats?.points ?? "—" },
            { label: "Tasks done", value: stats?.tasks ?? "—" },
          ].map((item) => (
            <div key={item.label} className="rounded-2xl border border-border bg-card px-3 py-3 text-center">
              <p className="font-mono text-lg font-semibold tabular-nums text-primary">{item.value}</p>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{item.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-6">
          <div className="mb-3 flex items-end justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-primary">Allowlist</p>
              <h2 className="text-lg font-semibold">Genesis previews</h2>
            </div>
            <Link href="/nft" className="text-xs font-semibold text-primary">View NFT</Link>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {NFTS.map((piece) => (
              <Link key={piece.id} href="/nft" className="group overflow-hidden rounded-2xl border border-border bg-card">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={piece.image} alt={piece.name} className="aspect-square w-full object-cover transition duration-500 group-hover:scale-[1.03]" />
                <div className="flex items-center justify-between px-3 py-2">
                  <span className="text-xs font-semibold">{piece.name}</span>
                  <span className="text-[10px] text-muted-foreground">{piece.detail}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-2xl space-y-5 px-5 py-8 sm:px-8">
      <div className="overflow-hidden rounded-3xl border border-primary/20">
        <ThreeViewer src={HERO_MODEL.src} alt="CLAWRENA claw model" className="h-[220px]" />
      </div>
      {userData && (
        <ScorePanel
          points={userData.points}
          rank={userData.rank}
          tasksDone={doneCount}
          totalTasks={TASKS.length}
          checkedInToday={userData.checkedInToday}
          onCheckin={handleCheckin}
          checkinLoading={checkinLoading}
        />
      )}
      {userData && <ReferralCard referralCode={userData.referralCode} />}
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="todo">To do · {todoCount}</TabsTrigger>
          <TabsTrigger value="done">Done · {doneCount}</TabsTrigger>
        </TabsList>
      </Tabs>
      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="size-6 animate-spin text-primary" /></div>
      ) : (
        <div className="space-y-3">
          {filtered.map((task) => (
            <TaskCard key={task.id} task={task} done={done.includes(task.id)} onComplete={handleComplete} />
          ))}
          {filtered.length === 0 && (
            <p className="py-12 text-center text-sm text-muted-foreground">
              {tab === "done" ? "No tasks completed yet." : "Every task is done."}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default function HomePage() {
  return <HomeInner />;
}
