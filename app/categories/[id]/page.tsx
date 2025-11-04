"use client";

import { use, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function CategoryDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`/api/categories/${id}/unique-products`);

        if (!res.ok) {
          throw new Error(`Erreur ${res.status}: ${res.statusText}`);
        }

        const json = await res.json();
        setData(json);
      } catch (error) {
        console.error("Erreur lors du chargement :", error);
        setError("Impossible de charger les données de la catégorie");
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryProducts();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-gray-500 text-lg animate-pulse">
          Chargement...
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-2xl font-bold text-red-500 mb-4">Erreur</h2>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Réessayer
        </button>
      </div>
    );
  }

  if (!data || !data.category) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-2xl font-bold text-gray-700 mb-4">
          Catégorie introuvable
        </h2>
        <Link
          href="/categories"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Retour aux catégories
        </Link>
      </div>
    );
  }

  const { category, products = [] } = data;

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">{category.name}</h1>
          {category.description && (
            <p className="text-gray-600">{category.description}</p>
          )}
        </div>

        {/* Products grid */}
        {products.length === 0 ? (
          <div className="text-center py-20 bg-white rounded shadow-sm">
            <h3 className="text-xl font-semibold text-gray-700 mb-3">
              Aucun produit disponible
            </h3>
            <p className="text-gray-500 mb-4">
              Aucun produit n'est actuellement disponible dans cette catégorie.
            </p>
            <Link
              href="/categories"
              className="inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              Explorer d'autres catégories
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product: any) => (
              <Link
                key={product.id}
                href={`/products/${product.id}`}
                className="group relative bg-white rounded shadow hover:shadow-lg transition overflow-hidden border border-gray-100"
              >
                <div className="relative h-60 w-full overflow-hidden rounded-t">
                  {product.images?.[0]?.url ? (
                    <Image
                      src={product.images[0].url}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                      <span className="text-gray-400 text-3xl">📦</span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg text-gray-800 mb-2">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                    {product.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-blue-600 font-bold">
                      {product.price} €
                    </span>
                    <span
                      className={`text-sm px-2 py-1 rounded-full ${
                        product.stock > 10
                          ? "bg-green-100 text-green-700"
                          : product.stock > 0
                          ? "bg-orange-100 text-orange-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {product.stock > 10
                        ? "En stock"
                        : product.stock > 0
                        ? `${product.stock} restants`
                        : "Rupture"}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
