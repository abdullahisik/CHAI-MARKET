import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const ordersFilePath = path.join(process.cwd(), "data", "orders.json");

function readOrders() {
  try {
    if (!fs.existsSync(ordersFilePath)) return [];
    const content = fs.readFileSync(ordersFilePath, "utf-8");
    return JSON.parse(content || "[]");
  } catch {
    return [];
  }
}

export async function GET() {
  return NextResponse.json(readOrders());
}