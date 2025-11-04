import { useEffect, useState } from "react";

type Product = {
  id: string;
  name: string;
  price?: number;
  images?: { id: string; url: string }[];
  sizes?: { id: string; size: string }[];
  colors?: { id: string; color: string }[];
};

const useProductsByCategory = (categoryId: string) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/categories/${categoryId}/products`);
      if (!res.ok) throw new Error("Failed to fetch products");
      const data = await res.json();
      setProducts(data.products);
    } catch (err) {
      console.error(err);
      setError("Unable to fetch products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (categoryId) fetchProducts();
  }, [categoryId]);

  return { products, loading, error, fetchProducts };
};

export default useProductsByCategory;
