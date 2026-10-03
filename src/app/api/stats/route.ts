import { NextResponse } from "next/server";
import { sql } from "drizzle-orm";
import { getDb, users, completedTasks } from "@/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const db = getDb();
    const [players] = await db.select({
      n: sql<number>`cast(count(*) as int)`,
      points: sql<number>`cast(coalesce(sum(${users.points}), 0) as int)`,
    }).from(users);
    const [tasks] = await db.select({
      n: sql<number>`cast(count(*) as int)`,
    }).from(completedTasks);
    return NextResponse.json({
      players: Number(players?.n ?? 0),
      points: Number(players?.points ?? 0),
      tasks: Number(tasks?.n ?? 0),
    });
  } catch {
    return NextResponse.json({ players: 0, points: 0, tasks: 0 });
  }
}
