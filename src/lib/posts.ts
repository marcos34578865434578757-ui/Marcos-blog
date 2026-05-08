import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import {
  collectLocalizedEntries,
  resolveLocalizedFile,
} from "@/lib/localized-content";
import {
  normalizeLegacyMediaContent,
  normalizeLegacyMediaPath,
} from "@/lib/media-storage";
import { isPostCategory, type PostCategory } from "@/lib/post-categories";
import type { Locale } from "@/lib/messages";

export type PostFrontmatter = {
  title: string;
  date: string;
  description: string;
  tags: string[];
  cover: string;
  readingTime: string;
  featured?: boolean;
  category: PostCategory;
};

export type TocItem = {
  id: string;
  title: string;
  depth: 2 | 3;
};

export type Post = PostFrontmatter & {
  slug: string;
  content: string;
  toc: TocItem[];
  requestedLocale: Locale;
  sourceLocale: Locale;
  availableLocales: Locale[];
  isFallback: boolean;
};

const contentDirectory = path.join(process.cwd(), "src", "content", "blog");

function normalizeDate(value: unknown) {
  if (typeof value === "string") {
    return value;
  }

  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }

  return "";
}

function extractToc(raw: string) {
  const lines = raw.split("\n");
  let insideCodeBlock = false;
  const toc: TocItem[] = [];

  for (const line of lines) {
    if (line.trim().startsWith("```")) {
      insideCodeBlock = !insideCodeBlock;
      continue;
    }

    if (insideCodeBlock) {
      continue;
    }

    const match = /^(##|###)\s+(.+)$/.exec(line.trim());
    if (!match) {
      continue;
    }

    const depth = match[1].length as 2 | 3;
    const title = match[2].trim();
    const id = title
      .toLowerCase()
      .replace(/[^\w\u4e00-\u9fa5 -]/g, "")
      .replace(/\s+/g, "-");

    toc.push({ id, title, depth });
  }

  return toc;
}

async function readPostFromEntry(
  entry: Awaited<ReturnType<typeof collectLocalizedEntries>>[number],
  locale: Locale,
): Promise<Post | null> {
  const resolved = resolveLocalizedFile(contentDirectory, entry, locale);
  if (!resolved) {
    return null;
  }

  const raw = await fs.readFile(resolved.filePath, "utf8");
  const { data, content } = matter(raw);
  const typed = data as Partial<PostFrontmatter> & { date?: string | Date };
  const category = String(typed.category ?? "");

  return {
    slug: entry.slug,
    title: typed.title ?? "",
    description: typed.description ?? "",
    tags: typed.tags ?? [],
    cover: typeof typed.cover === "string" ? normalizeLegacyMediaPath(typed.cover) : "",
    readingTime: typed.readingTime ?? "",
    featured: typeof typed.featured === "boolean" ? typed.featured : false,
    category: isPostCategory(category) ? category : "成长思考",
    date: normalizeDate(typed.date),
    content: normalizeLegacyMediaContent(content),
    toc: extractToc(normalizeLegacyMediaContent(content)),
    requestedLocale: locale,
    sourceLocale: resolved.sourceLocale,
    availableLocales: resolved.availableLocales,
    isFallback: resolved.isFallback,
  };
}

export async function getAllPosts(locale: Locale = "zh") {
  const entries = await collectLocalizedEntries(contentDirectory);
  const posts = await Promise.all(entries.map((entry) => readPostFromEntry(entry, locale)));

  return posts
    .filter((post): post is Post => Boolean(post))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getFeaturedPosts(limit = 3, locale: Locale = "zh") {
  const posts = await getAllPosts(locale);
  const featuredPosts = posts.filter((post) => post.featured);

  if (featuredPosts.length > 0) {
    return featuredPosts.slice(0, limit);
  }

  return posts.slice(0, limit);
}

export async function getPostBySlug(slug: string, locale: Locale = "zh") {
  const entries = await collectLocalizedEntries(contentDirectory);
  const entry = entries.find((item) => item.slug === slug);
  return entry ? readPostFromEntry(entry, locale) : null;
}

export async function getAdjacentPosts(slug: string, locale: Locale = "zh") {
  const posts = await getAllPosts(locale);
  const index = posts.findIndex((post) => post.slug === slug);

  return {
    previous: index < posts.length - 1 ? posts[index + 1] : null,
    next: index > 0 ? posts[index - 1] : null,
  };
}
