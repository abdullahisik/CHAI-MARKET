import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma";
import { ThemePreset, UserRole } from "@prisma/client";

async function main() {
  const passwordHash = await bcrypt.hash("Admin12345!", 10);

  const defaultStore = await prisma.store.upsert({
    where: { slug: "chai-market" },
    update: {},
    create: {
      name: "CHAI MARKET",
      slug: "chai-market",
      domain: "chaimarket.co.uk",
      mainColor: "#0f3b2e",
      secondaryColor: "#d4af37",
      currency: "GBP",
      themePreset: ThemePreset.CLASSIC,
      companyEmail: "info@chaimarket.co.uk",
      supportEmail: "support@chaimarket.co.uk",
      orderEmail: "orders@chaimarket.co.uk",
      contactPhone: "+44",
      whatsappNumber: "+44",
      city: "Manchester",
      country: "United Kingdom",
    },
  });

  await prisma.user.upsert({
    where: { email: "admin@chaimarket.co.uk" },
    update: {
      storeId: defaultStore.id,
    },
    create: {
      storeId: defaultStore.id,
      name: "Super Admin",
      email: "admin@chaimarket.co.uk",
      passwordHash,
      role: UserRole.SUPER_ADMIN,
    },
  });

  const existingSettings = await prisma.siteSetting.findFirst({
    where: { storeId: defaultStore.id },
  });

  if (!existingSettings) {
    await prisma.siteSetting.create({
      data: {
        storeId: defaultStore.id,
        siteName: "CHAI MARKET",
        headerText: "Wholesale & Retail Food Store",
        footerText: "Wholesale & retail food products across Manchester and the UK.",
        mainColor: "#0f3b2e",
        secondaryColor: "#d4af37",
        contactEmail: "info@chaimarket.co.uk",
        contactPhone: "+44",
        whatsappNumber: "+44",
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });