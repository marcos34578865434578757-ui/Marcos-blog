import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { POST_CATEGORIES, isPostCategory, type PostCategory } from "@/lib/post-categories";
import {
  collectLocalizedEntries,
  deleteLocalizedSlugFiles,
  fileExists,
  getLegacyFilePath,
  getLocalizedFilePath,
  renameLocalizedSlugFiles,
  resolveLocalizedFile,
} from "@/lib/localized-content";
import {
  normalizeLegacyMediaContent,
  normalizeLegacyMediaPath,
} from "@/lib/media-storage";
import type { Locale } from "@/lib/messages";
import { getAllPosts, getPostBySlug, type Post } from "@/lib/posts";
import { getAllProjects, getProjectBySlug, type Project } from "@/lib/projects";

export type ManagedContentKind = "post" | "project";

type EditorLocaleMeta = {
  contentLocale: Locale;
  availableLocales: Locale[];
  translationSourceLocale: Locale | null;
};

export type PostEditorData = EditorLocaleMeta & {
  kind: "post";
  previousSlug: string | null;
  slug: string;
  title: string;
  date: string;
  description: string;
  category: PostCategory;
  tags: string;
  cover: string;
  readingTime: string;
  featured: boolean;
  content: string;
};

export type ProjectEditorData = EditorLocaleMeta & {
  kind: "project";
  previousSlug: string | null;
  slug: string;
  title: string;
  date: string;
  description: string;
  tags: string;
  cover: string;
  status: string;
  demo: string;
  github: string;
  featured: boolean;
  content: string;
};

export type EditorData = PostEditorData | ProjectEditorData;
export type EditorFieldErrors = Partial<Record<string, string>>;

const blogDirectory = path.join(process.cwd(), "src", "content", "blog");
const projectDirectory = path.join(process.cwd(), "src", "content", "projects");

