"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Loader2, PlusCircle } from "lucide-react";
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
    stock: number;
    price: number;
    images: (string | { url: string })[];
    colors: (string | { color: string })[];
  }

  const isAdmin = session?.user?.role === "ADMIN";

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setError(null);
      setLoading(true);
      const res = await fetch("/api/products");
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
      setMainImages(initialImages);
    } catch (err) {
      console.error(err);
      setError("Unable to load products. Please try again later.");
    } finally {
      setLoading(false);
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
        : [], // <- si undefined, on met un tableau vide
    });
  };

  return (
    <div className="bg-gradient-to-br from-slate-50 to-slate-100">
      <HeaderWrapper /> {/* <-- absolute */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <Hero
        imageUrl="/home/hero1.svg"
        buttonText="Discover the collection"
        verticalText="New Collection"
      />
      <Features />
      <Sellers />
      {/* Main */}
      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-6xl mx-auto">
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
            <ProductList
              products={products}
              mainImages={mainImages}
              addedProducts={addedProducts}
              handleAddToCart={handleAddToCart}
              isAdmin={isAdmin}
            />
          )}
        </div>
      </main>
      <AutoScrollBanner />
      <MadeInTunisia
        variant="elegant"
        animation="glitch"
        textColor="text-black"
        lineColor="bg-gray-900"
        size="xl"
        delay={1000}
        className="bg-gray-50"
      />{" "}
      <Standard />
      <ShippingSection />
      <Values />
      <About />
    </div>
  );
}
