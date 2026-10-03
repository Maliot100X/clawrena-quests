"use client";

import { useState } from "react";
import { CheckCircle2, ExternalLink, Heart, MessageCircle, Quote, Repeat2, UserPlus } from "lucide-react";
import { Task } from "@/lib/tasks";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { XIcon } from "./XIcon";

const icons = {
  follow: UserPlus,
  like: Heart,
  repost: Repeat2,
  quote: Quote,
  reply: MessageCircle,
};

export function TaskCard({
  task,
  done,
  onComplete,
}: {
  task: Task;
  done: boolean;
  onComplete: (id: string, proof?: string) => Promise<void>;
}) {
  const [opened, setOpened] = useState(false);
  const [proof, setProof] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const Icon = icons[task.type];

  async function submit() {
    setError("");
    setLoading(true);
    try {
      await onComplete(task.id, task.requiresProof ? proof.trim() : undefined);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not save that task.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <article className={cn("rounded-2xl border p-4 sm:p-5", done ? "border-up/25 bg-up/[0.04]" : "border-border bg-card")}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <div className={cn("grid size-10 shrink-0 place-items-center rounded-xl border", done ? "border-up/30 bg-up/10 text-up" : "border-border bg-white/5 text-primary")}>
            <Icon className="size-4" />
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant={task.type}>{task.type}</Badge>
              <span className="font-mono text-xs font-bold text-primary">+{task.points} pt</span>
            </div>
            <h3 className="mt-1.5 text-sm font-semibold">{task.title}</h3>
            <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{task.description}</p>
          </div>
        </div>
        {done && <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-up" />}
      </div>
      {!done && (
        <div className="mt-4 space-y-3 sm:pl-[3.25rem]">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              window.open(task.xUrl, "_blank", "noopener,noreferrer");
              setOpened(true);
            }}
          >
            <XIcon className="size-3.5" />
            Open on X
            <ExternalLink className="size-3" />
          </Button>
          {task.requiresProof && (
            <div className="space-y-2">
              <Input
                type="url"
                value={proof}
                onChange={(event) => setProof(event.target.value)}
                placeholder={task.proofPlaceholder}
                aria-label={`${task.title} proof link`}
              />
              <p className="text-[11px] leading-5 text-muted-foreground">
                We check the link on X. It has to be your post, and it has to {task.type} the CLAWRENA post.
              </p>
              {error && <p className="text-xs text-down">{error}</p>}
              <Button type="button" size="sm" onClick={submit} disabled={!proof || !opened || loading}>
                {loading ? "Checking…" : "Submit link"}
              </Button>
            </div>
          )}
          {!task.requiresProof && opened && (
            <div className="space-y-2">
              {error && <p className="text-xs text-down">{error}</p>}
              <Button type="button" size="sm" onClick={submit} disabled={loading}>
                {loading ? "Saving…" : "Mark as done"}
              </Button>
            </div>
          )}
        </div>
      )}
    </article>
  );
}
