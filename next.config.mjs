/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "images.pexels.com" },
      { protocol: "https", hostname: "*.tile.openstreetmap.org" },
    ],
  },
  // MapLibre ships its own workers; keep transpile clean.
  transpilePackages: ["maplibre-gl"],
};

export default nextConfig;
