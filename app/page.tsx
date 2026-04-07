"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import SiteHeader from "./components/site-header";
import SiteFooter from "./components/site-footer";

type Variant = {
  size?: string;
  retailPrice?: string;
  retailDiscountPrice?: string;
  boxQty?: number;
  boxPrice?: string;
  boxDiscountPrice?: string;
  image?: string;
  unitPrice?: string;
  discountPrice?: string;
  unitStock?: number;
  boxStock?: number;
  vatClass?: string;
};

type Product = {
  slug?: string;
  name?: string;
  category?: string;
  subCategory?: string;
  description?: string;
  variants?: Variant[];
};

type StorefrontSummary = {
  discountProducts: Product[];
  bestSellers: Product[];
  newProducts: Product[];
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

function safeVariants(product?: Product) {
  return Array.isArray(product?.variants) ? product!.variants! : [];
}

function getMainVariant(product?: Product) {
  const variants = safeVariants(product);
  return (
    variants.find((v) => (v.size || "").toLowerCase() === "1kg") ||
    variants[0] ||
    undefined
  );
}

function getShownPrice(product?: Product) {
  const variant = getMainVariant(product);
  return (
    variant?.retailDiscountPrice ||
    variant?.retailPrice ||
    variant?.discountPrice ||
    variant?.unitPrice ||
    ""
  );
}

function getRadiusClass(cardRadius: string) {
  if (cardRadius === "full") return "rounded-[2rem]";
  if (cardRadius === "md") return "rounded-lg";
  return "rounded-3xl";
}

function getShadowClass(shadowStyle: string) {
  if (shadowStyle === "light") return "shadow";
  if (shadowStyle === "strong") return "shadow-2xl";
  return "shadow-lg";
}

function getBannerStyleClass(bannerStyle: string) {
  if (bannerStyle === "wide") return "min-h-[380px]";
  if (bannerStyle === "soft") return "min-h-[320px]";
  return "min-h-[340px]";
}

function getThemePalette(themePreset: string) {
  if (themePreset === "classic") {
    return {
      heroBg: "bg-[#eee7d4]",
      sectionBg: "bg-[#f8f5ee]",
      accentText: "text-[#8b6b1f]",
      darkBtn: "bg-[#284332] text-white",
      lightPanel: "bg-[#f6f0de]",
    };
  }

  if (themePreset === "modern") {
    return {
      heroBg: "bg-slate-100",
      sectionBg: "bg-white",
      accentText: "text-cyan-700",
      darkBtn: "bg-slate-900 text-white",
      lightPanel: "bg-slate-50",
    };
  }

  if (themePreset === "minimal") {
    return {
      heroBg: "bg-[#f4f4f4]",
      sectionBg: "bg-white",
      accentText: "text-black",
      darkBtn: "bg-black text-white",
      lightPanel: "bg-[#fafafa]",
    };
  }

  return {
    heroBg: "bg-[#e9e4d8]",
    sectionBg: "bg-[#f8f5ee]",
    accentText: "text-green-700",
    darkBtn: "bg-[#102418] text-white",
    lightPanel: "bg-[#f3eee4]",
  };
}

function ProductCard({
  product,
  radiusClass,
  shadowClass,
}: {
  product: Product;
  radiusClass: string;
  shadowClass: string;
}) {
  const variant = getMainVariant(product);
  const href = `/products/${makeSlug(String(product.slug || product.name || ""))}`;

  return (
    <Link
      href={href}
      className={`min-w-[220px] border bg-white p-4 transition hover:shadow-xl ${radiusClass} ${shadowClass}`}
    >
      <div className={`mb-4 h-44 overflow-hidden bg-[#f8f5ee] ${radiusClass}`}>
        {variant?.image ? (
          <img
            src={variant.image}
            alt={product.name || ""}
            className="h-full w-full object-contain"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-gray-400">
            No image
          </div>
        )}
      </div>

      <h4 className="font-bold">{product.name}</h4>
      <p className="text-sm text-gray-600">{product.subCategory}</p>
      <p className="mt-2 font-semibold">
        {getShownPrice(product) ? `From £${getShownPrice(product)}` : "-"}
      </p>
    </Link>
  );
}

function ProductSliderSection({
  title,
  products,
  radiusClass,
  shadowClass,
}: {
  title: string;
  products: Product[];
  radiusClass: string;
  shadowClass: string;
}) {
  if (!products.length) return null;

  return (
    <section className="px-6 py-10">
      <div className="mx-auto max-w-7xl">
        <h3 className="mb-6 text-3xl font-bold">{title}</h3>

        <div className="flex gap-4 overflow-x-auto pb-2">
          {products.map((product, index) => (
            <ProductCard
              key={`${title}-${product.slug || product.name}-${index}`}
              product={product}
              radiusClass={radiusClass}
              shadowClass={shadowClass}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function CategoryBanner({
  title,
  subtitle,
  href,
  products,
  radiusClass,
  shadowClass,
  bannerStyleClass,
  lightPanel,
  darkBtn,
}: {
  title: string;
  subtitle: string;
  href: string;
  products: Product[];
  radiusClass: string;
  shadowClass: string;
  bannerStyleClass: string;
  lightPanel: string;
  darkBtn: string;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (products.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % products.length);
    }, 2500);

    return () => clearInterval(timer);
  }, [products]);

  if (!products.length) return null;

  const product = products[currentIndex];
  const variant = getMainVariant(product);

  return (
    <Link
      href={href}
      className={`group relative block overflow-hidden bg-white transition hover:shadow-2xl ${radiusClass} ${shadowClass}`}
    >
      <div className={`grid md:grid-cols-[1.2fr_1fr] ${bannerStyleClass}`}>
        <div className={`flex flex-col justify-center p-8 ${lightPanel}`}>
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-green-700">
            {subtitle}
          </p>
          <h3 className="text-4xl font-extrabold">{title}</h3>
          <p className="mt-4 max-w-md text-gray-700">
            Explore {product.name} and similar products in this category.
          </p>
          <div className={`mt-6 inline-flex w-fit px-5 py-3 font-semibold ${radiusClass} ${darkBtn}`}>
            View Category
          </div>
        </div>

        <div className="flex items-center justify-center bg-white p-6">
          {variant?.image ? (
            <img
              src={variant.image}
              alt={product.name || title}
              className="h-[260px] w-full object-contain"
            />
          ) : (
            <div className="text-sm text-gray-400">No image</div>
          )}
        </div>
      </div>
    </Link>
  );
}

function HeroSlider({
  products,
  radiusClass,
  shadowClass,
  heroBg,
  accentText,
  darkBtn,
}: {
  products: Product[];
  radiusClass: string;
  shadowClass: string;
  heroBg: string;
  accentText: string;
  darkBtn: string;
}) {
  const validProducts = products.filter((p) => getMainVariant(p)?.image);

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (validProducts.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % validProducts.length);
    }, 3000);

    return () => clearInterval(timer);
  }, [validProducts.length]);

  if (!validProducts.length) return null;

  const current = validProducts[currentIndex];
  const variant = getMainVariant(current);

  return (
    <section className={`${heroBg} px-6 py-12`}>
      <div className={`mx-auto grid max-w-7xl items-center gap-8 bg-white p-8 md:grid-cols-2 ${radiusClass} ${shadowClass}`}>
        <div>
          <p className={`mb-3 text-sm font-semibold uppercase tracking-[0.25em] ${accentText}`}>
            CHAI MARKET
          </p>
          <h2 className="text-5xl font-extrabold leading-tight">
            Wholesale & Retail
            <br />
            Food Products
          </h2>
          <p className="mt-5 text-lg text-gray-700">
            Pulses, rice, flour, oats, seeds, nuts and jelly products with fast
            and reliable service.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a href="#category-banners" className={`px-6 py-3 font-semibold ${radiusClass} ${darkBtn}`}>
              Shop Now
            </a>
            <Link
              href={`/products/${makeSlug(String(current.slug || current.name || ""))}`}
              className={`border border-[#102418] px-6 py-3 font-semibold text-[#102418] ${radiusClass}`}
            >
              Featured Product
            </Link>
          </div>
        </div>

        <div className="flex justify-center">
          {variant?.image ? (
            <img
              src={variant.image}
              alt={current.name || "Featured product"}
              className="h-[380px] w-full object-contain"
            />
          ) : null}
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [summary, setSummary] = useState<StorefrontSummary>({
    discountProducts: [],
    bestSellers: [],
    newProducts: [],
  });
  const [settings, setSettings] = useState<SettingsData>({
    appearance: {
      themePreset: "premium",
      headerStyle: "centered",
      bannerStyle: "split",
      cardRadius: "xl",
      shadowStyle: "medium",
    },
  });

  useEffect(() => {
    const load = async () => {
      try {
        const [productsRes, summaryRes, settingsRes] = await Promise.all([
          fetch("/api/products", { cache: "no-store" }),
          fetch("/api/storefront-summary", { cache: "no-store" }),
          fetch("/api/settings", { cache: "no-store" }),
        ]);

        const productsData = await productsRes.json();
        const summaryData = await summaryRes.json();
        const settingsData = await settingsRes.json();

        setProducts(Array.isArray(productsData) ? productsData : []);
        setSummary(
          summaryData || {
            discountProducts: [],
            bestSellers: [],
            newProducts: [],
          }
        );
        setSettings(
          settingsData || {
            appearance: {
              themePreset: "premium",
              headerStyle: "centered",
              bannerStyle: "split",
              cardRadius: "xl",
              shadowStyle: "medium",
            },
          }
        );
      } catch {
        setProducts([]);
        setSummary({
          discountProducts: [],
          bestSellers: [],
          newProducts: [],
        });
      }
    };

    load();
  }, []);

  const appearance = settings.appearance || {};
  const radiusClass = getRadiusClass(appearance.cardRadius || "xl");
  const shadowClass = getShadowClass(appearance.shadowStyle || "medium");
  const bannerStyleClass = getBannerStyleClass(appearance.bannerStyle || "split");
  const palette = getThemePalette(appearance.themePreset || "premium");

  const pulses = useMemo(
    () => products.filter((p) => p.subCategory === "Pulses"),
    [products]
  );
  const rice = useMemo(
    () => products.filter((p) => p.subCategory === "Rice"),
    [products]
  );
  const flourOats = useMemo(
    () => products.filter((p) => p.subCategory === "Flour-Oats"),
    [products]
  );
  const seeds = useMemo(
    () => products.filter((p) => p.subCategory === "Seeds & Superfoods"),
    [products]
  );
  const bigNuts = useMemo(
    () => products.filter((p) => p.subCategory === "Big Nut"),
    [products]
  );
  const smallNuts = useMemo(
    () => products.filter((p) => p.subCategory === "Small Nut"),
    [products]
  );
  const jellies = useMemo(
    () => products.filter((p) => p.subCategory === "Jellies"),
    [products]
  );

  return (
    <main className={`min-h-screen text-[#1f2e1f] ${palette.sectionBg}`}>
      <SiteHeader />

      <HeroSlider
        products={products}
        radiusClass={radiusClass}
        shadowClass={shadowClass}
        heroBg={palette.heroBg}
        accentText={palette.accentText}
        darkBtn={palette.darkBtn}
      />

      <section id="category-banners" className="px-6 py-12">
        <div className="mx-auto max-w-7xl">
          <h3 className="mb-8 text-center text-3xl font-bold">
            Shop by Category
          </h3>

          <div className="grid gap-6 md:grid-cols-2">
            <CategoryBanner
              title="Pulses"
              subtitle="Pulses Collection"
              href="/category/pulses"
              products={pulses}
              radiusClass={radiusClass}
              shadowClass={shadowClass}
              bannerStyleClass={bannerStyleClass}
              lightPanel={palette.lightPanel}
              darkBtn={palette.darkBtn}
            />
            <CategoryBanner
              title="Flour & Oats"
              subtitle="Flour & Oats Collection"
              href="/category/flour-oats"
              products={flourOats}
              radiusClass={radiusClass}
              shadowClass={shadowClass}
              bannerStyleClass={bannerStyleClass}
              lightPanel={palette.lightPanel}
              darkBtn={palette.darkBtn}
            />
            <CategoryBanner
              title="Rice"
              subtitle="Rice Collection"
              href="/category/rice"
              products={rice}
              radiusClass={radiusClass}
              shadowClass={shadowClass}
              bannerStyleClass={bannerStyleClass}
              lightPanel={palette.lightPanel}
              darkBtn={palette.darkBtn}
            />
            <CategoryBanner
              title="Seeds & Superfoods"
              subtitle="Seeds & Superfoods Collection"
              href="/category/seeds-superfoods"
              products={seeds}
              radiusClass={radiusClass}
              shadowClass={shadowClass}
              bannerStyleClass={bannerStyleClass}
              lightPanel={palette.lightPanel}
              darkBtn={palette.darkBtn}
            />
            <CategoryBanner
              title="Big Nuts"
              subtitle="Big Nuts Collection"
              href="/category/big-nuts"
              products={bigNuts}
              radiusClass={radiusClass}
              shadowClass={shadowClass}
              bannerStyleClass={bannerStyleClass}
              lightPanel={palette.lightPanel}
              darkBtn={palette.darkBtn}
            />
            <CategoryBanner
              title="Small Nuts"
              subtitle="Small Nuts Collection"
              href="/category/small-nuts"
              products={smallNuts}
              radiusClass={radiusClass}
              shadowClass={shadowClass}
              bannerStyleClass={bannerStyleClass}
              lightPanel={palette.lightPanel}
              darkBtn={palette.darkBtn}
            />
            <CategoryBanner
              title="Jellybon"
              subtitle="Jellybon Collection"
              href="/category/jellybon"
              products={jellies}
              radiusClass={radiusClass}
              shadowClass={shadowClass}
              bannerStyleClass={bannerStyleClass}
              lightPanel={palette.lightPanel}
              darkBtn={palette.darkBtn}
            />
          </div>
        </div>
      </section>

      <ProductSliderSection
        title="Discount Products"
        products={summary.discountProducts}
        radiusClass={radiusClass}
        shadowClass={shadowClass}
      />
      <ProductSliderSection
        title="Best Sellers"
        products={summary.bestSellers}
        radiusClass={radiusClass}
        shadowClass={shadowClass}
      />
      <ProductSliderSection
        title="New Products"
        products={summary.newProducts}
        radiusClass={radiusClass}
        shadowClass={shadowClass}
      />

      <SiteFooter />
    </main>
  );
}