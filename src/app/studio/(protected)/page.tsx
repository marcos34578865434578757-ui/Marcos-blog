import Link from "next/link";
import { getAdminDashboardData } from "@/lib/content-admin";
import { POST_CATEGORIES } from "@/lib/post-categories";
import { getRequestLocale } from "@/lib/locale";
import {
  getCategoryLabel,
  getContentLocaleStatusLabel,
  getMessages,
} from "@/lib/messages";

function StatCard({
  label,
  value,
  helper,
}: {
  label: string;
  value: string | number;
  helper: string;
}) {
  return (
    <div className="theme-card-soft rounded-[28px] p-6">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-accent)]">
        {label}
      </p>
      <p className="mt-4 text-4xl font-semibold text-[var(--color-ink)]">{value}</p>
      <p className="mt-3 text-sm leading-7 text-[var(--color-copy)]">{helper}</p>
    </div>
  );
}

function ContentTable({
  title,
  helper,
  hrefPrefix,
  defaultContentLocale,
  items,
}: {
  title: string;
  helper: string;
  hrefPrefix: "/studio/posts" | "/studio/projects";
  defaultContentLocale: "zh" | "en";
  items: Array<{
    slug: string;
    title: string;
    description: string;
    date: string;
    tags: string[];
    extra?: string | null;
    localeStatus: string;
  }>;
}) {
  return (
    <section className="theme-card rounded-[34px] p-6 sm:p-7">
      <div>
        <h2 className="text-2xl font-semibold text-[var(--color-ink)]">{title}</h2>
        <p className="mt-3 text-sm leading-7 text-[var(--color-copy)]">{helper}</p>
      </div>

      <div className="mt-6 space-y-4">
        {items.map((item) => (
          <Link
            key={item.slug}
            href={`${hrefPrefix}/${item.slug}?contentLocale=${defaultContentLocale}`}
            className="theme-card-soft block rounded-[28px] p-5 hover:-translate-y-0.5"
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-lg font-semibold text-[var(--color-ink)]">
                    {item.title}
                  </h3>
                  {item.extra ? (
                    <span className="rounded-full bg-white/65 px-3 py-1 text-xs font-medium text-[var(--color-muted)]">
                      {item.extra}
                    </span>
                  ) : null}
                  <span className="rounded-full bg-[rgba(143,220,194,0.18)] px-3 py-1 text-xs font-semibold text-[var(--color-accent)]">
                    {item.localeStatus}
                  </span>
                </div>
                <p className="mt-2 line-clamp-2 text-sm leading-7 text-[var(--color-copy)]">
                  {item.description}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-white/65 px-3 py-1 text-xs font-medium text-[var(--color-muted)]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="shrink-0 text-sm text-[var(--color-muted)]">{item.date}</div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default async function AdminDashboardPage() {
  const locale = await getRequestLocale();
  const messages = getMessages(locale);
  const { posts, projects } = await getAdminDashboardData(locale);
  const featuredPosts = posts.filter((item) => item.featured).length;
  const featuredProjects = projects.filter((item) => item.featured).length;
  const categorySummary = POST_CATEGORIES.map((category) => ({
    category,
    count: posts.filter((post) => post.category === category).length,
  }));

  return (
    <div className="space-y-6">
      <section className="grid gap-5 md:grid-cols-4">
        <StatCard
          label={messages.admin.dashboard.postsLabel}
          value={posts.length}
          helper={messages.admin.dashboard.postsHelper}
        />
        <StatCard
          label={messages.admin.dashboard.projectsLabel}
          value={projects.length}
          helper={messages.admin.dashboard.projectsHelper}
        />
        <StatCard
          label={messages.admin.dashboard.featuredLabel}
          value={featuredPosts + featuredProjects}
          helper={messages.admin.dashboard.featuredHelper}
        />
        <StatCard
          label={messages.admin.dashboard.homeLabel}
          value="1"
          helper={messages.admin.dashboard.homeHelper}
        />
      </section>

      <section className="theme-card-soft rounded-[34px] p-6 sm:p-7">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-[var(--color-ink)]">
              {messages.admin.dashboard.categoryTitle}
            </h2>
            <p className="mt-3 text-sm leading-7 text-[var(--color-copy)]">
              {messages.admin.dashboard.categoryDescription}
            </p>
          </div>
          <Link
            href="/studio/home"
            className="inline-flex h-11 items-center justify-center rounded-full bg-[linear-gradient(135deg,#8fdcc2,#cfe8ff)] px-5 text-sm font-semibold text-slate-900 shadow-[0_18px_38px_rgba(143,220,194,0.28)]"
          >
            {messages.admin.dashboard.editHomeContent}
          </Link>
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {categorySummary.map((item) => (
            <div
              key={item.category}
              className="rounded-[26px] border border-[var(--color-border)] bg-white/55 p-5"
            >
              <p className="text-sm font-semibold text-[var(--color-ink)]">
                {getCategoryLabel(item.category, locale)}
              </p>
              <p className="mt-3 text-3xl font-semibold text-[var(--color-accent)]">
                {item.count}
              </p>
            </div>
          ))}
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-2">
        <ContentTable
          title={messages.admin.dashboard.recentPostsTitle}
          helper={messages.admin.dashboard.recentPostsHelper}
          hrefPrefix="/studio/posts"
          defaultContentLocale={locale}
          items={posts.map((post) => ({
            ...post,
            extra: post.featured
              ? messages.admin.dashboard.featuredPostBadge
              : `${getCategoryLabel(post.category, locale)} · ${post.readingTime}`,
            localeStatus: getContentLocaleStatusLabel(post.availableLocales, locale),
          }))}
        />

        <ContentTable
          title={messages.admin.dashboard.recentProjectsTitle}
          helper={messages.admin.dashboard.recentProjectsHelper}
          hrefPrefix="/studio/projects"
          defaultContentLocale={locale}
          items={projects.map((project) => ({
            ...project,
            extra: project.featured
              ? messages.admin.dashboard.featuredProjectBadge
              : project.status,
            localeStatus: getContentLocaleStatusLabel(project.availableLocales, locale),
          }))}
        />
      </div>
    </div>
  );
}
