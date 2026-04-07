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

function writeOrders(orders: any[]) {
  fs.writeFileSync(ordersFilePath, JSON.stringify(orders, null, 2), "utf-8");
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const orderId = String(body.orderId || "").trim();
    const status = String(body.status || "").trim();

    if (!orderId || !status) {
      return NextResponse.json(
        { success: false, message: "Order ID and status are required." },
        { status: 400 }
      );
    }

    const orders = readOrders();
    const index = orders.findIndex((o: any) => String(o.id) === orderId);

    if (index === -1) {
      return NextResponse.json(
        { success: false, message: "Order not found." },
        { status: 404 }
      );
    }

    orders[index].status = status;
    writeOrders(orders);

    return NextResponse.json({
      success: true,
      message: "Order status updated successfully.",
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Status update failed.",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}