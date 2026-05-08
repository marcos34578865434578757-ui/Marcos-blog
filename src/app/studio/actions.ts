"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  clearAdminSession,
  establishAdminSession,
  requireAdminSession,
  verifyAdminCredentials,
} from "@/lib/admin-auth";
import {
  deletePostBySlug,
  deleteProjectBySlug,
  savePostFromForm,
  saveProjectFromForm,
  type EditorData,
  type EditorFieldErrors,
} from "@/lib/content-admin";
import {
  getHomeContentEditorValuesFromForm,
  saveHomeContent,
  validateHomeContentValues,
  type HomeContentEditorValues,
  type HomeContentFieldErrors,
} from "@/lib/home-content";
import { getRequestLocale } from "@/lib/locale";

export type LoginActionState = {
  error: string | null;
};

export type EditorActionState = {
  message: string | null;
  errors: EditorFieldErrors;
  values: EditorData | null;
};

export type HomeContentActionState = {
  message: string | null;
  errors: HomeContentFieldErrors;
  values: HomeContentEditorValues | null;
};

function revalidateContentPaths(kind: "post" | "project", slug: string) {
  revalidatePath("/");
  revalidatePath("/studio");

  if (kind === "post") {
    revalidatePath("/blog");
    revalidatePath(`/blog/${slug}`);
    return;
  }

  revalidatePath("/projects");
  revalidatePath(`/projects/${slug}`);
}

function revalidateHomePaths() {
  revalidatePath("/");
  revalidatePath("/studio");
  revalidatePath("/studio/home");
}

function getActionMessages(locale: "zh" | "en") {
  return {
    missingConfig:
      locale === "en"
        ? "Admin environment variables are not configured yet. Please set ADMIN_PASSWORD and ADMIN_SESSION_SECRET first."
        : "后台登录环境变量还没配置完整，请先设置 ADMIN_PASSWORD 和 ADMIN_SESSION_SECRET。",
    invalidCredentials:
      locale === "en" ? "Invalid username or password." : "用户名或密码不正确。",
    fixForm:
      locale === "en" ? "Please fix the highlighted form issues first." : "请先修正表单里的问题。",
    fixHomeForm:
      locale === "en"
        ? "Please fix the highlighted home content issues first."
        : "请先修正首页内容表单里的问题。",
    chooseImage:
      locale === "en" ? "Please choose an image first." : "请先选择一张图片再上传。",
  };
}

export async function loginAction(
  _previousState: LoginActionState,
  formData: FormData,
): Promise<LoginActionState> {
  const locale = await getRequestLocale();
  const labels = getActionMessages(locale);
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "").trim();
  const result = await verifyAdminCredentials(username, password);

  if (!result.ok) {
    return {
      error:
        result.reason === "missing-config"
          ? labels.missingConfig
          : labels.invalidCredentials,
    };
  }

  await establishAdminSession();
  redirect("/studio");
}

export async function logoutAction() {
  await clearAdminSession();
  redirect("/studio/login");
}

export async function savePostAction(
  _previousState: EditorActionState,
  formData: FormData,
): Promise<EditorActionState> {
  const locale = await getRequestLocale();
  const labels = getActionMessages(locale);
  await requireAdminSession();

  const result = await savePostFromForm(formData);
  if (!result.ok) {
    return {
      message: labels.fixForm,
      errors: result.errors,
      values: result.values,
    };
  }

  revalidateContentPaths("post", result.slug);
  redirect(`/studio/posts/${result.slug}?saved=1&contentLocale=${result.contentLocale}`);
}

export async function saveProjectAction(
  _previousState: EditorActionState,
  formData: FormData,
): Promise<EditorActionState> {
  const locale = await getRequestLocale();
  const labels = getActionMessages(locale);
  await requireAdminSession();

  const result = await saveProjectFromForm(formData);
  if (!result.ok) {
    return {
      message: labels.fixForm,
      errors: result.errors,
      values: result.values,
    };
  }

  revalidateContentPaths("project", result.slug);
  redirect(
    `/studio/projects/${result.slug}?saved=1&contentLocale=${result.contentLocale}`,
  );
}

export async function saveHomeContentAction(
  _previousState: HomeContentActionState,
  formData: FormData,
): Promise<HomeContentActionState> {
  const locale = await getRequestLocale();
  const labels = getActionMessages(locale);
  await requireAdminSession();

  const values = getHomeContentEditorValuesFromForm(formData);
  const errors = validateHomeContentValues(values);

  if (Object.keys(errors).length > 0) {
    return {
      message: labels.fixHomeForm,
      errors,
      values,
    };
  }

  await saveHomeContent(values);
  revalidateHomePaths();
  redirect("/studio/home?saved=1");
}

export async function deletePostAction(formData: FormData) {
  await requireAdminSession();

  const slug = String(formData.get("slug") ?? "").trim();
  if (!slug) {
    return;
  }

  const deleted = await deletePostBySlug(slug);
  if (deleted) {
    revalidatePath("/");
    revalidatePath("/studio");
    revalidatePath("/blog");
    revalidatePath(`/blog/${slug}`);
  }

  redirect("/studio?deleted=post");
}

export async function deleteProjectAction(formData: FormData) {
  await requireAdminSession();

  const slug = String(formData.get("slug") ?? "").trim();
  if (!slug) {
    return;
  }

  const deleted = await deleteProjectBySlug(slug);
  if (deleted) {
    revalidatePath("/");
    revalidatePath("/studio");
    revalidatePath("/projects");
    revalidatePath(`/projects/${slug}`);
  }

  redirect("/studio?deleted=project");
}
