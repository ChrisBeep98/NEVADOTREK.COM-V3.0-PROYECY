import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === 'production';
const repoName = "NEVADOTREK.COM-V3.0-PROYECY";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  // Solo aplicar basePath y assetPrefix en producción (GitHub Pages)
  basePath: isProd ? `/${repoName}` : "",
  assetPrefix: isProd ? `/${repoName}/` : "",
};

export default nextConfig;
