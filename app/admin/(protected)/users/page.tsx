import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/admin-session";

export default async function AdminUsersPage() {
  const currentUser = await getAdminSession();

  if (!currentUser) return null;

  const users = await prisma.user.findMany({
    where: { storeId: currentUser.storeId },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Users</h2>
        <p className="text-sm text-neutral-500">
          Manage admin users and roles for {currentUser.store.name}.
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-neutral-50 text-left text-neutral-500">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-t border-neutral-200">
                <td className="px-4 py-3 font-medium">{user.name}</td>
                <td className="px-4 py-3">{user.email}</td>
                <td className="px-4 py-3">{user.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}