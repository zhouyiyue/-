import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 生产优化
  productionBrowserSourceMaps: false,
  reactStrictMode: true,
  staticPageGenerationTimeout: 60, // 增加超时时间

  // 完全禁用静态生成，使用客户端渲染
  output: 'export',
  trailingSlash: true,

  // 图像优化
  images: {
    unoptimized: true,
    disableStaticImages: true,
  },

  // 包大小优化
  compress: true,
  poweredByHeader: false,

  // TypeScript 配置
  typescript: {
    tsconfigPath: "./tsconfig.json",
    ignoreBuildErrors: false,
  },

  // Turbopack 配置 - 简化配置
  turbopack: {},

  // 移除 webpack 配置，使用 Turbopack 默认优化
};

export default nextConfig;
