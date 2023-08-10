import { withAuth } from "next-auth/middleware";

enum Role {
  USER = "USER",
  INACTIVE = "INACTIVE",
  ADMIN = "ADMIN",
}

interface Token {
  roles: Role[];
}

export default withAuth(function middleware() {}, {
  callbacks: {
    authorized: ({ req, token }) => {
      if (req.nextUrl.pathname.startsWith("/auth")||req.nextUrl.pathname.startsWith("/_next")) {
        return true;
      }

      const customToken = token as unknown as Token;

      if (!customToken) return false;

      if (customToken.roles.includes(Role.INACTIVE)) return false;

      if (!customToken.roles.includes(Role.USER)) return false;

      if (
        req.nextUrl.pathname.startsWith("/admin") &&
        !customToken.roles.includes(Role.ADMIN)
      )
        return false;

      return true;
    },
  },
});
