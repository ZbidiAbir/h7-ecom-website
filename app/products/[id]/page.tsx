"use client";

import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import { use } from "react";
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
  stock?: number;
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

  // Memoized data
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

  const isCombinationAvailable = useMemo(() => {
    if (!product?.category?.products) return true;
    if (categoryColors.length === 0 && categorySizes.length === 0) return true;

    const availableProduct = product.category.products.find((p) => {
      const colorMatch =
        !selectedColor || p.colors.some((c) => c.color === selectedColor);
      const sizeMatch =
        !selectedSize || p.sizes.some((s) => s.size === selectedSize);
      return colorMatch && sizeMatch;
    });

    return !!availableProduct;
  }, [product, selectedColor, selectedSize, categoryColors, categorySizes]);

  const isProductInStock = useMemo(() => {
    return product?.stock && product.stock > 0;
  }, [product]);

  const isAddToCartDisabled = !isProductInStock || !isCombinationAvailable;

  // Calculs prix
  const discount = useMemo(() => {
    if (product?.comparePrice && product.comparePrice > product.price) {
      return Math.round(
        ((product.comparePrice - product.price) / product.comparePrice) * 100
      );
    }
    return 0;
  }, [product]);

  const finalPrice = useMemo(() => {
    return product
      ? (product.price * (1 - product.discount / 100)).toFixed(3)
      : "0";
  }, [product]);

  const handleAddToCart = () => {
    if (!product || isAddToCartDisabled) return;

    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: mainImage || product.images[0]?.url,
      quantity,
      //@ts-ignore
      stock: product.stock,
      colors:
        product.colors?.map((c) => (typeof c === "string" ? c : c.color)) || [],
      sizes:
        product.sizes?.map((s) => (typeof s === "string" ? s : s.size)) || [],
    });
  };

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
    setQuantity((prev) =>
      Math.max(1, Math.min(prev + change, product?.stock || 99))
    );
  };

  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    e.currentTarget.src = "/images/placeholder-product.jpg";
  };

  const getAddToCartText = () => {
    if (!isProductInStock) return "Out of stock";
    if (!isCombinationAvailable) return "Combination Not Available";
    return "Add to cart";
  };

  if (!product) {
    return (
      <div className="min-h-screen pt-36 flex justify-center items-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Product Not Found
          </h2>
          <p className="text-gray-600">
            The product you're looking for doesn't exist.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <HeaderWrapper />

      {/* Breadcrumb */}
      <div className="px-4 sm:px-6 lg:px-8 pt-36 bg-gray-50 border-b">
        <nav className="flex text-sm text-gray-600 py-4">
          <a href="/" className="hover:text-gray-900 transition-colors">
            Home
          </a>
          {product.category && (
            <>
              <span className="mx-3">/</span>
              <span className="hover:text-gray-900 transition-colors capitalize">
                {product.category.name}
              </span>
            </>
          )}
          <span className="mx-3">/</span>
          <span className="text-gray-900 font-medium truncate max-w-xs">
            {product.name}
          </span>
        </nav>
      </div>

      {/* Product Section */}
      <div className="px-4 sm:px-6 lg:px-32 py-8">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Images Section */}
          <div className="flex-1">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Vertical Thumbnails */}
              {product.images.length > 1 && (
                <div className="flex lg:flex-col gap-3 order-2 lg:order-1   lg:overflow-y-auto max-h-[600px] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 pb-4 lg:pb-0">
                  {product.images.map((img, index) => (
                    <button
                      key={`${img.url}-${index}`}
                      onClick={() => {
                        setMainImage(img.url);
                        setImageLoading(true);
                      }}
                      className={` relative overflow-hidden transition-all duration-200 ${
                        mainImage === img.url
                          ? "border-black  scale-105"
                          : "border-gray-200 "
                      }`}
                    >
                      <div className="w-16 h-16 md:w-20 md:h-20 relative">
                        <Image
                          src={img.url}
                          alt={`${product.name} - View ${index + 1}`}
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

              {/* Main Image */}
              <div
                className={`relative bg-gray-50 aspect-square shadow-sm border border-gray-100 group ${
                  product.images.length > 1
                    ? "flex-1 order-1 lg:order-2"
                    : "w-full"
                }`}
              >
                {mainImage && (
                  <>
                    {imageLoading && (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
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
                      onLoad={() => setImageLoading(false)}
                      onError={handleImageError}
                    />
                  </>
                )}

                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {discount > 0 && (
                    <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                      -{discount}%
                    </span>
                  )}
                  {!isProductInStock && (
                    <span className="bg-gray-600 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                      Out of stock
                    </span>
                  )}
                  {!isCombinationAvailable && (
                    <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                      Not Available
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="flex-1 ">
            <div className="sticky  space-y-8">
              {/* Header */}
              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 ">
                    {product.tags?.map((tag) => (
                      <span
                        key={tag}
                        className="bg-blue-100 text-blue-800 px-3  rounded-full text-xs font-medium capitalize"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight leading-tight">
                    {product.name}
                  </h1>
                </div>

                {/* Ratings */}
                <div className="flex items-center gap-3">
                  <div className="flex text-amber-400 text-xl">
                    {"★".repeat(4)}
                    <span className="text-gray-300">★</span>
                  </div>
                  <span className="text-sm text-gray-600">(4.5/5)</span>
                </div>

                {/* Pricing */}
                <div className="flex items-baseline gap-4">
                  {product.discount > 0 ? (
                    <>
                      <span className="text-3xl font-bold text-gray-900">
                        {finalPrice} DT
                      </span>
                      <span className="text-xl text-gray-500 line-through">
                        {product.price.toFixed(3)} DT
                      </span>
                      <span className="text-sm  text-red-600 bg-red-50 px-2 py-1 ">
                        -{product.discount}%
                      </span>
                    </>
                  ) : (
                    <span className="text-3xl font-bold text-gray-900">
                      {product.price.toFixed(3)} DT
                    </span>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="prose prose-gray  text-xs  border-b border-gray-200">
                <p className="text-gray-600 leading-relaxed text-base">
                  {product.description}
                </p>
              </div>

              {/* Color Selection */}
              {categoryColors.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-semibold text-gray-900">
                      Select Color
                    </h3>
                    {selectedColor && (
                      <span className="text-sm text-gray-500">
                        Selected:{" "}
                        {
                          categoryColors.find((c) => c.color === selectedColor)
                            ?.name
                        }
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {categoryColors.map((colorObj) => (
                      <button
                        key={colorObj.color}
                        onClick={() => setSelectedColor(colorObj.color)}
                        className={`group relative w-8 h-8 rounded-full border-3 transition-all duration-200 hover:scale-110 hover:shadow-lg ${
                          selectedColor === colorObj.color
                            ? "border-black shadow-lg ring-0.5 ring-black ring-opacity-20 scale-110"
                            : "border-gray-300 hover:border-gray-500"
                        }`}
                        style={{ backgroundColor: colorObj.color }}
                        title={colorObj.name}
                      >
                        {selectedColor === colorObj.color && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <svg
                              className="w-5 h-5 text-white drop-shadow-lg"
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

              {/* Size Selection */}
              {categorySizes.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-semibold text-gray-900">
                      Choose Size
                    </h3>
                    {selectedSize && (
                      <span className="text-sm text-gray-500">
                        Selected: {selectedSize}
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                    {categorySizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`py-2 px-2  font-semibold text-sm transition-all duration-200  hover:border-gray-400 hover:scale-105 ${
                          selectedSize === size
                            ? "border-black bg-black text-white shadow-lg transform scale-105"
                            : "bg-gray-100 text-gray-900 border-gray-200 hover:bg-gray-50"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Add to Cart Section */}
              <div className="space-y-6 ">
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  {/* Quantity Selector */}
                  <div className="flex items-center border border-gray-300  bg-[#F0F0F0]">
                    <button
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= 1}
                      className="w-10 h-10 flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed rounded-l-lg"
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
                    <span className="w-10 h-10 flex items-center justify-center font-semibold text-lg">
                      {quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(1)}
                      disabled={quantity >= (product.stock || 99)}
                      className="w-10 h-10 flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed rounded-r-lg"
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

                  {/* Add to Cart Button */}
                  <button
                    disabled={isAddToCartDisabled}
                    onClick={handleAddToCart}
                    className={`flex-1 w-full py-2 px-8 text-lg font-semibold transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]  shadow-lg hover:shadow-xl ${
                      !isAddToCartDisabled
                        ? "bg-black text-white hover:bg-gray-800 active:bg-gray-900 cursor-pointer"
                        : "bg-gray-400 text-gray-200 cursor-not-allowed"
                    }`}
                  >
                    {getAddToCartText()}
                  </button>
                </div>

                {/* Stock Info */}
                {product.stock && (
                  <p className="text-sm text-gray-600 text-center">
                    {product.stock > 10
                      ? `${product.stock} items available`
                      : product.stock > 0
                      ? `Only ${product.stock} left in stock`
                      : "Out of stock"}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
