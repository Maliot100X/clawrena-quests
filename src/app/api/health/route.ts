import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const id = process.env.TWITTER_CLIENT_ID ?? "";
  const secret = process.env.TWITTER_CLIENT_SECRET ?? "";
  const authReady = id.length > 12 && secret.length > 12 && !id.startsWith("REPLACE") && !secret.startsWith("REPLACE");
  return NextResponse.json({ authReady });
}
