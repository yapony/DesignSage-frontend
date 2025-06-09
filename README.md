# DesignSage Frontend

DesignSage 是一个基于 AI 的智能设计助手平台，提供需求分析、概念设计和详细设计三个核心模块，本项目为其前端部分。

项目结构：
```bash
DesignSage-frontend/
├── app/                # 应用路由和页面
├── components/         # 可复用组件
├── lib/               # 工具函数和配置
├── public/            # 静态资源
├── types/             # TypeScript 类型定义
├── hooks/             # 自定义 React Hooks
└── config/            # 项目配置文件
```

## 功能特性

### 1. 需求分析模块
- 静态需求分析
- 动态需求洞察
- 需求报告生成

### 2. 概念设计模块
- 设计知识问答
- 设计视野拓展
- 概念设计方案生成

### 3. 详细设计模块
- 设计规范问答
- 实现方案探索
- 详细设计方案生成

## 技术栈

- **框架**: Next.js 15.2.4
- **UI 组件**: 
  - Radix UI
  - Tailwind CSS
  - Shadcn UI
- **状态管理**: React Hooks
- **表单处理**: React Hook Form
- **Markdown 渲染**: React Markdown
- **主题**: Next Themes
- **类型检查**: TypeScript

## 开发流程

### 1. 克隆项目并创建分支

1. 克隆项目到本地
```bash
# 克隆项目
git clone https://github.com/yapony/DesignSage-frontend.git
cd DesignSage-frontend

#以下三条命令只在继续开发情况下需要
# 创建新分支
git checkout -b your-feature

# 进入已存在的分支并更新
git checkout your-feature

# 确保本地代码是最新的
git pull origin your-feature

#每次开发时，确保自己所在是正确的分支，再进行开发
```

### 2. 本地开发

1. 环境准备
```bash
# 安装 Node.js (推荐 v18 或更高版本)
安装方法多样，可自行查询

# 安装 pnpm 包管理器（如果没有下载过的话；也有其他下载方式可以自行搜索）
npm install -g pnpm

# 安装项目依赖
pnpm install
```

2. 配置环境变量
```bash
# 复制环境变量模板文件，并填入必要的环境变量
将项目中的.env.example文件复制一份，重命名为.env.local，在其中填入你的Dify相关信息
```

3. 启动开发服务器
```bash
# 启动开发服务器
pnpm dev

# 访问 http://localhost:3000
```

4. 开发过程中的代码提交
```bash
# 查看修改的文件
git status

# 添加修改的文件
git add .

# 提交修改
git commit -m "feat: 添加新功能描述"
```

### 3. 上传分支

将代码推送到远程仓库
```bash

# 推送到远程仓库
git push origin your-feature
