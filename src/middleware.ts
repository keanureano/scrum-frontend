import { withAuth } from "next-auth/middleware";

enum Role {
  USER = "USER",
  INACTIVE = "INACTIVE",
  ADMIN = "ADMIN",
}

interface Token {
  roles: Role[];
}
export const config = {
  matcher: ["/((?!api/auth|auth|_next/static|_next/image|favicon.ico).*)"],
};

export default withAuth(function middleware() { }, {
  callbacks: {
    authorized: ({ req, token }) => {

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
