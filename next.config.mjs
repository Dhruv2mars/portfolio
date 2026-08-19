/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "github.com" },
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
    ],
  },
  async redirects() {
    return [
      { source: "/writings", destination: "/blog", permanent: true },
      { source: "/writings/:slug", destination: "/blog/:slug", permanent: true },
    ];
  },
};

export default nextConfig;
