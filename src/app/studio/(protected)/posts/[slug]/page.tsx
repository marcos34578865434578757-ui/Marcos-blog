import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { deletePostAction, savePostAction } from "@/app/studio/actions";
import { ContentEditor } from "@/components/admin/ContentEditor";
import { getEditablePost } from "@/lib/content-admin";
import { getRequestLocale } from "@/lib/locale";
import { getMessages, isLocale } from "@/lib/messages";

type PostEditorPageProps = {
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
    title: locale === "en" ? "Edit Post" : "编辑文章",
    description:
      locale === "en"
        ? "Edit a blog post from the admin dashboard."
        : "在后台编辑博客文章。",
  };
}

export default async function PostEditorPage({
  params,
  searchParams,
}: PostEditorPageProps) {
  const locale = await getRequestLocale();
  const messages = getMessages(locale);
  const [{ slug }, { saved, contentLocale: rawContentLocale }] = await Promise.all([
    params,
    searchParams,
  ]);
  const contentLocale = isLocale(rawContentLocale) ? rawContentLocale : "zh";
  const post = await getEditablePost(slug, contentLocale);

  if (!post) {
    notFound();
  }

  return (
    <ContentEditor
      title={`${messages.admin.editor.editPostTitle} ${post.title || slug}`}
      description={messages.admin.editor.editPostDescription}
      data={post}
      saveAction={savePostAction}
      deleteAction={deletePostAction}
      publicHref={`/blog/${slug}`}
      saved={saved === "1"}
      localeLinks={{
        zh: `/studio/posts/${slug}?contentLocale=zh`,
        en: `/studio/posts/${slug}?contentLocale=en`,
      }}
    />
  );
}
