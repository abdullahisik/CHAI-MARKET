import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

const ADMIN_COOKIE_NAME = "chai_admin_session";

export async function getAdminSession() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(ADMIN_COOKIE_NAME)?.value;

  if (!sessionCookie) return null;

  const user = await prisma.user.findUnique({
    where: { id: sessionCookie },
    include: {
      store: true,
    },
  });

  if (!user) return null;

  return user;
}

export const adminCookieName = ADMIN_COOKIE_NAME;