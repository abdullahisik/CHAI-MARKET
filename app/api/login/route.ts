import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { adminUsers } from "../../../data/admin-users";

const SECRET = "chai-market-secret-key";

export async function POST(req: Request) {
  const body = await req.json();
  const { email, password } = body;

  const user = adminUsers.find(
    (u) => u.email.toLowerCase() === String(email).toLowerCase() && u.password === password
  );

  if (!user) {
    return NextResponse.json({ success: false, message: "Invalid login" }, { status: 401 });
  }

  const token = jwt.sign(
    { email: user.email, name: user.name },
    SECRET,
    { expiresIn: "7d" }
  );

  const response = NextResponse.json({
    success: true,
    user: { email: user.email, name: user.name },
  });

  response.cookies.set("admin_token", token, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    path: "/",
  });

  return response;
}