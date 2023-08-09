import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import jwt from "jsonwebtoken";

const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        // Call your Spring Boot login API here
        const res = await fetch("http://localhost:8080/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(credentials),
        });

        const { token } = await res.json();
        const decodedToken = jwt.decode(token);

        if (!res.ok || !decodedToken?.sub) {
          return Promise.resolve(null);
        }

        return Promise.resolve({
          id: decodedToken.sub,
          email: decodedToken.sub,
        }) as any;
      },
    }),
  ],
  callbacks: {
    async session({ session, user, token }) {
      // console.log("----------------");
      // console.log("[SESSION CALLED]");
      // console.log("SESSION:", session);
      // console.log("USER:", user);
      // console.log("TOKEN:", token);
      // console.log("----------------");
      return session;
    },

    async jwt({ token, user, account, profile }) {
      // console.log("----------------");
      // console.log("[JWT CALLED]");
      // console.log("TOKEN:", token);
      // console.log("USER:", user);
      // console.log("ACCOUNT:", account);
      // console.log("PROFILE:", profile);
      // console.log("----------------");
      return token;
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
