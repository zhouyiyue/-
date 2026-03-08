import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 优化生产构建
  productionBrowserSourceMaps: false,
  
  // 启用严格模式
  reactStrictMode: true,
  
  // 支持静态生成和增量静态再生成
  staticPageGenerationTimeout: 60,
  
  // 优化图像加载
  images: {
    unoptimized: true,
  },
  
  // Turbopack 配置
  turbopack: {},
};

export default nextConfig;
