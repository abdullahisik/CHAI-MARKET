"use client";

import { useEffect, useMemo, useState } from "react";

type Variant = {
  size: string;
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

type EditState = {
  originalSlug: string;
  originalSize: string;
  name: string;
  category: string;
  subCategory: string;
  description: string;
  size: string;
  retailPrice: string;
  retailDiscountPrice: string;
  boxQty: string;
  boxPrice: string;
  boxDiscountPrice: string;
  image: string;
} | null;

function getAutoFolder(category: string, subCategory: string, size: string) {
  const s = size.toLowerCase();

  if (category === "Bakliyat" && subCategory === "Pulses") {
    if (s === "500g" || s === "half kg") return "/products/PULSES/HALF KG/";
    if (s === "1kg" || s === "1 kg") return "/products/PULSES/1 KG/";
    return "/products/PULSES/2-4 KG/";
  }

  if (category === "Bakliyat" && subCategory === "Rice") {
    if (s === "500g" || s === "half kg") return "/products/RICES/HALF KG/";
    if (s === "1kg" || s === "1 kg") return "/products/RICES/1 KG/";
    return "/products/RICES/2-4 KG/";
  }

  if (category === "Bakliyat" && subCategory === "Seeds & Superfoods") {
    if (s === "500g" || s === "half kg") return "/products/SUPERFOODS-SEEDS/HALF KG/";
    if (s === "1kg" || s === "1 kg") return "/products/SUPERFOODS-SEEDS/1 KG/";
    return "/products/SUPERFOODS-SEEDS/2-4 KG/";
  }

  if (category === "Un" && subCategory === "Flour-Oats") {
    if (s === "500g" || s === "half kg") return "/products/FLOUR-OATS/HALF KG/";
    if (s === "1kg" || s === "1 kg") return "/products/FLOUR-OATS/1 KG/";
    return "/products/FLOUR-OATS/2-4 KG/";
  }

  if (category === "Kuruyemis" && subCategory === "Big Nut") {
    return "/products/NUTS/BIG NUTS/";
  }

  if (category === "Kuruyemis" && subCategory === "Small Nut") {
    return "/products/NUTS/SMALL NUTS/";
  }

  if (category === "Jellybon") {
    return "/products/JELLIES/";
  }

  return "/products/";
}

export default function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [message, setMessage] = useState("");
  const [allImages, setAllImages] = useState<string[]>([]);

  const [name, setName] = useState("");
  const [category, setCategory] = useState("Bakliyat");
  const [subCategory, setSubCategory] = useState("Pulses");
  const [description, setDescription] = useState("");

  const [sizePreset, setSizePreset] = useState("1kg");
  const [sizeManual, setSizeManual] = useState("");

  const [retailPrice, setRetailPrice] = useState("");
  const [retailDiscountPrice, setRetailDiscountPrice] = useState("");

  const [boxQtyPreset, setBoxQtyPreset] = useState("8");
  const [boxQtyManual, setBoxQtyManual] = useState("");

  const [boxPrice, setBoxPrice] = useState("");
  const [boxDiscountPrice, setBoxDiscountPrice] = useState("");
  const [fileName, setFileName] = useState("");

  const [editState, setEditState] = useState<EditState>(null);

  const finalSize = useMemo(() => {
    return sizeManual.trim() || (sizePreset === "Custom" ? "" : sizePreset);
  }, [sizeManual, sizePreset]);

  const finalBoxQty = useMemo(() => {
    return boxQtyManual.trim() || (boxQtyPreset === "Custom" ? "" : boxQtyPreset);
  }, [boxQtyManual, boxQtyPreset]);

  const loadProducts = async () => {
    const res = await fetch("/api/products");
    const data = await res.json();
    setProducts(Array.isArray(data) ? data : []);
  };

  const loadImages = async () => {
    try {
      const res = await fetch("/api/images");
      const text = await res.text();

      if (!text) {
        setAllImages([]);
        return;
      }

      const data = JSON.parse(text);
      setAllImages(Array.isArray(data) ? data : []);
    } catch {
      setAllImages([]);
    }
  };

  useEffect(() => {
    loadProducts();
    loadImages();
  }, []);

  useEffect(() => {
    if (!editState && !boxQtyManual) {
      if (sizePreset === "500g") setBoxQtyPreset("20");
      if (sizePreset === "1kg") setBoxQtyPreset("8");
      if (sizePreset === "2kg") setBoxQtyPreset("8");
      if (sizePreset === "4kg") setBoxQtyPreset("4");
    }
  }, [sizePreset, editState, boxQtyManual]);

  const autoFolder = useMemo(
    () => getAutoFolder(category, subCategory, finalSize || sizePreset),
    [category, subCategory, finalSize, sizePreset]
  );

  const image = useMemo(() => {
    if (!fileName.trim()) return "";
    return `${autoFolder}${fileName.trim()}`;
  }, [autoFolder, fileName]);

  const suggestedImages = useMemo(() => {
    return allImages.filter((img) => img.startsWith(autoFolder)).slice(0, 300);
  }, [allImages, autoFolder]);

  const clearAddForm = () => {
    setName("");
    setCategory("Bakliyat");
    setSubCategory("Pulses");
    setDescription("");
    setSizePreset("1kg");
    setSizeManual("");
    setRetailPrice("");
    setRetailDiscountPrice("");
    setBoxQtyPreset("8");
    setBoxQtyManual("");
    setBoxPrice("");
    setBoxDiscountPrice("");
    setFileName("");
  };

  const handleBulkImport = async () => {
    setMessage("Importing...");
    const res = await fetch("/api/bulk-import", { method: "POST" });
    const data = await res.json();

    if (data.success) {
      setMessage(
        `Bulk import done. Added products: ${data.addedProducts}, added variants: ${data.addedVariants}`
      );
      loadProducts();
      loadImages();
    } else {
      setMessage(data.message || "Bulk import failed.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    const res = await fetch("/api/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        category,
        subCategory,
        description,
        size: finalSize,
        retailPrice,
        retailDiscountPrice,
        boxQty: finalBoxQty,
        boxPrice,
        boxDiscountPrice,
        image,
      }),
    });

    const data = await res.json();

    if (data.success) {
      setMessage("Product saved successfully.");
      clearAddForm();
      loadProducts();
    } else {
      setMessage(data.message || "Something went wrong.");
    }
  };

  const startEdit = (product: Product, variant: Variant) => {
    setEditState({
      originalSlug: product.slug,
      originalSize: variant.size,
      name: product.name,
      category: product.category,
      subCategory: product.subCategory,
      description: product.description,
      size: variant.size || "",
      retailPrice: variant.retailPrice || variant.unitPrice || "",
      retailDiscountPrice:
        variant.retailDiscountPrice || variant.discountPrice || "",
      boxQty: String(variant.boxQty ?? ""),
      boxPrice: variant.boxPrice || "",
      boxDiscountPrice: variant.boxDiscountPrice || "",
      image: variant.image || "",
    });
    setMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setEditState(null);
    setMessage("");
  };

  const handleEditSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editState) return;

    const res = await fetch("/api/products", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(editState),
    });

    const data = await res.json();

    if (data.success) {
      setMessage("Product updated successfully.");
      setEditState(null);
      loadProducts();
    } else {
      setMessage(data.message || "Update failed.");
    }
  };

  const handleDelete = async (slug: string, size: string) => {
    const ok = window.confirm(`Delete ${slug} - ${size}?`);
    if (!ok) return;

    const res = await fetch("/api/products", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ slug, size }),
    });

    const data = await res.json();

    if (data.success) {
      setMessage("Variant deleted successfully.");
      loadProducts();
    } else {
      setMessage(data.message || "Delete failed.");
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f5ee] px-6 py-10 text-[#1f2e1f]">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-4xl font-bold">Admin Dashboard</h1>

          <div className="flex flex-wrap gap-3">
            <a
              href="/admin/settings"
              className="rounded bg-slate-700 px-6 py-3 font-semibold text-white"
            >
              Settings
            </a>

            <a
              href="/admin/bulk-pricing"
              className="rounded bg-amber-600 px-6 py-3 font-semibold text-white"
            >
              Bulk Price Update
            </a>

            <a
              href="/admin/orders"
              className="rounded bg-blue-600 px-6 py-3 font-semibold text-white"
            >
              Orders
            </a>

            <a
              href="/admin/sales-report"
              className="rounded bg-purple-600 px-6 py-3 font-semibold text-white"
            >
              Monthly Sales
            </a>

            <a
              href="/admin/stock-warning"
              className="rounded bg-red-600 px-6 py-3 font-semibold text-white"
            >
              Stock Warning
            </a>

            <button
              type="button"
              onClick={handleBulkImport}
              className="rounded bg-green-600 px-6 py-3 font-semibold text-white"
            >
              Import All Images Automatically
            </button>
          </div>
        </div>

        {editState && (
          <div className="mb-10 rounded-2xl border-2 border-[#102418] bg-white p-8 shadow">
            <h2 className="mb-6 text-2xl font-bold">Edit Variant</h2>

            <form onSubmit={handleEditSave} className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold">Product Name</label>
                <input
                  className="w-full rounded border px-4 py-3"
                  value={editState.name}
                  onChange={(e) =>
                    setEditState({ ...editState, name: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">Category</label>
                <input
                  className="w-full rounded border px-4 py-3"
                  value={editState.category}
                  onChange={(e) =>
                    setEditState({ ...editState, category: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">Sub Category</label>
                <input
                  className="w-full rounded border px-4 py-3"
                  value={editState.subCategory}
                  onChange={(e) =>
                    setEditState({ ...editState, subCategory: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">Size</label>
                <input
                  className="w-full rounded border px-4 py-3"
                  value={editState.size}
                  onChange={(e) =>
                    setEditState({ ...editState, size: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">Retail Price</label>
                <input
                  className="w-full rounded border px-4 py-3"
                  value={editState.retailPrice}
                  onChange={(e) =>
                    setEditState({ ...editState, retailPrice: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">Retail Discount Price</label>
                <input
                  className="w-full rounded border px-4 py-3"
                  value={editState.retailDiscountPrice}
                  onChange={(e) =>
                    setEditState({
                      ...editState,
                      retailDiscountPrice: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">Box Qty</label>
                <input
                  className="w-full rounded border px-4 py-3"
                  value={editState.boxQty}
                  onChange={(e) =>
                    setEditState({ ...editState, boxQty: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">Box Price</label>
                <input
                  className="w-full rounded border px-4 py-3"
                  value={editState.boxPrice}
                  onChange={(e) =>
                    setEditState({ ...editState, boxPrice: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">Box Discount Price</label>
                <input
                  className="w-full rounded border px-4 py-3"
                  value={editState.boxDiscountPrice}
                  onChange={(e) =>
                    setEditState({
                      ...editState,
                      boxDiscountPrice: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">Image Path</label>
                <input
                  className="w-full rounded border px-4 py-3"
                  value={editState.image}
                  onChange={(e) =>
                    setEditState({ ...editState, image: e.target.value })
                  }
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-semibold">Description</label>
                <textarea
                  className="w-full rounded border px-4 py-3"
                  rows={4}
                  value={editState.description}
                  onChange={(e) =>
                    setEditState({ ...editState, description: e.target.value })
                  }
                />
              </div>

              <div className="md:col-span-2 flex gap-3">
                <button
                  type="submit"
                  className="rounded bg-[#102418] px-6 py-3 font-semibold text-white"
                >
                  Save Changes
                </button>

                <button
                  type="button"
                  onClick={cancelEdit}
                  className="rounded border border-[#102418] px-6 py-3 font-semibold text-[#102418]"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="mb-10 rounded-2xl bg-white p-8 shadow">
          <h2 className="mb-6 text-2xl font-bold">Add Product / Variant</h2>

          <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold">Product Name</label>
              <input
                className="w-full rounded border px-4 py-3"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">Category</label>
              <select
                className="w-full rounded border px-4 py-3"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
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
                value={subCategory}
                onChange={(e) => setSubCategory(e.target.value)}
              >
                <option>Pulses</option>
                <option>Rice</option>
                <option>Seeds & Superfoods</option>
                <option>Flour-Oats</option>
                <option>Big Nut</option>
                <option>Small Nut</option>
                <option>Jellies</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">Size Preset</label>
              <select
                className="w-full rounded border px-4 py-3"
                value={sizePreset}
                onChange={(e) => setSizePreset(e.target.value)}
              >
                <option>500g</option>
                <option>1kg</option>
                <option>2kg</option>
                <option>4kg</option>
                <option>Custom</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">Manual Size</label>
              <input
                className="w-full rounded border px-4 py-3"
                value={sizeManual}
                onChange={(e) => setSizeManual(e.target.value)}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">Final Size</label>
              <input
                className="w-full rounded border bg-gray-100 px-4 py-3"
                value={finalSize}
                readOnly
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">Retail Price</label>
              <input
                className="w-full rounded border px-4 py-3"
                value={retailPrice}
                onChange={(e) => setRetailPrice(e.target.value)}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">Retail Discount Price</label>
              <input
                className="w-full rounded border px-4 py-3"
                value={retailDiscountPrice}
                onChange={(e) => setRetailDiscountPrice(e.target.value)}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">Box Qty Preset</label>
              <select
                className="w-full rounded border px-4 py-3"
                value={boxQtyPreset}
                onChange={(e) => setBoxQtyPreset(e.target.value)}
              >
                <option>4</option>
                <option>8</option>
                <option>12</option>
                <option>14</option>
                <option>15</option>
                <option>20</option>
                <option>Custom</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">Manual Box Qty</label>
              <input
                className="w-full rounded border px-4 py-3"
                value={boxQtyManual}
                onChange={(e) => setBoxQtyManual(e.target.value)}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">Final Box Qty</label>
              <input
                className="w-full rounded border bg-gray-100 px-4 py-3"
                value={finalBoxQty}
                readOnly
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">Box Price</label>
              <input
                className="w-full rounded border px-4 py-3"
                value={boxPrice}
                onChange={(e) => setBoxPrice(e.target.value)}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">Box Discount Price</label>
              <input
                className="w-full rounded border px-4 py-3"
                value={boxDiscountPrice}
                onChange={(e) => setBoxDiscountPrice(e.target.value)}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">Auto Folder</label>
              <input
                className="w-full rounded border bg-gray-100 px-4 py-3"
                value={autoFolder}
                readOnly
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">File Name</label>
              <input
                list="image-suggestions"
                className="w-full rounded border px-4 py-3"
                value={fileName}
                onChange={(e) => {
                  const val = e.target.value;
                  const full = suggestedImages.find((img) => img === val);
                  if (full) {
                    const onlyFile = full.split("/").pop() || "";
                    setFileName(onlyFile);
                  } else {
                    setFileName(val);
                  }
                }}
              />
              <datalist id="image-suggestions">
                {suggestedImages.map((img) => (
                  <option key={img} value={img} />
                ))}
              </datalist>
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-semibold">Final Image Path</label>
              <input
                className="w-full rounded border bg-gray-100 px-4 py-3"
                value={image}
                readOnly
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-semibold">Description</label>
              <textarea
                className="w-full rounded border px-4 py-3"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="md:col-span-2 flex gap-3">
              <button
                type="submit"
                className="rounded bg-[#102418] px-6 py-3 font-semibold text-white"
              >
                Save Product
              </button>

              <button
                type="button"
                onClick={handleBulkImport}
                className="rounded bg-green-600 px-6 py-3 font-semibold text-white"
              >
                Auto Import All Images
              </button>
            </div>
          </form>

          {message && <p className="mt-4 font-semibold">{message}</p>}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {products.map((product) => (
            <div key={product.slug} className="rounded-xl bg-white p-6 shadow">
              <h2 className="text-2xl font-bold">{product.name}</h2>
              <p className="mt-1 text-sm text-gray-600">
                {product.category} / {product.subCategory}
              </p>
              <p className="mt-3 text-sm">{product.description}</p>

              <div className="mt-4 space-y-3">
                {product.variants.map((variant) => (
                  <div key={`${product.slug}-${variant.size || "empty"}`} className="rounded border p-3">
                    <div className="font-semibold">{variant.size || "(empty size)"}</div>
                    <div>Retail: £{variant.retailPrice || variant.unitPrice || "-"}</div>
                    <div>
                      Retail Discount:{" "}
                      {variant.retailDiscountPrice || variant.discountPrice
                        ? `£${variant.retailDiscountPrice || variant.discountPrice}`
                        : "No discount"}
                    </div>
                    <div>Box Qty: {variant.boxQty ?? "-"}</div>
                    <div>Box Price: £{variant.boxPrice || "-"}</div>
                    <div>
                      Box Discount:{" "}
                      {variant.boxDiscountPrice
                        ? `£${variant.boxDiscountPrice}`
                        : "No discount"}
                    </div>
                    <div className="text-xs text-gray-500">{variant.image}</div>

                    <div className="mt-3 flex gap-2">
                      <button
                        type="button"
                        onClick={() => startEdit(product, variant)}
                        className="rounded bg-[#102418] px-4 py-2 text-sm font-semibold text-white"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(product.slug, variant.size)}
                        className="rounded border border-red-600 px-4 py-2 text-sm font-semibold text-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}