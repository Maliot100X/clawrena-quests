import { NextResponse } from "next/server";
import { getDb, users } from "@/db";
import { desc } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const db = getDb();
    const leaders = await db.select({ id: users.id, username: users.username, displayName: users.displayName, avatar: users.avatar, points: users.points }).from(users).orderBy(desc(users.points)).limit(100);
    return NextResponse.json(leaders);
  } catch (error) {
    console.error("leaderboard", error);
    return NextResponse.json({ error: "Leaderboard is not ready yet." }, { status: 503 });
  }
}
