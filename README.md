# Vue3 CI Demo

一个 Vue3 + Vite 的最小 DevOps 演示项目。

## DevOps 和 CI 是什么

- DevOps：开发（Dev）与运维（Ops）协作的方法论，核心目标是通过自动化缩短从开发到上线的周期。
- CI（持续集成）：每次代码提交后，自动执行安装依赖、构建、测试，尽早发现问题。

## 当前实现

- 本地开发调试：`npm run dev`
- 本地构建：`npm run build`
- 单元测试：`npm run test`
- GitHub Actions：
  - 触发条件：`push` 到 `master`、`pull_request` 到 `master`
  - CI 阶段：`npm ci` -> `npm run test` -> `npm run build`
  - CD 阶段：仅在 `push master` 时自动部署到 GitHub Pages（免费测试环境）

工作流文件：

- `.github/workflows/ci-cd.yml`

## 本地运行

```bash
npm install
npm run dev
```

Windows PowerShell 如果执行策略阻止 `npm`，可用：

```powershell
npm.cmd run dev
```

## 启用 GitHub Pages 自动部署

1. 推送代码到 `master` 分支。
2. 打开仓库 Settings -> Pages。
3. Build and deployment 的 Source 选择 `GitHub Actions`。
4. 等待 Actions 中 `CI and Deploy` 工作流执行完成。
5. 测试环境地址会出现在 workflow 的 deploy job 输出中。
