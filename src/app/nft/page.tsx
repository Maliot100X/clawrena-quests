"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { Check, Copy, ExternalLink, Loader2 } from "lucide-react";
import { CA, NFTS, PUMP_URL, SOLSCAN_URL } from "@/lib/nfts";
import { MODELS } from "@/lib/models";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const ThreeViewer = dynamic(() => import("@/components/3d/ThreeViewer").then((mod) => mod.ThreeViewer), {
  ssr: false,
  loading: () => <div className="grid h-[380px] place-items-center"><Loader2 className="size-6 animate-spin text-primary" /></div>,
});

const rules = [
  { title: "Finish the five tasks", body: "Follow, like, repost, quote, and reply. Each one is worth 10 points." },
  { title: "Check in daily", body: "One check-in per UTC day adds another 10 points." },
  { title: "Bring someone in", body: "When a friend you invited finishes their first task, you get 20 points." },
];

export default function NFTPage() {
  const [active, setActive] = useState(MODELS[0].id);
  const [copied, setCopied] = useState(false);
  const model = MODELS.find((item) => item.id === active) ?? MODELS[0];

  const copy = async () => {
    await navigator.clipboard.writeText(CA);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mx-auto w-full max-w-2xl space-y-5 px-5 py-8 sm:px-8">
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-primary">NFT</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">CLAWRENA allowlist</h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          The ranking is the list. These pieces are the preview. The model on the stage is a real GLB from three.ws.
        </p>
      </div>

      <Card className="overflow-hidden border-primary/25 p-0">
        <div className="flex items-center gap-2 border-b border-border px-3 py-3">
          {MODELS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setActive(item.id)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${active === item.id ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground"}`}
            >
              {item.label}
            </button>
          ))}
          <a href="https://three.ws" target="_blank" rel="noreferrer" className="ml-auto text-[10px] font-semibold text-primary">
            3D by three.ws
          </a>
        </div>
        <ThreeViewer key={model.src} src={model.src} alt={`${model.label} 3D model`} className="h-[360px] sm:h-[420px]" />
        <div className="flex items-center justify-between border-t border-border px-5 py-4">
          <div>
            <p className="font-semibold">Drag to orbit</p>
            <p className="text-xs text-muted-foreground">Scroll to zoom. The mesh is the generated GLB, not a picture.</p>
          </div>
          <Badge>Preview</Badge>
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-3">
        {NFTS.map((piece) => (
          <figure key={piece.id} className="overflow-hidden rounded-2xl border border-border bg-card">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={piece.image} alt={piece.name} className="aspect-square w-full object-cover" />
            <figcaption className="flex items-center justify-between px-3 py-2">
              <span className="text-xs font-semibold">{piece.name}</span>
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{piece.detail}</span>
            </figcaption>
          </figure>
        ))}
      </div>

      <Card className="border-primary/25 p-6">
        <div className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/mark.jpg" alt="" className="size-14 rounded-2xl border border-primary/30 object-cover" />
          <div>
            <div className="flex items-center gap-2">
              <p className="text-xl font-semibold">$CLAWRENA</p>
              <Badge>Solana</Badge>
            </div>
            <p className="text-xs text-muted-foreground">pump.fun token for the arena</p>
          </div>
        </div>
        <p className="mt-4 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Contract</p>
        <div className="mt-1.5 flex items-center gap-2">
          <code className="min-w-0 flex-1 truncate rounded-xl border border-border bg-background px-3 py-2 font-mono text-xs text-muted-foreground">{CA}</code>
          <Button type="button" size="icon" variant="outline" onClick={copy} aria-label="Copy contract address">
            {copied ? <Check className="size-4 text-up" /> : <Copy className="size-4" />}
          </Button>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button asChild size="sm" variant="secondary">
            <a href={PUMP_URL} target="_blank" rel="noreferrer">pump.fun <ExternalLink className="size-3" /></a>
          </Button>
          <Button asChild size="sm" variant="outline">
            <a href={SOLSCAN_URL} target="_blank" rel="noreferrer">Solscan <ExternalLink className="size-3" /></a>
          </Button>
        </div>
      </Card>

      <div className="grid gap-3">
        {rules.map((rule, index) => (
          <div key={rule.title} className="rounded-2xl border border-border bg-card-raised p-4">
            <p className="font-mono text-xs text-primary">0{index + 1}</p>
            <p className="mt-1 text-sm font-semibold">{rule.title}</p>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">{rule.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
