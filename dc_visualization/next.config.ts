import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 生产优化
  productionBrowserSourceMaps: false,
  reactStrictMode: true,
  staticPageGenerationTimeout: 20,

  // 改为静态导出模式
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

  // Turbopack 配置
  turbopack: {
    resolveAlias: {
      // 避免重复引入
      'echarts': 'echarts',
    },
  },

  // webpack 配置优化
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              priority: 10,
              reuseExistingChunk: true,
            },
            common: {
              minChunks: 2,
              priority: 5,
              reuseExistingChunk: true,
            },
          },
        },
      };

      // 禁用性能警告
      config.performance = {
        maxEntrypointSize: 512000,
        maxAssetSize: 512000,
      };
    }

    return config;
  },
};

export default nextConfig;
