import NextAuth, { AuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import jwt, { JwtPayload } from "jsonwebtoken";

const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const LOGIN_URL = `${process.env.BACKEND_URL}/auth/login`;

        const res = await fetch(LOGIN_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(credentials),
        });

        if (!res.ok || res.status === 403) {
          return null;
        }

        const jwtPayload = jwt.decode((await res.json()).token) as JwtPayload;

        const user = {
          id: jwtPayload.sub,
          roles: jwtPayload.roles,
        } as User;

        return user;
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      session.user = token;
      return session;
    },

    async jwt({ token, user }) {
      return { ...token, ...user };
    },
  },
  session: {
    strategy: "jwt",
  },
  theme: {
    colorScheme: "light", // "auto" | "dark" | "light"
    brandColor: "", // Hex color code
    logo: "", // Absolute URL to image
    buttonText: "", // Hex color code
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
