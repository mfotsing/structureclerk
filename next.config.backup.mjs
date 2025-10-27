/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "localhost",
      "avatars.githubusercontent.com",
      "lh3.googleusercontent.com",
      "images.unsplash.com",
      "api.dicebear.com",
    ],
    formats: ["image/webp", "image/avif"],
  },
};

export default nextConfig;