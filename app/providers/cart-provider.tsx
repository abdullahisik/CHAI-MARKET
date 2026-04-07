"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

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

type CartContextType = {
  items: CartItem[];
  itemCount: number;
  addItem: (item: Omit<CartItem, "id" | "quantity">) => void;
  increaseQty: (id: string) => void;
  decreaseQty: (id: string) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextType | null>(null);

const STORAGE_KEY = "chai-market-cart";

function buildId(
  productSlug: string,
  size: string,
  purchaseType: "retail" | "box"
) {
  return `${productSlug}__${size}__${purchaseType}`;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        setItems(parsed);
      }
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {}
  }, [items]);

  const addItem = (item: Omit<CartItem, "id" | "quantity">) => {
    const id = buildId(item.productSlug, item.size, item.purchaseType);

    setItems((prev) => {
      const existing = prev.find((x) => x.id === id);

      if (existing) {
        return prev.map((x) =>
          x.id === id ? { ...x, quantity: x.quantity + 1 } : x
        );
      }

      return [
        ...prev,
        {
          ...item,
          id,
          quantity: 1,
        },
      ];
    });
  };

  const increaseQty = (id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decreaseQty = (id: string) => {
    setItems((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setItems([]);
  };

  const itemCount = useMemo(() => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }, [items]);

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        addItem,
        increaseQty,
        decreaseQty,
        removeItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);

  if (!ctx) {
    throw new Error("useCart must be used inside CartProvider");
  }

  return ctx;
}