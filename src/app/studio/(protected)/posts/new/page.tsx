import type { Metadata } from "next";
import { savePostAction } from "@/app/studio/actions";
import { ContentEditor } from "@/components/admin/ContentEditor";
import { createEmptyPostDraft } from "@/lib/content-admin";
import { getRequestLocale } from "@/lib/locale";
import { getMessages } from "@/lib/messages";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  return {
    title: locale === "en" ? "New Post" : "新建文章",
    description:
      locale === "en"
        ? "Create a new blog post in the admin dashboard."
        : "在后台创建一篇新的博客文章。",
  };
}

export default async function NewPostPage() {
  const locale = await getRequestLocale();
  const messages = getMessages(locale);

  return (
    <ContentEditor
      title={messages.admin.editor.newPostTitle}
      description={messages.admin.editor.newPostDescription}
      data={createEmptyPostDraft("zh")}
      saveAction={savePostAction}
    />
  );
}
