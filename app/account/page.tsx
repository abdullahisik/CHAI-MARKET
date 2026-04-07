"use client";

import { useEffect, useState } from "react";
import SiteHeader from "../components/site-header";
import { useAuth } from "../providers/auth-provider";

type OrderItem = {
  id?: string;
  productName?: string;
  size?: string;
  purchaseType?: string;
  quantity?: number;
  unitPrice?: number;
};

type Order = {
  id?: string;
  createdAt?: string;
  status?: string;
  paymentMethod?: string;
  customer?: {
    fullName?: string;
    email?: string;
    phone?: string;
    address?: string;
    notes?: string;
  };
  items?: OrderItem[];
  subtotal?: number;
  vatTotal?: number;
  shipping?: number;
  grandTotal?: number;
};

export default function AccountPage() {
  const { user, isLoggedIn } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [message, setMessage] = useState("");

  const loadOrders = async () => {
    if (!user?.email) return;

    try {
      const res = await fetch(
        `/api/orders/by-email?email=${encodeURIComponent(user.email)}`
      );
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch {
      setOrders([]);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [user]);

  const updateStatus = async (orderId: string, status: string) => {
    setMessage("Saving...");

    try {
      const res = await fetch("/api/orders/update-status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderId, status }),
      });

      const data = await res.json();

      if (data.success) {
        setMessage("Request submitted successfully.");
        loadOrders();
      } else {
        setMessage(data.message || "Request failed.");
      }
    } catch {
      setMessage("Request failed.");
    }
  };

  return (
    <main className="min-h-screen bg-[#f8f5ee] text-[#1f2e1f]">
      <SiteHeader />

      <div className="mx-auto max-w-5xl px-6 py-10">
        <h1 className="mb-8 text-4xl font-bold">My Account</h1>

        {!isLoggedIn || !user ? (
          <div className="rounded bg-white p-8 shadow">
            <p className="mb-4 text-lg">You are not logged in.</p>
            <a
              href="/login"
              className="rounded bg-[#102418] px-5 py-3 font-semibold text-white"
            >
              Go to Login
            </a>
          </div>
        ) : (
          <div className="grid gap-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded bg-white p-6 shadow">
                <h2 className="mb-4 text-2xl font-bold">Profile Details</h2>
                <div className="space-y-2">
                  <p>
                    <span className="font-semibold">Full Name:</span> {user.fullName}
                  </p>
                  <p>
                    <span className="font-semibold">Email:</span> {user.email}
                  </p>
                  <p>
                    <span className="font-semibold">Phone:</span> {user.phone || "-"}
                  </p>
                  <p>
                    <span className="font-semibold">Address:</span> {user.address || "-"}
                  </p>
                </div>
              </div>

              <div className="rounded bg-white p-6 shadow">
                <h2 className="mb-4 text-2xl font-bold">Payment</h2>
                <div className="space-y-3">
                  <div className="rounded border bg-[#f8f5ee] p-4">
                    <div className="font-semibold">Card Payment</div>
                    <div className="text-sm text-gray-600">Coming Soon</div>
                  </div>

                  <div className="rounded border bg-[#f8f5ee] p-4">
                    <div className="font-semibold">Bank Transfer</div>
                    <div className="text-sm text-gray-600">
                      Available after order confirmation
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded bg-white p-6 shadow">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-2xl font-bold">My Orders</h2>
                {message && <p className="font-semibold">{message}</p>}
              </div>

              <div className="space-y-4">
                {orders.map((order, index) => (
                  <div
                    key={order.id || `order-${index}`}
                    className="rounded border p-4"
                  >
                    <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <div className="font-bold">{order.id || "Order"}</div>
                        <div className="text-sm text-gray-600">
                          {order.createdAt
                            ? new Date(order.createdAt).toLocaleString()
                            : "-"}
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="font-semibold">
                          Status: {order.status || "-"}
                        </div>
                        <div className="text-sm text-gray-600">
                          Payment: {order.paymentMethod || "-"}
                        </div>
                        <div className="font-bold">
                          £{Number(order.grandTotal || 0).toFixed(2)}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {(order.items || []).map((item, itemIndex) => (
                        <div
                          key={item.id || `${order.id}-item-${itemIndex}`}
                          className="text-sm text-gray-700"
                        >
                          {item.productName} | {item.size || "-"} |{" "}
                          {item.purchaseType} | Qty: {Number(item.quantity || 0)}
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 flex flex-wrap gap-3">
                      {(order.status === "pending" ||
                        order.status === "bank-transfer-pending" ||
                        order.status === "paid" ||
                        order.status === "processing") && (
                        <button
                          type="button"
                          onClick={() =>
                            updateStatus(String(order.id || ""), "cancelled")
                          }
                          className="rounded border border-red-600 px-4 py-2 font-semibold text-red-600"
                        >
                          Cancel Order
                        </button>
                      )}

                      {(order.status === "paid" ||
                        order.status === "processing" ||
                        order.status === "shipped" ||
                        order.status === "completed") && (
                        <button
                          type="button"
                          onClick={() =>
                            updateStatus(
                              String(order.id || ""),
                              "refund-requested"
                            )
                          }
                          className="rounded border border-amber-600 px-4 py-2 font-semibold text-amber-700"
                        >
                          Request Refund
                        </button>
                      )}
                    </div>
                  </div>
                ))}

                {orders.length === 0 && (
                  <div className="text-gray-500">No orders yet.</div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}