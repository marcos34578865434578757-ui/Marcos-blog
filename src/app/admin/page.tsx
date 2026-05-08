import { redirect } from "next/navigation";

export const dynamic = "force-static";

export default function AdminCmsRedirectPage() {
  redirect("/admin/index.html");
}
