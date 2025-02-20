/** @type {import('next').NextConfig} */

const nextConfig = {
  experimental: {
    runtime: 'nodejs', // Force Node.js runtime instead of Edge
  },
};
module.exports = nextConfig;
