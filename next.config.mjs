/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      { source: "/writings", destination: "/blog", permanent: true },
      { source: "/writings/:slug", destination: "/blog/:slug", permanent: true },
    ];
  },
};

export default nextConfig;
