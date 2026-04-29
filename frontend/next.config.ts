import type { NextConfig } from "next";

const STRAPI_INTERNAL = process.env.STRAPI_URL || "http://strapi:1337";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "1337",
        pathname: "/uploads/**",
      },
      {
        protocol: "http",
        hostname: "strapi",
        port: "1337",
        pathname: "/uploads/**",
      },
    ],
  },
  async rewrites() {
    return [
      // Proxy Strapi admin panel through the frontend
      { source: "/admin", destination: `${STRAPI_INTERNAL}/admin` },
      { source: "/admin/:path*", destination: `${STRAPI_INTERNAL}/admin/:path*` },
      // Strapi API + uploads used by admin
      { source: "/content-manager/:path*", destination: `${STRAPI_INTERNAL}/content-manager/:path*` },
      { source: "/upload/:path*", destination: `${STRAPI_INTERNAL}/upload/:path*` },
      { source: "/uploads/:path*", destination: `${STRAPI_INTERNAL}/uploads/:path*` },
      { source: "/content-type-builder/:path*", destination: `${STRAPI_INTERNAL}/content-type-builder/:path*` },
      { source: "/i18n/:path*", destination: `${STRAPI_INTERNAL}/i18n/:path*` },
      { source: "/users-permissions/:path*", destination: `${STRAPI_INTERNAL}/users-permissions/:path*` },
      { source: "/_health", destination: `${STRAPI_INTERNAL}/_health` },
    ];
  },
};

export default nextConfig;
