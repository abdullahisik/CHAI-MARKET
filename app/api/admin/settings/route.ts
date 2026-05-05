import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { adminCookieName } from "@/lib/admin-session";
import { ThemePreset } from "@prisma/client";

async function getAdmin(req: Request) {
  const cookieHeader = req.headers.get("cookie") || "";
  const cookie = cookieHeader.split(";").map((c) => c.trim()).find((c) => c.startsWith(`${adminCookieName}=`));
  const userId = cookie?.split("=")[1];
  if (!userId) return null;

  return prisma.user.findUnique({ where: { id: userId }, include: { store: true } });
}

export async function POST(req: Request) {
  const admin = await getAdmin(req);
  if (!admin) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

  const body = await req.json();

  const themePreset = String(body.themePreset || "CLASSIC") as ThemePreset;

  await prisma.store.update({
    where: { id: admin.storeId },
    data: {
      name: String(body.storeName || admin.store.name),
      domain: String(body.domain || ""),
      logoUrl: String(body.logoUrl || ""),
      mainColor: String(body.mainColor || "#0f3b2e"),
      secondaryColor: String(body.secondaryColor || "#d4af37"),
      themePreset,
      companyEmail: String(body.companyEmail || ""),
      supportEmail: String(body.supportEmail || ""),
      orderEmail: String(body.orderEmail || ""),
      contactPhone: String(body.contactPhone || ""),
      whatsappNumber: String(body.whatsappNumber || ""),
    },
  });

  await prisma.siteSetting.upsert({
    where: { storeId: admin.storeId },
    update: {
      siteName: String(body.storeName || admin.store.name),
      logoUrl: String(body.logoUrl || ""),
      mainColor: String(body.mainColor || "#0f3b2e"),
      secondaryColor: String(body.secondaryColor || "#d4af37"),
      contactEmail: String(body.companyEmail || ""),
      contactPhone: String(body.contactPhone || ""),
      whatsappNumber: String(body.whatsappNumber || ""),
    },
    create: {
      storeId: admin.storeId,
      siteName: String(body.storeName || admin.store.name),
      logoUrl: String(body.logoUrl || ""),
      mainColor: String(body.mainColor || "#0f3b2e"),
      secondaryColor: String(body.secondaryColor || "#d4af37"),
      contactEmail: String(body.companyEmail || ""),
      contactPhone: String(body.contactPhone || ""),
      whatsappNumber: String(body.whatsappNumber || ""),
    },
  });

  return NextResponse.json({ success: true });
}