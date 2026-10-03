"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Loader2, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";

interface Leader {
  id: string;
  username: string;
  displayName: string;
  avatar: string | null;
  points: number;
}

export default function RankingsPage() {
  const { data: session } = useSession();
  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/leaderboard")
      .then(async (response) => {
        const body = await response.json();
        if (!response.ok || !Array.isArray(body)) {
          setError(body.error ?? "Leaderboard is not ready yet.");
          setLeaders([]);
          return;
        }
        setLeaders(body);
      })
      .catch(() => setError("Could not load rankings."))
      .finally(() => setLoading(false));
  }, []);

  const podium = leaders.length >= 3 ? [leaders[1], leaders[0], leaders[2]] : [];

  return (
    <div className="mx-auto w-full max-w-2xl px-5 py-8 sm:px-8">
      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-primary">Leaderboard</p>
      <h1 className="mt-1 flex items-center gap-2 text-3xl font-semibold tracking-tight">
        <Trophy className="size-6 text-primary" /> Rankings
      </h1>
      <p className="mt-2 mb-6 text-sm text-muted-foreground">Top scores take the allowlist. Your row is marked in teal.</p>

      {podium.length > 0 && (
        <div className="mb-5 grid grid-cols-3 items-end gap-3">
          {podium.map((leader, index) => {
            const rank = index === 1 ? 1 : index === 0 ? 2 : 3;
            return (
              <div
                key={leader.id}
                className={cn(
                  "flex flex-col items-center gap-2 rounded-2xl border p-4",
                  rank === 1 ? "border-primary/40 bg-primary/10 pb-6" : "border-border bg-card",
                  rank === 2 && "mb-3",
                  rank === 3 && "mb-6"
                )}
              >
                <span className="font-mono text-xs text-primary">#{rank}</span>
                <Avatar className={cn("size-14", rank === 1 && "size-16 ring-2 ring-primary")}>
                  {leader.avatar && <AvatarImage src={leader.avatar} alt="" />}
                  <AvatarFallback>{leader.displayName.slice(0, 1)}</AvatarFallback>
                </Avatar>
                <p className="max-w-[7rem] truncate text-center text-xs font-semibold">{leader.displayName}</p>
                <p className="font-mono text-sm font-bold text-primary">{leader.points}</p>
              </div>
            );
          })}
        </div>
      )}

      <Card className="overflow-hidden shadow-none">
        {loading ? (
          <div className="flex justify-center py-16"><Loader2 className="size-6 animate-spin text-primary" /></div>
        ) : error ? (
          <p className="px-5 py-16 text-center text-sm text-muted-foreground">{error}</p>
        ) : leaders.length === 0 ? (
          <div className="px-5 py-14 text-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/mark.jpg" alt="" className="mx-auto mb-4 size-16 rounded-2xl object-cover" />
            <p className="text-sm text-muted-foreground">No scores yet. Sign in and take the first spot.</p>
          </div>
        ) : (
          <ol>
            {leaders.map((leader, index) => {
              const mine = session?.user?.id === leader.id;
              return (
                <li key={leader.id} className={cn("flex items-center gap-3 border-b border-border px-4 py-3 last:border-0", mine && "bg-primary/10")}>
                  <span className="w-6 text-center font-mono text-xs text-muted-foreground">{index + 1}</span>
                  <Avatar className="size-9">
                    {leader.avatar && <AvatarImage src={leader.avatar} alt="" />}
                    <AvatarFallback>{leader.displayName.slice(0, 1)}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className={cn("truncate text-sm font-semibold", mine && "text-primary")}>
                      {leader.displayName} {mine && <span className="font-normal text-muted-foreground">you</span>}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">@{leader.username}</p>
                  </div>
                  <p className="font-mono text-sm font-semibold tabular-nums">{leader.points}<span className="text-xs font-normal text-muted-foreground"> pt</span></p>
                </li>
              );
            })}
          </ol>
        )}
      </Card>
    </div>
  );
}
