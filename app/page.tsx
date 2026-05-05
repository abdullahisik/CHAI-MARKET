import Link from "next/link";
import { ShoppingCart, Search, User, Star, Truck, ShieldCheck } from "lucide-react";
import { getCurrentStore } from "@/lib/storefront";

export const dynamic = "force-dynamic";

function themeClasses(theme: string) {
  if (theme === "PREMIUM") {
    return {
      page: "bg-[#0b0b0b] text-white",
      hero: "bg-gradient-to-br from-black via-neutral-900 to-[#1d1403]",
      card: "bg-neutral-900 border-neutral-800 text-white",
      section: "bg-neutral-950",
      muted: "text-neutral-300",
      button: "bg-yellow-500 text-black hover:bg-yellow-400",
    };
  }

  if (theme === "MODERN") {
    return {
      page: "bg-slate-50 text-slate-950",
      hero: "bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-900",
      card: "bg-white border-slate-200 text-slate-950",
      section: "bg-white",
      muted: "text-slate-500",
      button: "bg-emerald-600 text-white hover:bg-emerald-500",
    };
  }

  return {
    page: "bg-[#f4efe2] text-[#10261d]",
    hero: "bg-[#123d2d]",
    card: "bg-white border-[#e7dec9] text-[#10261d]",
    section: "bg-[#f4efe2]",
    muted: "text-neutral-600",
    button: "bg-[#d4af37] text-[#10261d] hover:bg-[#c79d24]",
  };
}

