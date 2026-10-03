import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db, users, completedTasks, pointsLog, referrals } from "@/db";
import { eq, sql, and } from "drizzle-orm";
import { TASKS } from "@/lib/tasks";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { taskId, proofUrl } = await req.json() as { taskId: string; proofUrl?: string };
  const task = TASKS.find(t => t.id === taskId);
  if (!task) return NextResponse.json({ error: "Invalid task" }, { status: 400 });
  if (task.requiresProof && !proofUrl) return NextResponse.json({ error: "Proof URL required" }, { status: 400 });
  if (proofUrl && !proofUrl.startsWith("https://x.com/") && !proofUrl.startsWith("https://twitter.com/"))
    return NextResponse.json({ error: "Must be a valid X URL" }, { status: 400 });
  const existing = await db.select().from(completedTasks).where(and(eq(completedTasks.userId, session.user.id), eq(completedTasks.taskId, taskId))).limit(1);
  if (existing.length > 0) return NextResponse.json({ error: "Task already completed" }, { status: 400 });
  await db.insert(completedTasks).values({ userId: session.user.id, taskId, proofUrl: proofUrl ?? null });
  await db.update(users).set({ points: sql`${users.points} + ${task.points}` }).where(eq(users.id, session.user.id));
  await db.insert(pointsLog).values({ userId: session.user.id, amount: task.points, reason: `task_${taskId}` });
  const allDone = await db.select().from(completedTasks).where(eq(completedTasks.userId, session.user.id));
  if (allDone.length === 1) {
    const [user] = await db.select().from(users).where(eq(users.id, session.user.id)).limit(1);
    if (user?.referredBy) {
      const [ref] = await db.select().from(referrals).where(and(eq(referrals.referrerId, user.referredBy), eq(referrals.referredId, session.user.id))).limit(1);
      if (ref && !ref.rewardGiven) {
        await db.update(users).set({ points: sql`${users.points} + 20` }).where(eq(users.id, user.referredBy));
        await db.insert(pointsLog).values({ userId: user.referredBy, amount: 20, reason: `referral_${session.user.id}` });
        await db.update(referrals).set({ rewardGiven: true }).where(and(eq(referrals.referrerId, user.referredBy), eq(referrals.referredId, session.user.id)));
      }
    }
  }
  return NextResponse.json({ success: true, pointsAwarded: task.points });
}
