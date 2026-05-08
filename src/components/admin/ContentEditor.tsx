"use client";

import Link from "next/link";
import {
  useActionState,
  useMemo,
  useRef,
  useState,
} from "react";
import type {
  ChangeEvent,
  ClipboardEvent as ReactClipboardEvent,
  FormEvent,
} from "react";
import { type EditorActionState } from "@/app/studio/actions";
import type { EditorData } from "@/lib/content-admin";
import { POST_CATEGORIES } from "@/lib/post-categories";
import { useLocale, useMessages } from "@/lib/locale-client";
import {
  getCategoryLabel,
  getContentLocaleLabel,
  getContentLocaleStatusLabel,
} from "@/lib/messages";
import { DeleteButton, SaveButton } from "@/components/admin/AdminFormButtons";

type SaveAction = (
  state: EditorActionState,
  formData: FormData,
) => Promise<EditorActionState>;

type DeleteAction = (formData: FormData) => Promise<void>;

type ContentEditorProps = {
  title: string;
  description: string;
  data: EditorData;
  saveAction: SaveAction;
  deleteAction?: DeleteAction;
  publicHref?: string | null;
  saved?: boolean;
  localeLinks?: {
    zh: string;
    en: string;
  };
};

function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return <p className="mt-2 text-sm text-rose-600 dark:text-rose-300">{message}</p>;
}

