import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/admin/LoginForm";
import { Container } from "@/components/layout/Container";
import { getAdminSession, isAdminConfigured } from "@/lib/admin-auth";
import { getRequestLocale } from "@/lib/locale";
import { getMessages } from "@/lib/messages";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const messages = getMessages(locale);

  return {
    title: "Admin Login",
    description: messages.admin.login.description,
  };
}

export default async function AdminLoginPage() {
  const locale = await getRequestLocale();
  const messages = getMessages(locale);
  const session = await getAdminSession();
  if (session.authenticated) {
    redirect("/studio");
  }

  return (
    <Container className="py-12 sm:py-16">
      <div className="mx-auto max-w-[560px] space-y-6">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-accent)]">
            {messages.admin.login.eyebrow}
          </p>
          <h1 className="mt-4 text-4xl font-semibold text-[var(--color-ink)]">
            {messages.admin.login.title}
          </h1>
          <p className="mt-4 text-base leading-8 text-[var(--color-copy)]">
            {messages.admin.login.description}
          </p>
        </div>

        <LoginForm
          configured={isAdminConfigured()}
          defaultUsername={process.env.ADMIN_USERNAME?.trim() || "admin"}
        />
      </div>
    </Container>
  );
}
