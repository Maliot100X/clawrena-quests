import { NextResponse } from "next/server";
import { getDb, users } from "@/db";
import { desc } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  const db = getDb();
  const leaders = await db.select({ id: users.id, username: users.username, displayName: users.displayName, avatar: users.avatar, points: users.points }).from(users).orderBy(desc(users.points)).limit(100);
  return NextResponse.json(leaders);
}
