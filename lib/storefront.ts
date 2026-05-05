import { prisma } from "@/lib/prisma";

export async function getCurrentStore() {
  const store =
    (await prisma.store.findFirst({
      where: {
        domain: "chaimarket.co.uk",
        isActive: true,
      },
      include: {
        siteSettings: true,
        products: {
          where: {
            isActive: true,
          },
          orderBy: {
            createdAt: "desc",
          },
          take: 12,
          include: {
            category: true,
          },
        },
        categories: {
          orderBy: {
            name: "asc",
          },
        },
      },
    })) ||
    (await prisma.store.findFirst({
      where: {
        isActive: true,
      },
      include: {
        siteSettings: true,
        products: {
          where: {
            isActive: true,
          },
          orderBy: {
            createdAt: "desc",
          },
          take: 12,
          include: {
            category: true,
          },
        },
        categories: {
          orderBy: {
            name: "asc",
          },
        },
      },
    }));

  return store;
}