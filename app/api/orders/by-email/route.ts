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

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const email = String(searchParams.get("email") || "").trim().toLowerCase();

  if (!email) {
    return NextResponse.json([]);
  }

  const orders = readOrders().filter(
    (order: any) =>
      String(order?.customer?.email || "").trim().toLowerCase() === email
  );

  return NextResponse.json(orders);
}