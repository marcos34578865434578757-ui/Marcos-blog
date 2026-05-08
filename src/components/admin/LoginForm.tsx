"use client";

import { useActionState } from "react";
import { loginAction, type LoginActionState } from "@/app/studio/actions";
import { useMessages } from "@/lib/locale-client";

type LoginFormProps = {
  configured: boolean;
  defaultUsername: string;
};

export function LoginForm({ configured, defaultUsername }: LoginFormProps) {
  const messages = useMessages();
  const [state, formAction] = useActionState(loginAction, {
    error: null,
  } satisfies LoginActionState);

  if (!configured) {
    return (
      <div className="theme-card-soft rounded-[30px] p-6 text-sm leading-7 text-[var(--color-copy)]">
        <p className="font-semibold text-[var(--color-ink)]">
          {messages.admin.login.missingTitle}
        </p>
        <p className="mt-3">{messages.admin.login.missingDescription}</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="theme-card rounded-[34px] p-7 sm:p-8">
      <div className="space-y-5">
        <div>
          <label
            htmlFor="username"
            className="mb-2 block text-sm font-medium text-[var(--color-ink)]"
          >
            {messages.admin.login.username}
          </label>
          <input
            id="username"
            name="username"
            type="text"
            defaultValue={defaultUsername}
            autoComplete="username"
            className="h-12 w-full rounded-2xl border border-[var(--color-border)] bg-white/75 px-4 text-sm text-[var(--color-ink)] outline-none focus:border-[var(--color-border-strong)]"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="mb-2 block text-sm font-medium text-[var(--color-ink)]"
          >
            {messages.admin.login.password}
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            className="h-12 w-full rounded-2xl border border-[var(--color-border)] bg-white/75 px-4 text-sm text-[var(--color-ink)] outline-none focus:border-[var(--color-border-strong)]"
          />
        </div>
      </div>

      {state.error ? (
        <p className="mt-4 rounded-2xl border border-rose-200/80 bg-rose-50/90 px-4 py-3 text-sm text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-200">
          {state.error}
        </p>
      ) : null}

      <button
        type="submit"
        className="mt-6 inline-flex h-12 items-center justify-center rounded-full bg-[linear-gradient(135deg,#8fdcc2,#cfe8ff)] px-5 text-sm font-semibold text-slate-900 shadow-[0_18px_38px_rgba(143,220,194,0.28)]"
      >
        {messages.admin.login.submit}
      </button>
    </form>
  );
}
