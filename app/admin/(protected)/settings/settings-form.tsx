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
    headerText: "Wholesale & Retail Food Store",
    footerText: "Wholesale & retail food products across Manchester and the UK.",
  });

  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  function update(key: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    const res = await fetch("/api/admin/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setSaving(false);

    if (!res.ok) {
      setMessage("Failed to save settings.");
      return;
    }

    setMessage("Settings saved. Refresh the live website to see changes.");
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Store Settings</h2>
        <p className="text-sm text-neutral-500">
          Change live website theme, logo, colours, domain and contact details.
        </p>
      </div>

      <form
        onSubmit={save}
        className="grid gap-6 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium">Store Name</label>
            <input
              className="w-full rounded-xl border px-4 py-3"
              value={form.storeName}
              onChange={(e) => update("storeName", e.target.value)}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Domain</label>
            <input
              className="w-full rounded-xl border px-4 py-3"
              value={form.domain}
              onChange={(e) => update("domain", e.target.value)}
              placeholder="chaimarket.co.uk"
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium">Logo URL</label>
            <input
              className="w-full rounded-xl border px-4 py-3"
              value={form.logoUrl}
              onChange={(e) => update("logoUrl", e.target.value)}
              placeholder="https://..."
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Main Colour</label>
            <input
              type="color"
              className="h-14 w-full rounded-xl border px-2 py-2"
              value={form.mainColor}
              onChange={(e) => update("mainColor", e.target.value)}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Secondary Colour</label>
            <input
              type="color"
              className="h-14 w-full rounded-xl border px-2 py-2"
              value={form.secondaryColor}
              onChange={(e) => update("secondaryColor", e.target.value)}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Theme</label>
            <select
              className="w-full rounded-xl border px-4 py-3"
              value={form.themePreset}
              onChange={(e) => update("themePreset", e.target.value)}
            >
              <option value="CLASSIC">Classic</option>
              <option value="PREMIUM">Premium</option>
              <option value="MODERN">Modern</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Company Email</label>
            <input
              className="w-full rounded-xl border px-4 py-3"
              value={form.companyEmail}
              onChange={(e) => update("companyEmail", e.target.value)}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Support Email</label>
            <input
              className="w-full rounded-xl border px-4 py-3"
              value={form.supportEmail}
              onChange={(e) => update("supportEmail", e.target.value)}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Order Email</label>
            <input
              className="w-full rounded-xl border px-4 py-3"
              value={form.orderEmail}
              onChange={(e) => update("orderEmail", e.target.value)}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Phone</label>
            <input
              className="w-full rounded-xl border px-4 py-3"
              value={form.contactPhone}
              onChange={(e) => update("contactPhone", e.target.value)}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">WhatsApp</label>
            <input
              className="w-full rounded-xl border px-4 py-3"
              value={form.whatsappNumber}
              onChange={(e) => update("whatsappNumber", e.target.value)}
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium">Header Text</label>
            <input
              className="w-full rounded-xl border px-4 py-3"
              value={form.headerText}
              onChange={(e) => update("headerText", e.target.value)}
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium">Footer Text</label>
            <textarea
              className="min-h-[120px] w-full rounded-xl border px-4 py-3"
              value={form.footerText}
              onChange={(e) => update("footerText", e.target.value)}
            />
          </div>
        </div>

        {message && (
          <div className="rounded-xl bg-neutral-100 px-4 py-3 text-sm">
            {message}
          </div>
        )}

        <button
          disabled={saving}
          className="rounded-xl bg-neutral-900 px-5 py-3 font-semibold text-white disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save Settings"}
        </button>
      </form>
    </div>
  );
}