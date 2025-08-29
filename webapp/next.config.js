/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: false
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: false
  },
  env: {
    GITHUB_TOKEN: process.env.GITHUB_TOKEN,
    AUDIT_BOT_TOKEN: process.env.AUDIT_BOT_TOKEN
  },
  async rewrites() {
    return [
      {
        source: '/api/socket',
        destination: '/api/socket'
      }
    ]
  }
}

module.exports = nextConfig
