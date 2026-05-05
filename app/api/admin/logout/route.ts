import { NextResponse } from "next/server";
import { adminCookieName } from "@/lib/admin-session";

export async function POST() {
  const response = NextResponse.json({ success: true });

  response.cookies.set(adminCookieName, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    path: "/",
    maxAge: 0,
  });

  return response;
}