"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type CategoryOption = {
  id: string;
  name: string;
};

export default function NewProductPage() {
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [form, setForm] = useState({
    name: "",
    brand: "",
    sku: "",
    barcode: "",
    weight: "",
    packSize: "",
    categoryId: "",
    salePrice: "",
    costPrice: "",
    comparePrice: "",
    stockQuantity: "0",
    lowStockThreshold: "5",
    description: "",
    imageUrl: "",
    isActive: true,
    isFeatured: false,
  });

  const [loading, setLoading] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await fetch("/api/admin/categories/list", {
          cache: "no-store",
        });

        if (!res.ok) {
          setLoadingCategories(false);
          return;
        }

        const data = await res.json();
        setCategories(data.categories || []);
      } catch {
      } finally {
        setLoadingCategories(false);
      }
    }

    loadCategories();
  }, []);

  function updateField(
    key: keyof typeof form,
    value: string | boolean
  ) {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const res = await fetch("/api/admin/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Failed to create product.");
      return;
    }

    setSuccess("Product created successfully.");

    setTimeout(() => {
      window.location.href = "/admin/products";
    }, 700);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Add Product</h2>
          <p className="text-sm text-neutral-500">
            Create a new product for this store.
          </p>
        </div>

        <Link
          href="/admin/products"
          className="rounded-xl border border-neutral-300 px-4 py-3 text-sm font-medium hover:bg-neutral-50"
        >
          Back to Products
        </Link>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium text-neutral-700">
              Product Name *
            </label>
            <input
              value={form.name}
              onChange={(e) => updateField("name", e.target.value)}
              className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-neutral-900"
              placeholder="e.g. Basmati Rice 5kg"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-700">
              Brand
            </label>
            <input
              value={form.brand}
              onChange={(e) => updateField("brand", e.target.value)}
              className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-neutral-900"
              placeholder="e.g. Chai Market"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-700">
              Category
            </label>
            <select
              value={form.categoryId}
              onChange={(e) => updateField("categoryId", e.target.value)}
              className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-neutral-900"
            >
              <option value="">
                {loadingCategories ? "Loading categories..." : "No category"}
              </option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-700">
              SKU
            </label>
            <input
              value={form.sku}
              onChange={(e) => updateField("sku", e.target.value)}
              className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-neutral-900"
              placeholder="e.g. CM-BAS-5KG"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-700">
              Barcode
            </label>
            <input
              value={form.barcode}
              onChange={(e) => updateField("barcode", e.target.value)}
              className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-neutral-900"
              placeholder="Barcode number"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-700">
              Weight
            </label>
            <input
              value={form.weight}
              onChange={(e) => updateField("weight", e.target.value)}
              className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-neutral-900"
              placeholder="e.g. 5kg"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-700">
              Pack Size
            </label>
            <input
              value={form.packSize}
              onChange={(e) => updateField("packSize", e.target.value)}
              className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-neutral-900"
              placeholder="e.g. 1 x 5kg"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-700">
              Sale Price (£)
            </label>
            <input
              type="number"
              step="0.01"
              value={form.salePrice}
              onChange={(e) => updateField("salePrice", e.target.value)}
              className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-neutral-900"
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-700">
              Cost Price (£)
            </label>
            <input
              type="number"
              step="0.01"
              value={form.costPrice}
              onChange={(e) => updateField("costPrice", e.target.value)}
              className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-neutral-900"
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-700">
              Compare Price (£)
            </label>
            <input
              type="number"
              step="0.01"
              value={form.comparePrice}
              onChange={(e) => updateField("comparePrice", e.target.value)}
              className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-neutral-900"
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-700">
              Stock Quantity
            </label>
            <input
              type="number"
              value={form.stockQuantity}
              onChange={(e) => updateField("stockQuantity", e.target.value)}
              className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-neutral-900"
              placeholder="0"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-700">
              Low Stock Threshold
            </label>
            <input
              type="number"
              value={form.lowStockThreshold}
              onChange={(e) =>
                updateField("lowStockThreshold", e.target.value)
              }
              className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-neutral-900"
              placeholder="5"
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium text-neutral-700">
              Image URL
            </label>
            <input
              value={form.imageUrl}
              onChange={(e) => updateField("imageUrl", e.target.value)}
              className="w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-neutral-900"
              placeholder="https://..."
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium text-neutral-700">
              Description
            </label>
            <textarea
              value={form.description}
              onChange={(e) => updateField("description", e.target.value)}
              className="min-h-[140px] w-full rounded-xl border border-neutral-300 px-4 py-3 outline-none focus:border-neutral-900"
              placeholder="Write product details..."
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              id="isActive"
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => updateField("isActive", e.target.checked)}
            />
            <label htmlFor="isActive" className="text-sm font-medium text-neutral-700">
              Active product
            </label>
          </div>

          <div className="flex items-center gap-3">
            <input
              id="isFeatured"
              type="checkbox"
              checked={form.isFeatured}
              onChange={(e) => updateField("isFeatured", e.target.checked)}
            />
            <label htmlFor="isFeatured" className="text-sm font-medium text-neutral-700">
              Featured product
            </label>
          </div>
        </div>

        {error && (
          <div className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {success && (
          <div className="mt-4 rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700">
            {success}
          </div>
        )}

        <div className="mt-6 flex items-center gap-3">
          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-neutral-900 px-5 py-3 text-sm font-semibold text-white hover:bg-neutral-800 disabled:opacity-60"
          >
            {loading ? "Saving..." : "Save Product"}
          </button>

          <Link
            href="/admin/products"
            className="rounded-xl border border-neutral-300 px-5 py-3 text-sm font-medium hover:bg-neutral-50"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}