"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle, ShoppingCart, Menu, Search, User, X } from "lucide-react";
import AuthButton from "@/components/auth-button";
import Link from "next/link";

interface HeaderProps {
  isAdmin: boolean;
  cartCount: number;
  openCart: () => void;
}

export default function Header({ isAdmin, cartCount, openCart }: HeaderProps) {
  const [showBanner, setShowBanner] = useState(true);

  return (
    <header className="sticky top-0 z-50 ">
      {/* ✅ Bannière promo avec bouton Close */}
      {showBanner && (
        <div className="relative bg-black text-white text-sm text-center py-1">
          <span>
            Sign up and get 20% off your first order.{" "}
            <Link href="/signup" className="underline">
              Sign Up Now
            </Link>
          </span>
          <button
            onClick={() => setShowBanner(false)}
            className="absolute right-12 top-1/2 -translate-y-1/2 text-white hover:text-gray-300"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header principal */}
      <div className="bg-transparent ">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          {/* Menu gauche */}
          <div className="flex items-center gap-4">
            <button className="p-1 text-slate-700 hover:text-slate-900">
              <Menu className="w-5 h-5" />
            </button>
            <button className="p-1 text-slate-700 hover:text-slate-900">
              <Search className="w-5 h-5" />
            </button>
          </div>

          {/* Logo centré */}
          <Link
            href="/"
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <span className="text-xl md:text-2xl font-bold bg-black bg-clip-text text-transparent">
              HASHSEVEN
            </span>
          </Link>

          {/* Menu droit */}
          <div className="flex items-center gap-4">
            <AuthButton />

            <button
              onClick={openCart}
              className="relative flex items-center gap-1 text-black hover:text-slate-900"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-gray-300 text-black text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </button>
            {isAdmin && (
              <Button asChild size="sm" className="bg-gray-300 text-gray-700">
                <Link
                  href="/admin/dashboard"
                  className="flex items-center gap-2 "
                >
                  <PlusCircle className="w-4 h-4" />
                  Dashboard
                </Link>
              </Button>
            )}
            {/* <AuthButton /> */}
          </div>
        </div>
      </div>
    </header>
  );
}
