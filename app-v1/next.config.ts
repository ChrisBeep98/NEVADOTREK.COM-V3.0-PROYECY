import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",  // Genera archivos HTML estáticos (necesario para GitHub Pages)
  images: {
    unoptimized: true, // Desactiva la optimización de imágenes que requiere servidor
  },
  basePath: "/NEVADOTREKV3.0", // Nombre de tu repositorio para cargar assets correctamente
  assetPrefix: "/NEVADOTREKV3.0/", // Prefijo para los assets
};

export default nextConfig;
