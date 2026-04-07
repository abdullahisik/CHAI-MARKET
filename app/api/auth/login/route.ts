import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

type User = {
  id: string;
  fullName: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
  createdAt: string;
};

const usersFilePath = path.join(process.cwd(), "data", "users.json");

function ensureUsersFile() {
  if (!fs.existsSync(usersFilePath)) {
    fs.writeFileSync(usersFilePath, "[]", "utf-8");
  }
}

function readUsers(): User[] {
  ensureUsersFile();
  const content = fs.readFileSync(usersFilePath, "utf-8");
  return JSON.parse(content || "[]");
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const email = String(body.email || "").trim().toLowerCase();
    const password = String(body.password || "").trim();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email and password are required." },
        { status: 400 }
      );
    }

    const users = readUsers();
    const user = users.find((u) => u.email === email && u.password === password);

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Invalid email or password." },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Login successful.",
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        address: user.address,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Login failed.",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}