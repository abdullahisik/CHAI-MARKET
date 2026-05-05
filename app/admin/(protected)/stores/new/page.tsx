"use client";

import Link from "next/link";
import { useState } from "react";

export default function NewStorePage() {
  const [form, setForm] = useState({
    name: "",
    domain: "",
    adminEmail: "",
    adminPassword: "Admin12345!",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  function update(key: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const res = await fetch("/api/admin/stores", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setMessage(data.error || "Failed to create store.");
      return;
    }

    setMessage("Store created successfully.");
    setTimeout(() => (window.location.href = "/admin/stores"), 700);
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Add Store</h2>
        <p className="text-sm text-neutral-500">Create a new client store.</p>
      </div>

      <form onSubmit={submit} className="rounded-2xl border bg-white p-6 shadow-sm space-y-4">
        <input className="w-full rounded-xl border px-4 py-3" placeholder="Store Name" value={form.name} onChange={(e) => update("name", e.target.value)} required />
        <input className="w-full rounded-xl border px-4 py-3" placeholder="Domain e.g. clientshop.co.uk" value={form.domain} onChange={(e) => update("domain", e.target.value)} />
        <input className="w-full rounded-xl border px-4 py-3" placeholder="Admin Email" value={form.adminEmail} onChange={(e) => update("adminEmail", e.target.value)} required />
        <input className="w-full rounded-xl border px-4 py-3" placeholder="Admin Password" value={form.adminPassword} onChange={(e) => update("adminPassword", e.target.value)} required />

        {message && <p className="text-sm text-neutral-700">{message}</p>}

        <div className="flex gap-3">
          <button disabled={loading} className="rounded-xl bg-neutral-900 px-5 py-3 text-white font-semibold">
            {loading ? "Saving..." : "Save Store"}
          </button>

          <Link href="/admin/stores" className="rounded-xl border px-5 py-3">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}