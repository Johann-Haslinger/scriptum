import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;

const withPWA = require("next-pwa")({
  dest: "public", // Hier werden die Service Worker Files abgelegt
  register: true,
  skipWaiting: true,
});

module.exports = withPWA({
  // weitere Next.js configs
});
