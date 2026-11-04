/** @type {import('next').NextConfig} */
const rawApiProxyTarget = process.env.API_PROXY_TARGET?.trim();
const apiProxyTarget = rawApiProxyTarget?.replace(/\/+$/, "");

if (process.env.NODE_ENV === "production" && !apiProxyTarget) {
  throw new Error(
    "API_PROXY_TARGET is required for production builds so /api/* can be proxied same-origin."
  );
}

const nextConfig = {
  /* config options here */
  experimental: {
    agentFeedback: true,
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  // Proxy browser API calls through the frontend origin. Better Auth's OAuth
  // state cookie must be first-party for browsers that block third-party
  // cookies; keeping /api/* same-origin is what makes that possible.
  async rewrites() {
    if (!apiProxyTarget) return [];

    return [
      {
        source: "/api/:path*",
        destination: `${apiProxyTarget}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
