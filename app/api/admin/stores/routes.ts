import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { adminCookieName } from "@/lib/admin-session";
import { ThemePreset, UserRole } from "@prisma/client";

function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-");
}

async function getAdmin(req: Request) {
  const cookieHeader = req.headers.get("cookie") || "";
  const cookie = cookieHeader.split(";").map((c) => c.trim()).find((c) => c.startsWith(`${adminCookieName}=`));
  const userId = cookie?.split("=")[1];
  if (!userId) return null;

  return prisma.user.findUnique({ where: { id: userId }, include: { store: true } });
}

export async function POST(req: Request) {
  const admin = await getAdmin(req);

  if (!admin || admin.role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Only Super Admin can create stores." }, { status: 403 });
  }

  const body = await req.json();

  const name = String(body.name || "").trim();
  const domain = String(body.domain || "").trim();
  const adminEmail = String(body.adminEmail || "").trim().toLowerCase();
  const adminPassword = String(body.adminPassword || "Admin12345!");

  if (!name || !adminEmail) {
    return NextResponse.json({ error: "Store name and admin email are required." }, { status: 400 });
  }

  const slug = slugify(name) || `store-${Date.now()}`;
  const passwordHash = await bcrypt.hash(adminPassword, 10);

  const store = await prisma.store.create({
    data: {
      name,
      slug,
      domain,
      currency: "GBP",
      themePreset: ThemePreset.CLASSIC,
      companyEmail: adminEmail,
      supportEmail: adminEmail,
      orderEmail: adminEmail,
      mainColor: "#0f3b2e",
      secondaryColor: "#d4af37",
      users: {
        create: {
          name: `${name} Admin`,
          email: adminEmail,
          passwordHash,
          role: UserRole.ADMIN,
        },
      },
      siteSettings: {
        create: {
          siteName: name,
          contactEmail: adminEmail,
          mainColor: "#0f3b2e",
          secondaryColor: "#d4af37",
        },
      },
    },
  });

  return NextResponse.json({ success: true, storeId: store.id });
}