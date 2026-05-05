import { redirect } from "next/navigation";

export default async function AdminLogoutPage() {
  await fetch("http://localhost:3000/api/admin/logout", {
    method: "POST",
    cache: "no-store",
  });

  redirect("/admin/login");
}