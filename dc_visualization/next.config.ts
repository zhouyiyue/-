import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* 开启静态导出模式，这是离线运行的关键 */
  output: 'export', 
  
  /* 离线环境下必须禁用图片优化功能 */
  images: {
    unoptimized: true,
  },

  /* 建议开启，确保在本地服务器访问时路径解析更准确 */
  trailingSlash: true, 
};

export default nextConfig;
