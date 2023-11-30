/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
          source: '/',
          headers: [
              {
                "key": "Content-Security-Policy",
                "value": "default-src 'self' https: ; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; object-src 'none'"
              },
              {
                "key": "Strict-Transport-Security",
                "value": "max-age=2592000; includeSubDomains; preload"
              }
          ]
      }
    ]
  },  
  reactStrictMode: false,
    swcMinify: true,
    images: { unoptimized: true },
    trailingSlash: true,    
}

module.exports = nextConfig
