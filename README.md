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
2. `npm run lint`：Biome 只读代码规范与格式校验，不会改写源码
3. `npm run test`：Vitest 自动化集成测试
4. `npm run build`：类型检查与生产构建

CI 使用 `npm run verify:ci`（只检查、不改写，警告即失败），随后运行 `npm run smoke`，在浏览器中打开生产构建的每个页面。本地首次运行冒烟测试前需执行 `npx playwright install chromium`，并先 `npm run build`。

---

## 目录结构

```text
├── AGENTS.md                  # [Harness] 跨 Agent（Codex / Claude Code）通用开发宪法
├── CLAUDE.md                  # [Harness] Claude Code 入口指令（引用 AGENTS.md）
├── .claude/commands/          # [Harness] Claude Code 自定义斜杠命令
│   └── add-module.md          # 一键生成标准 CRUD 业务模块的 SOP
├── biome.json                 # [Harness] 统一代码规范与格式配置
└── src/
    ├── schemas/               # [契约层] Zod Schema、DTO、TS 类型及 API Contract
    ├── mocks/                 # [Mock 层] MSW 内存数据库 (db.ts) 与有状态路由 (handlers.ts)
    ├── components/shared/     # [公共组件] CrudTable、CrudFormDrawer、Mock 控制台等
    ├── features/              # [业务层] 按领域隔离的页面、请求与列配置
    │   ├── tenants/           # 租户管理模块
    │   ├── subscriptions/     # 订阅套餐模块
    │   └── members/           # 成员管理模块
    ├── lib/                   # 通用工具 (请求封装 / 表单校验 / CRUD 页面状态)
    ├── test/                  # Vitest 环境垫片及架构适应度测试
    ├── App.tsx                # 路由与 Ant Design 全局布局
    ├── AppProviders.tsx       # React Query 与 Ant Design 全局配置 (中文语言包)
    └── main.tsx               # 应用入口（启动 MSW 后挂载 React）
```

---

## 数据流与代码说明

一个标准业务模块遵循以下单向数据流：

```text
页面组件（Page）
  -> React Query Hooks（features/<module>/api.ts）
  -> HTTP 请求（lib/request.ts）
  -> Zod Schema 校验（schemas/<module>.model.schema.ts）
  -> 业务页面渲染（CrudTable / CrudFormDrawer）
```

各层职责如下：

- `src/schemas/<module>.model.schema.ts`：定义实体、创建/更新 DTO、Zod 校验规则与派生 TypeScript 类型。
- `src/schemas/<module>.schema.ts`：重导出模型与类型，并导出供接口文档弹窗使用的 `apiContract`。
- `src/features/<module>/api.ts`：唯一放置该模块 HTTP 请求与 React Query hooks 的位置。
- `src/features/<module>/<Module>Page.tsx`：组合公共表格、抽屉和业务表单字段，不直接调用接口。
- `src/features/<module>/columns.tsx`：定义列表列及操作相关展示逻辑。
- `src/mocks/db.ts` / `src/mocks/handlers.ts`：维护内存数据并实现完整、有状态的 GET/POST/PUT/DELETE Mock。
- `src/components/shared/`：跨业务模块复用的表格、表单抽屉、契约弹窗和 Mock 控制组件。

业务请求必须经过 `lib/request.ts` 的 Zod 校验。请求成功后会使用 Zod 将后端响应解析为确定的类型；响应结构不符合契约时会抛出异常，而不会静默传入页面。

### 列表与表单示例

新增或编辑页面统一使用公共组件：

```tsx
<CrudTable<Tenant>
  columns={tenantColumns}
  data={data}
  loading={isLoading}
  error={error}
  searchKeys={['name', 'domain']}
  onCreate={page.openCreate}
  onEdit={page.openEdit}
  onDelete={page.destroy}
/>

<CrudFormDrawer<CreateTenantDTO>
  open={page.open}
  title={page.editing ? '编辑租户' : '新建租户'}
  initialValues={page.editing ?? defaults}
  loading={save.isPending}
  onSubmit={page.submit}
  onClose={page.close}
>
  <TenantsFormFields />
</CrudFormDrawer>
```

React Query API 层示例：

```ts
const url = '/api/tenants';

export function useTenants() {
  return useQuery({
    queryKey: ['tenants'],
    queryFn: () => request(z.array(tenantSchema), url),
  });
}
```

完整参考可查看：

- 租户页面：[TenantsPage.tsx](src/features/tenants/TenantsPage.tsx)
- 租户请求：[api.ts](src/features/tenants/api.ts)
- 租户契约：[tenants.schema.ts](src/schemas/tenants.schema.ts)

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

## 新增业务模块流程

推荐使用 `/add-module <module-name>` 或手动按照以下顺序接入：

1. 在 `src/schemas/<module>.model.schema.ts` 中定义实体、Create/Update DTO、Zod Schema 和导出类型。
2. 在 `src/schemas/<module>.schema.ts` 中重导出模型，并导出包含方法、路径、请求体和响应校验的 `apiContract`。
3. 在 `src/components/shared/ApiContractModal.tsx` 注册模块契约。
4. 在 `src/mocks/db.ts` 中添加内存初始数据，在 `src/mocks/handlers.ts` 中实现状态化 CRUD 接口。
5. 在 `src/features/<module>/api.ts` 中使用 React Query 和 `lib/request.ts` 封装查询、保存和删除 hooks。
6. 在 `src/features/<module>/` 中使用 `CrudTable`、`CrudFormDrawer` 和领域表单字段实现页面与列配置。
7. 在 `src/features/<module>/<Module>Page.test.tsx` 中编写集成测试。
8. 在 `src/App.tsx` 中增加懒加载页面路由，并在 `scripts/smoke.mjs` 中增加冒烟检查。
9. 执行 `npm run verify`；通过后再执行 `npm run verify:ci` 和 `npm run smoke`。

