import type { Metadata } from "next";
import { saveProjectAction } from "@/app/studio/actions";
import { ContentEditor } from "@/components/admin/ContentEditor";
import { createEmptyProjectDraft } from "@/lib/content-admin";
import { getRequestLocale } from "@/lib/locale";
import { getMessages } from "@/lib/messages";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  return {
    title: locale === "en" ? "New Project" : "新建项目",
    description:
      locale === "en"
        ? "Create a new project entry in the admin dashboard."
        : "在后台创建新的项目条目。",
  };
}

export default async function NewProjectPage() {
  const locale = await getRequestLocale();
  const messages = getMessages(locale);

  return (
    <ContentEditor
      title={messages.admin.editor.newProjectTitle}
      description={messages.admin.editor.newProjectDescription}
      data={createEmptyProjectDraft("zh")}
      saveAction={saveProjectAction}
    />
  );
}
