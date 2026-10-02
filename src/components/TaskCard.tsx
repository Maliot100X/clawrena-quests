"use client";
import { useState } from "react";
import { Task } from "@/lib/tasks";
import { cn } from "@/lib/utils";
import { XIcon } from "./XIcon";
import { CheckCircle2, ExternalLink } from "lucide-react";

const typeBadge: Record<string, string> = {
  follow: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  like: "bg-rose-500/10 text-rose-400 border-rose-500/20",
  repost: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  quote: "bg-violet-500/10 text-violet-400 border-violet-500/20",
  reply: "bg-amber-500/10 text-amber-400 border-amber-500/20",
};

export function TaskCard({ task, done, onComplete }: { task: Task; done: boolean; onComplete: (id: string, proof?: string) => Promise<void>; }) {
  const [opened, setOpened] = useState(false);
  const [proof, setProof] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit() {
    setError(""); setLoading(true);
    try { await onComplete(task.id, task.requiresProof ? proof : undefined); }
    catch (e: unknown) { setError(e instanceof Error ? e.message : "Error"); }
    finally { setLoading(false); }
  }

  return (
    <div className={cn("rounded-2xl border p-4 sm:p-5 transition-all duration-200", done ? "border-[#2bd58c]/20 bg-[#2bd58c]/[0.04]" : "border-white/7 bg-[#0d0f13] hover:border-white/10")}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <div className={cn("shrink-0 size-10 rounded-xl flex items-center justify-center text-lg border", done ? "bg-[#2bd58c]/10 border-[#2bd58c]/20" : "bg-white/5 border-white/7")}>
            {task.icon}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={cn("text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border", typeBadge[task.type])}>{task.type}</span>
              <span className="text-xs font-mono text-[#22c7b8] font-bold">+{task.points} pt</span>
            </div>
            <p className="mt-1.5 text-sm font-semibold text-[#eef0f3]">{task.title}</p>
            <p className="mt-0.5 text-xs text-[#8b909a] leading-relaxed">{task.description}</p>
          </div>
        </div>
        {done && <CheckCircle2 className="size-5 text-[#2bd58c] shrink-0 mt-0.5" />}
      </div>
      {!done && (
        <div className="mt-4 space-y-3 pl-13">
          <button onClick={() => { window.open(task.xUrl, "_blank"); setOpened(true); }}
            className="flex items-center gap-1.5 text-xs font-medium text-[#8b909a] hover:text-[#eef0f3] border border-white/7 hover:border-white/20 rounded-full px-3 py-1.5 transition-all hover:bg-white/5">
            <XIcon className="size-3.5" /> Open on X first <ExternalLink className="size-3 ml-0.5" />
          </button>
          {task.requiresProof && (
            <div className="space-y-2">
              <input type="url" value={proof} onChange={e => setProof(e.target.value)} placeholder={task.proofPlaceholder}
                className="w-full h-9 px-3 rounded-xl border border-white/10 bg-[#07080b] text-sm text-[#eef0f3] placeholder:text-[#8b909a] focus:border-[#22c7b8]/50 focus:ring-1 focus:ring-[#22c7b8]/30 focus:outline-none transition-colors" />
              {error && <p className="text-xs text-[#ff5c7a]">{error}</p>}
              <button onClick={submit} disabled={!proof || !opened || loading}
                className="h-8 px-4 rounded-full bg-[#22c7b8] text-[#021a18] text-xs font-bold hover:brightness-110 transition-all disabled:opacity-40 disabled:cursor-not-allowed">
                {loading ? "Submitting…" : `Submit ${task.type} URL`}
              </button>
            </div>
          )}
          {!task.requiresProof && opened && (
            <div className="space-y-2">
              {error && <p className="text-xs text-[#ff5c7a]">{error}</p>}
              <button onClick={submit} disabled={loading}
                className="h-8 px-4 rounded-full bg-[#22c7b8] text-[#021a18] text-xs font-bold hover:brightness-110 transition-all disabled:opacity-40">
                {loading ? "Saving…" : "Mark as done ✓"}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
