import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 成效优化
  output: "standalone",  // 最小化输出文件
  productionBrowserSourceMaps: false,
  
  // 优化构建速度
  reactStrictMode: true,
  staticPageGenerationTimeout: 60,
  
  // 优化图像
  images: {
    unoptimized: true,  // 禁用 Next.js 图像优化（节省构建时间）
    disableStaticImages: true,
  },
  
  // 优化包大小
  compress: true,
  poweredByHeader: false,  // 移除 X-Powered-By 头
  
  // Turbopack 配置
  turbopack: {},
  
  // TypeScript 配置
  typescript: {
    tsconfigPath: "./tsconfig.json",
  },
};

export default nextConfig;
