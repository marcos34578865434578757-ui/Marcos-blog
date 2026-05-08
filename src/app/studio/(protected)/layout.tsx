import { AdminShell } from "@/components/admin/AdminShell";
import { requireAdminSession } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export default async function ProtectedAdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await requireAdminSession();

  return (
    <AdminShell username={session.username ?? "admin"}>{children}</AdminShell>
  );
}
