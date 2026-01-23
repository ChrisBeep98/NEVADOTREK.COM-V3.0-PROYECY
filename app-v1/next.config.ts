import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true, // Necesario para GitHub Pages estático
  },
  // Al usar un dominio personalizado (nevadotrek.com), 
  // NO necesitamos basePath ni assetPrefix. La raíz es '/'.
  basePath: "",
  assetPrefix: "",
  trailingSlash: true, // Recomendado para exportaciones estáticas para evitar problemas de rutas
};

export default nextConfig;