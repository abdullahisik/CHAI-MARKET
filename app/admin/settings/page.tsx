"use client";

import { useEffect, useState } from "react";

export default function AdminSettingsPage() {
  const [accountName, setAccountName] = useState("");
  const [bankName, setBankName] = useState("");
  const [sortCode, setSortCode] = useState("");
  const [accountNumber, setAccountNumber] = useState("");

  const [instagram, setInstagram] = useState("");
  const [facebook, setFacebook] = useState("");
  const [tiktok, setTiktok] = useState("");
  const [whatsapp, setWhatsapp] = useState("");

  const [themePreset, setThemePreset] = useState("premium");
  const [headerStyle, setHeaderStyle] = useState("centered");
  const [bannerStyle, setBannerStyle] = useState("split");
  const [cardRadius, setCardRadius] = useState("xl");
  const [shadowStyle, setShadowStyle] = useState("medium");

  const [message, setMessage] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/settings", { cache: "no-store" });
        const data = await res.json();

        setAccountName(data?.bank?.accountName || "");
        setBankName(data?.bank?.bankName || "");
        setSortCode(data?.bank?.sortCode || "");
        setAccountNumber(data?.bank?.accountNumber || "");

        setInstagram(data?.social?.instagram || "");
        setFacebook(data?.social?.facebook || "");
        setTiktok(data?.social?.tiktok || "");
        setWhatsapp(data?.social?.whatsapp || "");

        setThemePreset(data?.appearance?.themePreset || "premium");
        setHeaderStyle(data?.appearance?.headerStyle || "centered");
        setBannerStyle(data?.appearance?.bannerStyle || "split");
        setCardRadius(data?.appearance?.cardRadius || "xl");
        setShadowStyle(data?.appearance?.shadowStyle || "medium");
      } catch {
        setMessage("Failed to load settings.");
      }
    };

    load();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("Saving...");

    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bank: {
            accountName,
            bankName,
            sortCode,
            accountNumber,
          },
          social: {
            instagram,
            facebook,
            tiktok,
            whatsapp,
          },
          appearance: {
            themePreset,
            headerStyle,
            bannerStyle,
            cardRadius,
            shadowStyle,
          },
        }),
      });

      const data = await res.json();

      if (data.success) {
        setMessage("Settings saved successfully. Refresh homepage to see changes.");
      } else {
        setMessage(data.message || "Save failed.");
      }
    } catch {
      setMessage("Save failed.");
    }
  };

  return (
    <main className="min-h-screen bg-[#f8f5ee] px-6 py-10 text-[#1f2e1f]">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold">Site Settings</h1>
            <p className="mt-2 text-sm text-gray-600">
              Bank details, social links and appearance settings
            </p>
          </div>

          <a
            href="/admin/dashboard"
            className="rounded border border-[#102418] px-5 py-3 font-semibold text-[#102418]"
          >
            Back to Dashboard
          </a>
        </div>

        <form onSubmit={handleSave} className="grid gap-8">
          <div className="rounded-xl bg-white p-6 shadow">
            <h2 className="mb-5 text-2xl font-bold">Bank Details</h2>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold">Account Name</label>
                <input className="w-full rounded border px-4 py-3" value={accountName} onChange={(e) => setAccountName(e.target.value)} />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">Bank Name</label>
                <input className="w-full rounded border px-4 py-3" value={bankName} onChange={(e) => setBankName(e.target.value)} />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">Sort Code</label>
                <input className="w-full rounded border px-4 py-3" value={sortCode} onChange={(e) => setSortCode(e.target.value)} />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">Account Number</label>
                <input className="w-full rounded border px-4 py-3" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} />
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-white p-6 shadow">
            <h2 className="mb-5 text-2xl font-bold">Social Links</h2>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold">Instagram</label>
                <input className="w-full rounded border px-4 py-3" value={instagram} onChange={(e) => setInstagram(e.target.value)} />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">Facebook</label>
                <input className="w-full rounded border px-4 py-3" value={facebook} onChange={(e) => setFacebook(e.target.value)} />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">TikTok</label>
                <input className="w-full rounded border px-4 py-3" value={tiktok} onChange={(e) => setTiktok(e.target.value)} />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">WhatsApp Link</label>
                <input className="w-full rounded border px-4 py-3" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} />
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-white p-6 shadow">
            <h2 className="mb-5 text-2xl font-bold">Appearance Settings</h2>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold">Theme Preset</label>
                <select className="w-full rounded border px-4 py-3" value={themePreset} onChange={(e) => setThemePreset(e.target.value)}>
                  <option value="classic">Classic</option>
                  <option value="premium">Premium</option>
                  <option value="modern">Modern</option>
                  <option value="minimal">Minimal</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">Header Style</label>
                <select className="w-full rounded border px-4 py-3" value={headerStyle} onChange={(e) => setHeaderStyle(e.target.value)}>
                  <option value="centered">Centered</option>
                  <option value="compact">Compact</option>
                  <option value="luxury">Luxury</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">Banner Style</label>
                <select className="w-full rounded border px-4 py-3" value={bannerStyle} onChange={(e) => setBannerStyle(e.target.value)}>
                  <option value="split">Split</option>
                  <option value="wide">Wide</option>
                  <option value="soft">Soft</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">Card Radius</label>
                <select className="w-full rounded border px-4 py-3" value={cardRadius} onChange={(e) => setCardRadius(e.target.value)}>
                  <option value="md">Medium</option>
                  <option value="xl">Extra Large</option>
                  <option value="full">Rounded Full</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">Shadow Style</label>
                <select className="w-full rounded border px-4 py-3" value={shadowStyle} onChange={(e) => setShadowStyle(e.target.value)}>
                  <option value="light">Light</option>
                  <option value="medium">Medium</option>
                  <option value="strong">Strong</option>
                </select>
              </div>
            </div>
          </div>

          {message && <p className="font-semibold">{message}</p>}

          <div>
            <button type="submit" className="rounded bg-[#102418] px-6 py-3 font-semibold text-white">
              Save Settings
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}