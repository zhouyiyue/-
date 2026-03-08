# Vercel 部署指南

## 部署前检查清单

### ✅ 已完成的准备工作

1. **数据文件配置**
   - CSV 数据文件已正确放置在 `public/data/` 目录
   - 路径: `public/data/政务合并榜补全_杜苏芮_微博匹配.csv`

2. **静态文件优化**
   - 所有资源都在 `public/` 目录中
   - 图像已设置为未优化状态 (适合Vercel Edge)

3. **环境配置**
   - `next.config.ts` 已优化用于Vercel部署
   - `vercel.json` 已配置缓存策略

4. **构建配置**
   - TypeScript 配置正确
   - 所有依赖都在 `dc_visualization/package.json` 中

## 部署步骤

### 使用 Git 部署

整个仓库已经通过根 `package.json` 和根级 `vercel.json` 指定了子目录 `dc_visualization` 为实际的应用根，因此你可以在仓库根上执行以下命令：

```bash
# 1. 进入项目根目录
cd .

# 2. 初始化 git（如果尚未初始化）
git init

# 3. 添加所有文件
git add .

# 4. 提交
git commit -m "准备部署到 Vercel"

# 5. 添加远程仓库
git remote add origin https://github.com/<你的用户名>/<仓库名>.git

# 6. 推送到 main 分支
git branch -M main
git push -u origin main
```

### 连接 Vercel

1. 访问 https://vercel.com
2. 登录或注册账户
3. 点击 "Add New Project"
4. 选择你的 GitHub 仓库
5. Vercel 会自动检测到根 `vercel.json`，不需要额外设置 Root Directory
   > 如果仍然提示，请确保 "Root Directory" 为空或为仓库根。
6. 点击 "Deploy"

## 故障排除

### 404 错误排查

**问题: 访问页面时出现 404**

解决方案:
```bash
# 检查数据文件是否存在
ls -la public/data/

# 确保文件名正确（注意中文字符）
# 预期文件: 政务合并榜补全_杜苏芮_微博匹配.csv
```

### 数据加载失败

**问题: CSV 数据无法加载**

- 检查 `public/data/` 中的文件权限
- 确认文件编码为 UTF-8
- 验证 CSV 文件格式正确

### 部署超时

**问题: 构建过程超时**

- 增加 Vercel 超时时间到 60 秒
- 检查是否有大型依赖包需要优化

## 生产优化建议

1. **启用缓存**
   - 静态资源已配置 1 年缓存期限
   - API 响应应考虑添加缓存头

2. **性能监控**
   - 使用 Vercel Analytics 监控性能
   - 定期检查核心网页活力指标

3. **日志查看**
   - 在 Vercel 仪表板查看实时日志
   - 使用 `vercel logs` 命令行工具

## 必需文件清单

- ✅ `public/data/政务合并榜补全_杜苏芮_微博匹配.csv`
- ✅ `next.config.ts` (已优化)
- ✅ `vercel.json` (已配置)
- ✅ `package.json` (所有依赖已列出)
- ✅ `tsconfig.json`
- ✅ `app/layout.tsx` (已更新)
- ✅ `app/page.tsx`

## 常见问题

**Q: 为什么数据不显示?**
A: 检查浏览器开发者工具的 Network 标签，确保 CSV 文件能够成功加载。

**Q: 部署后样式不显示?**
A: 清除浏览器缓存并进行硬刷新 (Ctrl+Shift+R)。

**Q: 如何更新数据?**
A: 更新 `public/data/` 中的 CSV 文件，推送到 GitHub，Vercel 将自动重新部署。

---

若遇到问题，请检查 Vercel 仪表板中的构建日志获取详细错误信息。
