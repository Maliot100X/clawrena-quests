import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getDb, users, completedTasks, pointsLog, referrals } from "@/db";
import { eq, sql, and } from "drizzle-orm";
import { TASKS } from "@/lib/tasks";
import { verifyProof } from "@/lib/verify";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { taskId, proofUrl } = await req.json() as { taskId: string; proofUrl?: string };
  const task = TASKS.find(t => t.id === taskId);
  if (!task) return NextResponse.json({ error: "Invalid task" }, { status: 400 });
  if (task.requiresProof && !proofUrl) return NextResponse.json({ error: "Proof URL required" }, { status: 400 });
  let storedProof: string | null = null;
  if (task.requiresProof) {
    const username = session.user.username;
    if (!username) return NextResponse.json({ error: "Missing X username on this session. Sign in again." }, { status: 400 });
    const checked = await verifyProof(task.type === "quote" ? "quote" : "reply", proofUrl ?? "", username);
    if (!checked.ok) return NextResponse.json({ error: checked.error }, { status: 400 });
    storedProof = checked.proofUrl;
  }
  const db = getDb();
  const existing = await db.select().from(completedTasks).where(and(eq(completedTasks.userId, session.user.id), eq(completedTasks.taskId, taskId))).limit(1);
  if (existing.length > 0) return NextResponse.json({ error: "Task already completed" }, { status: 400 });
  await db.insert(completedTasks).values({ userId: session.user.id, taskId, proofUrl: storedProof });
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
