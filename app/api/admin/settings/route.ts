import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { adminCookieName } from "@/lib/admin-session";
import { ThemePreset } from "@prisma/client";

async function getAdmin(req: Request) {
  const cookieHeader = req.headers.get("cookie") || "";
  const cookie = cookieHeader
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${adminCookieName}=`));

  const userId = cookie?.split("=")[1];

  if (!userId) return null;

  return prisma.user.findUnique({
    where: { id: userId },
    include: { store: true },
  });
}

function safeTheme(value: string): ThemePreset {
  if (value === "PREMIUM") return ThemePreset.PREMIUM;
  if (value === "MODERN") return ThemePreset.MODERN;
  return ThemePreset.CLASSIC;
}

export async function POST(req: Request) {
  try {
    const admin = await getAdmin(req);

    if (!admin) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const body = await req.json();

    const storeName = String(body.storeName || admin.store.name).trim();
    const domain = String(body.domain || "").trim();
    const logoUrl = String(body.logoUrl || "").trim();
    const mainColor = String(body.mainColor || "#0f3b2e").trim();
    const secondaryColor = String(body.secondaryColor || "#d4af37").trim();
    const themePreset = safeTheme(String(body.themePreset || "CLASSIC"));
    const companyEmail = String(body.companyEmail || "").trim();
    const supportEmail = String(body.supportEmail || "").trim();
    const orderEmail = String(body.orderEmail || "").trim();
    const contactPhone = String(body.contactPhone || "").trim();
    const whatsappNumber = String(body.whatsappNumber || "").trim();
    const headerText = String(body.headerText || "Wholesale & Retail Food Store").trim();
    const footerText = String(
      body.footerText ||
        "Wholesale & retail food products across Manchester and the UK."
    ).trim();

    await prisma.store.update({
      where: { id: admin.storeId },
      data: {
        name: storeName,
        domain,
        logoUrl,
        mainColor,
        secondaryColor,
        themePreset,
        companyEmail,
        supportEmail,
        orderEmail,
        contactPhone,
        whatsappNumber,
      },
    });

    await prisma.siteSetting.upsert({
      where: { storeId: admin.storeId },
      update: {
        siteName: storeName,
        logoUrl,
        mainColor,
        secondaryColor,
        headerText,
        footerText,
        contactEmail: companyEmail,
        contactPhone,
        whatsappNumber,
      },
      create: {
        storeId: admin.storeId,
        siteName: storeName,
        logoUrl,
        mainColor,
        secondaryColor,
        headerText,
        footerText,
        contactEmail: companyEmail,
        contactPhone,
        whatsappNumber,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("SETTINGS UPDATE ERROR:", error);

    return NextResponse.json(
      { error: "Settings could not be saved." },
      { status: 500 }
    );
  }
}