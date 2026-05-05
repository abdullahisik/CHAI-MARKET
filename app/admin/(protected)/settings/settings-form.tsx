"use client";

import { useState } from "react";

export default function SettingsForm({ store }: { store: any }) {
  const [form, setForm] = useState({
    storeName: store.name || "",
    domain: store.domain || "",
    logoUrl: store.logoUrl || "",
    mainColor: store.mainColor || "#0f3b2e",
    secondaryColor: store.secondaryColor || "#d4af37",
    themePreset: store.themePreset || "CLASSIC",
    companyEmail: store.companyEmail || "",
    supportEmail: store.supportEmail || "",
    orderEmail: store.orderEmail || "",
    contactPhone: store.contactPhone || "",
    whatsappNumber: store.whatsappNumber || "",
  });

  const [message, setMessage] = useState("");

  function update(key: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");

    const res = await fetch("/api/admin/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setMessage(res.ok ? "Settings saved." : "Failed to save settings.");
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Store Settings</h2>
        <p className="text-sm text-neutral-500">Logo, domain, colours, theme and email settings.</p>
      </div>

      <form onSubmit={save} className="rounded-2xl border bg-white p-6 shadow-sm grid gap-4 md:grid-cols-2">
        <input className="rounded-xl border px-4 py-3" placeholder="Store Name" value={form.storeName} onChange={(e) => update("storeName", e.target.value)} />
        <input className="rounded-xl border px-4 py-3" placeholder="Domain" value={form.domain} onChange={(e) => update("domain", e.target.value)} />
        <input className="rounded-xl border px-4 py-3 md:col-span-2" placeholder="Logo URL" value={form.logoUrl} onChange={(e) => update("logoUrl", e.target.value)} />

        <input type="color" className="h-14 rounded-xl border px-4 py-3" value={form.mainColor} onChange={(e) => update("mainColor", e.target.value)} />
        <input type="color" className="h-14 rounded-xl border px-4 py-3" value={form.secondaryColor} onChange={(e) => update("secondaryColor", e.target.value)} />

        <select className="rounded-xl border px-4 py-3" value={form.themePreset} onChange={(e) => update("themePreset", e.target.value)}>
          <option value="CLASSIC">Classic</option>
          <option value="PREMIUM">Premium</option>
          <option value="MODERN">Modern</option>
        </select>

        <input className="rounded-xl border px-4 py-3" placeholder="Company Email" value={form.companyEmail} onChange={(e) => update("companyEmail", e.target.value)} />
        <input className="rounded-xl border px-4 py-3" placeholder="Support Email" value={form.supportEmail} onChange={(e) => update("supportEmail", e.target.value)} />
        <input className="rounded-xl border px-4 py-3" placeholder="Order Email" value={form.orderEmail} onChange={(e) => update("orderEmail", e.target.value)} />
        <input className="rounded-xl border px-4 py-3" placeholder="Phone" value={form.contactPhone} onChange={(e) => update("contactPhone", e.target.value)} />
        <input className="rounded-xl border px-4 py-3" placeholder="WhatsApp Number" value={form.whatsappNumber} onChange={(e) => update("whatsappNumber", e.target.value)} />

        {message && <p className="md:col-span-2 text-sm">{message}</p>}

        <button className="md:col-span-2 rounded-xl bg-neutral-900 px-5 py-3 text-white font-semibold">
          Save Settings
        </button>
      </form>
    </div>
  );
}