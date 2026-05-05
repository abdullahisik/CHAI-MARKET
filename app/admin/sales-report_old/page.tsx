import fs from "fs";
import path from "path";

type CartItem = {
  id: string;
  productSlug: string;
  productName: string;
  size: string;
  purchaseType: "retail" | "box";
  quantity: number;
  unitPrice: number;
  boxQty: number;
  image: string;
  vatClass: "zero" | "standard";
};

type Order = {
  id: string;
  createdAt: string;
  items: CartItem[];
  subtotal: number;
  vatTotal: number;
  shipping: number;
  grandTotal: number;
  whatsappText: string;
};

const ordersFilePath = path.join(process.cwd(), "data", "orders.json");

function readOrders(): Order[] {
  try {
    if (!fs.existsSync(ordersFilePath)) return [];
    const content = fs.readFileSync(ordersFilePath, "utf-8");
    return JSON.parse(content || "[]");
  } catch {
    return [];
  }
}

type ReportRow = {
  productSlug: string;
  productName: string;
  size: string;
  retailOrders: number;
  boxOrders: number;
  totalUnitsSold: number;
  totalRevenue: number;
};

export default function SalesReportPage() {
  const orders = readOrders();

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  const monthlyOrders = orders.filter((order) => {
    const d = new Date(order.createdAt);
    return d.getFullYear() === currentYear && d.getMonth() === currentMonth;
  });

  const map = new Map<string, ReportRow>();

  for (const order of monthlyOrders) {
    for (const item of order.items) {
      const key = `${item.productSlug}__${item.size}`;

      if (!map.has(key)) {
        map.set(key, {
          productSlug: item.productSlug,
          productName: item.productName,
          size: item.size,
          retailOrders: 0,
          boxOrders: 0,
          totalUnitsSold: 0,
          totalRevenue: 0,
        });
      }

      const row = map.get(key)!;

      if (item.purchaseType === "retail") {
        row.retailOrders += item.quantity;
        row.totalUnitsSold += item.quantity;
      }

      if (item.purchaseType === "box") {
        row.boxOrders += item.quantity;
        row.totalUnitsSold += item.quantity * Number(item.boxQty || 0);
      }

      row.totalRevenue += item.unitPrice * item.quantity;
    }
  }

  const reportRows = Array.from(map.values()).sort((a, b) =>
    a.productName.localeCompare(b.productName)
  );

  return (
    <main className="min-h-screen bg-[#f8f5ee] px-6 py-10 text-[#1f2e1f]">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold">Monthly Sales Report</h1>
            <p className="mt-2 text-sm text-gray-600">
              Current month unit and box sales
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
                <th className="border px-3 py-3">Size</th>
                <th className="border px-3 py-3">Retail Sold</th>
                <th className="border px-3 py-3">Box Sold</th>
                <th className="border px-3 py-3">Total Unit Equivalent</th>
                <th className="border px-3 py-3">Revenue</th>
              </tr>
            </thead>

            <tbody>
              {reportRows.map((row) => (
                <tr key={`${row.productSlug}-${row.size}`} className="odd:bg-[#faf8f2]">
                  <td className="border px-3 py-2 font-semibold">{row.productName}</td>
                  <td className="border px-3 py-2">{row.size || "-"}</td>
                  <td className="border px-3 py-2">{row.retailOrders}</td>
                  <td className="border px-3 py-2">{row.boxOrders}</td>
                  <td className="border px-3 py-2">{row.totalUnitsSold}</td>
                  <td className="border px-3 py-2">£{row.totalRevenue.toFixed(2)}</td>
                </tr>
              ))}

              {reportRows.length === 0 && (
                <tr>
                  <td colSpan={6} className="border px-4 py-8 text-center text-gray-500">
                    No sales this month yet.
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