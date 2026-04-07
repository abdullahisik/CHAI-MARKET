"use client";

import Link from "next/link";
import SiteHeader from "../components/site-header";
import { useCart } from "../providers/cart-provider";

function formatMoney(value: number) {
  return `£${value.toFixed(2)}`;
}

export default function CartPage() {
  const { items, increaseQty, decreaseQty, removeItem, clearCart } = useCart();

  const subtotal = items.reduce((sum, item) => {
    return sum + item.unitPrice * item.quantity;
  }, 0);

  const vatTotal = items.reduce((sum, item) => {
    const lineSubtotal = item.unitPrice * item.quantity;
    const rate = item.vatClass === "standard" ? 0.2 : 0;
    return sum + lineSubtotal * rate;
  }, 0);

  const shipping = subtotal === 0 ? 0 : subtotal >= 75 ? 0 : 4.99;
  const grandTotal = subtotal + vatTotal + shipping;

  return (
    <main className="min-h-screen bg-[#f8f5ee] text-[#1f2e1f]">
      <SiteHeader />

      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8 flex items-center justify-between gap-4">
          <h1 className="text-4xl font-bold">Your Cart</h1>

          {items.length > 0 && (
            <button
              type="button"
              onClick={clearCart}
              className="rounded border border-red-600 px-5 py-3 font-semibold text-red-600"
            >
              Clear Cart
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="rounded bg-white p-8 shadow">
            <p className="mb-4 text-lg">Your cart is empty.</p>
            <Link
              href="/"
              className="rounded bg-[#102418] px-5 py-3 font-semibold text-white"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
            <div className="space-y-4">
              {items.map((item) => {
                const lineTotal = item.unitPrice * item.quantity;

                return (
                  <div
                    key={item.id}
                    className="grid gap-4 rounded bg-white p-4 shadow md:grid-cols-[120px_1fr_auto]"
                  >
                    <div className="h-[120px] overflow-hidden rounded bg-[#f3efe5]">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.productName}
                          className="h-full w-full object-contain"
                        />
                      ) : null}
                    </div>

                    <div>
                      <h2 className="text-xl font-bold">{item.productName}</h2>
                      <p className="text-sm text-gray-600">
                        Size: {item.size || "-"}
                      </p>
                      <p className="text-sm text-gray-600">
                        Type: {item.purchaseType === "box" ? "Box" : "Retail"}
                      </p>
                      {item.purchaseType === "box" && item.boxQty > 0 && (
                        <p className="text-sm text-gray-600">
                          {item.boxQty} units per box
                        </p>
                      )}
                      <p className="mt-2 font-semibold">
                        {formatMoney(item.unitPrice)} each
                      </p>
                    </div>

                    <div className="flex flex-col items-end justify-between gap-3">
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="text-sm font-semibold text-red-600"
                      >
                        Remove
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => decreaseQty(item.id)}
                          className="rounded border px-3 py-1 font-bold"
                        >
                          -
                        </button>

                        <span className="min-w-[24px] text-center font-semibold">
                          {item.quantity}
                        </span>

                        <button
                          type="button"
                          onClick={() => increaseQty(item.id)}
                          className="rounded border px-3 py-1 font-bold"
                        >
                          +
                        </button>
                      </div>

                      <div className="text-lg font-bold">
                        {formatMoney(lineTotal)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="rounded bg-white p-6 shadow">
              <h2 className="mb-6 text-2xl font-bold">Order Summary</h2>

              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span>Subtotal</span>
                  <span>{formatMoney(subtotal)}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span>VAT</span>
                  <span>{formatMoney(vatTotal)}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span>Shipping</span>
                  <span>
                    {shipping === 0 ? "Free" : formatMoney(shipping)}
                  </span>
                </div>

                <div className="border-t pt-3 text-base font-bold">
                  <div className="flex items-center justify-between">
                    <span>Total</span>
                    <span>{formatMoney(grandTotal)}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 rounded bg-[#f8f5ee] p-4 text-sm text-gray-700">
                <p>Shipping is free for orders over £75.</p>
                <p>Orders under £75 have a £4.99 delivery charge.</p>
              </div>

              <Link
                href="/checkout"
                className="mt-6 block w-full rounded bg-green-600 px-6 py-3 text-center font-semibold text-white"
              >
                Go to Checkout
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}