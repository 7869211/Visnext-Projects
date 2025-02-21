/** @type {import('next').NextConfig} */
import 'dotenv/config';

const nextConfig = {
  reactStrictMode: true,
  env: {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    ELEVENLABS_API_KEY: process.env.ELEVENLABS_API_KEY,
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack'],
    });

    return config;
  },
  images: {
    domains: ["cloudflare-ipfs.com", "avatars.githubusercontent.com"], // For fuzz-testing
  },
};

export default nextConfig;
