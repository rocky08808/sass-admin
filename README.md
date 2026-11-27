# SaaS Admin Platform (AI-Native Harness Engineering)

基于 **React 19 + TypeScript + Ant Design v5** 构建的 SaaS 后台管理系统，内置完整的 **Harness Engineering（AI 工程护栏与脚手架体系）**，原生兼容 **Claude Code** 与 **Codex CLI** 协同开发。

---

## 核心特性

1. **双 AI Agent 兼容的 Harness 体系**：
   - 采用单一事实来源（Single Source of Truth），通过 `AGENTS.md` 统一约束架构、组件复用与代码规范，`CLAUDE.md` 无缝衔接 Claude Code 工作流。
   - 内置 `/add-module` 标准化指令，实现新 CRUD 业务模块的秒级高质量扩展。
2. **高复用企业级公共组件**：
   - `CrudTable`：基于 Ant Design `Table` 封装，统一集成关键词搜索、分页、Loading 骨架与标准化的编辑/删除（`Popconfirm`）操作列。
   - `CrudFormDrawer`：基于 Ant Design `Drawer` + `Form` 封装，统一处理表单回显、校验与异步提交状态。
3. **契约驱动的前后端并行协作**：
   - 使用 `Zod` (`src/schemas/`) 作为前后端共享的数据契约与类型真值来源。
   - 集成 **MSW (Mock Service Worker)**，在浏览器端拦截真实 HTTP 请求并提供带内存状态的完整 CRUD 模拟，后端就绪后业务代码无需改动即可切换。
4. **自动化质量门禁 (`npm run verify`)**：
   - 集成 TypeScript 严格类型检查、Biome 极速 Lint/格式化、以及 Vitest + Testing Library 集成测试。

---

## 技术栈

- **核心框架**：React 19, TypeScript (Strict Mode), Vite
- **UI 组件库**：Ant Design v5 (`antd`, `@ant-design/icons`)
- **状态与请求**：TanStack Query (`@tanstack/react-query`)
- **契约与校验**：Zod
- **接口 Mock**：MSW (Mock Service Worker)
- **工程化与测试**：Biome, Vitest, React Testing Library, jsdom

---

## 快速开始

需要 Node.js 22.12 或更高版本。

### 1. 安装依赖
```bash
npm install
```

### 2. 启动开发服务器（自带 MSW Mock 后端）
```bash
npm run dev
```
启动后访问 `http://localhost:5173`，系统默认包含三个完整的业务模块：
- **租户管理 (`/tenants`)**：支持租户的查询、新增、编辑、状态切换与删除。
- **订阅套餐 (`/subscriptions`)**：支持计费周期、价格、席位上限的完整 CRUD 管理。
- **成员管理 (`/members`)**：支持成员的查询、新增、编辑、角色与状态管理及删除。

### 3. 运行全量质量门禁（Harness 验收）
```bash
npm run verify
```
该命令会依次执行：
1. `npm run typecheck`：TypeScript 静态类型检查
2. `npm run lint`：Biome 代码规范与格式校验（带 `--write`，会自动改写 `src` 中可修复的问题）
3. `npm run test`：Vitest 自动化集成测试

---

## 目录结构

```text
├── AGENTS.md                  # [Harness] 跨 Agent（Codex / Claude Code）通用开发宪法
├── CLAUDE.md                  # [Harness] Claude Code 入口指令（引用 AGENTS.md）
├── .claude/commands/          # [Harness] Claude Code 自定义斜杠命令
│   └── add-module.md          # 一键生成标准 CRUD 业务模块的 SOP
├── biome.json                 # [Harness] 统一代码规范与格式配置
└── src/
    ├── schemas/               # [契约层] Zod Schema 定义与 TS 类型导出
    ├── mocks/                 # [Mock层] MSW 内存数据库 (db.ts) 与路由拦截 (handlers.ts)
    ├── components/shared/     # [公共组件] CrudTable.tsx & CrudFormDrawer.tsx
    ├── features/              # [业务层] 按领域隔离的业务模块
    │   ├── tenants/           # 租户管理模块
    │   ├── subscriptions/     # 订阅套餐模块
    │   └── members/           # 成员管理模块
    ├── lib/                   # 通用工具 (请求封装 / 表单校验 / CRUD 页面状态)
    ├── test/                  # Vitest 环境垫片 (matchMedia / ResizeObserver)
    ├── App.tsx                # 路由与 Ant Design 全局布局
    ├── AppProviders.tsx       # React Query 与 Ant Design 全局配置 (中文语言包)
    └── main.tsx               # 应用入口（启动 MSW 后挂载 React）
```

---

## AI 协同开发指南 (Harness Workflow)

### 使用 Claude Code 快速新增业务模块
在项目根目录启动 `claude`，直接使用内置斜杠命令：
```text
/add-module roles
```
Claude Code 将自动遵循 `AGENTS.md` 完成 Schema 定义、MSW 接口模拟、复用 `CrudTable`/`CrudFormDrawer` 构建页面、注册路由并编写集成测试，最后自动运行 `npm run verify` 确保全绿交付。

### 使用 Codex CLI 协同开发
在项目根目录启动 `codex`，Codex 会自动读取 `AGENTS.md` 约束。例如补充边界测试或重构逻辑：
```text
Read AGENTS.md. Add edge-case unit tests for subscriptions validation and run npm run verify.
```

---

## 前后端联调切换

1. 所有接口数据结构均定义在 `src/schemas/*.schema.ts`，可直接作为前后端接口文档对齐。
2. 当真实后端 API 就绪后，只需在 `src/main.tsx` 中关闭 MSW 启动逻辑，并在 `vite.config.ts` 中配置 `server.proxy` 指向真实后端地址即可切换，业务代码无需改动。
