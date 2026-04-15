/** @type {import('next').NextConfig} */
const nextConfig = {
  // @cloudflare/next-on-pages requires standalone output, not export, to process SSR pages properly
  // output: 'export',
};

export default nextConfig;