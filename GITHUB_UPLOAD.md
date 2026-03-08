# 将本项目上传到 GitHub

按下面步骤在本地执行（需已安装 [Git](https://git-scm.com/download/win)）。

## 1. 打开终端

在项目根目录 `可视化平台` 下打开 **PowerShell** 或 **Git Bash**。

## 2. 初始化仓库并提交

```bash
# 进入项目根目录（请按你的实际路径修改）
cd "d:\自建\武\大创-台风预测\可视化平台"

# 若尚未初始化 Git
git init

# 添加所有文件（.gitignore 已排除 node_modules、.next 等）
git add .

# 首次提交
git commit -m "feat: 台风杜苏芮微博舆情分析大屏"
```

## 3. 关联你的 GitHub 仓库并推送

**请把下面的 `你的用户名/你的仓库名` 换成你自己的 GitHub 仓库地址。**

```bash
# 添加远程仓库（HTTPS 示例）
git remote add origin https://github.com/你的用户名/你的仓库名.git

# 若仓库已存在且已有 main 分支，可直接推送
git branch -M main
git push -u origin main
```

若使用 **SSH**：

```bash
git remote add origin git@github.com:你的用户名/你的仓库名.git
git branch -M main
git push -u origin main
```

## 4. 若 GitHub 上已存在该仓库且已有提交

先拉再推，避免覆盖远程历史：

```bash
git pull origin main --rebase
git push -u origin main
```

## 5. 若本机未安装 Git

1. 打开 https://git-scm.com/download/win 下载并安装 Git。
2. 安装时勾选 “Add Git to PATH”。
3. 重新打开终端，再执行上述命令。

---

**说明**：根目录和 `dc_visualization/` 下的 `node_modules`、`dc_visualization/.next` 已写在 `.gitignore` 中，不会被提交；`data/` 下的 CSV 会随项目一起上传。若 CSV 体积过大，可在 `.gitignore` 中取消注释 `data/*.csv` 再提交。
