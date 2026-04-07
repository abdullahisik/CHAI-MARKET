"use client";

import { useMemo, useState } from "react";
import SiteHeader from "./site-header";
import { useCart } from "../providers/cart-provider";

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

export default function ProductDetailClient({
  product,
}: {
  product: Product;
}) {
  const variants = product.variants || [];
  const [selectedSize, setSelectedSize] = useState(variants[0]?.size || "");

  const { addItem } = useCart();

  const selectedVariant = useMemo(() => {
    return (
      variants.find((v) => String(v.size || "") === String(selectedSize || "")) ||
      variants[0]
    );
  }, [variants, selectedSize]);

  if (!selectedVariant) {
    return (
      <main className="min-h-screen bg-[#f8f5ee] text-[#1f2e1f]">
        <SiteHeader />
        <div className="mx-auto max-w-7xl px-6 py-10">Product not found</div>
      </main>
    );
  }

  const retailPrice = Number(
    selectedVariant.retailDiscountPrice ||
      selectedVariant.retailPrice ||
      selectedVariant.discountPrice ||
      selectedVariant.unitPrice ||
      0
  );

  const boxPrice = Number(
    selectedVariant.boxDiscountPrice || selectedVariant.boxPrice || 0
  );

  const unitStock = Number(selectedVariant.unitStock || 0);
  const boxStock = Number(selectedVariant.boxStock || 0);
  const boxQty = Number(selectedVariant.boxQty || 0);
  const vatClass =
    String(selectedVariant.vatClass || "zero") === "standard"
      ? "standard"
      : "zero";

  const retailOutOfStock = unitStock <= 0;
  const boxOutOfStock = boxStock <= 0;

  const handleAddRetail = () => {
    if (retailOutOfStock || retailPrice <= 0) return;

    addItem({
      productSlug: String(product.slug || ""),
      productName: String(product.name || ""),
      size: String(selectedVariant.size || ""),
      purchaseType: "retail",
      unitPrice: retailPrice,
      boxQty,
      image: String(selectedVariant.image || ""),
      vatClass,
    });
  };

  const handleAddBox = () => {
    if (boxOutOfStock || boxPrice <= 0) return;

    addItem({
      productSlug: String(product.slug || ""),
      productName: String(product.name || ""),
      size: String(selectedVariant.size || ""),
      purchaseType: "box",
      unitPrice: boxPrice,
      boxQty,
      image: String(selectedVariant.image || ""),
      vatClass,
    });
  };

  return (
    <main className="min-h-screen bg-[#f8f5ee] text-[#1f2e1f]">
      <SiteHeader />

      <div className="mx-auto max-w-7xl px-6 py-10">
        <a
          href="/"
          className="mb-6 inline-block rounded border border-[#102418] px-4 py-2 text-sm font-semibold text-[#102418]"
        >
          ← Back to Home
        </a>

        <h1 className="mb-8 text-4xl font-bold">{product.name}</h1>

        <div className="grid gap-10 md:grid-cols-2">
          <div className="rounded bg-white p-6 shadow">
            {selectedVariant.image ? (
              <img
                src={selectedVariant.image}
                alt={product.name || ""}
                className="h-[520px] w-full object-contain"
              />
            ) : null}
          </div>

          <div>
            <h2 className="mb-4 text-2xl font-bold">Product Details</h2>

            <p className="mb-6 text-lg text-gray-700">
              {product.description || "Premium quality product."}
            </p>

            <ul className="mb-6 list-disc space-y-2 pl-5 text-gray-700">
              <li>Premium quality</li>
              <li>Suitable for wholesale and retail</li>
              <li>Fast delivery in Manchester</li>
              <li>UK wide service available</li>
            </ul>

            <div className="mb-6">
              <p className="mb-3 text-sm font-semibold">Select size</p>
              <div className="flex flex-wrap gap-3">
                {variants.map((variant) => {
                  const active =
                    String(variant.size || "") === String(selectedSize || "");

                  return (
                    <button
                      key={String(variant.size || "")}
                      type="button"
                      onClick={() => setSelectedSize(String(variant.size || ""))}
                      className={`rounded border px-4 py-2 font-semibold ${
                        active
                          ? "bg-[#102418] text-white"
                          : "border-[#102418] text-[#102418]"
                      }`}
                    >
                      {variant.size || "Default"}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mb-6 rounded border bg-white p-4">
              <p className="mb-3 text-sm font-semibold">Selected variant</p>

              <div className="mb-4 rounded border p-4">
                <div className="text-sm text-gray-600">Size</div>
                <div className="font-semibold">{selectedVariant.size || "-"}</div>
              </div>

              <div className="mb-4 rounded border p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold">Retail Price</div>
                    <div className="text-sm text-gray-600">
                      Single unit purchase
                    </div>
                  </div>
                  <div className="text-xl font-bold">
                    {retailPrice > 0 ? `£${retailPrice.toFixed(2)}` : "-"}
                  </div>
                </div>

                <div className="mt-2 text-sm">
                  {retailOutOfStock ? (
                    <span className="font-semibold text-red-600">
                      Out of stock
                    </span>
                  ) : (
                    <span className="text-gray-600">
                      In stock: {unitStock} units
                    </span>
                  )}
                </div>
              </div>

              <div className="rounded border p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold">Box Price</div>
                    <div className="text-sm text-gray-600">
                      {boxQty > 0 ? `${boxQty} units per box` : "Box purchase"}
                    </div>
                  </div>
                  <div className="text-xl font-bold">
                    {boxPrice > 0 ? `£${boxPrice.toFixed(2)}` : "-"}
                  </div>
                </div>

                <div className="mt-2 text-sm">
                  {boxOutOfStock ? (
                    <span className="font-semibold text-red-600">
                      Out of stock
                    </span>
                  ) : (
                    <span className="text-gray-600">
                      In stock: {boxStock} boxes
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleAddRetail}
                disabled={retailOutOfStock || retailPrice <= 0}
                className={`rounded px-6 py-3 font-semibold text-white ${
                  retailOutOfStock || retailPrice <= 0
                    ? "cursor-not-allowed bg-gray-400"
                    : "bg-green-500"
                }`}
              >
                {retailOutOfStock ? "Retail Out of Stock" : "Add Retail"}
              </button>

              <button
                type="button"
                onClick={handleAddBox}
                disabled={boxOutOfStock || boxPrice <= 0}
                className={`rounded px-6 py-3 font-semibold text-white ${
                  boxOutOfStock || boxPrice <= 0
                    ? "cursor-not-allowed bg-gray-400"
                    : "bg-[#102418]"
                }`}
              >
                {boxOutOfStock ? "Box Out of Stock" : "Add Box"}
              </button>
            </div>

            <p className="mt-4 text-sm text-gray-600">
              VAT is calculated in cart based on the product VAT class.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}