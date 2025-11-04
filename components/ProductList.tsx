"use client";

import { Button } from "@/components/ui/button";
import { ShoppingCart, PlusCircle } from "lucide-react";
import Link from "next/link";

interface Product {
  id: string;
  name: string;
  discount: number;
  description: string;
  stock: number;
  price: number;
  colors: (string | { color: string })[];
  images: (string | { url: string })[];
}

interface ProductListProps {
  products: Product[];
  mainImages: { [key: string]: string };
  addedProducts: { [key: string]: boolean };
  handleAddToCart: (product: Product) => void;
  isAdmin?: boolean;
}

export default function ProductList({
  products,
  mainImages,
  addedProducts,
  handleAddToCart,
  isAdmin = false,
}: ProductListProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-16 bg-white">
        <div className="bg-white rounded-2xl border border-slate-200 p-8 max-w-md mx-auto shadow-sm">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <PlusCircle className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">
            No products yet
          </h3>
          <p className="text-slate-500 mb-4">
            {isAdmin
              ? "Create your first product to get started!"
              : "Check back later for new products."}
          </p>
        </div>
      </div>
    );
  }

  // 👉 Mélanger les produits et n’en garder que 8
  const shuffledProducts = [...products].sort(() => Math.random() - 0.5);
  const displayedProducts = shuffledProducts.slice(0, 8);

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 pt-12">
        {displayedProducts.map((product) => (
          <div
            key={product.id}
            className={`bg-white transition-shadow duration-300 ${
              product.stock === 0 ? "opacity-70" : ""
            }`}
          >
            <div className="relative w-full">
              <img
                src={mainImages[product.id] || "/placeholder.png"}
                alt={product.name}
                className="w-full h-64 object-cover rounded-lg"
              />
              {product.discount > 0 && (
                <div className="absolute top-0 left-0">
                  <span className="bg-black text-white text-xs px-2.5 py-1 shadow-md">
                    -{product.discount}%
                  </span>
                </div>
              )}
            </div>

            <div className="p-4">
              <h3 className="font-bold text-lg text-black mb-2">
                {product.name}
              </h3>
              <div className="flex items-center gap-1.5">
                <div className="flex text-amber-400 text-sm">
                  {"★".repeat(4)}
                  <span className="text-gray-300">★</span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center justify-between pt-1">
                  <div className="flex gap-2">
                    {product.discount > 0 ? (
                      <>
                        <span className="font-bold text-gray-900 text-base">
                          {(
                            product.price *
                            (1 - product.discount / 100)
                          ).toFixed(3)}{" "}
                          DT
                        </span>
                        <span className="text-gray-400 line-through text-sm">
                          {product.price.toFixed(3)} DT
                        </span>
                      </>
                    ) : (
                      <span className="font-bold text-gray-900 text-base">
                        {product.price.toFixed(3)} DT
                      </span>
                    )}
                  </div>
                </div>

                <Link href={`/products/${product.id}`}>
                  {" "}
                  <button
                    className="text-black cursor-pointer"
                    // onClick={() => handleAddToCart(product)}
                  >
                    <ShoppingCart className="w-4 h-4 text-black" />
                  </button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 👉 Bouton Voir plus */}
      {products.length > 8 && (
        <div className="flex justify-center mt-10">
          <Link href={"/categories"}>
            {" "}
            <Button
              onClick={() => console.log("Voir plus cliqué")}
              className="bg-black text-white hover:bg-gray-800 px-6 py-2 rounded-full text-sm cursor-pointer"
            >
              See More...
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
