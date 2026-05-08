"use client";

import { useActionState } from "react";
import {
  saveHomeContentAction,
  type HomeContentActionState,
} from "@/app/studio/actions";
import type { HomeContentEditorValues } from "@/lib/home-content";
import { useMessages } from "@/lib/locale-client";
import { SaveButton } from "@/components/admin/AdminFormButtons";

function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return <p className="mt-2 text-sm text-rose-600 dark:text-rose-300">{message}</p>;
}

type HomeContentEditorProps = {
  values: HomeContentEditorValues;
  saved?: boolean;
};

export function HomeContentEditor({
  values,
  saved = false,
}: HomeContentEditorProps) {
  const messages = useMessages();
  const [state, formAction] = useActionState(saveHomeContentAction, {
    message: null,
    errors: {},
    values: null,
  } satisfies HomeContentActionState);
  const draft = state.values ?? values;

  return (
    <div className="space-y-6">
      {saved ? (
        <div className="rounded-[24px] border border-emerald-200/80 bg-emerald-50/90 px-4 py-3 text-sm text-emerald-800 dark:border-emerald-700/40 dark:bg-emerald-950/30 dark:text-emerald-200">
          {messages.admin.homeContent.saved}
        </div>
      ) : null}

      {state.message ? (
        <div className="rounded-[24px] border border-amber-200/80 bg-amber-50/90 px-4 py-3 text-sm text-amber-800 dark:border-amber-700/40 dark:bg-amber-950/30 dark:text-amber-200">
          {state.message}
        </div>
      ) : null}

      <form action={formAction} className="grid gap-6 xl:grid-cols-2">
        <section className="theme-card rounded-[34px] p-6 sm:p-7">
          <div className="space-y-5">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-accent)]">
                Hero
              </p>
              <h2 className="mt-3 text-2xl font-semibold text-[var(--color-ink)]">
                {messages.admin.homeContent.heroTitle}
              </h2>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-[var(--color-ink)]">
                  {messages.admin.homeContent.eyebrowLabel}
                </label>
                <input
                  name="heroEyebrow"
                  defaultValue={draft.heroEyebrow}
                  className="h-12 w-full rounded-2xl border border-[var(--color-border)] bg-white/75 px-4 text-sm text-[var(--color-ink)] outline-none"
                />
                <FieldError message={state.errors.heroEyebrow} />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-[var(--color-ink)]">
                  {messages.admin.homeContent.badgeLabel}
                </label>
                <input
                  name="heroBadge"
                  defaultValue={draft.heroBadge}
                  className="h-12 w-full rounded-2xl border border-[var(--color-border)] bg-white/75 px-4 text-sm text-[var(--color-ink)] outline-none"
                />
                <FieldError message={state.errors.heroBadge} />
              </div>
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-[var(--color-ink)]">
                  {messages.admin.homeContent.mainTitle}
                </label>
                <textarea
                  name="heroTitle"
                  defaultValue={draft.heroTitle}
                  rows={3}
                  className="w-full rounded-[24px] border border-[var(--color-border)] bg-white/75 px-4 py-3 text-sm leading-7 text-[var(--color-ink)] outline-none"
                />
                <FieldError message={state.errors.heroTitle} />
              </div>
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-[var(--color-ink)]">
                  {messages.admin.homeContent.intro}
                </label>
                <textarea
                  name="heroIntro"
                  defaultValue={draft.heroIntro}
                  rows={5}
                  className="w-full rounded-[24px] border border-[var(--color-border)] bg-white/75 px-4 py-3 text-sm leading-7 text-[var(--color-ink)] outline-none"
                />
                <FieldError message={state.errors.heroIntro} />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-[var(--color-ink)]">
                  {messages.admin.homeContent.primaryCtaLabel}
                </label>
                <input
                  name="primaryCtaLabel"
                  defaultValue={draft.primaryCtaLabel}
                  className="h-12 w-full rounded-2xl border border-[var(--color-border)] bg-white/75 px-4 text-sm text-[var(--color-ink)] outline-none"
                />
                <FieldError message={state.errors.primaryCtaLabel} />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-[var(--color-ink)]">
                  {messages.admin.homeContent.primaryCtaHref}
                </label>
                <input
                  name="primaryCtaHref"
                  defaultValue={draft.primaryCtaHref}
                  className="h-12 w-full rounded-2xl border border-[var(--color-border)] bg-white/75 px-4 text-sm text-[var(--color-ink)] outline-none"
                />
                <FieldError message={state.errors.primaryCtaHref} />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-[var(--color-ink)]">
                  {messages.admin.homeContent.secondaryCtaLabel}
                </label>
                <input
                  name="secondaryCtaLabel"
                  defaultValue={draft.secondaryCtaLabel}
                  className="h-12 w-full rounded-2xl border border-[var(--color-border)] bg-white/75 px-4 text-sm text-[var(--color-ink)] outline-none"
                />
                <FieldError message={state.errors.secondaryCtaLabel} />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-[var(--color-ink)]">
                  {messages.admin.homeContent.secondaryCtaHref}
                </label>
                <input
                  name="secondaryCtaHref"
                  defaultValue={draft.secondaryCtaHref}
                  className="h-12 w-full rounded-2xl border border-[var(--color-border)] bg-white/75 px-4 text-sm text-[var(--color-ink)] outline-none"
                />
                <FieldError message={state.errors.secondaryCtaHref} />
              </div>
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-[var(--color-ink)]">
                  {messages.admin.homeContent.heroTags}
                </label>
                <textarea
                  name="heroTags"
                  defaultValue={draft.heroTags}
                  rows={5}
                  className="w-full rounded-[24px] border border-[var(--color-border)] bg-white/75 px-4 py-3 text-sm leading-7 text-[var(--color-ink)] outline-none"
                />
                <FieldError message={state.errors.heroTags} />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-[var(--color-ink)]">
                  {messages.admin.homeContent.noteEyebrow}
                </label>
                <input
                  name="heroNoteLabel"
                  defaultValue={draft.heroNoteLabel}
                  className="h-12 w-full rounded-2xl border border-[var(--color-border)] bg-white/75 px-4 text-sm text-[var(--color-ink)] outline-none"
                />
                <FieldError message={state.errors.heroNoteLabel} />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-[var(--color-ink)]">
                  {messages.admin.homeContent.noteTitle}
                </label>
                <input
                  name="heroNoteTitle"
                  defaultValue={draft.heroNoteTitle}
                  className="h-12 w-full rounded-2xl border border-[var(--color-border)] bg-white/75 px-4 text-sm text-[var(--color-ink)] outline-none"
                />
                <FieldError message={state.errors.heroNoteTitle} />
              </div>
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-[var(--color-ink)]">
                  {messages.admin.homeContent.noteStatus}
                </label>
                <textarea
                  name="heroStatus"
                  defaultValue={draft.heroStatus}
                  rows={4}
                  className="w-full rounded-[24px] border border-[var(--color-border)] bg-white/75 px-4 py-3 text-sm leading-7 text-[var(--color-ink)] outline-none"
                />
                <FieldError message={state.errors.heroStatus} />
              </div>
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-[var(--color-ink)]">
                  {messages.admin.homeContent.highlights}
                </label>
                <textarea
                  name="heroHighlights"
                  defaultValue={draft.heroHighlights}
                  rows={5}
                  className="w-full rounded-[24px] border border-[var(--color-border)] bg-white/75 px-4 py-3 text-sm leading-7 text-[var(--color-ink)] outline-none"
                />
                <FieldError message={state.errors.heroHighlights} />
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <div className="theme-card rounded-[34px] p-6 sm:p-7">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-accent)]">
                {messages.admin.homeContent.statsEyebrow}
              </p>
              <h2 className="mt-3 text-2xl font-semibold text-[var(--color-ink)]">
                {messages.admin.homeContent.statsTitle}
              </h2>
            </div>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <input name="heroStatLabel1" defaultValue={draft.heroStatLabel1} placeholder={messages.admin.homeContent.statLabelPlaceholder} className="h-12 rounded-2xl border border-[var(--color-border)] bg-white/75 px-4 text-sm text-[var(--color-ink)] outline-none" />
              <input name="heroStatValue1" defaultValue={draft.heroStatValue1} placeholder={messages.admin.homeContent.statValuePlaceholder} className="h-12 rounded-2xl border border-[var(--color-border)] bg-white/75 px-4 text-sm text-[var(--color-ink)] outline-none" />
              <input name="heroStatLabel2" defaultValue={draft.heroStatLabel2} placeholder={messages.admin.homeContent.statLabelPlaceholder} className="h-12 rounded-2xl border border-[var(--color-border)] bg-white/75 px-4 text-sm text-[var(--color-ink)] outline-none" />
              <input name="heroStatValue2" defaultValue={draft.heroStatValue2} placeholder={messages.admin.homeContent.statValuePlaceholder} className="h-12 rounded-2xl border border-[var(--color-border)] bg-white/75 px-4 text-sm text-[var(--color-ink)] outline-none" />
              <input name="heroStatLabel3" defaultValue={draft.heroStatLabel3} placeholder={messages.admin.homeContent.statLabelPlaceholder} className="h-12 rounded-2xl border border-[var(--color-border)] bg-white/75 px-4 text-sm text-[var(--color-ink)] outline-none" />
              <input name="heroStatValue3" defaultValue={draft.heroStatValue3} placeholder={messages.admin.homeContent.statValuePlaceholder} className="h-12 rounded-2xl border border-[var(--color-border)] bg-white/75 px-4 text-sm text-[var(--color-ink)] outline-none" />
            </div>
          </div>

          <div className="theme-card rounded-[34px] p-6 sm:p-7">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-accent)]">
                {messages.admin.homeContent.focusEyebrow}
              </p>
              <h2 className="mt-3 text-2xl font-semibold text-[var(--color-ink)]">
                {messages.admin.homeContent.focusTitle}
              </h2>
            </div>
            <div className="mt-5 grid gap-5">
              <input name="focusEyebrow" defaultValue={draft.focusEyebrow} placeholder={messages.admin.homeContent.focusEyebrowPlaceholder} className="h-12 rounded-2xl border border-[var(--color-border)] bg-white/75 px-4 text-sm text-[var(--color-ink)] outline-none" />
              <FieldError message={state.errors.focusEyebrow} />
              <textarea name="focusTitle" defaultValue={draft.focusTitle} rows={2} placeholder={messages.admin.homeContent.focusTitlePlaceholder} className="w-full rounded-[24px] border border-[var(--color-border)] bg-white/75 px-4 py-3 text-sm leading-7 text-[var(--color-ink)] outline-none" />
              <FieldError message={state.errors.focusTitle} />
              <textarea name="focusDescription" defaultValue={draft.focusDescription} rows={4} placeholder={messages.admin.homeContent.focusDescriptionPlaceholder} className="w-full rounded-[24px] border border-[var(--color-border)] bg-white/75 px-4 py-3 text-sm leading-7 text-[var(--color-ink)] outline-none" />
              <FieldError message={state.errors.focusDescription} />
              <textarea name="focusStatus" defaultValue={draft.focusStatus} rows={4} placeholder={messages.admin.homeContent.focusStatusPlaceholder} className="w-full rounded-[24px] border border-[var(--color-border)] bg-white/75 px-4 py-3 text-sm leading-7 text-[var(--color-ink)] outline-none" />
              <FieldError message={state.errors.focusStatus} />
              <textarea name="focusItems" defaultValue={draft.focusItems} rows={6} placeholder={messages.admin.homeContent.focusItemsPlaceholder} className="w-full rounded-[24px] border border-[var(--color-border)] bg-white/75 px-4 py-3 text-sm leading-7 text-[var(--color-ink)] outline-none" />
              <FieldError message={state.errors.focusItems} />
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <input name="focusUpdatedAt" defaultValue={draft.focusUpdatedAt} placeholder="2026-05-06" className="h-12 w-full rounded-2xl border border-[var(--color-border)] bg-white/75 px-4 text-sm text-[var(--color-ink)] outline-none" />
                  <FieldError message={state.errors.focusUpdatedAt} />
                </div>
                <div>
                  <input name="focusBadgeLabel" defaultValue={draft.focusBadgeLabel} placeholder={messages.admin.homeContent.focusBadgePlaceholder} className="h-12 w-full rounded-2xl border border-[var(--color-border)] bg-white/75 px-4 text-sm text-[var(--color-ink)] outline-none" />
                  <FieldError message={state.errors.focusBadgeLabel} />
                </div>
              </div>
            </div>
          </div>

          <div className="theme-card-soft rounded-[30px] p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm leading-7 text-[var(--color-copy)]">
                {messages.admin.homeContent.saveHint}
              </p>
              <SaveButton />
            </div>
          </div>
        </section>
      </form>
    </div>
  );
}
