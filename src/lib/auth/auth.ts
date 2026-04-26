import { eq } from "drizzle-orm";
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { getDb } from "@/lib/db";
import { env } from "@/lib/env";
import { users } from "@/lib/schemas";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
    async signIn({ user }) {
      if (user.email) {
        const db = await getDb();
        const existing = await db
          .select()
          .from(users)
          .where(eq(users.email, user.email))
          .limit(1);

        if (existing.length === 0) {
          await db.insert(users).values({
            email: user.email,
            name: user.name,
            image: user.image,
            googleId: user.id,
          });
        }
      }
      return true;
    },
  },
  pages: {
    signIn: "/login",
  },
});

export async function getServerAuthContext() {
  const session = await auth();
  if (!session?.user?.id) {
    return { session: null, user: null };
  }

  const db = getDb();
  const user = await db
    .select()
    .from(users)
    .where(eq(users.googleId, session.user.id))
    .limit(1)
    .then((rows) => rows[0] || null);

  return { session, user };
}
