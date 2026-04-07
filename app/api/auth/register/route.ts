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

function writeUsers(users: User[]) {
  fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2), "utf-8");
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const fullName = String(body.fullName || "").trim();
    const email = String(body.email || "").trim().toLowerCase();
    const password = String(body.password || "").trim();
    const phone = String(body.phone || "").trim();
    const address = String(body.address || "").trim();

    if (!fullName || !email || !password) {
      return NextResponse.json(
        { success: false, message: "Full name, email and password are required." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, message: "Password must be at least 6 characters." },
        { status: 400 }
      );
    }

    const users = readUsers();

    const existing = users.find((u) => u.email === email);
    if (existing) {
      return NextResponse.json(
        { success: false, message: "This email is already registered." },
        { status: 400 }
      );
    }

    const newUser: User = {
      id: `USR-${Date.now()}`,
      fullName,
      email,
      password,
      phone,
      address,
      createdAt: new Date().toISOString(),
    };

    users.unshift(newUser);
    writeUsers(users);

    return NextResponse.json({
      success: true,
      message: "Account created successfully.",
      user: {
        id: newUser.id,
        fullName: newUser.fullName,
        email: newUser.email,
        phone: newUser.phone,
        address: newUser.address,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Register failed.",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}