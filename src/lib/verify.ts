import { TARGET_TWEET_ID } from "@/lib/nfts";

export type ProofKind = "quote" | "reply";

interface TweetPayload {
  id?: string;
  author?: { screen_name?: string };
  replying_to_status?: string | number | null;
  quote?: { id?: string | number | null } | null;
}

export function parseStatusUrl(proofUrl: string) {
  const match = proofUrl.trim().match(/^https:\/\/(?:x|twitter)\.com\/([A-Za-z0-9_]{1,15})\/status\/(\d+)(?:[/?].*)?$/);
  if (!match) return null;
  return { handle: match[1], id: match[2] };
}

export async function verifyProof(kind: ProofKind, proofUrl: string, username: string) {
  const parsed = parseStatusUrl(proofUrl);
  if (!parsed) {
    return { ok: false as const, error: "Paste a post link like https://x.com/you/status/123" };
  }
  if (parsed.handle.toLowerCase() !== username.toLowerCase()) {
    return { ok: false as const, error: "That post is not from the X account you signed in with." };
  }
  if (parsed.id === TARGET_TWEET_ID) {
    return { ok: false as const, error: "Paste your own post, not the original CLAWRENA post." };
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);
  try {
    const response = await fetch(`https://api.fxtwitter.com/${parsed.handle}/status/${parsed.id}`, {
      signal: controller.signal,
      cache: "no-store",
      headers: { accept: "application/json" },
    });
    if (!response.ok) {
      return { ok: false as const, error: "Could not read that post on X. Check the link and try again." };
    }
    const body = (await response.json()) as { tweet?: TweetPayload };
    const tweet = body.tweet;
    if (!tweet) return { ok: false as const, error: "That post was not found." };
    const author = tweet.author?.screen_name ?? "";
    if (author.toLowerCase() !== username.toLowerCase()) {
      return { ok: false as const, error: "The author of that post does not match your account." };
    }
    if (kind === "reply") {
      if (String(tweet.replying_to_status ?? "") !== TARGET_TWEET_ID) {
        return { ok: false as const, error: "That post is not a reply to the CLAWRENA post." };
      }
    } else if (String(tweet.quote?.id ?? "") !== TARGET_TWEET_ID) {
      return { ok: false as const, error: "That post does not quote the CLAWRENA post." };
    }
    return { ok: true as const, proofUrl: `https://x.com/${parsed.handle}/status/${parsed.id}` };
  } catch {
    return { ok: false as const, error: "X lookup timed out. Try the link again in a moment." };
  } finally {
    clearTimeout(timer);
  }
}
