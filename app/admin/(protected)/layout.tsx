import Link from "next/link";
import { redirect } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Settings,
  Users,
  Store,
  FolderTree,
} from "lucide-react";
import { getAdminSession } from "@/lib/admin-session";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/stores", label: "Stores", icon: Store },
  { href: "/admin/categories", label: "Categories", icon: FolderTree },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default async function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getAdminSession();

  if (!user) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-neutral-100 text-neutral-900">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[280px_1fr]">
        <aside className="border-r border-neutral-200 bg-white p-6">
          <div className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-neutral-400">
              {user.store.name}
            </p>
            <h2 className="mt-2 text-2xl font-bold">Admin Panel</h2>
            <p className="mt-2 text-sm text-neutral-500">{user.email}</p>
            <p className="mt-1 text-xs text-neutral-400">
              Role: {user.role.replaceAll("_", " ")}
            </p>
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-neutral-700 hover:bg-neutral-100"
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        <main>
          <header className="flex items-center justify-between border-b border-neutral-200 bg-white px-6 py-4">
            <div>
              <h1 className="text-lg font-semibold">{user.store.name}</h1>
              <p className="text-sm text-neutral-500">
                Manage products, stores, users, and settings
              </p>
            </div>

            <form action="/admin/logout" method="get">
              <button className="rounded-xl border border-neutral-300 px-4 py-2 text-sm font-medium hover:bg-neutral-50">
                Sign Out
              </button>
            </form>
          </header>

          <div className="p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}