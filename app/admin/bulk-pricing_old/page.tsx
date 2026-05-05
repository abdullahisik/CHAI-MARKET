"use client";

import { useEffect, useMemo, useState } from "react";

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
  slug: string;
  name: string;
  category: string;
  subCategory: string;
  description: string;
  variants: Variant[];
};

type BulkRow = {
  slug: string;
  originalSize: string;
  productName: string;
  category: string;
  subCategory: string;
  size: string;
  boxQty: string;
  retailPrice: string;
  unitDiscountPercent: string;
  boxPrice: string;
  boxDiscountPercent: string;
  unitStock: string;
  boxStock: string;
  vatClass: string;
  image: string;
};

function calcDiscountPercent(original: string, discounted: string) {
  const originalNum = Number(original || 0);
  const discountedNum = Number(discounted || 0);

  if (!originalNum || !discountedNum || discountedNum >= originalNum) {
    return "";
  }

  const percent = ((originalNum - discountedNum) / originalNum) * 100;
  return percent.toFixed(2);
}

function normalize(value: string) {
  return String(value || "").trim().toLowerCase();
}

function variantBelongsToSelection(
  product: Product,
  variant: Variant,
  selectedCategory: string,
  selectedSubCategory: string
) {
  if (product.category !== selectedCategory) return false;
  if (product.subCategory !== selectedSubCategory) return false;

  const imagePath = String(variant.image || "").toUpperCase();

  if (selectedCategory === "Kuruyemis" && selectedSubCategory === "Big Nut") {
    return imagePath.includes("/PRODUCTS/NUTS/BIG NUTS/");
  }

  if (selectedCategory === "Kuruyemis" && selectedSubCategory === "Small Nut") {
    return imagePath.includes("/PRODUCTS/NUTS/SMALL NUTS/");
  }

  return true;
}

