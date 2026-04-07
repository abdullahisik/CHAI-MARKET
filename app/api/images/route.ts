import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const publicProductsPath = path.join(process.cwd(), "public", "products");

function listImageFiles(dirPath: string, webPrefix: string): string[] {
  const result: string[] = [];

  if (!fs.existsSync(dirPath)) return result;

  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    const webPath = `${webPrefix}/${entry.name}`;

    if (entry.isDirectory()) {
      result.push(...listImageFiles(fullPath, webPath));
    } else if (entry.isFile()) {
      if (/\.(jpg|jpeg|png|webp)$/i.test(entry.name)) {
        result.push(webPath);
      }
    }
  }

  return result;
}

export async function GET() {
  try {
    const images = listImageFiles(publicProductsPath, "/products");
    return NextResponse.json(images.sort());
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Images could not be loaded.",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}