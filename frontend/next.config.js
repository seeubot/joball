/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://gastric-stormi-seeutech-acc3c2d6.koyeb.app'
  }
}

module.exports = nextConfig
