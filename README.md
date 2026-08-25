# ELEV-9 电梯逃生游戏

一款沉浸式的电梯逃生解谜游戏，玩家将扮演电梯管理员刘晓，被困在故障的电梯中，需要通过探索和解决谜题逃离困境。

## 🚀 技术栈

- React 18+
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Framer Motion

## 🎮 游戏简介

你是电梯管理员刘晓，有一天你发现自己被困在了电梯里... 探索电梯内部，寻找线索，解开隐藏的真相，寻找逃生之路。

## 🚀 快速开始

### 使用 npm

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建项目
npm run build

# 部署到 GitHub Pages
npm run deploy
```

## 🏗️ 项目结构

- `src/components` - React 组件
  - `interactives` - 交互式游戏元素
  - `scenes` - 游戏场景
  - `ui` - 用户界面组件
- `src/contexts` - 全局状态管理
- `src/pages` - 页面组件
- `src/hooks` - 自定义钩子

## 📖 游戏攻略

1. 仔细探索电梯内部的各个交互点
2. 收集线索并寻找逃离方法
3. 注意观察环境变化和细节提示

## 📝 部署指南

### 部署到 GitHub Pages

1. 确保在 package.json 中设置了正确的 homepage 字段
2. 运行部署命令: `npm run deploy`
3. 等待部署完成后，可以通过 `https://your-username.github.io/ELEV-9` 访问游戏

### 其他部署方式

你也可以将 `dist/static` 目录中的文件部署到任何静态网站托管服务，如 Netlify、Vercel 或自己的服务器上。