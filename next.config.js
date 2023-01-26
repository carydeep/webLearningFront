/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    URL_API: "https://web-learning-back.vercel.app",
    // URL_API: "http://localhost:6969",
  },
}

module.exports = nextConfig