export default async function HomePage() {
  const store = await getCurrentStore();

  if (!store) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Store not found</h1>
          <p className="mt-2 text-neutral-500">Please configure your store in admin panel.</p>
        </div>
      </main>
    );
  }

  const settings = store.siteSettings[0];
  const theme = themeClasses(store.themePreset);
  const mainColor = settings?.mainColor || store.mainColor;
  const secondaryColor = settings?.secondaryColor || store.secondaryColor;
  const logoUrl = settings?.logoUrl || store.logoUrl;

  return (
    <main className={`min-h-screen ${theme.page}`}>
      <header
        className={`${theme.hero} px-6 py-8 text-white`}
        style={{
          borderBottom: `4px solid ${secondaryColor}`,
        }}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div
              className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border-4 bg-black/20"
              style={{ borderColor: secondaryColor }}
            >
              {logoUrl ? (
                <img src={logoUrl} alt={store.name} className="h-full w-full object-cover" />
              ) : (
                <span className="text-xl font-bold" style={{ color: secondaryColor }}>
                  {store.name.slice(0, 2)}
                </span>
              )}
            </div>

            <div>
              <h1
                className="text-4xl font-black tracking-[0.35em] md:text-6xl"
                style={{ color: secondaryColor }}
              >
                {settings?.siteName || store.name}
              </h1>
              <p className="mt-2 text-sm md:text-base">
                {settings?.headerText || "Wholesale & Retail Food Store"}
              </p>
            </div>
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <Link href="/login" className="rounded-xl border border-white/30 px-5 py-3 font-semibold">
              Login
            </Link>
            <Link
              href="/register"
              className="rounded-xl px-5 py-3 font-semibold text-black"
              style={{ backgroundColor: secondaryColor }}
            >
              Register
            </Link>
            <button className="rounded-xl border border-white/30 p-3">
              <ShoppingCart />
            </button>
          </div>
        </div>

        <div className="mx-auto mt-10 max-w-3xl">
          <div className="flex items-center rounded-2xl bg-white px-4 py-3 text-black shadow-xl">
            <Search className="mr-3 text-neutral-400" />
            <input
              className="w-full outline-none"
              placeholder="Search product..."
            />
          </div>
        </div>
      </header>

      <section className={`${theme.section} px-6 py-12`}>
        <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-3">
          <div className={`rounded-3xl border p-6 shadow-sm ${theme.card}`}>
            <Truck className="mb-3" style={{ color: secondaryColor }} />
            <h3 className="text-lg font-bold">Wholesale & Retail</h3>
            <p className={`mt-2 text-sm ${theme.muted}`}>
              Flexible pricing for retail customers and wholesale buyers.
            </p>
          </div>

          <div className={`rounded-3xl border p-6 shadow-sm ${theme.card}`}>
            <ShieldCheck className="mb-3" style={{ color: secondaryColor }} />
            <h3 className="text-lg font-bold">Trusted Store</h3>
            <p className={`mt-2 text-sm ${theme.muted}`}>
              Manage orders, stock, customers and reports from one admin panel.
            </p>
          </div>

          <div className={`rounded-3xl border p-6 shadow-sm ${theme.card}`}>
            <User className="mb-3" style={{ color: secondaryColor }} />
            <h3 className="text-lg font-bold">Customer Discounts</h3>
            <p className={`mt-2 text-sm ${theme.muted}`}>
              Registered customers can receive special prices and discounts.
            </p>
          </div>
        </div>
      </section>

      <section className="px-6 py-12">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em]" style={{ color: secondaryColor }}>
                Shop by Category
              </p>
              <h2 className="mt-2 text-3xl font-black">Categories</h2>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-4">
            {store.categories.length === 0 && (
              <div className={`rounded-3xl border p-8 ${theme.card}`}>
                No categories yet.
              </div>
            )}

            {store.categories.map((category) => (
              <div key={category.id} className={`rounded-3xl border p-6 shadow-sm ${theme.card}`}>
                <h3 className="text-lg font-bold">{category.name}</h3>
                <p className={`mt-2 text-sm ${theme.muted}`}>{category.slug}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-12">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-[0.3em]" style={{ color: secondaryColor }}>
              Featured Products
            </p>
            <h2 className="mt-2 text-3xl font-black">Latest Products</h2>
          </div>

          <div className="grid gap-6 md:grid-cols-4">
            {store.products.length === 0 && (
              <div className={`rounded-3xl border p-8 ${theme.card}`}>
                No products yet. Add products from admin panel.
              </div>
            )}

            {store.products.map((product) => (
              <div key={product.id} className={`overflow-hidden rounded-3xl border shadow-sm ${theme.card}`}>
                <div className="flex h-56 items-center justify-center bg-neutral-100">
                  {product.imageUrl ? (
                    <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-sm text-neutral-400">No image</span>
                  )}
                </div>

                <div className="p-5">
                  <div className="mb-2 flex items-center gap-1">
                    <Star size={14} style={{ color: secondaryColor }} />
                    <span className={`text-xs ${theme.muted}`}>
                      {product.category?.name || "General"}
                    </span>
                  </div>

                  <h3 className="font-bold">{product.name}</h3>

                  <p className={`mt-2 text-sm ${theme.muted}`}>
                    Stock: {product.stockQuantity}
                  </p>

                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xl font-black">
                      {product.salePrice !== null ? `£${product.salePrice.toFixed(2)}` : "Ask price"}
                    </span>

                    <button className={`rounded-xl px-4 py-2 text-sm font-bold ${theme.button}`}>
                      Add
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer
        className="px-6 py-10 text-white"
        style={{ backgroundColor: mainColor }}
      >
        <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-4">
          <div>
            <h3 className="text-xl font-black" style={{ color: secondaryColor }}>
              {store.name}
            </h3>
            <p className="mt-3 text-sm text-white/70">
              {settings?.footerText ||
                "Wholesale & retail food products across Manchester and the UK."}
            </p>
          </div>

          <div>
            <h4 className="font-bold">Information</h4>
            <div className="mt-3 space-y-2 text-sm text-white/70">
              <p>About Us</p>
              <p>Delivery Information</p>
              <p>Returns Policy</p>
              <p>Privacy Policy</p>
            </div>
          </div>

          <div>
            <h4 className="font-bold">Contact</h4>
            <div className="mt-3 space-y-2 text-sm text-white/70">
              <p>{store.city || "United Kingdom"}</p>
              <p>{settings?.contactPhone || store.contactPhone || "Phone not set"}</p>
              <p>{settings?.contactEmail || store.companyEmail || "Email not set"}</p>
              <p>{settings?.whatsappNumber || store.whatsappNumber || "WhatsApp not set"}</p>
            </div>
          </div>

          <div>
            <h4 className="font-bold">Admin</h4>
            <div className="mt-3 space-y-2 text-sm text-white/70">
              <Link href="/admin/login" className="block hover:text-white">
                Admin Login
              </Link>
              <Link href="/register" className="block hover:text-white">
                Customer Register
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}