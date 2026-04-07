import fs from "fs";
import path from "path";

type Variant = {
  size?: string;
  retailPrice?: string;
  retailDiscountPrice?: string;
  boxQty?: number;
  boxPrice?: string;
  boxDiscountPrice?: string;
  image?: string;
  unitPrice?: string;
  discountPrice?: string;
  unitStock?: number;
  boxStock?: number;
  vatClass?: string;
};

type Product = {
  slug?: string;
  name?: string;
  category?: string;
  subCategory?: string;
  description?: string;
  variants?: Variant[];
};

const productsFilePath = path.join(process.cwd(), "data", "products.json");

function readProducts(): Product[] {
  try {
    if (!fs.existsSync(productsFilePath)) return [];
    const content = fs.readFileSync(productsFilePath, "utf-8");
    return JSON.parse(content || "[]");
  } catch {
    return [];
  }
}

export default function StockWarningPage() {
  const products = readProducts();

  const rows = products.flatMap((product) =>
    (Array.isArray(product.variants) ? product.variants : []).map((variant) => ({
      productName: product.name || "-",
      category: product.subCategory || "-",
      size: variant.size || "-",
      unitStock: Number(variant.unitStock || 0),
      boxStock: Number(variant.boxStock || 0),
    }))
  );

  const lowStock = rows.filter((row) => row.unitStock <= 10 || row.boxStock <= 5);

  return (
    <main className="min-h-screen bg-[#f8f5ee] px-6 py-10 text-[#1f2e1f]">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold">Stock Warning Dashboard</h1>
            <p className="mt-2 text-sm text-gray-600">
              Low stock products and variants
            </p>
          </div>

          <a
            href="/admin/dashboard"
            className="rounded border border-[#102418] px-5 py-3 font-semibold text-[#102418]"
          >
            Back to Dashboard
          </a>
        </div>

        <div className="overflow-x-auto rounded-xl bg-white shadow">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-[#102418] text-left text-white">
                <th className="border px-3 py-3">Product</th>
                <th className="border px-3 py-3">Category</th>
                <th className="border px-3 py-3">Size</th>
                <th className="border px-3 py-3">Unit Stock</th>
                <th className="border px-3 py-3">Box Stock</th>
                <th className="border px-3 py-3">Warning</th>
              </tr>
            </thead>
            <tbody>
              {lowStock.map((row, index) => (
                <tr key={`${row.productName}-${row.size}-${index}`} className="odd:bg-[#faf8f2]">
                  <td className="border px-3 py-2 font-semibold">{row.productName}</td>
                  <td className="border px-3 py-2">{row.category}</td>
                  <td className="border px-3 py-2">{row.size}</td>
                  <td className="border px-3 py-2">{row.unitStock}</td>
                  <td className="border px-3 py-2">{row.boxStock}</td>
                  <td className="border px-3 py-2 font-semibold text-red-600">
                    Low Stock
                  </td>
                </tr>
              ))}

              {lowStock.length === 0 && (
                <tr>
                  <td colSpan={6} className="border px-4 py-8 text-center text-gray-500">
                    No low stock warnings.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}