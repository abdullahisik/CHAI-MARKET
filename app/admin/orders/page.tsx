"use client";

import { useEffect, useState } from "react";

type CartItem = {
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
  items?: CartItem[];
  subtotal?: number;
  vatTotal?: number;
  shipping?: number;
  grandTotal?: number;
};

const statusOptions = [
  "pending",
  "bank-transfer-pending",
  "paid",
  "processing",
  "shipped",
  "completed",
  "cancelled",
  "refund-requested",
  "refunded",
];

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [message, setMessage] = useState("");

  const loadOrders = async () => {
    try {
      const res = await fetch("/api/orders");
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch {
      setOrders([]);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

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
        setMessage("Order status updated successfully.");
        loadOrders();
      } else {
        setMessage(data.message || "Update failed.");
      }
    } catch {
      setMessage("Update failed.");
    }
  };

  return (
    <main className="min-h-screen bg-[#f8f5ee] px-6 py-10 text-[#1f2e1f]">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold">Orders</h1>
            <p className="mt-2 text-sm text-gray-600">Saved customer orders</p>
          </div>

          <a
            href="/admin/dashboard"
            className="rounded border border-[#102418] px-5 py-3 font-semibold text-[#102418]"
          >
            Back to Dashboard
          </a>
        </div>

        {message && <p className="mb-5 font-semibold">{message}</p>}

        <div className="space-y-6">
          {orders.map((order, index) => {
            const customer = order.customer || {};
            const items = Array.isArray(order.items) ? order.items : [];

            return (
              <div
                key={order.id || `order-${index}`}
                className="rounded-xl bg-white p-6 shadow"
              >
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="text-2xl font-bold">
                      {order.id || "Order"}
                    </h2>
                    <p className="text-sm text-gray-600">
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleString()
                        : "-"}
                    </p>
                    <p className="text-sm text-gray-600">
                      Payment:{" "}
                      <span className="font-semibold">
                        {order.paymentMethod || "-"}
                      </span>
                    </p>
                  </div>

                  <div className="text-right">
                    <div className="font-semibold">
                      Subtotal: £{Number(order.subtotal || 0).toFixed(2)}
                    </div>
                    <div className="font-semibold">
                      VAT: £{Number(order.vatTotal || 0).toFixed(2)}
                    </div>
                    <div className="font-semibold">
                      Shipping: £{Number(order.shipping || 0).toFixed(2)}
                    </div>
                    <div className="text-lg font-bold">
                      Total: £{Number(order.grandTotal || 0).toFixed(2)}
                    </div>
                  </div>
                </div>

                <div className="mb-5 rounded border bg-[#f8f5ee] p-4">
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                    <h3 className="text-lg font-bold">Customer</h3>

                    <div className="flex items-center gap-2">
                      <select
                        className="rounded border px-3 py-2"
                        value={order.status || "pending"}
                        onChange={(e) =>
                          updateStatus(String(order.id || ""), e.target.value)
                        }
                      >
                        {statusOptions.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <p>
                    <span className="font-semibold">Name:</span>{" "}
                    {customer.fullName || "-"}
                  </p>
                  <p>
                    <span className="font-semibold">Email:</span>{" "}
                    {customer.email || "-"}
                  </p>
                  <p>
                    <span className="font-semibold">Phone:</span>{" "}
                    {customer.phone || "-"}
                  </p>
                  <p>
                    <span className="font-semibold">Address:</span>{" "}
                    {customer.address || "-"}
                  </p>
                  <p>
                    <span className="font-semibold">Notes:</span>{" "}
                    {customer.notes || "-"}
                  </p>
                  <p className="mt-2">
                    <span className="font-semibold">Current Status:</span>{" "}
                    {order.status || "pending"}
                  </p>
                </div>

                <div className="space-y-3">
                  {items.map((item, itemIndex) => (
                    <div
                      key={item.id || `${order.id}-item-${itemIndex}`}
                      className="rounded border p-4"
                    >
                      <div className="font-semibold">
                        {item.productName || "-"}
                      </div>
                      <div className="text-sm text-gray-600">
                        Size: {item.size || "-"} | Type:{" "}
                        {item.purchaseType || "-"} | Qty:{" "}
                        {Number(item.quantity || 0)}
                      </div>
                      <div className="text-sm text-gray-600">
                        Line total: £
                        {(
                          Number(item.unitPrice || 0) *
                          Number(item.quantity || 0)
                        ).toFixed(2)}
                      </div>
                    </div>
                  ))}

                  {items.length === 0 && (
                    <div className="rounded border p-4 text-sm text-gray-500">
                      No items in this order.
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {orders.length === 0 && (
            <div className="rounded bg-white p-8 text-center text-gray-500 shadow">
              No orders yet.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}