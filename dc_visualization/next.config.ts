import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 成效优化 - 移除 standalone 模式以避免部署问题
  productionBrowserSourceMaps: false,

  // 优化构建速度 - 减少静态生成超时
  reactStrictMode: true,
  staticPageGenerationTimeout: 30, // 从 60 减少到 30

  // 改为静态导出模式，避免数据加载卡住
  output: 'export',
  trailingSlash: true,

  // 优化图像 - 完全禁用图像处理
  images: {
    unoptimized: true,
    disableStaticImages: true,
  },

  // 优化包大小
  compress: true,
  poweredByHeader: false,

  // Turbopack 配置 - 简化配置
  turbopack: {},

  // TypeScript 配置 - 简化
  typescript: {
    tsconfigPath: "./tsconfig.json",
  },

  // 禁用实验性功能以避免构建问题
  experimental: {
    // 禁用可能导致卡住的功能
  },

  // 优化构建性能
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // 客户端构建优化
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
            },
          },
        },
      };
    }
    return config;
  },
};

export default nextConfig;
