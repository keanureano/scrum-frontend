import { AuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import jwt, { JwtPayload } from "jsonwebtoken";
import axios from "axios";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const LOGIN_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`;
        try {
          const res = await axios.post(LOGIN_URL, credentials);
          const jwtToken = res.data.token;
          const jwtPayload = jwt.decode(jwtToken) as JwtPayload;
          const user = {
            id: jwtPayload.sub,
            roles: jwtPayload.roles,
            token: jwtToken,
          } as User;
          return user;
        } catch (error) {
          return null;
        }
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
  pages: {
    signIn: "/auth/signIn",
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
