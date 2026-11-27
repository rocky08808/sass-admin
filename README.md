# SaaS Admin

React 19 + TypeScript + Vite + Ant Design v5 管理后台。数据由 MSW 模拟，刷新页面后恢复初始值。

需要 Node.js 22.12 或更高版本。

```bash
npm install
npm run dev      # 本地开发
npm run verify   # 类型检查 + Biome + 测试（lint 步骤会自动改写 src 中的文件）
npm run build    # 生产构建
```

开发规则见 `AGENTS.md`。目前没有真实后端，生产构建中同样启用 MSW。
