import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

type Variant = {
  size?: string;
  retailPrice?: string;
  retailDiscountPrice?: string;
  boxQty?: number;
  boxPrice?: string;
  boxDiscountPrice?: string;
  image?: string;
  unitPrice?: string;
  discountPrice?: string;
  unitStock?: number;
  boxStock?: number;
  vatClass?: string;
};

type Product = {
  slug: string;
  name: string;
  category: string;
  subCategory: string;
  description: string;
  variants: Variant[];
};

type CartItem = {
  id: string;
  productSlug: string;
  productName: string;
  size: string;
  purchaseType: "retail" | "box";
  quantity: number;
  unitPrice: number;
  boxQty: number;
  image: string;
  vatClass: "zero" | "standard";
};

type CustomerInfo = {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  notes: string;
};

type Order = {
  id: string;
  createdAt: string;
  status: "pending" | "bank-transfer-pending" | "paid" | "processing" | "shipped" | "completed" | "cancelled";
  paymentMethod: "bank-transfer" | "card-coming-soon";
  customer: CustomerInfo;
  items: CartItem[];
  subtotal: number;
  vatTotal: number;
  shipping: number;
  grandTotal: number;
  whatsappText: string;
};

const productsFilePath = path.join(process.cwd(), "data", "products.json");
const ordersFilePath = path.join(process.cwd(), "data", "orders.json");

function ensureFile(filePath: string) {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, "[]", "utf-8");
  }
}

function readProducts(): Product[] {
  ensureFile(productsFilePath);
  const content = fs.readFileSync(productsFilePath, "utf-8");
  return JSON.parse(content || "[]");
}

function writeProducts(products: Product[]) {
  fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2), "utf-8");
}

function readOrders(): Order[] {
  ensureFile(ordersFilePath);
  const content = fs.readFileSync(ordersFilePath, "utf-8");
  return JSON.parse(content || "[]");
}

function writeOrders(orders: Order[]) {
  fs.writeFileSync(ordersFilePath, JSON.stringify(orders, null, 2), "utf-8");
}

function normalizeSize(value: string | undefined) {
  return String(value || "").trim().toLowerCase();
}

function buildWhatsappText(order: Order) {
  const lines: string[] = [];

  lines.push(`Hello, I want to place this order.`);
  lines.push(`Order ID: ${order.id}`);
  lines.push(`Payment Method: ${order.paymentMethod}`);
  lines.push(``);
  lines.push(`Customer Details`);
  lines.push(`Name: ${order.customer.fullName}`);
  lines.push(`Email: ${order.customer.email}`);
  lines.push(`Phone: ${order.customer.phone}`);
  lines.push(`Address: ${order.customer.address}`);
  if (order.customer.notes) {
    lines.push(`Notes: ${order.customer.notes}`);
  }
  lines.push(``);

  lines.push(`Items`);
  for (const item of order.items) {
    lines.push(
      `- ${item.productName} | Size: ${item.size || "-"} | Type: ${item.purchaseType} | Qty: ${item.quantity} | Line Total: £${(item.unitPrice * item.quantity).toFixed(2)}`
    );
  }

  lines.push(``);
  lines.push(`Subtotal: £${order.subtotal.toFixed(2)}`);
  lines.push(`VAT: £${order.vatTotal.toFixed(2)}`);
  lines.push(`Shipping: £${order.shipping.toFixed(2)}`);
  lines.push(`Total: £${order.grandTotal.toFixed(2)}`);
  lines.push(``);

  if (order.paymentMethod === "bank-transfer") {
    lines.push(`I selected bank transfer. Please send me payment details.`);
  } else {
    lines.push(`Card payment is coming soon.`);
  }

  return lines.join("\n");
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const items: CartItem[] = Array.isArray(body.items) ? body.items : [];
    const customer: CustomerInfo = {
      fullName: String(body.customer?.fullName || "").trim(),
      email: String(body.customer?.email || "").trim(),
      phone: String(body.customer?.phone || "").trim(),
      address: String(body.customer?.address || "").trim(),
      notes: String(body.customer?.notes || "").trim(),
    };
    const paymentMethod =
      body.paymentMethod === "bank-transfer" ? "bank-transfer" : "card-coming-soon";

    if (!items.length) {
      return NextResponse.json(
        { success: false, message: "Cart is empty." },
        { status: 400 }
      );
    }

    if (!customer.fullName || !customer.email || !customer.phone || !customer.address) {
      return NextResponse.json(
        { success: false, message: "Full name, email, phone and address are required." },
        { status: 400 }
      );
    }

    if (paymentMethod === "card-coming-soon") {
      return NextResponse.json(
        { success: false, message: "Card payment is coming soon. Please select bank transfer." },
        { status: 400 }
      );
    }

    const products = readProducts();

    for (const item of items) {
      const product = products.find((p) => p.slug === item.productSlug);
      if (!product) {
        return NextResponse.json(
          { success: false, message: `Product not found: ${item.productName}` },
          { status: 400 }
        );
      }

      const variant = product.variants.find(
        (v) => normalizeSize(v.size) === normalizeSize(item.size)
      );

      if (!variant) {
        return NextResponse.json(
          {
            success: false,
            message: `Variant not found: ${item.productName} / ${item.size}`,
          },
          { status: 400 }
        );
      }

      if (item.purchaseType === "retail") {
        const stock = Number(variant.unitStock || 0);
        if (stock < item.quantity) {
          return NextResponse.json(
            {
              success: false,
              message: `Not enough retail stock for ${item.productName} (${item.size})`,
            },
            { status: 400 }
          );
        }
      }

      if (item.purchaseType === "box") {
        const stock = Number(variant.boxStock || 0);
        if (stock < item.quantity) {
          return NextResponse.json(
            {
              success: false,
              message: `Not enough box stock for ${item.productName} (${item.size})`,
            },
            { status: 400 }
          );
        }
      }
    }

    const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

    const vatTotal = items.reduce((sum, item) => {
      const lineSubtotal = item.unitPrice * item.quantity;
      const rate = item.vatClass === "standard" ? 0.2 : 0;
      return sum + lineSubtotal * rate;
    }, 0);

    const shipping = subtotal === 0 ? 0 : subtotal >= 75 ? 0 : 4.99;
    const grandTotal = subtotal + vatTotal + shipping;

    for (const item of items) {
      const product = products.find((p) => p.slug === item.productSlug)!;
      const variant = product.variants.find(
        (v) => normalizeSize(v.size) === normalizeSize(item.size)
      )!;

      if (item.purchaseType === "retail") {
        variant.unitStock = Math.max(0, Number(variant.unitStock || 0) - item.quantity);
      }

      if (item.purchaseType === "box") {
        variant.boxStock = Math.max(0, Number(variant.boxStock || 0) - item.quantity);
      }
    }

    const orderId = `ORD-${Date.now()}`;

    const draftOrder: Order = {
      id: orderId,
      createdAt: new Date().toISOString(),
      status: "bank-transfer-pending",
      paymentMethod,
      customer,
      items,
      subtotal,
      vatTotal,
      shipping,
      grandTotal,
      whatsappText: "",
    };

    draftOrder.whatsappText = buildWhatsappText(draftOrder);

    const orders = readOrders();
    orders.unshift(draftOrder);

    writeProducts(products);
    writeOrders(orders);

    return NextResponse.json({
      success: true,
      message: "Order created successfully.",
      orderId,
      whatsappText: draftOrder.whatsappText,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Order creation failed.",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}