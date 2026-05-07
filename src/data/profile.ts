export const profile = {
  name: "Marcos",
  siteName: "Marcos Blog",
  title: "AI 建站成长记录者",
  subtitle:
    "记录我从代码小白出发，借助 AI 把想法做成网站、文章和项目的过程。",
  bio:
    "你好，我是 Marcos。我正在认真学习如何借助 AI 做网站、整理内容、打磨界面，也把这些真实过程持续留在这个博客里。这里既是我的个人作品站，也是我长期记录方法、复盘过程和公开成长的地方。",
  avatar: "/images/avatar.png",
  email: "marcos34578865434578757@gmail.com",
  music: {
    title: "Close To You",
    artist: "Carpenters",
    src: "/audio/close-to-you.mp3",
  },
  socialLinks: [
    {
      key: "github",
      label: "GitHub",
      href: "https://github.com/marcos34578865434578757-ui",
      enabled: true,
      variant: "dark" as const,
    },
    {
      key: "xiaohongshu",
      label: "小红书",
      href: "https://www.xiaohongshu.com/user/profile/6667aaea0000000007005d21",
      enabled: true,
      variant: "light" as const,
    },
    {
      key: "bilibili",
      label: "Bilibili",
      href: "https://space.bilibili.com/1089924817?spm_id_from=333.1007.0.0",
      enabled: true,
      variant: "light" as const,
    },
    {
      key: "x",
      label: "X",
      href: "https://x.com/Leochalikes",
      enabled: true,
      variant: "light" as const,
    },
    {
      key: "email",
      label: "邮箱",
      href: "mailto:marcos34578865434578757@gmail.com",
      enabled: true,
      variant: "icon" as const,
    },
  ],
};

export type Profile = typeof profile;
