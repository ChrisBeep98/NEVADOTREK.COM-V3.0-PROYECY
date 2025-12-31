import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",  // Genera archivos HTML estáticos (necesario para GitHub Pages)
  images: {
    unoptimized: true, // Desactiva la optimización de imágenes que requiere servidor
  },
  basePath: "/NEVADOTREK.COM-V3.0-PROYECY", // Nombre de tu repositorio para cargar assets correctamente
  assetPrefix: "/NEVADOTREK.COM-V3.0-PROYECY/", // Prefijo para los assets
};

export default nextConfig;
