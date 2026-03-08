// Vercel 函数配置
import { join } from 'path';

export const config = {
  runtime: 'nodejs18.x',
};

export default function handler(req, res) {
  // 所有请求重定向到 Next.js 渲染
  res.status(200).json({ message: 'Vercel deployment configured' });
}
