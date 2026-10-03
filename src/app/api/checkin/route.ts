import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getDb, users, pointsLog } from "@/db";
import { eq, sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function POST() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const db = getDb();
  const [user] = await db.select().from(users).where(eq(users.id, session.user.id)).limit(1);
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const now = new Date();
  const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  if (user.lastCheckinAt && new Date(user.lastCheckinAt) >= today)
    return NextResponse.json({ error: "Already checked in today" }, { status: 400 });
  await db.update(users).set({ points: sql`${users.points} + 10`, lastCheckinAt: new Date() }).where(eq(users.id, session.user.id));
  await db.insert(pointsLog).values({ userId: session.user.id, amount: 10, reason: "daily_checkin" });
  return NextResponse.json({ success: true, pointsAwarded: 10 });
}
