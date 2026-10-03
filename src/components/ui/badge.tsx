import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider",
  {
    variants: {
      variant: {
        default: "border-primary/30 bg-primary/10 text-primary",
        follow: "border-sky-400/25 bg-sky-400/10 text-sky-300",
        like: "border-rose-400/25 bg-rose-400/10 text-rose-300",
        repost: "border-emerald-400/25 bg-emerald-400/10 text-emerald-300",
        quote: "border-violet-400/25 bg-violet-400/10 text-violet-300",
        reply: "border-amber-400/25 bg-amber-400/10 text-amber-300",
        up: "border-up/30 bg-up/10 text-up",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export function Badge({ className, variant, ...props }: React.HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
