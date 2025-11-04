"use client";

import { Button } from "@/components/ui/button";
import { ShoppingCart, PlusCircle } from "lucide-react";

interface Product {
  id: string;
  name: string;
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
      <div className="text-center py-16">
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

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {products.map((product) => (
        <div
          key={product.id}
          className={`bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-300 ${
            product.stock === 0 ? "opacity-70" : ""
          }`}
        >
          <img
            src={mainImages[product.id] || "/placeholder.png"}
            alt={product.name}
            className="w-full h-64 object-cover rounded-t-xl"
          />
          <div className="p-4">
            <h3 className="font-bold text-lg mb-2">{product.name}</h3>
            <p className="text-slate-600 text-sm mb-2">{product.description}</p>

            {/* Badge Stock */}
            {product.stock > 0 ? (
              <span className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded-full mb-2">
                In Stock
              </span>
            ) : (
              <span className="inline-block bg-red-100 text-red-800 text-xs font-semibold px-2 py-1 rounded-full mb-2">
                Out of Stock
              </span>
            )}

            <p className="text-slate-900 font-semibold mb-4">
              {product.price.toFixed(3)}Dt
            </p>

            <Button
              className="w-full flex items-center gap-2"
              onClick={() => handleAddToCart(product)}
              disabled={product.stock === 0 || addedProducts[product.id]}
            >
              <ShoppingCart className="w-4 h-4" />
              {addedProducts[product.id] ? "Added" : "Add to Cart"}
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