架构适应度测试会阻止以下代码腐化：

- 业务模块缺少对应的 `<module>.schema.ts`
- 业务模块缺少 `.test.tsx`
- 页面直接从 `antd` 导入裸 `Table` 或 `Drawer`
- 在 `api.ts` 以外的业务文件中直接调用 `fetch()`

---

## 前后端联调切换

1. 所有接口数据结构均定义在 `src/schemas/`，可直接作为前后端接口文档对齐。
2. 真实后端就绪后，把 `.env.example` 复制为 `.env.local`，并修改：
   ```bash
   VITE_ENABLE_MOCK=false
   API_PROXY_TARGET=http://localhost:8080   # 换成后端地址
   ```
3. 重启 `npm run dev`，`/api` 请求会代理到后端，业务代码无需改动。

代理只在本地 `dev` / `preview` 中生效。正式部署时需在网关或 Web 服务器上转发 `/api`。

### 环境变量

| 变量 | 默认值 | 说明 |
| --- | --- | --- |
| `VITE_ENABLE_MOCK` | `true` | 为 `true` 时启动浏览器端 MSW Mock；为 `false` 时关闭 Mock，并显示真实后端请求入口。 |
| `API_PROXY_TARGET` | `http://localhost:8080` | 仅在 `VITE_ENABLE_MOCK=false` 时用于代理 `/api/*` 的目标后端地址。 |

启动时会读取 `.env`、`.env.local` 等 Vite 环境文件。环境变量变更后需要重启开发服务器。

切换到真实后端时，接口的路径、HTTP 方法、请求体和响应结构仍须与 `src/schemas/` 中的契约保持一致。

---

## 页面与常用命令

应用默认路由如下：

| 路径 | 页面 | 内容 |
| --- | --- | --- |
| `/tenants` | 租户管理 | 租户的查询、新增、编辑、状态切换和删除 |
| `/subscriptions` | 订阅套餐 | 套餐周期、价格、席位上限及状态 CRUD |
| `/members` | 成员管理 | 成员查询、新增、编辑、角色与状态管理及删除 |

常用命令：

| 命令 | 用途 |
| --- | --- |
| `npm run dev` | 启动 Vite 开发服务器 |
| `npm run test` | 运行一次 Vitest 测试及架构适应度测试 |
| `npm run typecheck` | 单独执行 TypeScript 严格类型检查 |
| `npm run verify` | 本地完整验收：类型检查、Biome、Vitest 和生产构建 |
| `npm run verify:ci` | CI 验收：只检查、不改写，并将警告视为失败 |
| `npm run build` | TypeScript 检查后生成生产构建 |
| `npm run smoke` | 在真实 Chromium 中打开生产构建的全部页面 |

---

## 工程亮点：Harness 架构守护与前后端联调台

### 1. 架构适应度测试 (`src/test/architecture.test.ts`)
为防止多轮 AI 迭代导致代码腐化或破坏公共组件复用约定，项目内置了静态架构守护测试（随 `npm run verify` 自动执行）：
- **契约强绑定**：自动扫描 `src/features/*`，强制校验每个业务模块必须存在对应的 `src/schemas/*.schema.ts` 与集成测试文件。
- **组件复用硬约束**：静态检测所有业务页面禁止直接从 `antd` 引入裸 `Table` 或 `Drawer`，强制统一复用 `CrudTable` 与 `CrudFormDrawer`。
- **网络层隔离**：拦截业务 UI 文件中的裸 `fetch()` 调用，确保所有请求收敛于 `api.ts` 并经过 Zod 契约校验。

### 2. 可视化 Mock 联调控制台 (`MockControlBadge`)
- 通过环境变量 `VITE_ENABLE_MOCK` 控制 MSW 拦截器启停，后端就绪后无需修改业务代码即可无缝切换至真实 API。
- 开启 Mock 时，页面右上角提供 **MSW Mock 状态浮标**，支持**一键重置内存数据库**以及**开启/关闭 500ms 网络延迟模拟**，方便测试骨架屏、Loading 态及边界交互。

---

## 双 Agent 协同开发实录 (Workflow Demo)

本项目采用 **Claude Code + Codex CLI** 协同构建与验收，全流程共享 `AGENTS.md` 规范与 `npm run verify` 自动化门禁：

1. **Harness 基线初始化**：编写 `AGENTS.md`、`CLAUDE.md` 与 `.claude/commands/add-module.md`，确立技术栈与复用红线。
2. **Claude Code 搭建骨架与核心模块**：通过 Plan Mode 生成项目架构、封装 `CrudTable` / `CrudFormDrawer`，并交付 **租户管理 (`tenants`)** 与 **订阅套餐 (`subscriptions`)** 两个完整 CRUD 模块。
3. **Codex CLI 强化工程护栏与测试**：基于同一份 `AGENTS.md`，使用 Codex 补充 `architecture.test.ts` 架构守护测试、Mock 延迟控制台及边界用例。
4. **单命令质量门禁验收**：
   ```bash
   $ npm run verify:ci
   > npm run typecheck && npm run lint:ci && npm run test && npm run build

    Test Files  4 passed (4)
         Tests  15 passed (15)
   ✓ built

   $ npm run smoke
   ok   /tenants
   ok   /subscriptions
   ok   /members
   ```
   以上为节选输出。

