"use client";

import Header from "@/components/Header";
import { useCart } from "@/app/hooks/useCart";
import { useSession } from "next-auth/react";
import { useState } from "react";
import CartDrawer from "@/components/CartDrawer";

export default function HeaderWrapper() {
  const { cart } = useCart();
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "ADMIN";
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <>
      <div className="absolute top-0 left-0 w-full z-50">
        <Header
          isAdmin={isAdmin}
          cartCount={cart.length}
          openCart={() => setIsCartOpen(true)}
        />
        <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      </div>
    </>
  );
}
