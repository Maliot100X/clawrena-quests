import NextAuth from "next-auth";
import Twitter from "next-auth/providers/twitter";
import { getDb, users } from "@/db";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [Twitter({ clientId: process.env.TWITTER_CLIENT_ID!, clientSecret: process.env.TWITTER_CLIENT_SECRET! })],
  session: { strategy: "jwt" },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (!user?.id || !account) return false;
      try {
        const db = getDb();
        const twitterId = (profile?.data as { id?: string })?.id ?? user.id;
        const username = (profile?.data as { username?: string })?.username ?? (user.name ?? "user").toLowerCase().replace(/\s+/g, "");
        const displayName = user.name ?? username;
        const avatar = user.image ?? null;
        const existing = await db.select().from(users).where(eq(users.id, twitterId)).limit(1);
        if (existing.length === 0) {
          await db.insert(users).values({ id: twitterId, username, displayName, avatar, referralCode: nanoid(8).toUpperCase(), accessToken: account.access_token ?? null });
        } else {
          await db.update(users).set({ username, displayName, avatar, accessToken: account.access_token ?? null }).where(eq(users.id, twitterId));
        }
        return true;
      } catch (e) { console.error("signIn error", e); return false; }
    },
    async jwt({ token, account, profile }) {
      if (account && profile) {
        token.twitterId = (profile?.data as { id?: string })?.id ?? token.sub;
        token.username = (profile?.data as { username?: string })?.username ?? token.name;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = (token.twitterId as string) ?? token.sub!;
      session.user.username = token.username as string;
      return session;
    },
  },
  pages: { signIn: "/", error: "/" },
});

declare module "next-auth" {
  interface Session {
    user: { id: string; username: string; name?: string | null; email?: string | null; image?: string | null; };
  }
}
