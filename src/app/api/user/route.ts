import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db, users, completedTasks } from "@/db";
import { eq, desc } from "drizzle-orm";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const [user] = await db.select().from(users).where(eq(users.id, session.user.id)).limit(1);
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const done = await db.select().from(completedTasks).where(eq(completedTasks.userId, session.user.id));
  const allUsers = await db.select({ id: users.id, points: users.points }).from(users).orderBy(desc(users.points));
  const rank = allUsers.findIndex(u => u.id === user.id) + 1;
  const today = new Date(); today.setHours(0,0,0,0);
  const checkedInToday = user.lastCheckinAt != null && new Date(user.lastCheckinAt) >= today;
  return NextResponse.json({ id: user.id, username: user.username, displayName: user.displayName, avatar: user.avatar, points: user.points, referralCode: user.referralCode, rank, completedTaskIds: done.map(d => d.taskId), checkedInToday });
}
