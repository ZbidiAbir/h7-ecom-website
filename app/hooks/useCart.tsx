"use client";

import { createContext, useContext, useEffect, useState } from "react";

interface CartItem {
  id: string;
  name: string;
  price: number;
  image?: string;
  quantity: number;
  stock: number;
  colors?: (string | { color: string })[]; // <- accepte string ou objet
  sizes?: (string | { size: string })[]; // <- accepte string ou objet
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  updateQuantity: (id: string, quantity: number) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  // Charger depuis localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // Sauvegarder à chaque modification
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // Ajouter au panier
  const addToCart = (item: CartItem) => {
    const normalizedItem: CartItem = {
      ...item,
      colors:
        item.colors?.map((c) => (typeof c === "string" ? c : c.color)) || [],
      sizes: item.sizes?.map((c) => (typeof c === "string" ? c : c.size)) || [],
    };

    setCart((prev) => {
      const existing = prev.find((p) => p.id === normalizedItem.id);
      if (existing) {
        const newQuantity = Math.min(existing.quantity + 1, existing.stock);
        return prev.map((p) =>
          p.id === normalizedItem.id ? { ...p, quantity: newQuantity } : p
        );
      }
      return [...prev, normalizedItem];
    });
  };

  // Supprimer
  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  // Vider
  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("cart");
  };

  // Mettre à jour quantité
  const updateQuantity = (id: string, quantity: number) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: Math.max(1, Math.min(quantity, item.stock)),
            }
          : item
      )
    );
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, clearCart, updateQuantity }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
