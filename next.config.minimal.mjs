/** @type {import('next').NextConfig} */
const nextConfig = {
  // Désactiver toutes les fonctionnalités avancées
  experimental: {},
  images: {
    domains: [],
  },
  // Désactiver le middleware intégré
  skipMiddlewareUrlNormalize: true,
};

export default nextConfig;