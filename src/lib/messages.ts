export type Locale = "zh" | "en";

export const localeCookieName = "locale-preference";
export const localeStorageKey = "locale-preference";
export const localeEvent = "codex-locale-change";

export function isLocale(value: string | null | undefined): value is Locale {
  return value === "zh" || value === "en";
}

export const postCategoryLabels = {
  "AI 使用心得": {
    zh: "AI 使用心得",
    en: "AI Notes",
  },
  "成长思考": {
    zh: "成长思考",
    en: "Growth",
  },
  "工具分享": {
    zh: "工具分享",
    en: "Toolbox",
  },
} as const;

export const messages = {
  zh: {
    site: {
      title: "Marcos Blog",
      description:
        "一个记录我如何借助 AI 建站、打磨界面、整理内容并持续复盘的个人博客与作品站。",
      ogDescription:
        "从完全不会写代码开始，借助 AI 一点点把网站和项目真正做出来。",
      twitterDescription:
        "记录 AI 建站、界面优化和项目复盘的真实过程。",
    },
    nav: {
      home: "主页",
      blog: "博客",
      projects: "项目",
      about: "关于我",
    },
    header: {
      subtitle: "AI Builder Journey",
      avatarAlt: "的头像",
    },
    language: {
      label: "语言切换",
      zh: "中",
      en: "EN",
      switchToZh: "切换到中文",
      switchToEn: "Switch to English",
    },
    theme: {
      switchToLight: "切换到白天模式",
      switchToDark: "切换到夜间模式",
    },
    footer: {
      heading: "把 AI 建站这件事，做成一条能被后来自己复用的方法。",
      body:
        "这里记录真实项目、真实试错和真实成长。它既是我的工作现场，也是我长期整理经验、沉淀判断和持续更新的个人档案。",
      contact: "联系我：",
    },
    home: {
      featuredPosts: {
        eyebrow: "Journal",
        title: "最近写下来的几篇文章",
        description:
          "这些文章不是教程式输出，而是我在 AI 建站、界面优化、上线复盘和内容整理里的真实记录。",
      },
      featuredProjects: {
        eyebrow: "Selected Work",
        title: "我的一些项目",
        description:
          "这些项目不是一次性做完的成品，而是我把想法变成页面、把页面继续打磨成体验，再把体验沉淀成作品的过程。",
      },
      timeline: {
        eyebrow: "Method",
        title: "我现在更习惯这样和 AI 一起做站",
        description:
          "比起追求一次性生成一个“完美页面”，我更在意如何把问题拆开、让视觉收束、让每一步迭代都留下可以复用的判断。",
        stepLabel: "Step",
        milestones: [
          {
            title: "先把问题讲清楚",
            body: "在动手之前，先明确页面是给谁看、要表达什么、第一屏必须让人立刻看懂什么。",
          },
          {
            title: "再让 AI 帮我拆结构",
            body: "我更常让 AI 帮我拆页面、补模块、找层级问题，而不是一口气生成一整站。",
          },
          {
            title: "用真实页面判断好不好",
            body: "不只看代码能不能跑，而是看第一屏有没有重点、信息是否耐读、移动端是否还顺手。",
          },
          {
            title: "每次都留下复盘",
            body: "把改动、踩坑和判断理由都记下来，久了之后，项目不只是结果，也会变成自己的方法库。",
          },
        ],
      },
      hero: {
        eyebrow: "Marcos Blog",
        badge: "Personal Build Log",
        title: "从代码小白出发，把 AI 建站、界面打磨和内容迭代都留在这里",
        intro:
          "这个站点记录的不是一步到位的成品，而是我如何借助 AI 一步步搭结构、改界面、修细节、补内容，再把它慢慢打磨成一个能长期更新的个人作品站。",
        primaryCtaLabel: "先看文章",
        primaryCtaHref: "/blog",
        secondaryCtaLabel: "浏览项目",
        secondaryCtaHref: "/projects",
        tags: [
          "AI 建站",
          "Vibe Coding",
          "UI 优化",
          "内容系统",
          "长期项目",
          "公开复盘",
        ],
        noteLabel: "Working Note",
        noteTitle: "AI 建站成长记录",
        status:
          "我正在把这个博客打磨成一套既能持续更新，又能稳定承载项目与文章的长期内容站点。",
        highlights: [
          "用真实项目记录 AI 建站过程",
          "持续复盘界面、结构和交互细节",
          "把新手视角整理成可复用的方法",
        ],
        stats: [
          { label: "主线", value: "建站 + 内容" },
          { label: "节奏", value: "持续迭代" },
          { label: "目标", value: "长期作品" },
        ],
      },
      recentUpdates: {
        eyebrow: "Recent Updates",
        title: "最近我在把哪些地方继续推完整",
        description:
          "这里记录我当前最投入的几条主线：页面结构、内容更新、交互细节和上线准备。这个站点会随着这些事情一起慢慢长出来。",
        status:
          "正在把个人博客打磨成一套既能持续更新，又能稳定承载项目与文章的长期内容站点。",
        items: [
          "重构首页的信息层级，让内容和视觉更像真正的作品站。",
          "梳理 AI 建站过程中可复用的工作流、提示词和迭代方法。",
          "把做博客站、导航站和上线复盘的经验整理成可公开分享的文章。",
        ],
        updatedAtLabel: "最近更新：",
        updatedAt: "2026-05-06",
        badgeLabel: "持续更新中",
      },
    },
    about: {
      title: "关于我",
      description:
        "你好，我是 Marcos。我正在从一个代码小白出发，借助 AI 学习如何做网站、做内容、做更完整的个人作品。",
      metaDescription:
        "认识我，了解我为什么开始做这个站点，以及我如何和 AI 一起做项目。",
      personalNote: "Personal Note",
      noteBody:
        "我不是科班开发者，但我在认真学习如何借助 AI 做网站、做产品、做内容。这个站点既是我的成长档案，也是我持续公开复盘、整理经验和打磨审美的个人实验室。",
      contact: "联系邮箱",
      socialsEyebrow: "Socials",
      socialsTitle: "在这些地方也能找到我",
      socialsDescription:
        "这些入口现在先保留占位链接，后面我会继续补上真实地址，把整个站点慢慢变成完整、稳定、可持续更新的个人阵地。",
      blocks: [
        {
          title: "为什么开始做这个站",
          body: "我想要一个真正属于自己的空间，用来放项目、文章、方法和复盘，而不是把这些内容零散地丢在不同平台上。",
        },
        {
          title: "我怎么学习",
          body: "我更习惯把抽象概念放进真实项目里学。先搭起来，再修改，再复盘。每一次报错和每一次界面调整，都会变成下一次更快的判断。",
        },
        {
          title: "我想达成什么",
          body: "我希望这个站点不只是个人展示，而是一份长期积累下来的成长记录，也能给同样想借助 AI 做项目的人一些参考。",
        },
        {
          title: "我现在在推进什么",
          body: "目前我在继续完善博客系统、项目展示和交互细节，也在把自己的建站经验整理成更清晰、更容易被复用的内容。",
        },
      ],
    },
    blog: {
      title: "博客",
      description:
        "这里收录我在 AI 建站、界面优化、内容整理和上线复盘中的真实记录。",
      metaDescription:
        "记录我学习 AI 建站、优化页面体验、整理工具流程和持续成长的过程。",
      allPosts: "全部文章",
      empty: "这个分类下暂时还没有文章，下一篇很快就会补上。",
      previous: "上一篇",
      next: "下一篇",
      toc: "本页目录",
    },
    projects: {
      title: "项目",
      description:
        "这些项目不是一次性做完的成品，而是我把想法、结构和体验一点点落成现实的过程。",
      metaDescription:
        "这里放的是我和 AI 协作完成的站点、实验和内容型项目。",
      demo: "查看 Demo",
      github: "查看 GitHub",
    },
    admin: {
      login: {
        eyebrow: "Admin Access",
        title: "登录你的博客后台",
        description:
          "这个后台用于维护博客文章、项目条目和首页文案。内容最终仍然会保存成项目里的 MDX 文件和本地配置文件，和你现在的网站架构保持一致。",
        missingTitle: "后台还没有完成登录配置",
        missingDescription:
          "请先在项目根目录准备环境变量：`ADMIN_USERNAME`、`ADMIN_PASSWORD`、`ADMIN_SESSION_SECRET`。配置完成后重启开发服务器，再回来登录。",
        username: "用户名",
        password: "密码",
        submit: "进入后台",
      },
      dashboard: {
        postsLabel: "博客文章",
        postsHelper: "文章内容仍然直接从 src/content/blog 读取。",
        projectsLabel: "项目条目",
        projectsHelper: "项目内容继续保持 MDX 文件驱动。",
        featuredLabel: "精选内容",
        featuredHelper: "勾选 featured 后，首页精选区会优先显示这些内容。",
        homeLabel: "首页文案",
        homeHelper: "Hero 和 Recent Updates 已接入后台统一管理。",
        categoryTitle: "博客分类概览",
        categoryDescription:
          "文章分类采用单选主分类，标签依然保留给更细的主题标记。",
        editHomeContent: "编辑首页内容",
        recentPostsTitle: "最近文章",
        recentPostsHelper: "点击任意文章卡片即可进入编辑页。",
        recentProjectsTitle: "最近项目",
        recentProjectsHelper: "项目卡也支持封面、状态、Demo 和 GitHub 链接。",
        featuredPostBadge: "精选文章",
        featuredProjectBadge: "精选项目",
      },
      homeContent: {
        eyebrow: "Home Content",
        title: "编辑首页首屏与最近更新",
        description:
          "这里集中管理首页 Hero 和“最近我在把哪些地方继续推完整”这部分内容。保存后，首页会直接读取新的配置。",
        heroTitle: "首屏文案",
        eyebrowLabel: "眉标",
        badgeLabel: "胶囊标题",
        mainTitle: "主标题",
        intro: "简介",
        primaryCtaLabel: "主按钮文案",
        primaryCtaHref: "主按钮链接",
        secondaryCtaLabel: "次按钮文案",
        secondaryCtaHref: "次按钮链接",
        heroTags: "Hero 标签（每行一个）",
        noteEyebrow: "右侧卡片眉标",
        noteTitle: "右侧卡片标题",
        noteStatus: "右侧卡片状态文案",
        highlights: "Hero 亮点（每行一个）",
        statsEyebrow: "Hero Stats",
        statsTitle: "首屏小卡片数据",
        statLabelPlaceholder: "卡片标题",
        statValuePlaceholder: "卡片内容",
        focusEyebrow: "Recent Updates",
        focusTitle: "首页最近更新区块",
        focusEyebrowPlaceholder: "眉标",
        focusTitlePlaceholder: "标题",
        focusDescriptionPlaceholder: "说明文案",
        focusStatusPlaceholder: "顶部状态文案",
        focusItemsPlaceholder: "列表内容，每行一条",
        focusBadgePlaceholder: "持续更新中",
        saveHint:
          "这里保存后会直接更新首页首屏和最近更新区块，不会影响文章与项目的 MDX 结构。",
        saved: "首页文案已经保存，刷新首页就能看到新内容。",
      },
      shell: {
        title: "你的博客内容工作台",
        description:
          "这里负责管理文章、项目和首页文案。首版采用本地 MDX 与本地配置文件作为内容源，轻量但很适合你一个人持续维护。",
        currentUser: "当前登录：",
        nav: {
          dashboard: "内容概览",
          newPost: "新建文章",
          newProject: "新建项目",
          home: "首页内容",
          backToSite: "返回前台",
        },
      },
      editor: {
        contentEditor: "Content Editor",
        backToDashboard: "返回后台概览",
        viewPublicPage: "查看前台页面",
        saved: "已保存，前台内容已经同步更新。",
        mediaTitle: "上传图片",
        mediaBadge: "保存到本地静态资源",
        uploadToCover: "上传到封面",
        insertIntoContent: "插入正文",
        uploadImage: "上传图片",
        supportedFormats:
          "支持浏览器可直接显示的图片格式，例如 jpg、png、webp、gif、svg、avif、bmp 和 ico。",
        saveAfterInsert:
          "上传到正文后会先插入编辑器草稿，记得再点击一次“保存内容”，图片才会真正写入 MDX 文件。",
        noPreview: "正文预览会显示在这里。",
        draftDateFallback: "还没设置发布日期",
        projectStatusFallback: "项目状态待填写",
        titleFallback: "你的标题会显示在这里",
        descriptionFallback: "摘要会跟随 frontmatter 一起更新。",
        title: "标题",
        publishDate: "发布日期",
        summary: "摘要",
        category: "主分类",
        tags: "标签",
        cover: "封面地址",
        readingTime: "阅读时长",
        status: "项目状态",
        demo: "Demo 链接",
        github: "GitHub 链接",
        featured: "在首页精选区域展示",
        content: "正文（Markdown / MDX）",
        contentHint:
          "支持标准 Markdown 图片语法，例如 `![图片说明](/media/posts/example.png)`。图片插入正文后，仍需要点击保存内容才会写进最终的 MDX 文件。",
        contentPersistence:
          "当前版本会直接写入项目里的 `.mdx` 文件，适合你自己本地维护内容。",
        preview: "Preview",
        livePreview: "双栏实时预览",
        postPreviewBadge: "博客文章",
        projectPreviewBadge: "项目内容",
        dangerTitle: "危险操作",
        dangerDescription:
          "删除后会直接移除对应的 MDX 文件。建议确认内容不再需要之后再执行。",
        deleteConfirm: "确定要删除这篇内容吗？这个动作无法撤销。",
        save: "保存内容",
        saving: "正在保存...",
        deleting: "正在删除...",
        delete: "删除",
        logout: "退出登录",
        loggingOut: "正在退出...",
        uploadInserted:
          "图片已插入草稿，保存文章后会永久写入 MDX 文件。",
        uploadFilledCover:
          "图片已上传，封面地址已自动填入表单，保存内容后生效。",
        pasting: "正在上传粘贴的图片...",
        pasteFailed: "粘贴图片上传失败，请稍后再试。",
        newPostTitle: "新建博客文章",
        newPostDescription:
          "首版后台会直接生成一份新的 MDX 文件。你可以先把结构和正文放进去，之后再慢慢打磨细节。",
        editPostTitle: "编辑文章：",
        editPostDescription:
          "这里修改的内容会同步更新 frontmatter 和正文。保存之后，前台读取的还是同一份 MDX 内容源。",
        newProjectTitle: "新建项目条目",
        newProjectDescription:
          "项目页适合记录背景、目标、实现过程和结果，也支持补充 Demo 与 GitHub 链接。",
        editProjectTitle: "编辑项目：",
        editProjectDescription:
          "项目内容也会继续保留在 MDX 文件里，所以你依然可以把它纳入版本管理和部署流程里。",
      },
    },
  },
  en: {
    site: {
      title: "Marcos Blog",
      description:
        "A personal blog and portfolio documenting how I build with AI, refine interfaces, and turn experiments into long-term work.",
      ogDescription:
        "From complete beginner to building websites and projects with AI, one real iteration at a time.",
      twitterDescription:
        "A public log of AI-powered building, UI refinement, and project retrospectives.",
    },
    nav: {
      home: "Home",
      blog: "Blog",
      projects: "Projects",
      about: "About",
    },
    header: {
      subtitle: "AI Builder Journey",
      avatarAlt: "'s avatar",
    },
    language: {
      label: "Language",
      zh: "中",
      en: "EN",
      switchToZh: "切换到中文",
      switchToEn: "Switch to English",
    },
    theme: {
      switchToLight: "Switch to light mode",
      switchToDark: "Switch to dark mode",
    },
    footer: {
      heading: "Turning AI website building into a path I can reuse later.",
      body:
        "This space records real projects, real mistakes, and real growth. It is both my working studio and a long-term archive of methods I can return to.",
      contact: "Contact:",
    },
    home: {
      featuredPosts: {
        eyebrow: "Journal",
        title: "A few recent posts",
        description:
          "These are not tutorial-style articles. They are real notes from building with AI, refining pages, shipping updates, and improving taste over time.",
      },
      featuredProjects: {
        eyebrow: "Selected Work",
        title: "Some of my projects",
        description:
          "These projects are not one-shot finished pieces. They are where ideas become pages, pages become experiences, and experiences become finished work.",
      },
      timeline: {
        eyebrow: "Method",
        title: "This is how I prefer to build with AI now",
        description:
          "Instead of chasing one perfect generated page, I care more about breaking problems down, tightening visual decisions, and leaving reusable judgment behind each iteration.",
        stepLabel: "Step",
        milestones: [
          {
            title: "Clarify the problem first",
            body: "Before building, I define who the page is for, what it should communicate, and what the first screen must make obvious right away.",
          },
          {
            title: "Let AI help me shape the structure",
            body: "I use AI more often to break down pages, add missing modules, and spot hierarchy issues than to generate an entire site in one shot.",
          },
          {
            title: "Judge it through real pages",
            body: "I do not only ask whether the code runs. I check whether the first screen has focus, whether the information reads clearly, and whether mobile still feels smooth.",
          },
          {
            title: "Keep a record every time",
            body: "I write down changes, pitfalls, and why I made certain calls. Over time, the project becomes more than an outcome. It becomes a personal method library.",
          },
        ],
      },
      hero: {
        eyebrow: "Marcos Blog",
        badge: "Personal Build Log",
        title: "Starting as a beginner, leaving every AI build, UI pass, and content iteration here",
        intro:
          "This site is not a polished result that appeared all at once. It is a record of how I use AI to shape structure, refine interfaces, fix details, and slowly turn the whole thing into a portfolio I can keep growing.",
        primaryCtaLabel: "Read the posts",
        primaryCtaHref: "/blog",
        secondaryCtaLabel: "See the projects",
        secondaryCtaHref: "/projects",
        tags: [
          "AI Building",
          "Vibe Coding",
          "UI Refinement",
          "Content System",
          "Long-term Project",
          "Public Notes",
        ],
        noteLabel: "Working Note",
        noteTitle: "Documenting how I grow with AI",
        status:
          "I am turning this blog into a long-term content space that can keep updating while also carrying projects and writing in a stable way.",
        highlights: [
          "Use real projects to document how I build with AI",
          "Keep reviewing interface, structure, and interaction details",
          "Turn a beginner perspective into reusable methods",
        ],
        stats: [
          { label: "Track", value: "Building + Writing" },
          { label: "Pace", value: "Iterating" },
          { label: "Goal", value: "Long-term Work" },
        ],
      },
      recentUpdates: {
        eyebrow: "Recent Updates",
        title: "What I am still pushing forward right now",
        description:
          "This is where I keep the main threads I am investing in most: structure, content updates, interaction details, and launch readiness.",
        status:
          "I am still polishing this blog into a long-term space that can keep growing with both writing and projects.",
        items: [
          "Reshape the information hierarchy on the home page so it feels more like a finished body of work.",
          "Organize reusable workflows, prompts, and iteration patterns from building with AI.",
          "Turn lessons from this blog, navigation experiments, and launch notes into articles that are worth sharing.",
        ],
        updatedAtLabel: "Updated:",
        updatedAt: "2026-05-06",
        badgeLabel: "Still iterating",
      },
    },
    about: {
      title: "About",
      description:
        "Hi, I am Marcos. I am learning how to build websites, content, and more complete personal work with AI, starting from almost no coding background.",
      metaDescription:
        "Get to know who I am, why I started this site, and how I build projects with AI.",
      personalNote: "Personal Note",
      noteBody:
        "I am not a traditional developer, but I am seriously learning how to use AI to build websites, products, and content. This site is both a growth archive and a personal lab for public reflection, design taste, and practical methods.",
      contact: "Email",
      socialsEyebrow: "Socials",
      socialsTitle: "You can also find me here",
      socialsDescription:
        "These links are placeholders for now. I will gradually replace them with real destinations and keep turning this site into a complete, stable place I can continue updating.",
      blocks: [
        {
          title: "Why I started this site",
          body: "I wanted a space that truly belongs to me, where projects, writing, methods, and retrospectives can live together instead of being scattered across platforms.",
        },
        {
          title: "How I learn",
          body: "I prefer learning through real projects. Build first, revise, then reflect. Every error and every interface adjustment becomes faster judgment next time.",
        },
        {
          title: "What I want this to become",
          body: "I hope this site becomes more than a personal showcase. I want it to be a long-term record of growth that might also help other people building with AI.",
        },
        {
          title: "What I am working on now",
          body: "Right now I am improving the blog system, project presentation, and interaction details, while also turning my building experience into clearer, reusable notes.",
        },
      ],
    },
    blog: {
      title: "Blog",
      description:
        "A running log of what I learn while building with AI, refining interfaces, organizing content, and shipping small improvements.",
      metaDescription:
        "Notes on building with AI, improving page experience, shaping workflows, and growing through real project work.",
      allPosts: "All posts",
      empty: "There are no posts in this category yet. The next one is on the way.",
      previous: "Previous post",
      next: "Next post",
      toc: "On this page",
    },
    projects: {
      title: "Projects",
      description:
        "These projects are not one-time finished pieces. They are where ideas, structure, and experience get slowly turned into something real.",
      metaDescription:
        "A collection of sites, experiments, and content-driven projects I have built with AI collaboration.",
      demo: "View Demo",
      github: "View GitHub",
    },
    admin: {
      login: {
        eyebrow: "Admin Access",
        title: "Sign in to your blog admin",
        description:
          "This admin is used to manage blog posts, project entries, and home page copy. Content still ends up in local MDX files and config files, so it stays aligned with your current site architecture.",
        missingTitle: "Admin login is not configured yet",
        missingDescription:
          "Add `ADMIN_USERNAME`, `ADMIN_PASSWORD`, and `ADMIN_SESSION_SECRET` in the project root, then restart the dev server and come back to sign in.",
        username: "Username",
        password: "Password",
        submit: "Open admin",
      },
      dashboard: {
        postsLabel: "Posts",
        postsHelper: "Post content is still read directly from src/content/blog.",
        projectsLabel: "Projects",
        projectsHelper: "Project content remains powered by MDX files.",
        featuredLabel: "Featured",
        featuredHelper: "When featured is enabled, these items are prioritized on the home page.",
        homeLabel: "Home copy",
        homeHelper: "Hero and Recent Updates are managed from the admin now.",
        categoryTitle: "Blog category overview",
        categoryDescription:
          "Posts use one primary category, while tags are still kept for more detailed themes.",
        editHomeContent: "Edit home content",
        recentPostsTitle: "Recent posts",
        recentPostsHelper: "Click any post card to open the editor.",
        recentProjectsTitle: "Recent projects",
        recentProjectsHelper: "Project cards also support cover images, status, Demo, and GitHub links.",
        featuredPostBadge: "Featured post",
        featuredProjectBadge: "Featured project",
      },
      homeContent: {
        eyebrow: "Home Content",
        title: "Edit the home hero and recent updates",
        description:
          "This is where the home hero and the recent updates block are managed together. Once saved, the home page reads the new configuration directly.",
        heroTitle: "Hero copy",
        eyebrowLabel: "Eyebrow",
        badgeLabel: "Badge text",
        mainTitle: "Main title",
        intro: "Intro",
        primaryCtaLabel: "Primary CTA label",
        primaryCtaHref: "Primary CTA link",
        secondaryCtaLabel: "Secondary CTA label",
        secondaryCtaHref: "Secondary CTA link",
        heroTags: "Hero tags (one per line)",
        noteEyebrow: "Right card eyebrow",
        noteTitle: "Right card title",
        noteStatus: "Right card status copy",
        highlights: "Hero highlights (one per line)",
        statsEyebrow: "Hero Stats",
        statsTitle: "Small hero stat cards",
        statLabelPlaceholder: "Card label",
        statValuePlaceholder: "Card value",
        focusEyebrow: "Recent Updates",
        focusTitle: "Home recent updates block",
        focusEyebrowPlaceholder: "Eyebrow",
        focusTitlePlaceholder: "Title",
        focusDescriptionPlaceholder: "Description",
        focusStatusPlaceholder: "Top status copy",
        focusItemsPlaceholder: "One list item per line",
        focusBadgePlaceholder: "Still iterating",
        saveHint:
          "Saving here updates the home hero and recent updates block directly, without changing the MDX structure for posts or projects.",
        saved: "Home content has been saved. Refresh the home page to see the changes.",
      },
      shell: {
        title: "Your blog content workspace",
        description:
          "This is where posts, projects, and home page copy are managed. The first version keeps local MDX and local config files as the content source, which is light but a great fit for a solo workflow.",
        currentUser: "Signed in as:",
        nav: {
          dashboard: "Overview",
          newPost: "New post",
          newProject: "New project",
          home: "Home content",
          backToSite: "Back to site",
        },
      },
      editor: {
        contentEditor: "Content Editor",
        backToDashboard: "Back to dashboard",
        viewPublicPage: "View live page",
        saved: "Saved. The public content is already in sync.",
        mediaTitle: "Upload image",
        mediaBadge: "Saved into local static assets",
        uploadToCover: "Use as cover",
        insertIntoContent: "Insert into content",
        uploadImage: "Upload image",
        supportedFormats:
          "Supports browser-displayable image formats such as jpg, png, webp, gif, svg, avif, bmp, and ico.",
        saveAfterInsert:
          "When inserted into the body, the image first lands in the draft editor. Click save once more to permanently write it into the MDX file.",
        noPreview: "The content preview will appear here.",
        draftDateFallback: "Publish date not set",
        projectStatusFallback: "Project status not set",
        titleFallback: "Your title will appear here",
        descriptionFallback: "The summary will update together with frontmatter.",
        title: "Title",
        publishDate: "Publish date",
        summary: "Summary",
        category: "Category",
        tags: "Tags",
        cover: "Cover URL",
        readingTime: "Reading time",
        status: "Project status",
        demo: "Demo URL",
        github: "GitHub URL",
        featured: "Feature this content on the home page",
        content: "Body (Markdown / MDX)",
        contentHint:
          "Standard Markdown image syntax is supported, for example `![Image alt](/media/posts/example.png)`. After inserting an image, you still need to save for it to be written into the final MDX file.",
        contentPersistence:
          "This version writes directly into `.mdx` files inside the project, which works well for a local solo workflow.",
        preview: "Preview",
        livePreview: "Live side-by-side preview",
        postPreviewBadge: "Blog post",
        projectPreviewBadge: "Project entry",
        dangerTitle: "Danger zone",
        dangerDescription:
          "Deleting this removes the matching MDX file directly. It is best to do this only when you are sure the content is no longer needed.",
        deleteConfirm:
          "Are you sure you want to delete this item? This action cannot be undone.",
        save: "Save content",
        saving: "Saving...",
        deleting: "Deleting...",
        delete: "Delete",
        logout: "Log out",
        loggingOut: "Logging out...",
        uploadInserted:
          "Image uploaded and inserted into the draft. Save the article to write it into the MDX file.",
        uploadFilledCover:
          "Image uploaded and the cover field has been filled. Save the content to apply it.",
        pasting: "Uploading pasted image...",
        pasteFailed: "Failed to upload the pasted image. Please try again.",
        newPostTitle: "Create a new blog post",
        newPostDescription:
          "This first version of the admin creates a new MDX file directly. You can start with structure and content first, then keep polishing the details later.",
        editPostTitle: "Edit post:",
        editPostDescription:
          "Changes made here update both frontmatter and the main body. After saving, the public site still reads from the same MDX source file.",
        newProjectTitle: "Create a new project entry",
        newProjectDescription:
          "Project pages are meant for recording the background, goals, implementation process, and results. They also support Demo and GitHub links.",
        editProjectTitle: "Edit project:",
        editProjectDescription:
          "Project content also stays in MDX files, so you can continue keeping it inside your version control and deployment workflow.",
      },
    },
  },
} as const;

