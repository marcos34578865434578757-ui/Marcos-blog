import Link from "next/link";
import { logoutAction } from "@/app/admin/actions";
import { LogoutButton } from "@/components/admin/AdminFormButtons";
import { Container } from "@/components/layout/Container";
import { getRequestLocale } from "@/lib/locale";
import { getMessages } from "@/lib/messages";

type AdminShellProps = {
  username: string;
  children: React.ReactNode;
};

export async function AdminShell({ username, children }: AdminShellProps) {
  const locale = await getRequestLocale();
  const messages = getMessages(locale);

  const navItems = [
    { href: "/admin", label: messages.admin.shell.nav.dashboard },
    { href: "/admin/posts/new", label: messages.admin.shell.nav.newPost },
    { href: "/admin/projects/new", label: messages.admin.shell.nav.newProject },
    { href: "/admin/home", label: messages.admin.shell.nav.home },
    { href: "/", label: messages.admin.shell.nav.backToSite },
  ];

  return (
    <Container wide className="py-8 sm:py-10">
      <div className="space-y-6">
        <header className="theme-card rounded-[36px] p-6 sm:p-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-accent)]">
                Marcos Admin
              </p>
              <h1 className="mt-3 text-3xl font-semibold text-[var(--color-ink)]">
                {messages.admin.shell.title}
              </h1>
              <p className="mt-3 max-w-2xl text-base leading-8 text-[var(--color-copy)]">
                {messages.admin.shell.description}
              </p>
            </div>

            <form action={logoutAction}>
              <LogoutButton />
            </form>
          </div>

          <div className="mt-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <nav className="flex flex-wrap items-center gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="theme-card-soft inline-flex h-11 items-center justify-center rounded-full px-4 text-sm font-medium text-[var(--color-ink)]"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="rounded-full bg-white/55 px-4 py-2 text-sm text-[var(--color-muted)]">
              {messages.admin.shell.currentUser} {username}
            </div>
          </div>
        </header>

        {children}
      </div>
    </Container>
  );
}
