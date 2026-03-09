/** @type {import('next').NextConfig} */
const nextConfig = {
  // 核心：根据环境切换导出模式
  output: process.env.VERCEL === '1' ? undefined : 'export',
  
  trailingSlash: true,

  // 生产环境基础优化
  productionBrowserSourceMaps: false,
  reactStrictMode: true,
  staticPageGenerationTimeout: 120,

  // 图像处理
  images: {
    unoptimized: true,
  },

  // 忽略构建时的校验错误
  typescript: {
    ignoreBuildErrors: true,
  },
  
  eslint: {
    ignoreDuringBuilds: true,
  },

  // 其他优化
  compress: true,
  poweredByHeader: false,
};

export default nextConfig;