/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  publicRuntimeConfig: {
    apiHost: process.env.API_HOST,
  },
};

module.exports = nextConfig
