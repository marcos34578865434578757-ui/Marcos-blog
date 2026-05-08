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
import type { Locale } from "@/lib/messages";

export type ProjectFrontmatter = {
  title: string;
  description: string;
  date: string;
  tags: string[];
  cover: string;
  status: string;
  demo?: string;
  github?: string;
  featured?: boolean;
};

export type Project = ProjectFrontmatter & {
  slug: string;
  content: string;
  requestedLocale: Locale;
  sourceLocale: Locale;
  availableLocales: Locale[];
  isFallback: boolean;
};

const contentDirectory = path.join(process.cwd(), "src", "content", "projects");

function normalizeDate(value: unknown) {
  if (typeof value === "string") {
    return value;
  }

  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }

  return "";
}

async function readProjectFromEntry(
  entry: Awaited<ReturnType<typeof collectLocalizedEntries>>[number],
  locale: Locale,
): Promise<Project | null> {
  const resolved = resolveLocalizedFile(contentDirectory, entry, locale);
  if (!resolved) {
    return null;
  }

  const raw = await fs.readFile(resolved.filePath, "utf8");
  const { data, content } = matter(raw);
  const typed = data as Partial<ProjectFrontmatter> & { date?: string | Date };

  return {
    slug: entry.slug,
    title: typed.title ?? "",
    description: typed.description ?? "",
    tags: typed.tags ?? [],
    cover: typeof typed.cover === "string" ? normalizeLegacyMediaPath(typed.cover) : "",
    status: typed.status ?? "",
    demo: typed.demo,
    github: typed.github,
    featured: typeof typed.featured === "boolean" ? typed.featured : false,
    date: normalizeDate(typed.date),
    content: normalizeLegacyMediaContent(content),
    requestedLocale: locale,
    sourceLocale: resolved.sourceLocale,
    availableLocales: resolved.availableLocales,
    isFallback: resolved.isFallback,
  };
}

export async function getAllProjects(locale: Locale = "zh") {
  const entries = await collectLocalizedEntries(contentDirectory);
  const projects = await Promise.all(
    entries.map((entry) => readProjectFromEntry(entry, locale)),
  );

  return projects
    .filter((project): project is Project => Boolean(project))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getFeaturedProjects(limit = 3, locale: Locale = "zh") {
  const projects = await getAllProjects(locale);
  const featuredProjects = projects.filter((project) => project.featured);

  if (featuredProjects.length > 0) {
    return featuredProjects.slice(0, limit);
  }

  return projects.slice(0, limit);
}

export async function getProjectBySlug(slug: string, locale: Locale = "zh") {
  const entries = await collectLocalizedEntries(contentDirectory);
  const entry = entries.find((item) => item.slug === slug);
  return entry ? readProjectFromEntry(entry, locale) : null;
}
