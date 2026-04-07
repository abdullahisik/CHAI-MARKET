"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import SiteHeader from "../components/site-header";
import { useCart } from "../providers/cart-provider";
import { useAuth } from "../providers/auth-provider";

function formatMoney(value: number) {
  return `£${value.toFixed(2)}`;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, clearCart } = useCart();
  const { user } = useAuth();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<
    "bank-transfer" | "card-coming-soon"
  >("bank-transfer");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setFullName(user.fullName || "");
      setEmail(user.email || "");
      setPhone(user.phone || "");
      setAddress(user.address || "");
    }
  }, [user]);

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0),
    [items]
  );

  const vatTotal = useMemo(
    () =>
      items.reduce((sum, item) => {
        const lineSubtotal = item.unitPrice * item.quantity;
        const rate = item.vatClass === "standard" ? 0.2 : 0;
        return sum + lineSubtotal * rate;
      }, 0),
    [items]
  );

  const shipping = subtotal === 0 ? 0 : subtotal >= 75 ? 0 : 4.99;
  const grandTotal = subtotal + vatTotal + shipping;

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!items.length) {
      setMessage("Your cart is empty.");
      return;
    }

    setSubmitting(true);
    setMessage("");

    try {
      const res = await fetch("/api/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items,
          customer: {
            fullName,
            email,
            phone,
            address,
            notes,
          },
          paymentMethod,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        setMessage(data.message || "Checkout failed.");
        setSubmitting(false);
        return;
      }

      clearCart();
      router.push(`/order-confirmation?orderId=${encodeURIComponent(data.orderId)}`);
    } catch {
      setMessage("Checkout failed.");
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f8f5ee] text-[#1f2e1f]">
      <SiteHeader />

      <div className="mx-auto max-w-7xl px-6 py-10">
        <h1 className="mb-8 text-4xl font-bold">Checkout</h1>

        {items.length === 0 ? (
          <div className="rounded bg-white p-8 shadow">
            <p className="mb-4 text-lg">Your cart is empty.</p>
            <button
              type="button"
              onClick={() => router.push("/")}
              className="rounded bg-[#102418] px-5 py-3 font-semibold text-white"
            >
              Back to Shop
            </button>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
            <form onSubmit={handleCheckout} className="rounded bg-white p-6 shadow">
              <h2 className="mb-6 text-2xl font-bold">Customer Information</h2>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold">Full Name</label>
                  <input
                    className="w-full rounded border px-4 py-3"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold">Email</label>
                  <input
                    type="email"
                    className="w-full rounded border px-4 py-3"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold">Phone</label>
                  <input
                    className="w-full rounded border px-4 py-3"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-semibold">
                    Delivery Address
                  </label>
                  <textarea
                    rows={4}
                    className="w-full rounded border px-4 py-3"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-semibold">
                    Order Notes
                  </label>
                  <textarea
                    rows={4}
                    className="w-full rounded border px-4 py-3"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Optional delivery notes..."
                  />
                </div>
              </div>

              <h2 className="mb-4 mt-8 text-2xl font-bold">Payment Method</h2>

              <div className="grid gap-4">
                <label className="rounded border p-4">
                  <div className="flex items-start gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === "bank-transfer"}
                      onChange={() => setPaymentMethod("bank-transfer")}
                    />
                    <div>
                      <div className="font-semibold">Bank Transfer</div>
                      <div className="text-sm text-gray-600">
                        Available. Bank details will be shown after confirmation.
                      </div>
                    </div>
                  </div>
                </label>

                <label className="rounded border bg-gray-50 p-4 opacity-70">
                  <div className="flex items-start gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === "card-coming-soon"}
                      onChange={() => setPaymentMethod("card-coming-soon")}
                    />
                    <div>
                      <div className="font-semibold">Card Payment</div>
                      <div className="text-sm text-gray-600">Coming Soon</div>
                    </div>
                  </div>
                </label>
              </div>

              {message && (
                <p className="mt-6 font-semibold text-red-600">{message}</p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="mt-8 rounded bg-green-600 px-6 py-3 font-semibold text-white disabled:bg-gray-400"
              >
                {submitting ? "Processing..." : "Confirm Order"}
              </button>
            </form>

            <div className="rounded bg-white p-6 shadow">
              <h2 className="mb-6 text-2xl font-bold">Order Summary</h2>

              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="rounded border p-3">
                    <div className="font-semibold">{item.productName}</div>
                    <div className="text-sm text-gray-600">
                      {item.size} | {item.purchaseType} | Qty: {item.quantity}
                    </div>
                    <div className="text-sm font-semibold">
                      {formatMoney(item.unitPrice * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 space-y-3 border-t pt-4 text-sm">
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
                  <span>{shipping === 0 ? "Free" : formatMoney(shipping)}</span>
                </div>

                <div className="flex items-center justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>{formatMoney(grandTotal)}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}