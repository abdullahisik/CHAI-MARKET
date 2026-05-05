import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/admin-session";

export default async function AdminProductsPage() {
  const user = await getAdminSession();

  if (!user) return null;

  const products = await prisma.product.findMany({
    where: { storeId: user.storeId },
    orderBy: { createdAt: "desc" },
    include: {
      category: true,
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Products</h2>
          <p className="text-sm text-neutral-500">
            Manage all products for {user.store.name}.
          </p>
        </div>

        <Link
          href="/admin/products/new"
          className="rounded-xl bg-neutral-900 px-4 py-3 text-sm font-semibold text-white hover:bg-neutral-800"
        >
          Add Product
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-neutral-50 text-left text-neutral-500">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Brand</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-t border-neutral-200">
                <td className="px-4 py-3 font-medium">{product.name}</td>
                <td className="px-4 py-3">{product.category?.name ?? "—"}</td>
                <td className="px-4 py-3">{product.brand ?? "—"}</td>
                <td className="px-4 py-3">
                  {product.salePrice !== null ? `£${product.salePrice.toFixed(2)}` : "—"}
                </td>
                <td className="px-4 py-3">{product.stockQuantity}</td>
                <td className="px-4 py-3">
                  {product.isActive ? "Active" : "Inactive"}
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-neutral-500">
                  No products yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}