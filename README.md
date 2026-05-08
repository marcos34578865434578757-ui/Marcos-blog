# Marcos Blog

Marcos Blog is a personal blog and project journal built with Next.js, MDX, Tailwind CSS, and a Git-driven CMS workflow.

The site keeps content as versioned files in the repository while letting the production editor manage posts, projects, and images through Decap CMS. Netlify watches the GitHub repository and redeploys whenever CMS changes are committed.

## Live Site

- Netlify: [https://marcos-tiramisu-blog.netlify.app](https://marcos-tiramisu-blog.netlify.app)
- GitHub: [https://github.com/marcos34578865434578757-ui/tiramisu-blog](https://github.com/marcos34578865434578757-ui/tiramisu-blog)

## Main Features

- Next.js App Router frontend
- MDX blog posts and project writeups
- Chinese / English interface switching
- Chinese / English content files with fallback behavior
- Blog categories and tags
- Theme switching
- Interactive mint-green glow background
- Decap CMS admin at `/admin`
- Legacy local studio at `/studio`
- Git-based publishing through Netlify Identity + Git Gateway

## Content Model

Blog posts live in:

```text
src/content/blog
```

Projects live in:

```text
src/content/projects
```

Each content item uses the same slug with a language suffix:

```text
my-post.zh.mdx
my-post.en.mdx
my-project.zh.mdx
my-project.en.mdx
```

The important frontmatter fields are:

```yaml
slug: my-post
locale: zh
title: My title
date: 2026-05-08
description: Short summary
category: 工具分享
tags:
  - Next.js
cover: /uploads/example.png
readingTime: 5 min read
featured: true
```

Project files use `status`, `demo`, and `github` instead of `category` and `readingTime`.

## Admin Workflow

The main writing backend is Decap CMS:

```text
/admin
```

It manages four collections:

- Chinese posts
- English posts
- Chinese projects
- English projects

When you publish from Decap CMS, it commits MDX files and uploaded images directly to GitHub. Netlify then automatically deploys the updated site.

Uploaded images are stored in:

```text
public/uploads
```

They are referenced in content as:

```md
![image](/uploads/example.png)
```

## Netlify Setup

In the Netlify project settings:

1. Enable Identity.
2. Invite your editor email.
3. Enable Git Gateway.
4. Connect Git Gateway to this GitHub repository.
5. Keep Git-based deploy enabled for the `master` branch.

After that, the normal publishing flow is:

```text
Open /admin
Log in with Netlify Identity
Edit or create content
Publish
CMS commits to GitHub
Netlify redeploys automatically
```

## Legacy Studio

The previous custom local backend is still available at:

```text
/studio
```

It is kept as a fallback while Decap CMS is adopted. The long-term preferred editor is `/admin`.

## Local Development

Install dependencies:

```bash
npm install
```

Start the dev server:

```bash
npm run dev
```

Run checks:

```bash
npm run lint
npm run build
```

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- MDX via `next-mdx-remote`
- Decap CMS
- Netlify Identity
- Netlify Git Gateway
