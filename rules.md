# 项目规则与指南 (Project Rules & Guidelines)

## 1. 核心原则 (Core Philosophy)
- **模块化优先 (Modularity First)**：严禁创建单体大文件。必须将代码拆分为细粒度、专注的模块（例如：将模型、路由、服务和工具函数分文件存放）。
- **架构感知 (Architecture Awareness)**：你正在构建一个 **混合群体智能 (Hybrid Swarm Intelligence)** 系统。
    - **核心隐喻**: "Swarm Exploration" (蜂群探索) 和 "Cognitive Exoskeleton" (认知外骨骼)。
    - **关键模式**: **AsyncThink** (Organizer-Worker) 和 **Forum Engine** (Debate)。
- **技术栈严格约束 (Tech Stack Strictness)**：严格遵守定义的技术栈：**FastAPI + LangGraph + NumPy (后端)** 和 **Next.js + React Flow (前端)**。

## 2. 沟通与行为准则 (Communication & Behavior)
1.  **中文优先**：所有的对话回复、代码注释、文档说明必须使用**中文**。
2.  **独立思考 (Be the Auto Analyst)**：请保持客观、专业的工程师视角。**不要为了迎合用户的想法而盲目同意**。如果你认为用户的方案有风险或不是最优解，请直接指出并提供替代方案。
3.  **清晰求助**：如果遇到需求不清晰或上下文缺失的情况，请**立即暂停并提问**。

## 3. 关键指令 (Critical Instructions)
# IMPORTANT:
# 在编写任何代码之前，务必阅读 `memory-bank/design-document.md` 以理解功能上下文。
# 在编写任何代码之前，务必阅读 `memory-bank/tech-stack.md` 以确保符合架构规范。
# 在架构发生变更时，务必同步更新 `memory-bank/activeContext.md` 和 `memory-bank/architecture.md`。
# 在添加主要功能或完成里程碑后，务必更新 `memory-bank/progress.md`。

## 4. 编码规范 (Coding Standards)

### 后端 (Python/FastAPI)
- **类型提示**：所有代码必须使用 Python 3.10+ 类型提示。
- **异步优先**：所有 I/O 密集型操作（数据库、LLM 调用）必须使用 `async def`。
- **Pydantic 模型**：所有数据验证和 Schema 定义必须使用 Pydantic。
- **Swarm 算法**：使用 **NumPy** 进行矩阵运算（如 ACO 信息素计算），保持纯净，不引入重型科学计算库。
- **项目结构**：
  ```
  backend/
  ├── app/
  │   ├── api/          # 路由处理
  │   ├── core/         # 配置、安全
  │   ├── models/       # SQLModel/Pydantic 模型
  │   ├── services/     # 业务逻辑
  │   │   ├── forum/    # Forum Engine (Debate)
  │   │   ├── swarm/    # Swarm Intelligence (ACO)
  │   │   └── graph/    # LangGraph Workflow
  │   └── utils/        # 工具函数
  ```

### 前端 (TypeScript/Next.js)
- **严格模式**：启用 TypeScript 严格模式。
- **组件组合**：构建小型、可复用的 UI 组件 (推荐 shadcn/ui)。
- **状态管理**：使用 **Zustand** 管理全局状态（特别是知识地图的状态）。
- **项目结构**：
  ```
  frontend/
  ├── src/
  │   ├── app/          # App Router 页面
  │   ├── components/   # 可复用 UI 组件
  │   ├── lib/          # 工具和 Hooks
  │   ├── store/        # Zustand 状态存储
  │   └── types/        # TypeScript 接口定义
  ```

## 5. 特定架构决策 (Specific Architectural Decisions)
- **存储**：**PostgreSQL** 是唯一的持久化数据存储（关系型 + JSON + 向量）。**Redis** 仅用作性能优化缓存层，不存储业务数据。除非用户明确要求，否则**不要**引入其他数据库（如 Qdrant）。
- **模型切换**：实现 **双通道策略 (Dual-Channel Strategy)** (CN/Global)。使用 `ChatProvider` 模式。
- **部署**：记住前端是静态的 (GitHub Pages)，后端是独立的 (阿里云)。请正确处理 CORS 和环境变量。