function MarkdownPreview({ value }: { value: string }) {
  const messages = useMessages();
  const blocks = useMemo(() => {
    const lines = value.split("\n");
    const parsed: Array<
      | { type: "heading"; depth: 2 | 3; text: string }
      | { type: "list"; items: string[]; ordered: boolean }
      | { type: "blockquote"; text: string }
      | { type: "code"; text: string }
      | { type: "paragraph"; text: string }
      | { type: "image"; alt: string; src: string }
    > = [];

    let index = 0;
    while (index < lines.length) {
      const line = lines[index].trimEnd();
      const trimmed = line.trim();

      if (!trimmed) {
        index += 1;
        continue;
      }

      if (trimmed.startsWith("```")) {
        const codeLines: string[] = [];
        index += 1;
        while (index < lines.length && !lines[index].trim().startsWith("```")) {
          codeLines.push(lines[index]);
          index += 1;
        }
        index += 1;
        parsed.push({ type: "code", text: codeLines.join("\n") });
        continue;
      }

      const imageMatch = /^!\[(.*)\]\((.*)\)$/.exec(trimmed);
      if (imageMatch) {
        parsed.push({
          type: "image",
          alt: imageMatch[1] || "Uploaded image",
          src: imageMatch[2],
        });
        index += 1;
        continue;
      }

      if (trimmed.startsWith("## ")) {
        parsed.push({ type: "heading", depth: 2, text: trimmed.slice(3) });
        index += 1;
        continue;
      }

      if (trimmed.startsWith("### ")) {
        parsed.push({ type: "heading", depth: 3, text: trimmed.slice(4) });
        index += 1;
        continue;
      }

      if (trimmed.startsWith("> ")) {
        parsed.push({ type: "blockquote", text: trimmed.slice(2) });
        index += 1;
        continue;
      }

      if (/^[-*]\s+/.test(trimmed) || /^\d+\.\s+/.test(trimmed)) {
        const ordered = /^\d+\.\s+/.test(trimmed);
        const items: string[] = [];

        while (index < lines.length) {
          const current = lines[index].trim();
          if (
            (!ordered && /^[-*]\s+/.test(current)) ||
            (ordered && /^\d+\.\s+/.test(current))
          ) {
            items.push(current.replace(/^([-*]|\d+\.)\s+/, ""));
            index += 1;
            continue;
          }
          break;
        }

        parsed.push({ type: "list", items, ordered });
        continue;
      }

      const paragraph: string[] = [trimmed];
      index += 1;
      while (index < lines.length && lines[index].trim()) {
        const current = lines[index].trim();
        if (
          current.startsWith("## ") ||
          current.startsWith("### ") ||
          current.startsWith("> ") ||
          current.startsWith("```") ||
          /^[-*]\s+/.test(current) ||
          /^\d+\.\s+/.test(current) ||
          /^!\[(.*)\]\((.*)\)$/.test(current)
        ) {
          break;
        }

        paragraph.push(current);
        index += 1;
      }

      parsed.push({ type: "paragraph", text: paragraph.join(" ") });
    }

    return parsed;
  }, [value]);

  if (!value.trim()) {
    return (
      <div className="rounded-[28px] border border-dashed border-[var(--color-border)] px-5 py-10 text-center text-sm text-[var(--color-muted)]">
        {messages.admin.editor.noPreview}
      </div>
    );
  }

  return (
    <div className="theme-card-soft article-content rounded-[28px] p-6">
      {blocks.map((block, index) => {
        if (block.type === "heading") {
          const Tag = block.depth === 2 ? "h2" : "h3";
          return <Tag key={index}>{block.text}</Tag>;
        }

        if (block.type === "blockquote") {
          return <blockquote key={index}>{block.text}</blockquote>;
        }

        if (block.type === "code") {
          return (
            <pre key={index}>
              <code>{block.text}</code>
            </pre>
          );
        }

        if (block.type === "list") {
          const ListTag = block.ordered ? "ol" : "ul";
          return (
            <ListTag key={index}>
              {block.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ListTag>
          );
        }

        if (block.type === "image") {
          return (
            <figure key={index} className="overflow-hidden rounded-[24px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={block.src}
                alt={block.alt}
                className="w-full rounded-[24px] border border-white/70 bg-white/65 object-contain shadow-[0_24px_70px_rgba(51,65,85,0.12)]"
              />
              <figcaption className="mt-3 text-sm text-[var(--color-muted)]">
                {block.alt}
              </figcaption>
            </figure>
          );
        }

        return <p key={index}>{block.text}</p>;
      })}
    </div>
  );
}

type UploadApiResponse = {
  error?: string;
  markdown?: string;
  message?: string;
  target?: "cover" | "content";
  url?: string;
};

async function uploadImageRequest(
  formData: FormData,
  fallbackError: string,
): Promise<UploadApiResponse> {
  const response = await fetch("/api/admin/upload", {
    method: "POST",
    body: formData,
  });

  const payload = (await response
    .json()
    .catch(() => ({ error: fallbackError }))) as UploadApiResponse;

  if (!response.ok) {
    throw new Error(payload.error || payload.message || fallbackError);
  }

  return payload;
}

type UploadPanelProps = {
  kind: "posts" | "projects";
  onUseCover: (url: string) => void;
  onInsertMarkdown: (markdown: string) => void;
};

function UploadPanel({ kind, onUseCover, onInsertMarkdown }: UploadPanelProps) {
  const locale = useLocale();
  const messages = useMessages();
  const [target, setTarget] = useState<"cover" | "content">("cover");
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    setError(null);

    const file = fileRef.current?.files?.[0];
    if (!file) {
      setError(locale === "en" ? "Please choose an image first." : "Please choose an image first.");
      return;
    }

    setIsUploading(true);

    const formData = new FormData();
    formData.set("file", file);
    formData.set("kind", kind);
    formData.set("target", target);

    try {
      const payload = await uploadImageRequest(
        formData,
        messages.admin.editor.pasteFailed,
      );

      if (!payload.url) {
        throw new Error(messages.admin.editor.pasteFailed);
      }

      setUploadedUrl(payload.url);
      setMessage(payload.message ?? null);

      if (payload.target === "content" && payload.markdown) {
        onInsertMarkdown(payload.markdown);
      } else {
        onUseCover(payload.url);
      }

      if (fileRef.current) {
        fileRef.current.value = "";
      }
    } catch (uploadError) {
      setError(
        uploadError instanceof Error
          ? uploadError.message
          : messages.admin.editor.pasteFailed,
      );
      setUploadedUrl(null);
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className="theme-card-soft rounded-[28px] p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-accent)]">
            Media
          </p>
          <h3 className="mt-2 text-lg font-semibold text-[var(--color-ink)]">
            {messages.admin.editor.mediaTitle}
          </h3>
        </div>
        <div className="rounded-full bg-white/65 px-3 py-1 text-xs font-medium text-[var(--color-muted)]">
          {messages.admin.editor.mediaBadge}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <input
          ref={fileRef}
          type="file"
          accept="image/*,.jpg,.jpeg,.png,.webp,.gif,.svg,.avif,.bmp,.ico,.apng"
          className="block w-full rounded-2xl border border-[var(--color-border)] bg-white/70 px-4 py-3 text-sm text-[var(--color-ink)]"
        />
        <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]">
          <select
            value={target}
            onChange={(event) => setTarget(event.target.value as "cover" | "content")}
            className="h-11 rounded-full border border-[var(--color-border)] bg-white/80 px-4 text-sm text-[var(--color-ink)] outline-none"
          >
            <option value="cover">{messages.admin.editor.uploadToCover}</option>
            <option value="content">{messages.admin.editor.insertIntoContent}</option>
          </select>
          <button
            type="submit"
            disabled={isUploading}
            className="inline-flex h-11 items-center justify-center rounded-full bg-[linear-gradient(135deg,#8fdcc2,#cfe8ff)] px-5 text-sm font-semibold text-slate-900 shadow-[0_18px_38px_rgba(143,220,194,0.28)]"
          >
            {isUploading ? messages.admin.editor.pasting : messages.admin.editor.uploadImage}
          </button>
        </div>
      </form>

      <div className="mt-3 space-y-1 text-xs leading-6 text-[var(--color-muted)]">
        <p>{messages.admin.editor.supportedFormats}</p>
        <p>{messages.admin.editor.saveAfterInsert}</p>
      </div>

      {message ? (
        <div className="mt-4 rounded-2xl border border-[var(--color-border)] bg-white/55 px-4 py-3 text-sm text-[var(--color-copy)]">
          <p>{message}</p>
          {uploadedUrl ? (
            <p className="mt-2 break-all font-mono text-xs text-[var(--color-muted)]">
              {uploadedUrl}
            </p>
          ) : null}
        </div>
      ) : null}

      {error ? (
        <div className="mt-4 rounded-2xl border border-rose-200/80 bg-rose-50/90 px-4 py-3 text-sm text-rose-700 dark:border-rose-700/40 dark:bg-rose-950/30 dark:text-rose-200">
          {error}
        </div>
      ) : null}
    </div>
  );
}