export default function BulkPricingPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("Kuruyemis");
  const [selectedSubCategory, setSelectedSubCategory] = useState("Big Nut");
  const [rows, setRows] = useState<BulkRow[]>([]);
  const [message, setMessage] = useState("");
  const [sortBy, setSortBy] = useState("name-asc");

  const loadProducts = async () => {
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch {
      setProducts([]);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const availableSubCategories = useMemo(() => {
    const subs = new Set(
      products
        .filter((p) => p.category === selectedCategory)
        .map((p) => p.subCategory)
    );
    return Array.from(subs);
  }, [products, selectedCategory]);

  useEffect(() => {
    if (!availableSubCategories.includes(selectedSubCategory)) {
      setSelectedSubCategory(availableSubCategories[0] || "");
    }
  }, [availableSubCategories, selectedSubCategory]);

  useEffect(() => {
    const nextRows: BulkRow[] = [];
    const seen = new Set<string>();

    for (const product of products) {
      for (const variant of product.variants || []) {
        if (
          !variantBelongsToSelection(
            product,
            variant,
            selectedCategory,
            selectedSubCategory
          )
        ) {
          continue;
        }

        const currentSize = String(variant.size || "");
        const uniqueKey =
          `${product.slug}__${normalize(currentSize)}__${String(variant.image || "")}`;

        if (seen.has(uniqueKey)) continue;
        seen.add(uniqueKey);

        nextRows.push({
          slug: product.slug,
          originalSize: currentSize,
          productName: product.name,
          category: product.category,
          subCategory: product.subCategory,
          size: currentSize,
          boxQty: String(variant.boxQty ?? ""),
          retailPrice: String(variant.retailPrice || variant.unitPrice || ""),
          unitDiscountPercent: calcDiscountPercent(
            String(variant.retailPrice || variant.unitPrice || ""),
            String(variant.retailDiscountPrice || variant.discountPrice || "")
          ),
          boxPrice: String(variant.boxPrice || ""),
          boxDiscountPercent: calcDiscountPercent(
            String(variant.boxPrice || ""),
            String(variant.boxDiscountPrice || "")
          ),
          unitStock: String(variant.unitStock ?? ""),
          boxStock: String(variant.boxStock ?? ""),
          vatClass: String(variant.vatClass || "zero"),
          image: String(variant.image || ""),
        });
      }
    }

    nextRows.sort((a, b) => {
      if (sortBy === "name-asc") {
        return a.productName.localeCompare(b.productName);
      }

      if (sortBy === "name-desc") {
        return b.productName.localeCompare(a.productName);
      }

      if (sortBy === "unit-stock-asc") {
        return Number(a.unitStock || 0) - Number(b.unitStock || 0);
      }

      if (sortBy === "unit-stock-desc") {
        return Number(b.unitStock || 0) - Number(a.unitStock || 0);
      }

      if (sortBy === "box-stock-asc") {
        return Number(a.boxStock || 0) - Number(b.boxStock || 0);
      }

      if (sortBy === "box-stock-desc") {
        return Number(b.boxStock || 0) - Number(a.boxStock || 0);
      }

      if (sortBy === "low-stock-first") {
        const aMin = Math.min(Number(a.unitStock || 0), Number(a.boxStock || 0));
        const bMin = Math.min(Number(b.unitStock || 0), Number(b.boxStock || 0));
        return aMin - bMin;
      }

      return 0;
    });

    setRows(nextRows);
  }, [products, selectedCategory, selectedSubCategory, sortBy]);

  const updateRow = (index: number, field: keyof BulkRow, value: string) => {
    setRows((prev) =>
      prev.map((row, i) => {
        if (i !== index) return row;
        return { ...row, [field]: value };
      })
    );
  };

  const saveAll = async () => {
    setMessage("Saving...");

    try {
      const res = await fetch("/api/bulk-update-prices", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          rows: rows.map((row) => ({
            slug: row.slug,
            originalSize: row.originalSize,
            size: row.size,
            boxQty: row.boxQty,
            retailPrice: row.retailPrice,
            unitDiscountPercent: row.unitDiscountPercent,
            boxPrice: row.boxPrice,
            boxDiscountPercent: row.boxDiscountPercent,
            unitStock: row.unitStock,
            boxStock: row.boxStock,
            vatClass: row.vatClass,
          })),
        }),
      });

      const data = await res.json();

      if (data.success) {
        setMessage("All prices and stock updated successfully.");
        loadProducts();
      } else {
        setMessage(data.message || "Update failed.");
      }
    } catch {
      setMessage("Update failed.");
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f5ee] px-6 py-10 text-[#1f2e1f]">
      <div className="mx-auto max-w-[1800px]">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold">Bulk Pricing Update</h1>
            <p className="mt-2 text-sm text-gray-600">
              Update prices, size, stock and VAT in one table
            </p>
          </div>

          <div className="flex gap-3">
            <a
              href="/admin/dashboard"
              className="rounded border border-[#102418] px-5 py-3 font-semibold text-[#102418]"
            >
              Back to Dashboard
            </a>

            <button
              type="button"
              onClick={saveAll}
              className="rounded bg-[#102418] px-6 py-3 font-semibold text-white"
            >
              Save All Changes
            </button>
          </div>
        </div>

        <div className="mb-6 rounded-xl bg-white p-6 shadow">
          <div className="grid gap-4 md:grid-cols-4">
            <div>
              <label className="mb-2 block text-sm font-semibold">Category</label>
              <select
                className="w-full rounded border px-4 py-3"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option>Bakliyat</option>
                <option>Un</option>
                <option>Kuruyemis</option>
                <option>Jellybon</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">Sub Category</label>
              <select
                className="w-full rounded border px-4 py-3"
                value={selectedSubCategory}
                onChange={(e) => setSelectedSubCategory(e.target.value)}
              >
                {availableSubCategories.map((sub) => (
                  <option key={sub} value={sub}>
                    {sub}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">Sort By</label>
              <select
                className="w-full rounded border px-4 py-3"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="name-asc">Name A-Z</option>
                <option value="name-desc">Name Z-A</option>
                <option value="low-stock-first">Low Stock First</option>
                <option value="unit-stock-asc">Unit Stock Low-High</option>
                <option value="unit-stock-desc">Unit Stock High-Low</option>
                <option value="box-stock-asc">Box Stock Low-High</option>
                <option value="box-stock-desc">Box Stock High-Low</option>
              </select>
            </div>

            <div className="flex items-end">
              <div className="rounded border bg-[#f8f5ee] px-4 py-3 text-sm">
                Rows: <span className="font-bold">{rows.length}</span>
              </div>
            </div>
          </div>

          {message && (
            <p className="mt-4 font-semibold text-[#102418]">{message}</p>
          )}
        </div>

        <div className="overflow-x-auto rounded-xl bg-white shadow">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-[#102418] text-left text-white">
                <th className="border px-3 py-3">Product</th>
                <th className="border px-3 py-3">Sub Category</th>
                <th className="border px-3 py-3">Size</th>
                <th className="border px-3 py-3">Box Qty</th>
                <th className="border px-3 py-3">Unit Price</th>
                <th className="border px-3 py-3">Unit Discount %</th>
                <th className="border px-3 py-3">Box Price</th>
                <th className="border px-3 py-3">Box Discount %</th>
                <th className="border px-3 py-3">Unit Stock</th>
                <th className="border px-3 py-3">Box Stock</th>
                <th className="border px-3 py-3">VAT Class</th>
              </tr>
            </thead>

            <tbody>
              {rows.map((row, index) => (
                <tr
                  key={`${row.slug}-${row.originalSize}-${row.image}-${index}`}
                  className="odd:bg-[#faf8f2]"
                >
                  <td className="border px-3 py-2 font-semibold">
                    {row.productName}
                  </td>

                  <td className="border px-3 py-2">{row.subCategory}</td>

                  <td className="border px-3 py-2">
                    <input
                      className="w-28 rounded border px-2 py-1"
                      value={row.size}
                      onChange={(e) => updateRow(index, "size", e.target.value)}
                    />
                  </td>

                  <td className="border px-3 py-2">
                    <input
                      className="w-24 rounded border px-2 py-1"
                      value={row.boxQty}
                      onChange={(e) => updateRow(index, "boxQty", e.target.value)}
                    />
                  </td>

                  <td className="border px-3 py-2">
                    <input
                      className="w-24 rounded border px-2 py-1"
                      value={row.retailPrice}
                      onChange={(e) =>
                        updateRow(index, "retailPrice", e.target.value)
                      }
                    />
                  </td>

                  <td className="border px-3 py-2">
                    <input
                      className="w-24 rounded border px-2 py-1"
                      value={row.unitDiscountPercent}
                      onChange={(e) =>
                        updateRow(index, "unitDiscountPercent", e.target.value)
                      }
                    />
                  </td>

                  <td className="border px-3 py-2">
                    <input
                      className="w-24 rounded border px-2 py-1"
                      value={row.boxPrice}
                      onChange={(e) =>
                        updateRow(index, "boxPrice", e.target.value)
                      }
                    />
                  </td>

                  <td className="border px-3 py-2">
                    <input
                      className="w-24 rounded border px-2 py-1"
                      value={row.boxDiscountPercent}
                      onChange={(e) =>
                        updateRow(index, "boxDiscountPercent", e.target.value)
                      }
                    />
                  </td>

                  <td className="border px-3 py-2">
                    <input
                      className="w-24 rounded border px-2 py-1"
                      value={row.unitStock}
                      onChange={(e) =>
                        updateRow(index, "unitStock", e.target.value)
                      }
                    />
                  </td>

                  <td className="border px-3 py-2">
                    <input
                      className="w-24 rounded border px-2 py-1"
                      value={row.boxStock}
                      onChange={(e) =>
                        updateRow(index, "boxStock", e.target.value)
                      }
                    />
                  </td>

                  <td className="border px-3 py-2">
                    <select
                      className="w-28 rounded border px-2 py-1"
                      value={row.vatClass}
                      onChange={(e) =>
                        updateRow(index, "vatClass", e.target.value)
                      }
                    >
                      <option value="zero">0%</option>
                      <option value="standard">20%</option>
                    </select>
                  </td>
                </tr>
              ))}

              {rows.length === 0 && (
                <tr>
                  <td
                    colSpan={11}
                    className="border px-4 py-8 text-center text-gray-500"
                  >
                    No products found for this category / sub category.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}