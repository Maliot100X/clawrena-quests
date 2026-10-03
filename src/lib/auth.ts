import NextAuth from "next-auth";
import Twitter from "next-auth/providers/twitter";
import { getDb, users } from "@/db";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";

type TwitterRaw = {
  data?: { id?: string; username?: string; name?: string; profile_image_url?: string };
  id?: string;
  username?: string;
  name?: string;
};

function identity(user: { id?: string; name?: string | null; image?: string | null }, profile: unknown) {
  const raw = (profile ?? {}) as TwitterRaw;
  const data = raw.data ?? {};
  const id = String(data.id ?? raw.id ?? user.id ?? "");
  const username = String(data.username ?? raw.username ?? (user.name ?? "user")).replace(/^@/, "").replace(/\s+/g, "");
  const displayName = data.name ?? raw.name ?? user.name ?? username;
  const avatar = user.image ?? data.profile_image_url ?? null;
  return { id, username, displayName, avatar };
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  providers: [
    Twitter({
      clientId: process.env.TWITTER_CLIENT_ID,
      clientSecret: process.env.TWITTER_CLIENT_SECRET,
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (!account) return false;
      const ident = identity(user, profile);
      if (!ident.id) return false;
      try {
        const db = getDb();
        const existing = await db.select().from(users).where(eq(users.id, ident.id)).limit(1);
        if (existing.length === 0) {
          await db.insert(users).values({
            id: ident.id,
            username: ident.username,
            displayName: ident.displayName,
            avatar: ident.avatar,
            referralCode: nanoid(8).toUpperCase(),
            accessToken: account.access_token ?? null,
          });
        } else {
          await db.update(users).set({
            username: ident.username,
            displayName: ident.displayName,
            avatar: ident.avatar,
            accessToken: account.access_token ?? null,
          }).where(eq(users.id, ident.id));
        }
        return true;
      } catch (error) {
        console.error("signIn error", error);
        return false;
      }
    },
    async jwt({ token, account, profile, user }) {
      if (account && user) {
        const ident = identity(user, profile);
        token.twitterId = ident.id;
        token.username = ident.username;
        token.sub = ident.id;
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
