"use client";

import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import { use } from "react";
import Header from "@/components/Header";
import HeaderWrapper from "@/components/HeaderWrapper";
import { useCart } from "@/app/hooks/useCart";

interface ProductColor {
  color: string;
  name: string;
}

interface ProductSize {
  size: string;
}

interface ProductImage {
  url: string;
  color?: ProductColor;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  discount: number;
  comparePrice?: number;
  colors: ProductColor[];
  sizes: ProductSize[];
  images: ProductImage[];
  category?: {
    id: string;
    name: string;
    products: Product[];
  };
  inStock?: boolean;
  tags?: string[];
}

const ProductDetailsPage = ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { addToCart } = useCart();

  const { id } = use(params);
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [currentProductId, setCurrentProductId] = useState(id);
  const [mainImage, setMainImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [imageLoading, setImageLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/products/${currentProductId}`);
        const data: Product = await res.json();
        setProduct(data);
        if (data.colors?.length) setSelectedColor(data.colors[0].color);
        if (data.sizes?.length) setSelectedSize(data.sizes[0].size);
        if (data.images?.length) setMainImage(data.images[0].url);
      } catch (error) {
        console.error("Failed to fetch product:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [currentProductId]);
  const handleAddToCart = () => {
    if (!product) return;

    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: mainImage || product.images[0]?.url,
      quantity,
      stock: product.inStock ? 100 : 0, // tu peux remplacer 100 par product.stock si tu l’as dans ton modèle
    });
  };

  // Colors & Sizes in the same category
  const categoryColors = useMemo(() => {
    if (!product?.category?.products) return [];
    const allColors = product.category.products.flatMap((p) =>
      p.colors.map((c) => ({ color: c.color, name: c.name || c.color }))
    );
    return Array.from(
      new Map(allColors.map((item) => [item.color, item])).values()
    );
  }, [product]);

  const categorySizes = useMemo(() => {
    if (!product?.category?.products) return [];
    const allSizes = product.category.products.flatMap((p) =>
      p.sizes.map((s) => s.size)
    );
    return Array.from(new Set(allSizes)).sort((a, b) => {
      const sizeOrder = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];
      return sizeOrder.indexOf(a) - sizeOrder.indexOf(b);
    });
  }, [product]);

  // Update product based on color & size selection
  useEffect(() => {
    if (!selectedColor || !selectedSize || !product?.category?.products) return;

    const matchedProduct = product.category.products.find(
      (p) =>
        p.colors.some((c) => c.color === selectedColor) &&
        p.sizes.some((s) => s.size === selectedSize)
    );

    if (matchedProduct && matchedProduct.id !== product.id) {
      setCurrentProductId(matchedProduct.id);
    }
  }, [selectedColor, selectedSize, product]);

  const handleQuantityChange = (change: number) => {
    setQuantity((prev) => Math.max(1, prev + change));
  };

  const getColorName = (colorValue: string) => {
    return (
      categoryColors.find((c) => c.color === colorValue)?.name || colorValue
    );
  };

  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    e.currentTarget.src = "/images/placeholder-product.jpg";
  };

  if (!product) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-12 h-12 border-4 border-black border-dashed rounded-full animate-spin"></div>
      </div>
    );
  }

  const discount =
    product.comparePrice && product.comparePrice > product.price
      ? Math.round(
          ((product.comparePrice - product.price) / product.comparePrice) * 100
        )
      : 0;

  const savings = discount > 0 ? product.comparePrice! - product.price : 0;

  return (
    <div className=" ">
      {/* <HeaderWrapper /> */}
      <div className="  px-4 sm:px-6 lg:px-8  pt-36">
        <nav className="flex text-sm text-gray-500 mb-4">
          <a href="/" className="hover:text-gray-700">
            Accueil
          </a>
          {product.category && (
            <>
              <span className="mx-2">/</span>
              <a
                href={`/categories/${product.category.id}`}
                className="hover:text-gray-700 capitalize"
              >
                {product.category.name}
              </a>
            </>
          )}
          <span className="mx-2">/</span>
          <span className="text-gray-900 font-medium truncate">
            {product.name}
          </span>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          <div className="flex-1">
            <div className="relative rounded-2xl overflow-hidden bg-gray-50 aspect-square mb-6 shadow-sm border border-gray-100 group">
              {mainImage && (
                <>
                  {imageLoading && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 border-4 border-gray-200 border-t-black rounded-full animate-spin"></div>
                    </div>
                  )}
                  <Image
                    src={mainImage}
                    alt={product.name}
                    fill
                    className={`object-cover transition-all duration-500 group-hover:scale-105 ${
                      imageLoading ? "opacity-0" : "opacity-100"
                    }`}
                    priority
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    onLoad={() => setImageLoading(false)}
                    onError={handleImageError}
                  />
                </>
              )}

              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {discount > 0 && (
                  <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    -{discount}%
                  </span>
                )}
                {!product.inStock && (
                  <span className="bg-gray-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    Rupture de stock
                  </span>
                )}
              </div>
            </div>

            {product.images.length > 1 && (
              <div className="flex gap-3 overflow-y-auto pb-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                {product.images.map((img, index) => (
                  <button
                    key={`${img.url}-${index}`}
                    onClick={() => {
                      setMainImage(img.url);
                      setImageLoading(true);
                    }}
                    className={`flex-shrink-0 relative rounded-xl overflow-hidden border-2 transition-all duration-200 hover:scale-105 ${
                      mainImage === img.url
                        ? "border-black shadow-md"
                        : "border-gray-200 hover:border-gray-400"
                    }`}
                  >
                    <div className="w-20 h-20 md:w-24 md:h-24 relative">
                      <Image
                        src={img.url}
                        alt={`${product.name} - Vue ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="80px"
                        onError={handleImageError}
                      />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex-1 max-w-2xl">
            <div className="sticky top-8 space-y-8">
              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    {product.tags?.map((tag) => (
                      <span
                        key={tag}
                        className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight leading-tight uppercase">
                    {product.name}
                  </h1>
                  {product.category && (
                    <p className="text-sm text-gray-500 mt-2 capitalize">
                      {product.category.name}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <div className="flex text-amber-400">
                    {"★".repeat(4)}
                    <span className="text-gray-300">★</span>
                  </div>
                  <span className="text-sm text-gray-600">(42 avis)</span>
                </div>

                {/* Section Prix avec remise */}
                <div className="flex items-baseline gap-3">
                  {product.discount !== undefined &&
                  product.discount !== null &&
                  product.discount > 0 ? (
                    <>
                      {/* Prix après remise */}
                      <span className="text-3xl font-bold text-gray-900">
                        {(product.price * (1 - product.discount / 100)).toFixed(
                          3
                        )}{" "}
                        Dt
                      </span>

                      {/* Prix original barré */}
                      <span className="text-3xl text-gray-500 line-through">
                        {product.price.toFixed(3)} Dt
                      </span>

                      {/* Pourcentage de réduction */}
                      <span className="text-sm font-bold text-red-600 bg-red-50 px-2 py-1 rounded border border-red-200">
                        -{product.discount}%
                      </span>
                    </>
                  ) : (
                    /* Prix normal sans remise */
                    <span className="text-3xl font-bold text-gray-900">
                      {product.price.toFixed(3)} Dt
                    </span>
                  )}
                </div>
              </div>

              <div className="prose prose-gray max-w-none border-t border-b border-gray-200 py-6">
                <p className="text-gray-600 leading-relaxed text-lg">
                  {product.description}
                </p>
              </div>

              {categoryColors.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Select Colors
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {categoryColors.map((colorObj) => (
                      <button
                        key={colorObj.color}
                        onClick={() => setSelectedColor(colorObj.color)}
                        className={`group relative w-14 h-14 rounded-full border-3 transition-all duration-200 hover:scale-110 hover:shadow-lg ${
                          selectedColor === colorObj.color
                            ? "border-black shadow-md ring-2 ring-black ring-opacity-20"
                            : "border-gray-300 hover:border-gray-500"
                        }`}
                        style={{ backgroundColor: colorObj.color }}
                        title={colorObj.name}
                      >
                        {selectedColor === colorObj.color && (
                          <div className="absolute -top-1 -right-1 w-5 h-5 bg-black rounded-full flex items-center justify-center">
                            <svg
                              className="w-3 h-3 text-white"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {categorySizes.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Select Sizes{" "}
                    </h3>
                    <button className="text-sm text-gray-600 hover:text-gray-900 underline">
                      Guide des tailles
                    </button>
                  </div>
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                    {categorySizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`py-4 px-2 rounded-nome border-2 font-semibold transition-all duration-200 hover:border-gray-400 hover:scale-105 ${
                          selectedSize === size
                            ? "border-black bg-black text-white shadow-lg transform scale-105"
                            : "border-gray-300 bg-white text-gray-900 hover:bg-gray-50"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-6 pt-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={() => handleQuantityChange(-1)}
                      className="w-12 h-12 flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M20 12H4"
                        />
                      </svg>
                    </button>
                    <span className="w-12 h-12 flex items-center justify-center font-semibold text-lg">
                      {quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(1)}
                      className="w-12 h-12 flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                    </button>
                  </div>
                  <div className="space-y-4">
                    <button
                      disabled={!product.inStock}
                      onClick={handleAddToCart}
                      className={`w-full py-4 px-8 rounded-xl text-lg font-semibold transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl ${
                        product.inStock
                          ? "bg-black text-white hover:bg-gray-800 active:bg-gray-900"
                          : "bg-gray-400 text-gray-200 cursor-not-allowed"
                      }`}
                    >
                      {product.inStock
                        ? "Ajouter au panier"
                        : "Rupture de stock"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProductDetailsPage;