export function getMessages(locale: Locale) {
  return messages[locale];
}

export function getCategoryLabel(category: string, locale: Locale) {
  const mapping = postCategoryLabels[category as keyof typeof postCategoryLabels];
  return mapping ? mapping[locale] : category;
}

export function getContentFallbackCopy(
  requestedLocale: Locale,
  sourceLocale: Locale,
) {
  if (requestedLocale === "en" && sourceLocale === "zh") {
    return {
      short: "Original CN",
      long: "English version coming soon. Showing the original Chinese for now.",
    };
  }

  if (requestedLocale === "zh" && sourceLocale === "en") {
    return {
      short: "原文 EN",
      long: "中文版稍后补上，当前先显示英文原文。",
    };
  }

  return {
    short: "",
    long: "",
  };
}

export function getContentLocaleLabel(
  contentLocale: Locale,
  uiLocale: Locale,
) {
  if (uiLocale === "en") {
    return contentLocale === "en" ? "English content" : "Chinese content";
  }

  return contentLocale === "en" ? "英文内容" : "中文内容";
}

export function getContentLocaleStatusLabel(
  availableLocales: Locale[],
  uiLocale: Locale,
) {
  const hasZh = availableLocales.includes("zh");
  const hasEn = availableLocales.includes("en");

  if (hasZh && hasEn) {
    return uiLocale === "en" ? "ZH + EN ready" : "中英都有";
  }

  if (hasZh) {
    return uiLocale === "en" ? "ZH only" : "仅中文";
  }

  if (hasEn) {
    return uiLocale === "en" ? "EN only" : "仅英文";
  }

  return uiLocale === "en" ? "No content yet" : "尚未创建";
}
