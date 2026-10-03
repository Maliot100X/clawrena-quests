import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getDb, users, completedTasks, pointsLog } from "@/db";
import { eq, desc } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const db = getDb();
  const [user] = await db.select().from(users).where(eq(users.id, session.user.id)).limit(1);
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const done = await db.select().from(completedTasks).where(eq(completedTasks.userId, session.user.id));
  const history = await db.select().from(pointsLog).where(eq(pointsLog.userId, session.user.id)).orderBy(desc(pointsLog.createdAt)).limit(20);
  const allUsers = await db.select({ id: users.id, points: users.points }).from(users).orderBy(desc(users.points));
  const rank = allUsers.findIndex(u => u.id === user.id) + 1;
  const now = new Date();
  const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const checkedInToday = user.lastCheckinAt != null && new Date(user.lastCheckinAt) >= today;
  return NextResponse.json({
    id: user.id,
    username: user.username,
    displayName: user.displayName,
    avatar: user.avatar,
    points: user.points,
    referralCode: user.referralCode,
    rank,
    completedTaskIds: done.map(d => d.taskId),
    completed: done.map(d => ({ taskId: d.taskId, proofUrl: d.proofUrl, completedAt: d.completedAt })),
    history: history.map(h => ({ amount: h.amount, reason: h.reason, createdAt: h.createdAt })),
    checkedInToday,
  });
}
