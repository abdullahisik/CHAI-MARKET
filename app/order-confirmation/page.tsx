import fs from "fs";
import path from "path";
import SiteHeader from "../components/site-header";
import SiteFooter from "../components/site-footer";

const settingsFilePath = path.join(process.cwd(), "data", "settings.json");

function readSettings() {
  try {
    if (!fs.existsSync(settingsFilePath)) {
      return {
        bank: {
          accountName: "CHAI MARKET",
          bankName: "YOUR BANK NAME",
          sortCode: "00-00-00",
          accountNumber: "00000000",
        },
      };
    }

    const content = fs.readFileSync(settingsFilePath, "utf-8");
    return JSON.parse(content || "{}");
  } catch {
    return {
      bank: {
        accountName: "CHAI MARKET",
        bankName: "YOUR BANK NAME",
        sortCode: "00-00-00",
        accountNumber: "00000000",
      },
    };
  }
}

export default async function OrderConfirmationPage({
  searchParams,
}: {
  searchParams: Promise<{ orderId?: string }>;
}) {
  const params = await searchParams;
  const orderId = params?.orderId || "-";
  const settings = readSettings();
  const bank = settings.bank || {};

  return (
    <main className="min-h-screen bg-[#f8f5ee] text-[#1f2e1f]">
      <SiteHeader />

      <div className="mx-auto max-w-4xl px-6 py-12">
        <div className="rounded-2xl bg-white p-8 shadow">
          <h1 className="mb-4 text-4xl font-bold">Order Confirmed</h1>
          <p className="mb-2 text-lg">
            Your order has been created successfully.
          </p>
          <p className="mb-8 text-gray-700">
            Order ID: <span className="font-bold">{orderId}</span>
          </p>

          <div className="rounded-xl border bg-[#f8f5ee] p-6">
            <h2 className="mb-4 text-2xl font-bold">Bank Transfer Details</h2>

            <div className="space-y-2 text-gray-700">
              <p>
                <span className="font-semibold">Account Name:</span>{" "}
                {bank.accountName || "-"}
              </p>
              <p>
                <span className="font-semibold">Bank Name:</span>{" "}
                {bank.bankName || "-"}
              </p>
              <p>
                <span className="font-semibold">Sort Code:</span>{" "}
                {bank.sortCode || "-"}
              </p>
              <p>
                <span className="font-semibold">Account Number:</span>{" "}
                {bank.accountNumber || "-"}
              </p>
              <p>
                <span className="font-semibold">Reference:</span> {orderId}
              </p>
            </div>

            <p className="mt-5 text-sm text-red-600">
              Please use your Order ID as payment reference.
            </p>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href="/account"
              className="rounded bg-[#102418] px-6 py-3 font-semibold text-white"
            >
              Go to My Account
            </a>

            <a
              href="/"
              className="rounded border border-[#102418] px-6 py-3 font-semibold text-[#102418]"
            >
              Back to Home
            </a>
          </div>
        </div>
      </div>

      <SiteFooter />
    </main>
  );
}