function PreviewMeta({ draft }: { draft: EditorData }) {
  const locale = useLocale();
  const messages = useMessages();
  const tags = draft.tags
    ? draft.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean)
    : [];

  return (
    <div className="mt-5 rounded-[28px] border border-[var(--color-border)] bg-white/45 p-5">
      {draft.cover ? (
        <div
          className="mb-5 h-52 rounded-[24px] bg-cover bg-center shadow-[0_20px_40px_rgba(51,65,85,0.1)]"
          style={{ backgroundImage: `url('${draft.cover}')` }}
        />
      ) : null}
      <div className="flex flex-wrap items-center gap-3 text-sm text-[var(--color-muted)]">
        <span>{draft.date || messages.admin.editor.draftDateFallback}</span>
        {draft.kind === "post" ? (
          <span className="rounded-full bg-[rgba(143,220,194,0.18)] px-3 py-1 text-xs font-semibold text-[var(--color-accent)]">
            {getCategoryLabel(draft.category, locale)}
          </span>
        ) : (
          <span className="rounded-full bg-[rgba(143,220,194,0.18)] px-3 py-1 text-xs font-semibold text-[var(--color-accent)]">
            {draft.status || messages.admin.editor.projectStatusFallback}
          </span>
        )}
      </div>
      <h3 className="mt-4 text-2xl font-semibold text-[var(--color-ink)]">
        {draft.title || messages.admin.editor.titleFallback}
      </h3>
      <p className="mt-3 text-base leading-8 text-[var(--color-copy)]">
        {draft.description || messages.admin.editor.descriptionFallback}
      </p>
      {tags.length > 0 ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-white/70 px-3 py-1 text-xs font-medium text-[var(--color-muted)]"
            >
              {tag}
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function ContentEditor({
  title,
  description,
  data,
  saveAction,
  deleteAction,
  publicHref,
  saved = false,
  localeLinks,
}: ContentEditorProps) {
  const locale = useLocale();
  const messages = useMessages();
  const [state, formAction] = useActionState(saveAction, {
    message: null,
    errors: {},
    values: null,
  } satisfies EditorActionState);
  const [draft, setDraft] = useState<EditorData>(data);
  const [pasteMessage, setPasteMessage] = useState<string | null>(null);
  const [isPastingImage, setIsPastingImage] = useState(false);
  const contentRef = useRef<HTMLTextAreaElement | null>(null);
  const isPost = draft.kind === "post";
  const translationNotice = draft.translationSourceLocale
    ? locale === "en"
      ? `This ${isPost ? "post" : "project"} does not have an English version yet. You are editing a draft based on the Chinese original. Save once to create the English file.`
      : `This ${isPost ? "article" : "project"} does not have an English version yet. You are editing a draft generated from the Chinese original. Save once to create the English file.`
    : null;

  function updateField(key: string, value: string | boolean | null) {
    setDraft((current) => ({
      ...current,
      [key]: value,
    }) as EditorData);
  }

  function handleTextChange(
    key: string,
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) {
    const value =
      event.target instanceof HTMLInputElement && event.target.type === "checkbox"
        ? event.target.checked
        : event.target.value;
    updateField(key, value);
  }

  function insertMarkdownAtSelection(markdown: string, selection?: { start: number; end: number }) {
    const textarea = contentRef.current;

    setDraft((current) => {
      const start = selection?.start ?? textarea?.selectionStart ?? current.content.length;
      const end = selection?.end ?? textarea?.selectionEnd ?? current.content.length;
      const nextContent = `${current.content.slice(0, start)}${markdown}${current.content.slice(end)}`;

      requestAnimationFrame(() => {
        if (!textarea) {
          return;
        }

        const nextCursor = start + markdown.length;
        textarea.focus();
        textarea.selectionStart = nextCursor;
        textarea.selectionEnd = nextCursor;
      });

      return {
        ...current,
        content: nextContent,
      };
    });
  }

  async function handleContentPaste(event: ReactClipboardEvent<HTMLTextAreaElement>) {
    const imageItem = Array.from(event.clipboardData.items).find((item) =>
      item.type.startsWith("image/"),
    );

    if (!imageItem) {
      return;
    }

    const file = imageItem.getAsFile();
    if (!file) {
      return;
    }

    event.preventDefault();
    setIsPastingImage(true);
    setPasteMessage(messages.admin.editor.pasting);

    const selection = {
      start: event.currentTarget.selectionStart,
      end: event.currentTarget.selectionEnd,
    };

    const formData = new FormData();
    formData.set("file", file);
    formData.set("kind", isPost ? "posts" : "projects");
    formData.set("target", "content");

    try {
      const payload = await uploadImageRequest(
        formData,
        messages.admin.editor.pasteFailed,
      );

      if (!payload.markdown) {
        throw new Error(messages.admin.editor.pasteFailed);
      }

      insertMarkdownAtSelection(payload.markdown, selection);
      setPasteMessage(payload.message ?? messages.admin.editor.uploadInserted);
    } catch (error) {
      setPasteMessage(
        error instanceof Error ? error.message : messages.admin.editor.pasteFailed,
      );
    } finally {
      setIsPastingImage(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-accent)]">
            {messages.admin.editor.contentEditor}
          </p>
          <h1 className="mt-3 text-3xl font-semibold text-[var(--color-ink)]">{title}</h1>
          <p className="mt-3 max-w-2xl text-base leading-8 text-[var(--color-copy)]">
            {description}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {localeLinks ? (
            <div className="theme-card-soft inline-flex items-center gap-1 rounded-full p-1">
              {(["zh", "en"] as const).map((contentLocale) => (
                <Link
                  key={contentLocale}
                  href={localeLinks[contentLocale]}
                  className={[
                    "inline-flex h-10 items-center justify-center rounded-full px-4 text-sm font-medium transition-colors",
                    draft.contentLocale === contentLocale
                      ? "bg-[linear-gradient(135deg,#8fdcc2,#cfe8ff)] text-slate-900 shadow-[0_14px_28px_rgba(143,220,194,0.22)]"
                      : "text-[var(--color-muted)] hover:text-[var(--color-ink)]",
                  ].join(" ")}
                >
                  {getContentLocaleLabel(contentLocale, locale)}
                </Link>
              ))}
            </div>
          ) : null}
          <Link
            href="/studio"
            className="theme-card-soft inline-flex h-11 items-center justify-center rounded-full px-4 text-sm font-medium text-[var(--color-ink)]"
          >
            {messages.admin.editor.backToDashboard}
          </Link>
          {publicHref ? (
            <Link
              href={publicHref}
              target="_blank"
              className="theme-card-soft inline-flex h-11 items-center justify-center rounded-full px-4 text-sm font-medium text-[var(--color-ink)]"
            >
              {messages.admin.editor.viewPublicPage}
            </Link>
          ) : null}
        </div>
      </div>

      {saved ? (
        <div className="rounded-[24px] border border-emerald-200/80 bg-emerald-50/90 px-4 py-3 text-sm text-emerald-800 dark:border-emerald-700/40 dark:bg-emerald-950/30 dark:text-emerald-200">
          {messages.admin.editor.saved}
        </div>
      ) : null}

      {state.message ? (
        <div className="rounded-[24px] border border-amber-200/80 bg-amber-50/90 px-4 py-3 text-sm text-amber-800 dark:border-amber-700/40 dark:bg-amber-950/30 dark:text-amber-200">
          {state.message}
        </div>
      ) : null}

      <div className="flex flex-wrap items-center gap-3">
        <div className="rounded-full bg-[rgba(143,220,194,0.18)] px-4 py-2 text-sm font-medium text-[var(--color-accent)]">
          {getContentLocaleLabel(draft.contentLocale, locale)}
        </div>
        <div className="rounded-full bg-white/65 px-4 py-2 text-sm text-[var(--color-muted)]">
          {getContentLocaleStatusLabel(draft.availableLocales, locale)}
        </div>
      </div>

      {pasteMessage ? (
        <div className="rounded-[24px] border border-sky-200/80 bg-sky-50/90 px-4 py-3 text-sm text-sky-800 dark:border-sky-700/40 dark:bg-sky-950/30 dark:text-sky-200">
          {pasteMessage}
        </div>
      ) : null}

      {translationNotice ? (
        <div className="rounded-[24px] border border-violet-200/80 bg-violet-50/90 px-4 py-3 text-sm text-violet-800 dark:border-violet-700/40 dark:bg-violet-950/30 dark:text-violet-200">
          {translationNotice}
        </div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.02fr)_minmax(0,0.98fr)]">
        <form action={formAction} className="theme-card rounded-[34px] p-6 sm:p-7">
          <input type="hidden" name="previousSlug" value={draft.previousSlug ?? ""} />
          <input type="hidden" name="contentLocale" value={draft.contentLocale} />

          <div className="grid gap-5 md:grid-cols-2">
            <div className="md:col-span-2">
              <label
                htmlFor="title"
                className="mb-2 block text-sm font-medium text-[var(--color-ink)]"
              >
                {messages.admin.editor.title}
              </label>
              <input
                id="title"
                name="title"
                type="text"
                value={draft.title}
                onChange={(event) => handleTextChange("title", event)}
                className="h-12 w-full rounded-2xl border border-[var(--color-border)] bg-white/75 px-4 text-sm text-[var(--color-ink)] outline-none focus:border-[var(--color-border-strong)]"
              />
              <FieldError message={state.errors.title} />
            </div>

            <div>
              <label
                htmlFor="slug"
                className="mb-2 block text-sm font-medium text-[var(--color-ink)]"
              >
                Slug
              </label>
              <input
                id="slug"
                name="slug"
                type="text"
                value={draft.slug}
                onChange={(event) => handleTextChange("slug", event)}
                placeholder="my-first-post"
                className="h-12 w-full rounded-2xl border border-[var(--color-border)] bg-white/75 px-4 text-sm text-[var(--color-ink)] outline-none focus:border-[var(--color-border-strong)]"
              />
              <FieldError message={state.errors.slug} />
            </div>

            <div>
              <label
                htmlFor="date"
                className="mb-2 block text-sm font-medium text-[var(--color-ink)]"
              >
                {messages.admin.editor.publishDate}
              </label>
              <input
                id="date"
                name="date"
                type="date"
                value={draft.date}
                onChange={(event) => handleTextChange("date", event)}
                className="h-12 w-full rounded-2xl border border-[var(--color-border)] bg-white/75 px-4 text-sm text-[var(--color-ink)] outline-none focus:border-[var(--color-border-strong)]"
              />
              <FieldError message={state.errors.date} />
            </div>

            <div className="md:col-span-2">
              <label
                htmlFor="description"
                className="mb-2 block text-sm font-medium text-[var(--color-ink)]"
              >
                {messages.admin.editor.summary}
              </label>
              <textarea
                id="description"
                name="description"
                value={draft.description}
                onChange={(event) => handleTextChange("description", event)}
                rows={3}
                className="w-full rounded-[24px] border border-[var(--color-border)] bg-white/75 px-4 py-3 text-sm leading-7 text-[var(--color-ink)] outline-none focus:border-[var(--color-border-strong)]"
              />
              <FieldError message={state.errors.description} />
            </div>

            {isPost ? (
              <div>
                <label
                  htmlFor="category"
                  className="mb-2 block text-sm font-medium text-[var(--color-ink)]"
                >
                  {messages.admin.editor.category}
                </label>
                <select
                  id="category"
                  name="category"
                  value={draft.category}
                  onChange={(event) => handleTextChange("category", event)}
                  className="h-12 w-full rounded-2xl border border-[var(--color-border)] bg-white/75 px-4 text-sm text-[var(--color-ink)] outline-none focus:border-[var(--color-border-strong)]"
                >
                  {POST_CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {getCategoryLabel(category, locale)}
                    </option>
                  ))}
                </select>
                <FieldError message={state.errors.category} />
              </div>
            ) : null}

            <div>
              <label
                htmlFor="tags"
                className="mb-2 block text-sm font-medium text-[var(--color-ink)]"
              >
                {messages.admin.editor.tags}
              </label>
              <input
                id="tags"
                name="tags"
                type="text"
                value={draft.tags}
                onChange={(event) => handleTextChange("tags", event)}
                placeholder="AI, Next.js, Writing"
                className="h-12 w-full rounded-2xl border border-[var(--color-border)] bg-white/75 px-4 text-sm text-[var(--color-ink)] outline-none focus:border-[var(--color-border-strong)]"
              />
            </div>

            <div className={isPost ? "" : "md:col-span-2"}>
              <label
                htmlFor="cover"
                className="mb-2 block text-sm font-medium text-[var(--color-ink)]"
              >
                {messages.admin.editor.cover}
              </label>
              <input
                id="cover"
                name="cover"
                type="text"
                value={draft.cover}
                onChange={(event) => handleTextChange("cover", event)}
                placeholder="/images/cover.jpg"
                className="h-12 w-full rounded-2xl border border-[var(--color-border)] bg-white/75 px-4 text-sm text-[var(--color-ink)] outline-none focus:border-[var(--color-border-strong)]"
              />
              <FieldError message={state.errors.cover} />
            </div>

            {isPost ? (
              <div>
                <label
                  htmlFor="readingTime"
                  className="mb-2 block text-sm font-medium text-[var(--color-ink)]"
                >
                  {messages.admin.editor.readingTime}
                </label>
                <input
                  id="readingTime"
                  name="readingTime"
                  type="text"
                  value={draft.readingTime}
                  onChange={(event) => handleTextChange("readingTime", event)}
                  placeholder="6 min read"
                  className="h-12 w-full rounded-2xl border border-[var(--color-border)] bg-white/75 px-4 text-sm text-[var(--color-ink)] outline-none focus:border-[var(--color-border-strong)]"
                />
                <FieldError message={state.errors.readingTime} />
              </div>
            ) : (
              <>
                <div>
                  <label
                    htmlFor="status"
                    className="mb-2 block text-sm font-medium text-[var(--color-ink)]"
                  >
                    {messages.admin.editor.status}
                  </label>
                  <input
                    id="status"
                    name="status"
                    type="text"
                    value={draft.status}
                    onChange={(event) => handleTextChange("status", event)}
                    placeholder="In progress"
                    className="h-12 w-full rounded-2xl border border-[var(--color-border)] bg-white/75 px-4 text-sm text-[var(--color-ink)] outline-none focus:border-[var(--color-border-strong)]"
                  />
                  <FieldError message={state.errors.status} />
                </div>

                <div>
                  <label
                    htmlFor="demo"
                    className="mb-2 block text-sm font-medium text-[var(--color-ink)]"
                  >
                    {messages.admin.editor.demo}
                  </label>
                  <input
                    id="demo"
                    name="demo"
                    type="url"
                    value={draft.demo}
                    onChange={(event) => handleTextChange("demo", event)}
                    placeholder="https://example.com"
                    className="h-12 w-full rounded-2xl border border-[var(--color-border)] bg-white/75 px-4 text-sm text-[var(--color-ink)] outline-none focus:border-[var(--color-border-strong)]"
                  />
                  <FieldError message={state.errors.demo} />
                </div>

                <div>
                  <label
                    htmlFor="github"
                    className="mb-2 block text-sm font-medium text-[var(--color-ink)]"
                  >
                    {messages.admin.editor.github}
                  </label>
                  <input
                    id="github"
                    name="github"
                    type="url"
                    value={draft.github}
                    onChange={(event) => handleTextChange("github", event)}
                    placeholder="https://github.com/..."
                    className="h-12 w-full rounded-2xl border border-[var(--color-border)] bg-white/75 px-4 text-sm text-[var(--color-ink)] outline-none focus:border-[var(--color-border-strong)]"
                  />
                  <FieldError message={state.errors.github} />
                </div>
              </>
            )}

            <label className="md:col-span-2 flex items-center gap-3 rounded-2xl border border-[var(--color-border)] bg-white/55 px-4 py-3 text-sm text-[var(--color-ink)]">
              <input
                name="featured"
                type="checkbox"
                checked={draft.featured}
                onChange={(event) => handleTextChange("featured", event)}
                className="h-4 w-4 rounded border-[var(--color-border)] text-[var(--color-accent)]"
              />
              {messages.admin.editor.featured}
            </label>

            <div className="md:col-span-2">
              <label
                htmlFor="content"
                className="mb-2 block text-sm font-medium text-[var(--color-ink)]"
              >
                {messages.admin.editor.content}
              </label>
              <textarea
                ref={contentRef}
                id="content"
                name="content"
                value={draft.content}
                onChange={(event) => handleTextChange("content", event)}
                onPaste={handleContentPaste}
                rows={20}
                className="min-h-[480px] w-full rounded-[28px] border border-[var(--color-border)] bg-white/75 px-4 py-4 font-mono text-sm leading-7 text-[var(--color-ink)] outline-none focus:border-[var(--color-border-strong)]"
              />
              <FieldError message={state.errors.content} />
              <p className="mt-3 text-xs leading-6 text-[var(--color-muted)]">
                {messages.admin.editor.contentHint}
              </p>
              {isPastingImage ? (
                <p className="mt-2 text-xs leading-6 text-[var(--color-accent)]">
                  {messages.admin.editor.pasting}
                </p>
              ) : null}
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-[var(--color-muted)]">
              {messages.admin.editor.contentPersistence}
            </p>
            <SaveButton />
          </div>
        </form>

        <div className="space-y-6">
          <UploadPanel
            kind={isPost ? "posts" : "projects"}
            onUseCover={(url) => updateField("cover", url)}
            onInsertMarkdown={insertMarkdownAtSelection}
          />

          <div className="theme-card rounded-[34px] p-6 sm:p-7">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-accent)]">
                  {messages.admin.editor.preview}
                </p>
                <h2 className="mt-3 text-2xl font-semibold text-[var(--color-ink)]">
                  {messages.admin.editor.livePreview}
                </h2>
              </div>
              <div className="rounded-full bg-white/60 px-3 py-1 text-xs font-medium text-[var(--color-muted)]">
                {isPost
                  ? messages.admin.editor.postPreviewBadge
                  : messages.admin.editor.projectPreviewBadge}
              </div>
            </div>

            <PreviewMeta draft={draft} />

            <div className="mt-6">
              <MarkdownPreview value={draft.content} />
            </div>
          </div>

          {deleteAction && draft.previousSlug ? (
            <form
              action={deleteAction}
              className="theme-card-soft rounded-[30px] p-6"
              onSubmit={(event) => {
                if (!window.confirm(messages.admin.editor.deleteConfirm)) {
                  event.preventDefault();
                }
              }}
            >
              <input type="hidden" name="slug" value={draft.previousSlug} />
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-[var(--color-ink)]">
                    {messages.admin.editor.dangerTitle}
                  </h2>
                  <p className="mt-2 text-sm leading-7 text-[var(--color-copy)]">
                    {messages.admin.editor.dangerDescription}
                  </p>
                </div>
                <DeleteButton />
              </div>
            </form>
          ) : null}
        </div>
      </div>
    </div>
  );
}
