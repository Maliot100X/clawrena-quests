"use client";

import { useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { TASKS } from "@/lib/tasks";
import { ReferralCard } from "@/components/ReferralCard";
import { XIcon } from "@/components/XIcon";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface Completed {
  taskId: string;
  proofUrl: string | null;
  completedAt: string;
}

interface HistoryItem {
  amount: number;
  reason: string;
  createdAt: string;
}

interface UserData {
  username: string;
  displayName: string;
  avatar: string | null;
  points: number;
  rank: number;
  completedTaskIds: string[];
  referralCode: string;
  completed?: Completed[];
  history?: HistoryItem[];
}

function reasonLabel(reason: string) {
  if (reason === "daily_checkin") return "Daily check-in";
  if (reason.startsWith("referral_")) return "Referral reward";
  const task = TASKS.find((item) => reason === `task_${item.id}`);
  return task ? task.title : reason;
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "loading") return;
    if (!session?.user?.id) {
      setLoading(false);
      return;
    }
    fetch("/api/user")
      .then((response) => response.json())
      .then((body) => setUserData(body.error ? null : body))
      .finally(() => setLoading(false));
  }, [status, session?.user?.id]);

  if (status === "loading" || loading) {
    return <div className="flex justify-center py-20"><Loader2 className="size-6 animate-spin text-primary" /></div>;
  }

  if (!session) {
    return (
      <div className="mx-auto flex w-full max-w-2xl flex-col items-center gap-4 px-5 py-20 text-center">
        <div className="grid size-16 place-items-center rounded-full border border-primary/30 bg-primary/10">
          <XIcon className="size-6 text-primary" />
        </div>
        <h1 className="text-xl font-semibold">Sign in to open your profile</h1>
        <p className="max-w-sm text-sm text-muted-foreground">Points, task history, and your invite link live here.</p>
        <Button type="button" onClick={() => signIn("twitter", { callbackUrl: "/profile" })}>
          <XIcon className="size-4" /> Sign in with X
        </Button>
      </div>
    );
  }

  const doneIds = userData?.completedTaskIds ?? [];
  const pct = Math.round((doneIds.length / TASKS.length) * 100);

  return (
    <div className="mx-auto w-full max-w-2xl space-y-5 px-5 py-8 sm:px-8">
      <Card className="flex items-center gap-4 p-5 shadow-glow-sm">
        <Avatar className="size-16">
          {userData?.avatar && <AvatarImage src={userData.avatar} alt="" />}
          <AvatarFallback>{(userData?.displayName ?? "C").slice(0, 1)}</AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <h1 className="truncate text-xl font-semibold">{userData?.displayName}</h1>
          <a href={`https://x.com/${userData?.username}`} className="text-sm text-primary" target="_blank" rel="noreferrer">
            @{userData?.username}
          </a>
        </div>
      </Card>

      <div className="grid grid-cols-3 gap-2">
        {[
          { label: "Points", value: userData?.points ?? 0 },
          { label: "Rank", value: userData?.rank ? `#${userData.rank}` : "—" },
          { label: "Tasks", value: `${doneIds.length}/${TASKS.length}` },
        ].map((item) => (
          <div key={item.label} className="rounded-2xl border border-border bg-card px-3 py-3 text-center">
            <p className="font-mono text-lg font-semibold text-primary">{item.value}</p>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{item.label}</p>
          </div>
        ))}
      </div>
      <Progress value={pct} />

      {userData && <ReferralCard referralCode={userData.referralCode} />}

      <section>
        <h2 className="mb-3 text-sm font-semibold">Tasks</h2>
        <div className="space-y-2">
          {TASKS.map((task) => {
            const hit = userData?.completed?.find((item) => item.taskId === task.id);
            return (
              <div key={task.id} className="flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3">
                <CheckCircle2 className={hit ? "size-4 text-up" : "size-4 text-muted-foreground"} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{task.title}</p>
                  {hit?.proofUrl && (
                    <a href={hit.proofUrl} target="_blank" rel="noreferrer" className="text-xs text-primary">View proof</a>
                  )}
                </div>
                <span className="font-mono text-xs text-muted-foreground">{hit ? `+${task.points}` : "open"}</span>
              </div>
            );
          })}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold">Point history</h2>
        <Card className="shadow-none">
          {(userData?.history ?? []).length === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-muted-foreground">No points yet.</p>
          ) : (
            <ul>
              {userData?.history?.map((item, index) => (
                <li key={`${item.reason}-${index}`} className="flex items-center justify-between border-b border-border px-4 py-3 text-sm last:border-0">
                  <span>{reasonLabel(item.reason)}</span>
                  <span className="font-mono font-semibold text-up">+{item.amount}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </section>
    </div>
  );
}