export function getTodayDate() {
  return new Date().toISOString().slice(0, 10);
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function splitTags(value: string) {
  return value
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function normalizeMultilineContent(value: string) {
  return value.replace(/\r\n/g, "\n").trim();
}

function isValidDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  return !Number.isNaN(Date.parse(`${value}T00:00:00Z`));
}

function isValidHttpUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function isValidCover(value: string) {
  return value === "" || value.startsWith("/") || isValidHttpUrl(value);
}

function isValidExternalUrl(value: string) {
  return value === "" || isValidHttpUrl(value);
}

function formatTags(tags: string[]) {
  return tags.join(", ");
}

function estimateReadingTime(content: string) {
  const words = content
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/[#>*_\-\[\]()`]/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;

  const minutes = Math.max(1, Math.ceil(words / 220));
  return `${minutes} min read`;
}

async function readMdxFile(filePath: string) {
  const raw = await fs.readFile(filePath, "utf8");
  return matter(raw);
}

function buildPostFrontmatter(input: PostEditorData) {
  return {
    title: input.title,
    date: input.date,
    description: input.description,
    category: input.category,
    tags: splitTags(input.tags),
    cover: normalizeLegacyMediaPath(input.cover),
    readingTime: input.readingTime || estimateReadingTime(input.content),
    featured: input.featured,
  };
}

function buildProjectFrontmatter(input: ProjectEditorData) {
  return {
    title: input.title,
    description: input.description,
    date: input.date,
    tags: splitTags(input.tags),
    cover: normalizeLegacyMediaPath(input.cover),
    status: input.status,
    demo: input.demo || undefined,
    github: input.github || undefined,
    featured: input.featured,
  };
}

function formatDocument(content: string, data: Record<string, unknown>) {
  return `${matter.stringify(`${content.trim()}\n`, data).trim()}\n`;
}

function validateCommonFields(input: {
  title: string;
  slug: string;
  date: string;
  description: string;
  cover: string;
  content: string;
}) {
  const errors: EditorFieldErrors = {};

  if (!input.title) {
    errors.title = "请输入标题。";
  }

  if (!input.slug) {
    errors.slug = "请输入 slug，或先填写标题让我自动生成。";
  } else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(input.slug)) {
    errors.slug = "Slug 只能包含小写字母、数字和连字符。";
  }

  if (!input.date) {
    errors.date = "请输入发布日期。";
  } else if (!isValidDate(input.date)) {
    errors.date = "日期格式需要是 YYYY-MM-DD。";
  }

  if (!input.description) {
    errors.description = "请输入摘要。";
  }

  if (!isValidCover(input.cover)) {
    errors.cover = "封面地址需要是 / 开头的本地路径，或合法的 http(s) 地址。";
  }

  if (!input.content) {
    errors.content = "正文不能为空。";
  }

  return errors;
}

function createEditorLocaleMeta(contentLocale: Locale): EditorLocaleMeta {
  return {
    contentLocale,
    availableLocales: [],
    translationSourceLocale: null,
  };
}

export function createEmptyPostDraft(contentLocale: Locale = "zh"): PostEditorData {
  return {
    kind: "post",
    previousSlug: null,
    slug: "",
    title: "",
    date: getTodayDate(),
    description: "",
    category: POST_CATEGORIES[0],
    tags: "",
    cover: "",
    readingTime: "",
    featured: false,
    content:
      contentLocale === "en"
        ? "## Start writing\n\nWrite your English version here."
        : "## 开始写作\n\n在这里写下你的正文。",
    ...createEditorLocaleMeta(contentLocale),
  };
}

export function createEmptyProjectDraft(
  contentLocale: Locale = "zh",
): ProjectEditorData {
  return {
    kind: "project",
    previousSlug: null,
    slug: "",
    title: "",
    date: getTodayDate(),
    description: "",
    tags: "",
    cover: "",
    status: contentLocale === "en" ? "In progress" : "进行中",
    demo: "",
    github: "",
    featured: false,
    content:
      contentLocale === "en"
        ? "## Project background\n\nDescribe why this project exists."
        : "## 项目背景\n\n介绍一下这个项目为什么存在。",
    ...createEditorLocaleMeta(contentLocale),
  };
}

async function slugExistsInDirectory(directory: string, slug: string) {
  return (
    (await fileExists(getLocalizedFilePath(directory, slug, "zh"))) ||
    (await fileExists(getLocalizedFilePath(directory, slug, "en"))) ||
    (await fileExists(getLegacyFilePath(directory, slug)))
  );
}

export async function getEditablePost(
  slug: string,
  contentLocale: Locale = "zh",
) {
  const entries = await collectLocalizedEntries(blogDirectory);
  const entry = entries.find((item) => item.slug === slug);

  if (!entry) {
    return null;
  }

  const resolved = resolveLocalizedFile(blogDirectory, entry, contentLocale);
  if (!resolved) {
    return null;
  }

  const { data, content } = await readMdxFile(resolved.filePath);
  const category = String(data.category ?? "");

  return {
    kind: "post",
    previousSlug: slug,
    slug,
    title: typeof data.title === "string" ? data.title : "",
    date:
      typeof data.date === "string"
        ? data.date
        : data.date instanceof Date
          ? data.date.toISOString().slice(0, 10)
          : "",
    description: typeof data.description === "string" ? data.description : "",
    category: isPostCategory(category) ? category : POST_CATEGORIES[0],
    tags: Array.isArray(data.tags) ? formatTags(data.tags.filter(Boolean)) : "",
    cover:
      typeof data.cover === "string" ? normalizeLegacyMediaPath(data.cover) : "",
    readingTime: typeof data.readingTime === "string" ? data.readingTime : "",
    featured: Boolean(data.featured),
    content: normalizeLegacyMediaContent(content).trim(),
    contentLocale,
    availableLocales: resolved.availableLocales,
    translationSourceLocale: resolved.isFallback ? resolved.sourceLocale : null,
  } satisfies PostEditorData;
}

export async function getEditableProject(
  slug: string,
  contentLocale: Locale = "zh",
) {
  const entries = await collectLocalizedEntries(projectDirectory);
  const entry = entries.find((item) => item.slug === slug);

  if (!entry) {
    return null;
  }

  const resolved = resolveLocalizedFile(projectDirectory, entry, contentLocale);
  if (!resolved) {
    return null;
  }

  const { data, content } = await readMdxFile(resolved.filePath);

  return {
    kind: "project",
    previousSlug: slug,
    slug,
    title: typeof data.title === "string" ? data.title : "",
    date:
      typeof data.date === "string"
        ? data.date
        : data.date instanceof Date
          ? data.date.toISOString().slice(0, 10)
          : "",
    description: typeof data.description === "string" ? data.description : "",
    tags: Array.isArray(data.tags) ? formatTags(data.tags.filter(Boolean)) : "",
    cover:
      typeof data.cover === "string" ? normalizeLegacyMediaPath(data.cover) : "",
    status: typeof data.status === "string" ? data.status : "",
    demo: typeof data.demo === "string" ? data.demo : "",
    github: typeof data.github === "string" ? data.github : "",
    featured: Boolean(data.featured),
    content: normalizeLegacyMediaContent(content).trim(),
    contentLocale,
    availableLocales: resolved.availableLocales,
    translationSourceLocale: resolved.isFallback ? resolved.sourceLocale : null,
  } satisfies ProjectEditorData;
}

export async function getAdminDashboardData(locale: Locale = "zh") {
  const [posts, projects] = await Promise.all([
    getAllPosts(locale),
    getAllProjects(locale),
  ]);

  return {
    posts,
    projects,
  };
}

export async function savePostFromForm(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const previousSlug = String(formData.get("previousSlug") ?? "").trim() || null;
  const generatedSlug = slugify(title);
  const rawSlug = String(formData.get("slug") ?? "").trim();
  const slug = slugify(rawSlug || generatedSlug);
  const rawCategory = String(formData.get("category") ?? "").trim();
  const contentLocale =
    formData.get("contentLocale") === "en" ? "en" : "zh";

  const draft: PostEditorData = {
    kind: "post",
    previousSlug,
    slug,
    title,
    date: String(formData.get("date") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    category: isPostCategory(rawCategory) ? rawCategory : POST_CATEGORIES[0],
    tags: String(formData.get("tags") ?? "").trim(),
    cover: normalizeLegacyMediaPath(String(formData.get("cover") ?? "").trim()),
    readingTime: String(formData.get("readingTime") ?? "").trim(),
    featured: formData.get("featured") === "on",
    content: normalizeLegacyMediaContent(
      normalizeMultilineContent(String(formData.get("content") ?? "")),
    ),
    contentLocale,
    availableLocales: [],
    translationSourceLocale: null,
  };

  const errors = validateCommonFields(draft);
  if (!isPostCategory(rawCategory)) {
    errors.category = "请选择一个有效的文章分类。";
  }

  if (draft.readingTime && !/^\d+\s+min\s+read$/i.test(draft.readingTime)) {
    errors.readingTime = "阅读时长建议使用类似 6 min read 的格式。";
  }

  if (
    draft.slug &&
    draft.slug !== draft.previousSlug &&
    (await slugExistsInDirectory(blogDirectory, draft.slug))
  ) {
    errors.slug = "这个 slug 已经存在了，换一个更独特的吧。";
  }

  if (Object.keys(errors).length > 0) {
    return {
      ok: false,
      errors,
      values: draft,
    } as const;
  }

  if (draft.previousSlug && draft.previousSlug !== draft.slug) {
    await renameLocalizedSlugFiles(blogDirectory, draft.previousSlug, draft.slug);
  }

  await fs.mkdir(blogDirectory, { recursive: true });
  await fs.writeFile(
    getLocalizedFilePath(blogDirectory, draft.slug, draft.contentLocale),
    formatDocument(draft.content, buildPostFrontmatter(draft)),
    "utf8",
  );

  return {
    ok: true,
    slug: draft.slug,
    contentLocale: draft.contentLocale,
    message: draft.previousSlug ? "文章已更新。" : "文章已创建。",
  } as const;
}

export async function saveProjectFromForm(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const previousSlug = String(formData.get("previousSlug") ?? "").trim() || null;
  const generatedSlug = slugify(title);
  const rawSlug = String(formData.get("slug") ?? "").trim();
  const slug = slugify(rawSlug || generatedSlug);
  const contentLocale =
    formData.get("contentLocale") === "en" ? "en" : "zh";

  const draft: ProjectEditorData = {
    kind: "project",
    previousSlug,
    slug,
    title,
    date: String(formData.get("date") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    tags: String(formData.get("tags") ?? "").trim(),
    cover: normalizeLegacyMediaPath(String(formData.get("cover") ?? "").trim()),
    status: String(formData.get("status") ?? "").trim(),
    demo: String(formData.get("demo") ?? "").trim(),
    github: String(formData.get("github") ?? "").trim(),
    featured: formData.get("featured") === "on",
    content: normalizeLegacyMediaContent(
      normalizeMultilineContent(String(formData.get("content") ?? "")),
    ),
    contentLocale,
    availableLocales: [],
    translationSourceLocale: null,
  };

  const errors = validateCommonFields(draft);

  if (!draft.status) {
    errors.status = "请填写项目状态。";
  }

  if (!isValidExternalUrl(draft.demo)) {
    errors.demo = "演示地址需要是合法的 http(s) 链接。";
  }

  if (!isValidExternalUrl(draft.github)) {
    errors.github = "GitHub 地址需要是合法的 http(s) 链接。";
  }

  if (
    draft.slug &&
    draft.slug !== draft.previousSlug &&
    (await slugExistsInDirectory(projectDirectory, draft.slug))
  ) {
    errors.slug = "这个 slug 已经存在了，换一个更独特的吧。";
  }

  if (Object.keys(errors).length > 0) {
    return {
      ok: false,
      errors,
      values: draft,
    } as const;
  }

  if (draft.previousSlug && draft.previousSlug !== draft.slug) {
    await renameLocalizedSlugFiles(projectDirectory, draft.previousSlug, draft.slug);
  }

  await fs.mkdir(projectDirectory, { recursive: true });
  await fs.writeFile(
    getLocalizedFilePath(projectDirectory, draft.slug, draft.contentLocale),
    formatDocument(draft.content, buildProjectFrontmatter(draft)),
    "utf8",
  );

  return {
    ok: true,
    slug: draft.slug,
    contentLocale: draft.contentLocale,
    message: draft.previousSlug ? "项目已更新。" : "项目已创建。",
  } as const;
}

export async function deletePostBySlug(slug: string) {
  const post = await getPostBySlug(slug, "zh");
  const fallbackPost = post ?? (await getPostBySlug(slug, "en"));

  if (!fallbackPost) {
    return false;
  }

  await deleteLocalizedSlugFiles(blogDirectory, slug);
  return true;
}

export async function deleteProjectBySlug(slug: string) {
  const project = await getProjectBySlug(slug, "zh");
  const fallbackProject = project ?? (await getProjectBySlug(slug, "en"));

  if (!fallbackProject) {
    return false;
  }

  await deleteLocalizedSlugFiles(projectDirectory, slug);
  return true;
}

export type DashboardPost = Post;
export type DashboardProject = Project;
