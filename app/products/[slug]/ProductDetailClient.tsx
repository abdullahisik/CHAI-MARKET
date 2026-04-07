"use client";

import { useMemo, useState } from "react";

type Variant = {
  size: string;
  retailPrice: string;
  retailDiscountPrice?: string;
  boxQty: number;
  boxPrice: string;
  boxDiscountPrice?: string;
  image: string;
};

type Product = {
  slug?: string;
  name: string;
  category: string;
  subCategory: string;
  description: string;
  variants: Variant[];
};

export default function ProductDetailClient({
  product,
}: {
  product: Product;
}) {
  const defaultVariant =
    product.variants.find((v) => v.size.toLowerCase() === "1kg") ||
    product.variants[0];

  const [selectedSize, setSelectedSize] = useState(defaultVariant?.size || "");

  const selectedVariant = useMemo(() => {
    return (
      product.variants.find((v) => v.size === selectedSize) || defaultVariant
    );
  }, [product.variants, selectedSize, defaultVariant]);

  if (!selectedVariant) {
    return <div className="p-10">No variant found</div>;
  }

  return (
    <div className="min-h-screen bg-[#f8f5ee] px-6 py-10 text-[#1f2e1f]">
      <div className="mx-auto max-w-6xl">
        <a
          href="/"
          className="mb-6 inline-block rounded border border-[#102418] px-4 py-2 text-sm font-semibold text-[#102418]"
        >
          ← Back to Home
        </a>

        <h1 className="mb-8 text-4xl font-bold">{product.name}</h1>

        <div className="grid gap-10 md:grid-cols-2">
          <div className="overflow-hidden rounded bg-white p-4 shadow">
            <img
              src={selectedVariant.image}
              alt={product.name}
              className="h-[420px] w-full object-contain"
            />
          </div>

          <div>
            <h2 className="mb-4 text-2xl font-semibold">Product Details</h2>

            <p className="mb-4 text-lg text-gray-700">{product.description}</p>

            <ul className="mb-6 space-y-2 text-gray-700">
              <li>• Premium quality</li>
              <li>• Suitable for wholesale and retail</li>
              <li>• Fast delivery in Manchester</li>
              <li>• UK wide service available</li>
            </ul>

            <div className="mb-6">
              <div className="mb-3 text-sm font-semibold text-gray-600">
                Select size
              </div>

              <div className="flex flex-wrap gap-3">
                {product.variants.map((variant) => (
                  <button
                    key={variant.size}
                    type="button"
                    onClick={() => setSelectedSize(variant.size)}
                    className={`rounded border px-4 py-2 font-semibold ${
                      selectedSize === variant.size
                        ? "border-[#102418] bg-[#102418] text-white"
                        : "border-[#102418] bg-white text-[#102418]"
                    }`}
                  >
                    {variant.size}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6 rounded border bg-white p-4">
              <div className="mb-4 text-sm font-semibold text-gray-600">
                Selected variant
              </div>

              <div className="mb-4 flex items-center justify-between rounded border p-3">
                <div>
                  <div className="font-semibold">Size</div>
                  <div className="text-sm text-gray-600">
                    {selectedVariant.size}
                  </div>
                </div>
              </div>

              <div className="mb-4 flex items-center justify-between rounded border p-3">
                <div>
                  <div className="font-semibold">Retail Price</div>
                  <div className="text-sm text-gray-600">
                    Single unit purchase
                  </div>
                </div>

                <div className="text-right">
                  {selectedVariant.retailDiscountPrice ? (
                    <>
                      <div className="text-sm text-gray-400 line-through">
                        £{selectedVariant.retailPrice}
                      </div>
                      <div className="font-bold text-green-700">
                        £{selectedVariant.retailDiscountPrice}
                      </div>
                    </>
                  ) : (
                    <div className="font-bold">£{selectedVariant.retailPrice}</div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between rounded border p-3">
                <div>
                  <div className="font-semibold">Box Price</div>
                  <div className="text-sm text-gray-600">
                    {selectedVariant.boxQty} units per box
                  </div>
                </div>

                <div className="text-right">
                  {selectedVariant.boxDiscountPrice ? (
                    <>
                      <div className="text-sm text-gray-400 line-through">
                        £{selectedVariant.boxPrice}
                      </div>
                      <div className="font-bold text-green-700">
                        £{selectedVariant.boxDiscountPrice}
                      </div>
                    </>
                  ) : (
                    <div className="font-bold">£{selectedVariant.boxPrice}</div>
                  )}
                </div>
              </div>
            </div>

            <div className="mb-6 grid gap-3 md:grid-cols-2">
              <a
                href={`https://wa.me/447738800784?text=Hello%20I%20want%20to%20order%20${encodeURIComponent(
                  product.name
                )}%20-%20${encodeURIComponent(
                  selectedVariant.size
                )}%20Retail`}
                target="_blank"
                className="rounded bg-green-500 px-6 py-3 text-center font-semibold text-white"
              >
                Order Retail
              </a>

              <a
                href={`https://wa.me/447738800784?text=Hello%20I%20want%20to%20order%20${encodeURIComponent(
                  product.name
                )}%20-%20${encodeURIComponent(
                  selectedVariant.size
                )}%20Box`}
                target="_blank"
                className="rounded bg-[#102418] px-6 py-3 text-center font-semibold text-white"
              >
                Order Box
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}