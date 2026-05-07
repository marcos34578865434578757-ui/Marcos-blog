# Tiramisu Blog

一个基于 `Next.js 16 + App Router + MDX + Tailwind CSS` 的个人博客与作品站项目，用来记录我借助 AI/Agent 建站、整理内容、打磨界面，以及把真实想法慢慢做成长期作品的过程。

线上地址：

- Netlify: [https://marcos-tiramisu-blog.netlify.app](https://marcos-tiramisu-blog.netlify.app)

## 项目简介

这个项目不是单纯的个人主页模板，而是一套可以持续更新的内容站点。  
它同时承担几件事：

- 展示博客文章
- 展示项目与过程记录
- 承载双语内容切换
- 提供单作者后台，直接维护本地 MDX 内容
- 记录我使用 AI 建站、做内容和做复盘的方法

## 当前功能

### 前台

- 首页内容展示
- 博客列表与详情页
- 项目列表与详情页
- 关于我页面
- 浅色 / 深色模式切换
- 中文 / English 界面切换
- 文章与项目内容级中英文切换
- 目标语言缺失时，自动回退原文并显示提示

### 内容系统

- 博客与项目内容都基于 MDX
- 博客支持主分类与标签
- 支持正文图片
- 支持内容级双语文件结构：
  - `slug.zh.mdx`
  - `slug.en.mdx`

### 后台

- 后台登录
- 新建 / 编辑 / 删除博客文章
- 新建 / 编辑 / 删除项目条目
- 首页 Hero 与 Recent Updates 内容管理
- 双栏编辑器（左编右预览）
- 图片上传
- 正文粘贴截图自动上传并插入 Markdown
- 同一篇文章 / 项目下切换中文内容与英文内容分别维护

## 技术栈

- Next.js 16.2.4
- React 19
- TypeScript
- Tailwind CSS 4
- Framer Motion
- gray-matter
- next-mdx-remote

## 项目结构

```text
src/
  app/                  App Router 页面
  components/           页面组件、后台组件、UI 组件
  content/
    blog/               博客 MDX 内容
    projects/           项目 MDX 内容
    site/               首页配置内容
  data/                 个人资料等站点数据
  lib/                  内容解析、后台读写、国际化、MDX 渲染等
public/
  images/               站点图片
  uploads/              后台上传后的静态图片
```

## 内容模型

### 博客文章

博客使用 frontmatter + MDX 正文：

```md
---
title: 标题
date: 2026-05-07
description: 摘要
category: 工具分享
tags:
  - 标签一
  - 标签二
cover: /images/example.png
readingTime: 5 min read
featured: true
---

正文内容
```

### 项目条目

```md
---
title: 项目名称
description: 项目说明
date: 2026-05-07
tags:
  - Next.js
  - UX
cover: /images/example.png
status: 进行中
demo: https://example.com
github: https://github.com/example/repo
featured: false
---

正文内容
```

### 双语规则

- 中文版本：`slug.zh.mdx`
- 英文版本：`slug.en.mdx`
- 当前语言优先读取对应版本
- 若英文缺失，则回退到中文原文并提示 “English version coming soon”

## 本地开发

### 安装依赖

```bash
npm install
```

### 启动开发环境

```bash
npm run dev
```


### 构建与检查

```bash
npm run lint
npm run build
```

## 环境变量

项目后台需要以下环境变量：

```bash
ADMIN_USERNAME=
ADMIN_PASSWORD=
ADMIN_SESSION_SECRET=
```

可以参考：

- [\.env.example](F:\我的项目\我的博客\my-project\.env.example)

## 已完成的部署

### Netlify

- 生产地址：[https://marcos-tiramisu-blog.netlify.app](https://marcos-tiramisu-blog.netlify.app)
- 项目后台：[https://app.netlify.com/projects/marcos-tiramisu-blog](https://app.netlify.com/projects/marcos-tiramisu-blog)

### GitHub

- 目标仓库地址：`https://github.com/marcos34578865434578757-ui/tiramisu-blog`
- 如果仓库尚未存在，需要先在你的 GitHub 账号下创建同名仓库，或允许本机凭证自动创建后再推送

## 这个项目在做什么

这个博客最重要的不是“做出一个页面”，而是把这些能力慢慢连起来：

- 用 AI 拆需求、搭结构、修页面
- 用后台把内容维护变得顺手
- 用双语内容让文章和项目真正能一键切换
- 用持续迭代把站点变成长期可维护的作品

它既是一个网站，也是我记录建站方法、内容系统和个人成长的长期工程。
