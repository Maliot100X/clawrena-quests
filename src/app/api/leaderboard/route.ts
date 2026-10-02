import { NextResponse } from "next/server";
import { db, users } from "@/db";
import { desc } from "drizzle-orm";
export async function GET() {
  const leaders = await db.select({ id: users.id, username: users.username, displayName: users.displayName, avatar: users.avatar, points: users.points }).from(users).orderBy(desc(users.points)).limit(100);
  return NextResponse.json(leaders);
}
