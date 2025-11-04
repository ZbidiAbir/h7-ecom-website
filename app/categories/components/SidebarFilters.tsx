import { CategoryDropdown } from "./CategoryDropdown";
import { Slider } from "@/components/ui/slider";

interface SidebarFiltersProps {
  categories: any[];
  selectedCategory: any;
  products: any[];
  priceRange: [number, number];
  maxPrice: number;
  selectedColors: string[];
  selectedSizes: string[];
  availableColors: string[];
  availableSizes: string[];
  onCategorySelect: (type: any, value: string) => void;
  onPriceChange: (min: number, max: number) => void;
  onColorToggle: (color: string) => void;
  onSizeToggle: (size: string) => void;
  clearFilters: () => void;
}

const SidebarFilters = ({
  categories,
  selectedCategory,
  products,
  priceRange,
  maxPrice,
  selectedColors,
  selectedSizes,
  availableColors,
  availableSizes,
  onCategorySelect,
  onPriceChange,
  onColorToggle,
  onSizeToggle,
  clearFilters,
}: SidebarFiltersProps) => {
  const hasActiveFilters =
    priceRange[0] > 0 ||
    priceRange[1] < maxPrice ||
    selectedColors.length > 0 ||
    selectedSizes.length > 0;

  return (
    <div className="hidden lg:block bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-xl font-bold text-gray-800">Filtres</h2>
        <p className="text-sm text-gray-600 mt-1">
          {products.length} produit{products.length > 1 ? "s" : ""}
          {selectedCategory && ` dans ${selectedCategory.name}`}
        </p>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="mt-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Effacer tous les filtres
          </button>
        )}
      </div>

      <div>
        <div className="p-4 border-b border-gray-100 bg-gray-50">
          <h3 className="font-semibold text-gray-800">Catégories</h3>
        </div>
        <CategoryDropdown
          categories={categories}
          onCategorySelect={onCategorySelect}
          selectedCategory={selectedCategory?.id}
        />
      </div>

      <div className="p-6 border-b border-gray-100">
        <h3 className="font-semibold text-gray-800 mb-4">Prix</h3>
        <Slider
          defaultValue={[0, maxPrice]}
          value={[priceRange[0], priceRange[1]]}
          max={maxPrice}
          step={1}
          onValueChange={(value) => onPriceChange(value[0], value[1])}
          className="w-full"
        />
        <div className="flex justify-between text-sm text-gray-600 mt-2">
          <span>0 €</span>
          <span>{maxPrice} €</span>
        </div>
      </div>

      {availableColors.length > 0 && (
        <div className="p-6 border-b border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-4">
            Couleurs ({availableColors.length})
          </h3>
          <div className="flex flex-wrap gap-3 overflow-y-auto py-6">
            {availableColors.map((color) => (
              <div
                key={color}
                onClick={() => onColorToggle(color)}
                className={`w-8 h-8 rounded-full border-2 cursor-pointer transition ${
                  selectedColors.includes(color)
                    ? "border-black ring-2 ring-black"
                    : "border-gray-300"
                }`}
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
        </div>
      )}

      {availableSizes.length > 0 && (
        <div className="p-6 border-b border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-4">
            Tailles ({availableSizes.length})
          </h3>
          <div className="flex flex-wrap gap-2">
            {availableSizes.map((size) => (
              <label
                key={size}
                className="flex items-center cursor-pointer group"
              >
                <input
                  type="checkbox"
                  checked={selectedSizes.includes(size)}
                  onChange={() => onSizeToggle(size)}
                  className="sr-only"
                />
                <div
                  className={`px-3 py-2 border rounded-lg text-sm font-medium transition-all duration-200 ${
                    selectedSizes.includes(size)
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-700 border-gray-300 hover:border-blue-500 hover:text-blue-600"
                  }`}
                >
                  {size}
                </div>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
export default SidebarFilters;
