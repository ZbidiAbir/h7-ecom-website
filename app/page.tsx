"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import CartDrawer from "@/components/CartDrawer";
import { useCart } from "./hooks/useCart";
import ProductList from "@/components/ProductList";
import Hero from "@/components/home/Hero";
import HeaderWrapper from "@/components/HeaderWrapper";
import Features from "@/components/home/Features";
import Values from "@/components/home/Values";
import Sellers from "@/components/home/Sellers";
import Standard from "@/components/home/Standars";
import ShippingSection from "@/components/home/ShippingSection";
import AutoScrollBanner from "@/components/home/AutoScrollBanner";
import MadeInTunisia from "@/components/home/MadeInTunisia";
import About from "@/components/home/About";

export default function Home() {
  const { data: session } = useSession();
  const { addToCart } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);

  const [products, setProducts] = useState<Product[]>([]);
  const [jeansproducts, setJeansProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mainImages, setMainImages] = useState<{ [key: string]: string }>({});
  const [addedProducts, setAddedProducts] = useState<{
    [key: string]: boolean;
  }>({});

  // types.ts
  interface Product {
    id: string;
    name: string;
    description: string;
    discount: number;
    stock: number;
    price: number;
    images: (string | { url: string })[];
    colors: (string | { color: string })[];
  }

  const isAdmin = session?.user?.role === "ADMIN";

  useEffect(() => {
    fetchProducts();
    fetchProductsJeans(); // ✅ Ajouté ici
  }, []);

  const fetchProducts = async () => {
    try {
      setError(null);
      setLoading(true);
      const res = await fetch("/api/unique");
      if (!res.ok) throw new Error("Failed to fetch products");
      const data: Product[] = await res.json();
      setProducts(data);

      const initialImages: { [key: string]: string } = {};
      data.forEach((p) => {
        const firstImage = p.images[0];
        initialImages[p.id] =
          typeof firstImage === "string"
            ? firstImage
            : firstImage?.url || "/placeholder.png";
      });
      setMainImages((prev) => ({ ...prev, ...initialImages }));
    } catch (err) {
      console.error(err);
      setError("Unable to load products. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const fetchProductsJeans = async () => {
    try {
      setError(null);
      const res = await fetch("/api/unique-jeans");
      if (!res.ok) throw new Error("Failed to fetch jeans products");
      const data: Product[] = await res.json();
      setJeansProducts(data); // ✅ Corrigé ici

      const initialImages: { [key: string]: string } = {};
      data.forEach((p) => {
        const firstImage = p.images[0];
        initialImages[p.id] =
          typeof firstImage === "string"
            ? firstImage
            : firstImage?.url || "/placeholder.png";
      });
      setMainImages((prev) => ({ ...prev, ...initialImages }));
    } catch (err) {
      console.error(err);
      setError("Unable to load jeans products. Please try again later.");
    }
  };

  const handleAddToCart = (product: Product) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: mainImages[product.id] || "/placeholder.png",
      quantity: 1,
      stock: product.stock,
      colors: product.colors
        ? product.colors.map((c) => (typeof c === "string" ? c : c.color))
        : [],
    });
  };

  return (
    <div className="bg-white">
      <HeaderWrapper />
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <Hero />
      <Features />
      <Sellers />
      <main className="px-4 py-8 md:py-12">
        <div className="px-36">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-slate-400 mb-4" />
              <p className="text-slate-500">Loading products...</p>
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
                <p className="text-red-600 mb-4">{error}</p>
                <Button onClick={fetchProducts} variant="outline">
                  Try Again
                </Button>
              </div>
            </div>
          ) : (
            <div>
              {" "}
              <h1 className="text-black text-center text-3xl font-bold py-8">
                What we have for you
              </h1>
              <ProductList
                products={products}
                mainImages={mainImages}
                addedProducts={addedProducts}
                handleAddToCart={handleAddToCart}
                isAdmin={isAdmin}
              />
            </div>
          )}
        </div>
      </main>

      <About />
      <MadeInTunisia />
      <AutoScrollBanner />

      {/* ✅ Section jeans maintenant fonctionnelle */}
      <div className="px-36">
        <h1 className="text-center font-bold text-4xl py-12">
          Our jeans collection
        </h1>
        <ProductList
          products={jeansproducts}
          mainImages={mainImages}
          addedProducts={addedProducts}
          handleAddToCart={handleAddToCart}
          isAdmin={isAdmin}
        />
      </div>

      <Standard />
      <ShippingSection />
      <Values />
    </div>
  );
}
