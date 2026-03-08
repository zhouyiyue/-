# 404 问题诊断指南

## 如果部署后显示 404

按以下步骤排查问题：

### 第一步：检查 Vercel 仪表板

1. 登录 Vercel
2. 选择你的项目
3. 查看 "Deployments" 标签
4. 点击最新的部署查看日志
5. 查看 "Build" 和 "Runtime" 日志中是否有错误

### 第二步：验证部署配置

在 Vercel 项目设置中检查：

- ✓ **Framework Preset**: 应为 "Next.js"
- ✓ **Root Directory**: 应为 `dc_visualization`
- ✓ **Build Command**: 应为 `next build` 或空（自动）
- ✓ **Output Directory**: 应为空（自动）
- ✓ **Install Command**: 应为空（自动）

### 第三步：检查文件是否存在

在项目的 Vercel 部署中查看文件：

```
需要存在的文件：
✓ public/data/政务合并榜补全_杜苏芮_微博匹配.csv
✓ .next/server/app/page.js
✓ .next/server/app/layout.js
✓ public/favicon.ico
```

### 第四步：浏览器开发者工具检查

打开浏览器开发者工具 (F12)：

**Network 标签：**
- 检查主请求的状态码
- 应为 200 或 304
- 如果是 404，说明路由配置有问题

**Console 标签：**
- 查看是否有 JavaScript 错误
- 检查 CSV 数据是否加载成功

**Elements 标签：**
- 检查 HTML 结构是否正常渲染
- 确认样式是否加载

### 第五步：常见 404 原因

| 问题描述 | 可能原因 | 解决方案 |
|---------|--------|--------|
| 主页(/)显示404 | Root Directory 设置错误 | 设置为 `dc_visualization` |
| | app/page.tsx 不存在 | 检查文件是否在根目录 |
| | 构建失败 | 查看构建日志中的错误 |
| 数据无法加载 | CSV 文件路径错误 | 确保在 `public/data/` 中 |
| | 文件名不匹配 | 文件名需要完全相同(含中文) |
| 样式显示异常 | CSS 文件加载失败 | 清除缓存并刷新(Ctrl+Shift+R) |
| 组件报错 | 模块导入错误 | 检查构建日志中的错误信息 |

## 快速测试清单

### 本地验证（部署前）

```bash
# 1. 进入目录
cd dc_visualization

# 2. 清理并重新安装
rm -r node_modules .next
npm install

# 3. 构建测试
npm run build
# ✓ 应该看到 "Compiled successfully"

# 4. 启动生产服务器
npm start
# 然后访问 http://localhost:3000
# ✓ 页面应该正常加载
```

### Vercel 部署验证（部署后）

1. **访问主页**
   - URL: `https://你的-app-名字.vercel.app`
   - 预期: 看到大屏页面

2. **检查数据加载**
   - 打开浏览器控制台
   - 查看 Network 标签中的 CSV 文件
   - 预期: 状态码为 200

3. **验证功能**
   - 实时时间应该更新
   - 图表应该显示数据
   - 没有红色错误信息

## 如果问题持续存在

### 1. 收集诊断信息

```
记录以下信息：
- Vercel 项目名称
- 你的 GitHub 仓库 URL
- 部署时间
- 错误消息（如有）
```

### 2. 检查 Vercel 限制

- ✓ 超时设置是否足够？
- ✓ 内存是否充足？
- ✓ 并发连接数是否正常？

### 3. 重新部署

```bash
# 在本地
git add .
git commit -m "Troubleshooting deployment"
git push

# 然后在 Vercel 重新部署
# Vercel 应该自动触发重新部署
```

## 成功信号

部署成功时你应该看到：

✅ Vercel 仪表板显示 "✓ Production"  
✅ 可以访问 `https://你的-app.vercel.app`  
✅ 页面加载无错误  
✅ 数据图表显示  
✅ 浏览器控制台无错误消息  

## 需要帮助？

1. 检查 [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) 获取详细信息
2. 查看 [DEPLOYMENT_STATUS.md](./DEPLOYMENT_STATUS.md) 了解配置细节
3. 访问 https://vercel.com/docs 查看官方文档
