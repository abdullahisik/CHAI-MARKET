import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function AdminStoresPage() {
  const stores = await prisma.store.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Stores</h2>
          <p className="text-sm text-neutral-500">Manage white-label stores.</p>
        </div>

        <Link href="/admin/stores/new" className="rounded-xl bg-neutral-900 px-4 py-3 text-sm font-semibold text-white">
          Add Store
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl border bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-neutral-50 text-left text-neutral-500">
            <tr>
              <th className="px-4 py-3">Store</th>
              <th className="px-4 py-3">Domain</th>
              <th className="px-4 py-3">Theme</th>
              <th className="px-4 py-3">Currency</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {stores.map((store) => (
              <tr key={store.id} className="border-t">
                <td className="px-4 py-3 font-medium">{store.name}</td>
                <td className="px-4 py-3">{store.domain || "—"}</td>
                <td className="px-4 py-3">{store.themePreset}</td>
                <td className="px-4 py-3">{store.currency}</td>
                <td className="px-4 py-3">{store.isActive ? "Active" : "Inactive"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}