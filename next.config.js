/** @type {import('next').NextConfig} */

const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/logout",
        destination: "/api/auth/signOut",
      },
    ];
  },
};

module.exports = nextConfig;
