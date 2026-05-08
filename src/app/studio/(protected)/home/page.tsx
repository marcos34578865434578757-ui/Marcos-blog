import type { Metadata } from "next";
import { HomeContentEditor } from "@/components/admin/HomeContentEditor";
import { getHomeContent, homeContentToEditorValues } from "@/lib/home-content";
import { getRequestLocale } from "@/lib/locale";
import { getMessages } from "@/lib/messages";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const messages = getMessages(locale);

  return {
    title: messages.admin.homeContent.eyebrow,
    description: messages.admin.homeContent.description,
  };
}

export default async function AdminHomeContentPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const locale = await getRequestLocale();
  const messages = getMessages(locale);
  const [homeContent, params] = await Promise.all([getHomeContent(), searchParams]);

  return (
    <section className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-accent)]">
          {messages.admin.homeContent.eyebrow}
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-[var(--color-ink)]">
          {messages.admin.homeContent.title}
        </h1>
        <p className="mt-3 max-w-3xl text-base leading-8 text-[var(--color-copy)]">
          {messages.admin.homeContent.description}
        </p>
      </div>

      <HomeContentEditor
        values={homeContentToEditorValues(homeContent)}
        saved={params.saved === "1"}
      />
    </section>
  );
}
