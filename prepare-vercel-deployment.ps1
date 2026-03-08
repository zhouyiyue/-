#!/usr/bin/env pwsh
# Vercel 部署准备脚本

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Vercel 部署前检查和准备" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

$ErrorActionPreference = "Stop"

# 检查必需的文件
Write-Host "`n检查必需文件..." -ForegroundColor Yellow

$requiredFiles = @(
    "dc_visualization/package.json",
    "dc_visualization/next.config.ts",
    "dc_visualization/vercel.json",
    "dc_visualization/app/page.tsx",
    "dc_visualization/app/layout.tsx",
    "dc_visualization/public/data/政务合并榜补全_杜苏芮_微博匹配.csv"
)

foreach ($file in $requiredFiles) {
    if (Test-Path $file) {
        Write-Host "  ✓ $file" -ForegroundColor Green
    } else {
        Write-Host "  ✗ 缺失: $file" -ForegroundColor Red
        exit 1
    }
}

# 检查并清理 node_modules 和构建产物（可选）
Write-Host "`n可选清理操作..." -ForegroundColor Yellow

Read-Host "是否要清理根目录中的 node_modules? (Enter 继续, Ctrl+C 跳过)"
if (Test-Path "./node_modules") {
    Remove-Item "./node_modules" -Recurse -Force
    Write-Host "  ✓ 已清理根目录 node_modules" -ForegroundColor Green
}

# 验证 dc_visualization 的构建
Write-Host "`n验证项目构建..." -ForegroundColor Yellow
Push-Location "dc_visualization"

if (Test-Path "node_modules") {
    Write-Host "  npm 依赖已安装" -ForegroundColor Green
} else {
    Write-Host "  安装依赖中..." -ForegroundColor Yellow
    npm install
}

Write-Host "  构建项目中..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -eq 0) {
    Write-Host "  ✓ 构建成功" -ForegroundColor Green
} else {
    Write-Host "  ✗ 构建失败" -ForegroundColor Red
    Pop-Location
    exit 1
}

Pop-Location

# 最终检查
Write-Host "`n部署准备完成!" -ForegroundColor Green
Write-Host "`n下一步:" -ForegroundColor Cyan
Write-Host "  1. 推送到 GitHub"
Write-Host "     git add ."
Write-Host "     git commit -m '准备 Vercel 部署'"
Write-Host "     git push -u origin main"
Write-Host "`n  2. 在 Vercel UI 中:"
Write-Host "     - 连接 GitHub 账户"
Write-Host "     - 导入项目"
Write-Host "     - 设置 Root Directory 为 'dc_visualization'"
Write-Host "     - 点击 Deploy"
Write-Host "`n  3. 部署后检查:"
Write-Host "     - 访问网站确认页面加载"
Write-Host "     - 检查浏览器控制台是否有错误"
Write-Host "     - 验证数据是否正确显示"
