import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',       // Esto convierte tu proyecto en archivos HTML/CSS/JS puros
  images: { 
    unoptimized: true     // Necesario porque el optimizador de imágenes de Next requiere un servidor Node.js
  },
};

export default nextConfig;