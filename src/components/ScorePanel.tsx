"use client";

import { Calendar, Star, Trophy, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface Props {
  points: number;
  rank: number | null;
  tasksDone: number;
  totalTasks: number;
  checkedInToday: boolean;
  onCheckin: () => void;
  checkinLoading: boolean;
}

export function ScorePanel({ points, rank, tasksDone, totalTasks, checkedInToday, onCheckin, checkinLoading }: Props) {
  const pct = totalTasks > 0 ? Math.round((tasksDone / totalTasks) * 100) : 0;
  const stats = [
    { label: "Score", value: String(points), unit: "pt", icon: Star },
    { label: "Rank", value: rank ? `#${rank}` : "—", unit: "", icon: Trophy },
    { label: "Tasks", value: String(tasksDone), unit: `/${totalTasks}`, icon: Zap },
  ];

  return (
    <Card className="space-y-5 p-5 shadow-glow-sm">
      <div className="grid grid-cols-3 divide-x divide-border">
        {stats.map(({ label, value, unit, icon: Icon }) => (
          <div key={label} className="flex flex-col items-center gap-1 px-2">
            <Icon className="size-4 text-primary" />
            <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
            <p className="text-xl font-bold tabular-nums">
              {value}
              <span className="text-sm font-normal text-muted-foreground">{unit}</span>
            </p>
          </div>
        ))}
      </div>
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Task progress</span>
          <span className="font-semibold text-primary">{pct}%</span>
        </div>
        <Progress value={pct} />
      </div>
      <button
        type="button"
        onClick={onCheckin}
        disabled={checkedInToday || checkinLoading}
        className={cn(
          "flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left transition",
          checkedInToday ? "cursor-default border-up/20 bg-up/5" : "border-border bg-white/[0.03] hover:border-primary/30 hover:bg-primary/5"
        )}
      >
        <div className="flex items-center gap-3">
          <Calendar className={cn("size-4", checkedInToday ? "text-up" : "text-primary")} />
          <div>
            <p className="text-sm font-semibold">{checkedInToday ? "Checked in today" : "Daily check-in"}</p>
            <p className="text-xs text-muted-foreground">{checkedInToday ? "Come back after 00:00 UTC" : "Claim +10 pt"}</p>
          </div>
        </div>
        {!checkedInToday && (
          <span className="rounded-full bg-primary px-2.5 py-1 text-xs font-bold text-primary-foreground">
            {checkinLoading ? "…" : "+10"}
          </span>
        )}
      </button>
    </Card>
  );
}
