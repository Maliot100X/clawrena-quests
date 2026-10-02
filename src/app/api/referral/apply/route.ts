import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db, users, referrals } from "@/db";
import { eq } from "drizzle-orm";
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { code } = await req.json() as { code: string };
  if (!code) return NextResponse.json({ error: "No code" }, { status: 400 });
  const [referrer] = await db.select().from(users).where(eq(users.referralCode, code.toUpperCase())).limit(1);
  if (!referrer) return NextResponse.json({ error: "Invalid code" }, { status: 404 });
  if (referrer.id === session.user.id) return NextResponse.json({ error: "Cannot refer yourself" }, { status: 400 });
  const [me] = await db.select().from(users).where(eq(users.id, session.user.id)).limit(1);
  if (me?.referredBy) return NextResponse.json({ error: "Already referred" }, { status: 400 });
  await db.update(users).set({ referredBy: referrer.id }).where(eq(users.id, session.user.id));
  await db.insert(referrals).values({ referrerId: referrer.id, referredId: session.user.id });
  return NextResponse.json({ success: true });
}
