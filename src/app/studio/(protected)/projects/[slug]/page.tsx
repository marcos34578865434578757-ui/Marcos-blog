import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { deleteProjectAction, saveProjectAction } from "@/app/studio/actions";
import { ContentEditor } from "@/components/admin/ContentEditor";
import { getEditableProject } from "@/lib/content-admin";
import { getRequestLocale } from "@/lib/locale";
import { getMessages, isLocale } from "@/lib/messages";

type ProjectEditorPageProps = {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<{
    saved?: string;
    contentLocale?: string;
  }>;
};

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  return {
    title: locale === "en" ? "Edit Project" : "编辑项目",
    description:
      locale === "en"
        ? "Edit a project entry from the admin dashboard."
        : "在后台编辑项目条目。",
  };
}

export default async function ProjectEditorPage({
  params,
  searchParams,
}: ProjectEditorPageProps) {
  const locale = await getRequestLocale();
  const messages = getMessages(locale);
  const [{ slug }, { saved, contentLocale: rawContentLocale }] = await Promise.all([
    params,
    searchParams,
  ]);
  const contentLocale = isLocale(rawContentLocale) ? rawContentLocale : "zh";
  const project = await getEditableProject(slug, contentLocale);

  if (!project) {
    notFound();
  }

  return (
    <ContentEditor
      title={`${messages.admin.editor.editProjectTitle} ${project.title || slug}`}
      description={messages.admin.editor.editProjectDescription}
      data={project}
      saveAction={saveProjectAction}
      deleteAction={deleteProjectAction}
      publicHref={`/projects/${slug}`}
      saved={saved === "1"}
      localeLinks={{
        zh: `/studio/projects/${slug}?contentLocale=zh`,
        en: `/studio/projects/${slug}?contentLocale=en`,
      }}
    />
  );
}
