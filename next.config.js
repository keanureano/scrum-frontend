/** @type {import('next').NextConfig} */

const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/auth/logout",
        destination: "/api/auth/signout",
      },
    ];
  },
};

module.exports = nextConfig;
