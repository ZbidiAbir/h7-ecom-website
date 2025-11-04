import Image from "next/image";
import Link from "next/link";

interface ProductCardProps {
  product: any;
}

export const ProductCard = ({ product }: ProductCardProps) => (
  <Link
    href={`/products/${product.id}`}
    className="group relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 overflow-hidden border border-gray-100"
  >
    <div className="relative h-60 w-full overflow-hidden rounded-t-2xl">
      {product.images?.[0]?.url ? (
        <Image
          src={product.images[0].url}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
          <span className="text-4xl text-gray-400 opacity-60">📦</span>
        </div>
      )}

      {/* Badge stock */}
      <div className="absolute top-3 right-3">
        <span
          className={`text-xs px-2 py-1 rounded-full ${
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

    <div className="p-4">
      <h3 className="font-bold text-lg text-gray-800 mb-2 line-clamp-1">
        {product.name}
      </h3>
      <span className="text-blue-600 font-bold text-lg">{product.price} €</span>
    </div>
  </Link>
);
