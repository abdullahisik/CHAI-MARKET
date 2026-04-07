import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const dataDir = path.join(process.cwd(), "data");
const settingsFilePath = path.join(dataDir, "settings.json");

const defaultSettings = {
  bank: {
    accountName: "CHAI MARKET",
    bankName: "YOUR BANK NAME",
    sortCode: "00-00-00",
    accountNumber: "00000000",
  },
  social: {
    instagram: "",
    facebook: "",
    tiktok: "",
    whatsapp: "",
  },
  appearance: {
    themePreset: "premium",
    headerStyle: "centered",
    bannerStyle: "split",
    cardRadius: "xl",
    shadowStyle: "medium",
  },
};

function ensureSettingsFile() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  if (!fs.existsSync(settingsFilePath)) {
    fs.writeFileSync(
      settingsFilePath,
      JSON.stringify(defaultSettings, null, 2),
      "utf-8"
    );
  }
}

function readSettings() {
  ensureSettingsFile();
  const content = fs.readFileSync(settingsFilePath, "utf-8");
  const parsed = JSON.parse(content || JSON.stringify(defaultSettings));

  return {
    bank: {
      ...defaultSettings.bank,
      ...(parsed.bank || {}),
    },
    social: {
      ...defaultSettings.social,
      ...(parsed.social || {}),
    },
    appearance: {
      ...defaultSettings.appearance,
      ...(parsed.appearance || {}),
    },
  };
}

function writeSettings(settings: any) {
  ensureSettingsFile();
  fs.writeFileSync(settingsFilePath, JSON.stringify(settings, null, 2), "utf-8");
}

export async function GET() {
  try {
    const settings = readSettings();
    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to load settings.",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const nextSettings = {
      bank: {
        accountName: String(body?.bank?.accountName || ""),
        bankName: String(body?.bank?.bankName || ""),
        sortCode: String(body?.bank?.sortCode || ""),
        accountNumber: String(body?.bank?.accountNumber || ""),
      },
      social: {
        instagram: String(body?.social?.instagram || ""),
        facebook: String(body?.social?.facebook || ""),
        tiktok: String(body?.social?.tiktok || ""),
        whatsapp: String(body?.social?.whatsapp || ""),
      },
      appearance: {
        themePreset: String(body?.appearance?.themePreset || "premium"),
        headerStyle: String(body?.appearance?.headerStyle || "centered"),
        bannerStyle: String(body?.appearance?.bannerStyle || "split"),
        cardRadius: String(body?.appearance?.cardRadius || "xl"),
        shadowStyle: String(body?.appearance?.shadowStyle || "medium"),
      },
    };

    writeSettings(nextSettings);

    return NextResponse.json({
      success: true,
      message: "Settings updated successfully.",
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to save settings.",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}