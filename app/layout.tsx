import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "./providers/cart-provider";
import { AuthProvider } from "./providers/auth-provider";

export const metadata: Metadata = {
  title: "CHAI MARKET",
  description: "Wholesale & Retail Food Store",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <CartProvider>{children}</CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}