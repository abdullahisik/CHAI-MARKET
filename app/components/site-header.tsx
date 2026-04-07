"use client";

import Link from "next/link";
import { useCart } from "../providers/cart-provider";
import { useAuth } from "../providers/auth-provider";
import { useEffect, useMemo, useState } from "react";

type Product = {
  slug?: string;
  name?: string;
};

type Appearance = {
  themePreset?: string;
  headerStyle?: string;
  bannerStyle?: string;
  cardRadius?: string;
  shadowStyle?: string;
};

type SettingsData = {
  appearance?: Appearance;
};

function makeSlug(value: string) {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/\//g, "-")
    .replace(/[()'.]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getThemeClasses(themePreset: string) {
  if (themePreset === "modern") {
    return {
      headerBg: "bg-slate-950",
      title: "text-white",
      subtitle: "text-slate-300",
      accent: "text-cyan-400",
      buttonBorder: "border-white/20",
      logoRing: "ring-cyan-400/30",
      logoBg: "bg-slate-900/60",
    };
  }

  if (themePreset === "minimal") {
    return {
      headerBg: "bg-[#1d1d1d]",
      title: "text-white",
      subtitle: "text-gray-300",
      accent: "text-white",
      buttonBorder: "border-white/20",
      logoRing: "ring-white/20",
      logoBg: "bg-white/5",
    };
  }

  if (themePreset === "classic") {
    return {
      headerBg: "bg-[#1f3b2d]",
      title: "text-[#f5e6a8]",
      subtitle: "text-[#e9dfc7]",
      accent: "text-[#f5e6a8]",
      buttonBorder: "border-[#f5e6a8]/30",
      logoRing: "ring-[#f5e6a8]/25",
      logoBg: "bg-[#2b4d3a]",
    };
  }

  return {
    headerBg: "bg-gradient-to-r from-[#0d2a1f] via-[#102418] to-[#0d2a1f]",
    title: "text-[#d4af37]",
    subtitle: "text-[#e6dcc1]",
    accent: "text-emerald-300",
    buttonBorder: "border-white/20",
    logoRing: "ring-[#d4af37]/25",
    logoBg: "bg-white/5",
  };
}

function getHeaderSpacing(headerStyle: string) {
  if (headerStyle === "compact") {
    return {
      wrapper: "py-4",
      title: "text-3xl md:text-4xl tracking-[0.16em]",
      logoOuter: "h-20 w-20",
      logoInner: "h-14 w-14",
      searchWrap: "mt-4",
    };
  }

  if (headerStyle === "luxury") {
    return {
      wrapper: "py-8",
      title: "text-5xl md:text-6xl tracking-[0.24em]",
      logoOuter: "h-28 w-28",
      logoInner: "h-20 w-20",
      searchWrap: "mt-6",
    };
  }

  return {
    wrapper: "py-6",
    title: "text-4xl md:text-5xl tracking-[0.2em]",
    logoOuter: "h-24 w-24",
    logoInner: "h-16 w-16",
    searchWrap: "mt-5",
  };
}

export default function SiteHeader() {
  const { itemCount } = useCart();
  const { user, isLoggedIn, logout } = useAuth();

  const [searchTerm, setSearchTerm] = useState("");
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [results, setResults] = useState<Product[]>([]);
  const [settings, setSettings] = useState<SettingsData>({
    appearance: {
      themePreset: "premium",
      headerStyle: "centered",
    },
  });

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const res = await fetch("/api/products", { cache: "no-store" });
        const data = await res.json();
        setAllProducts(Array.isArray(data) ? data : []);
      } catch {
        setAllProducts([]);
      }
    };

    const loadSettings = async () => {
      try {
        const res = await fetch("/api/settings", { cache: "no-store" });
        const data = await res.json();
        setSettings(
          data || {
            appearance: {
              themePreset: "premium",
              headerStyle: "centered",
            },
          }
        );
      } catch {
        setSettings({
          appearance: {
            themePreset: "premium",
            headerStyle: "centered",
          },
        });
      }
    };

    loadProducts();
    loadSettings();
  }, []);

  useEffect(() => {
    const q = searchTerm.trim().toLowerCase();

    if (!q) {
      setResults([]);
      return;
    }

    const filtered = allProducts
      .filter((p) => String(p.name || "").toLowerCase().includes(q))
      .slice(0, 8);

    setResults(filtered);
  }, [searchTerm, allProducts]);

  const appearance = settings.appearance || {};
  const theme = getThemeClasses(appearance.themePreset || "premium");
  const spacing = getHeaderSpacing(appearance.headerStyle || "centered");

  const logoOuterClass = useMemo(
    () =>
      `flex items-center justify-center rounded-full ring-4 shadow-2xl ${spacing.logoOuter} ${theme.logoBg} ${theme.logoRing}`,
    [spacing.logoOuter, theme.logoBg, theme.logoRing]
  );

  const logoInnerClass = useMemo(
    () => `rounded-full object-cover ${spacing.logoInner}`,
    [spacing.logoInner]
  );

  return (
    <header className={`${theme.headerBg} px-6 text-white`}>
      <div className={`mx-auto max-w-7xl ${spacing.wrapper}`}>
        <div className="grid items-center gap-5 md:grid-cols-[180px_1fr_280px]">
          <div className="flex items-center">
            <Link href="/" className="inline-flex items-center">
              <div className={logoOuterClass}>
                <img
                  src="/logo.png?v=2"
                  alt="CHAI MARKET logo"
                  className={logoInnerClass}
                />
              </div>
            </Link>
          </div>

          <div className="text-center">
            <Link href="/" className="inline-block">
              <h1 className={`font-extrabold ${spacing.title} ${theme.title}`}>
                CHAI MARKET
              </h1>
              <p className={`mt-2 text-base ${theme.subtitle}`}>
                Wholesale & Retail Food Store
              </p>
            </Link>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-3">
            {isLoggedIn ? (
              <>
                <Link
                  href="/account"
                  className={`rounded-2xl border ${theme.buttonBorder} px-4 py-3 font-semibold text-white backdrop-blur`}
                >
                  {user?.fullName || "My Account"}
                </Link>

                <button
                  type="button"
                  onClick={logout}
                  className="rounded-2xl border border-red-400/70 px-4 py-3 font-semibold text-red-100"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className={`rounded-2xl border ${theme.buttonBorder} px-4 py-3 font-semibold text-white`}
                >
                  Login
                </Link>

                <Link
                  href="/register"
                  className="rounded-2xl bg-emerald-600 px-4 py-3 font-semibold text-white"
                >
                  Register
                </Link>
              </>
            )}

            <Link
              href="/cart"
              className={`relative flex h-14 w-14 items-center justify-center rounded-2xl border ${theme.buttonBorder} text-white shadow-lg`}
              aria-label="Cart"
              title="Cart"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1 5h12M10 21a1 1 0 100-2 1 1 0 000 2zm8 0a1 1 0 100-2 1 1 0 000 2z"
                />
              </svg>

              {itemCount > 0 && (
                <span className="absolute -right-2 -top-2 rounded-full bg-emerald-500 px-2 py-0.5 text-xs font-bold text-white">
                  {itemCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        <div className={`relative flex justify-end ${spacing.searchWrap}`}>
          <div className="w-full max-w-xl">
            <input
              className="w-full rounded-2xl border border-white/15 bg-white px-5 py-4 text-[#1f2e1f] outline-none shadow-xl"
              placeholder="Search product..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            {results.length > 0 && (
              <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-2xl border bg-white text-[#1f2e1f] shadow-2xl">
                {results.map((product, index) => (
                  <Link
                    key={`${product.slug || product.name}-${index}`}
                    href={`/products/${makeSlug(
                      String(product.slug || product.name || "")
                    )}`}
                    className="block border-b px-4 py-3 hover:bg-[#f8f5ee]"
                    onClick={() => {
                      setSearchTerm("");
                      setResults([]);
                    }}
                  >
                    {product.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}