import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/admin-session";

export default async function AdminDashboardPage() {
  const user = await getAdminSession();

  if (!user) return null;

  const [productCount, userCount, categoryCount, storeCount, settings] =
    await Promise.all([
      prisma.product.count({
        where: { storeId: user.storeId },
      }),
      prisma.user.count({
        where: { storeId: user.storeId },
      }),
      prisma.category.count({
        where: { storeId: user.storeId },
      }),
      prisma.store.count(),
      prisma.siteSetting.findFirst({
        where: { storeId: user.storeId },
      }),
    ]);

  const cards = [
    { title: "Products", value: productCount },
    { title: "Users", value: userCount },
    { title: "Categories", value: categoryCount },
    { title: "Stores", value: storeCount },
    { title: "Currency", value: user.store.currency },
    { title: "Theme", value: user.store.themePreset },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Dashboard</h2>
        <p className="text-sm text-neutral-500">
          White-label store overview for {user.store.name}.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => (
          <div
            key={card.title}
            className="rounded-2xl bg-white p-6 shadow-sm border border-neutral-200"
          >
            <p className="text-sm text-neutral-500">{card.title}</p>
            <p className="mt-2 text-3xl font-bold">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold">Current Store</h3>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-sm text-neutral-500">Store Name</p>
            <p className="font-medium">{user.store.name}</p>
          </div>
          <div>
            <p className="text-sm text-neutral-500">Slug</p>
            <p className="font-medium">{user.store.slug}</p>
          </div>
          <div>
            <p className="text-sm text-neutral-500">Domain</p>
            <p className="font-medium">{user.store.domain ?? "—"}</p>
          </div>
          <div>
            <p className="text-sm text-neutral-500">Company Email</p>
            <p className="font-medium">{user.store.companyEmail ?? "—"}</p>
          </div>
          <div>
            <p className="text-sm text-neutral-500">Primary Colour</p>
            <p className="font-medium">{settings?.mainColor ?? user.store.mainColor}</p>
          </div>
          <div>
            <p className="text-sm text-neutral-500">Secondary Colour</p>
            <p className="font-medium">
              {settings?.secondaryColor ?? user.store.secondaryColor}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}