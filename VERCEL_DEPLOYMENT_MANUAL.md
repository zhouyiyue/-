# Vercel 部署说明 - 修复后

## ⚠️ 重要：Root Directory 手动配置

由于项目是 monorepo 结构，Vercel 需要明确指定实际的应用目录。

## 📋 部署步骤

### 1. 推送到 GitHub

```bash
cd d:\自建\武\大创-台风预测\可视化平台

git add .
git commit -m "Fix vercel.json schema validation"
git push -u origin main
```

### 2. 在 Vercel 中导入项目

1. 访问 https://vercel.com
2. 点击 "Add New Project"
3. 连接你的 GitHub 账户并选择仓库

### 3. 🔴 **关键步骤：设置 Root Directory**

在 Vercel 部署配置页面中：

```
Framework Preset: Next.js ✓ (自动检测)
Root Directory: dc_visualization  ← 必须设置为这个！
Build Command: npm run build
Output Directory: (留空)
Install Command: npm install
```

**务必**将 "Root Directory" 设置为 `dc_visualization`，否则会显示 404。

### 4. 点击 "Deploy"

等待部署完成。

## ✅ 验证部署成功

部署后访问你的 Vercel URL，应该看到：
- ✓ 主页正常加载（不是 404）
- ✓ 页面标题："台风杜苏芮微博舆情分析大屏"
- ✓ 大屏显示数据
- ✓ 浏览器控制台无错误

## 🔍 如果仍然显示 404

检查 Vercel 仪表板：
1. 查看 "Settings" → "General"
2. 确认 "Root Directory" 确实设置为 `dc_visualization`
3. 如果需要修改，点击 "Edit" 后更新 Root Directory
4. 在 "Deployments" 中点击 "Redeploy" 进行重新部署
