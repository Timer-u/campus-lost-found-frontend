# 校园失物招领平台前端

> **归档说明**：本仓库为 2026 年「精弘网络试用期大作业」的前端交付成果，已通过验收。演示环境与自动化部署流水线均已停用，仓库以归档（Archived）形式保留，仅作记录，不再维护。

校园失物招领系统前端：学生可发布失物/招领信息并提交认领申请，管理员完成物品审核、认领处理与数据统计。配套后端见 [campus-lost-found-backend](https://github.com/Timer-u/campus-lost-found-backend)。

## 技术栈

Vue 3 · TypeScript · Vite · Vue Router · Pinia · Element Plus · ECharts · Axios

## 本地运行

```bash
npm install
npm run dev
```

- 接口基地址通过 `VITE_API_BASE_URL` 配置，默认 `/api/v1`
- 开发环境由 Vite 代理将 `/api` 转发到 `http://localhost:8080`

## 构建

```bash
npm run build
```
