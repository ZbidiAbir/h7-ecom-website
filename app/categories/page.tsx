"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronRight,
  ChevronDown,
  ChevronLeft,
  ChevronRightIcon,
} from "lucide-react";
import { Slider } from "@/components/ui/slider";
import HeaderWrapper from "@/components/HeaderWrapper";
import { FiShoppingCart } from "react-icons/fi";

// Composant CategoryDropdown
interface Category {
  id: string;
  name: string;
  parent?: { id: string; name: string };
  sizes?: { size: string }[];
  colors?: { color: string }[];
  subcategories?: Category[];
}

interface CategoryDropdownProps {
  categories: Category[];
  onCategorySelect: (type: "parent" | "sub" | "all", value: string) => void;
  selectedCategory?: string;
  className?: string;
}

function CategoryDropdown({
  categories,
  onCategorySelect,
  selectedCategory,
  className = "",
}: CategoryDropdownProps) {
  const parentCategories = Array.from(
    new Set(
      categories
        .map((cat) => cat.parent?.name)
        .filter((name): name is string => !!name)
    )
  );

  const [openParent, setOpenParent] = useState<string | null>(null);

  const handleParentClick = (parent: string) => {
    setOpenParent((prev) => (prev === parent ? null : parent));
  };

  const handleSubClick = (subId: string) => {
    const sub = categories.find((cat) => cat.id === subId);
    onCategorySelect("sub", subId);
  };

  return (
    <div className={`w-full bg-white border border-gray-200 ${className}`}>
      <ul className="divide-y divide-gray-100">
        {parentCategories.map((parent) => {
          const subCategories = categories.filter(
            (cat) => cat.parent?.name === parent
          );

          const isOpen = openParent === parent;

          return (
            <li key={parent}>
              <div
                onClick={() => handleParentClick(parent)}
                className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <span className="text-sm font-medium text-gray-800">
                  {parent}
                </span>
                {isOpen ? (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                )}
              </div>

              {isOpen && (
                <ul className="bg-gray-50">
                  {subCategories.map((sub) => (
                    <li
                      key={sub.id}
                      onClick={() => handleSubClick(sub.id)}
                      className={`flex items-center justify-between p-3 pl-6 cursor-pointer hover:bg-gray-100 transition-colors ${
                        selectedCategory === sub.id
                          ? "bg-gray-100 text-blue-600"
                          : "text-gray-700"
                      }`}
                    >
                      <span className="text-sm">{sub.name}</span>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

// Fonctions utilitaires pour extraire les couleurs et tailles
const getAvailableColors = (categories: Category[] = []) => {
  const colors = new Set<string>();

  categories.forEach((category) => {
    // Couleurs de la catégorie
    category.colors?.forEach((c) => {
      if (c.color) colors.add(c.color.toLowerCase());
    });

    // Couleurs des sous-catégories
    category.subcategories?.forEach((sub) => {
      sub.colors?.forEach((c) => {
        if (c.color) colors.add(c.color.toLowerCase());
      });
    });
  });

  return Array.from(colors).sort();
};

const getAvailableSizes = (items: any[], categories: Category[] = []) => {
  const sizes = new Set<string>();

  // Tailles provenant des produits
  items.forEach((item) => {
    item.sizes?.forEach((sizeObj: any) => {
      sizes.add(sizeObj.size);
    });
  });

  // Tailles provenant des catégories
  categories.forEach((cat) => {
    cat.sizes?.forEach((sizeObj) => {
      sizes.add(sizeObj.size);
    });
  });

  return Array.from(sizes).sort();
};

// Fonction pour obtenir les tailles de la catégorie sélectionnée
const getCategorySizes = (selectedCategory: Category | null): string[] => {
  if (!selectedCategory) return [];

  const sizes = new Set<string>();

  // Ajouter les tailles de la catégorie principale
  selectedCategory.sizes?.forEach((sizeObj) => {
    if (sizeObj.size) sizes.add(sizeObj.size);
  });

  // Ajouter les tailles des sous-catégories
  selectedCategory.subcategories?.forEach((sub) => {
    sub.sizes?.forEach((sizeObj) => {
      if (sizeObj.size) sizes.add(sizeObj.size);
    });
  });

  return Array.from(sizes).sort();
};

// Composant principal
export default function CombinedCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [allUniqueProducts, setAllUniqueProducts] = useState<any[]>([]);
  const [displayMode, setDisplayMode] = useState<"unique" | "all">("unique");
  const [loading, setLoading] = useState({
    categories: true,
    products: false,
    allProducts: true,
  });
  const [error, setError] = useState<string | null>(null);

  // États pour les filtres
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [availableColors, setAvailableColors] = useState<string[]>([]);
  const [availableSizes, setAvailableSizes] = useState<string[]>([]);

  // États pour la pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);

  // Fonction pour obtenir les tailles disponibles basées sur le contexte
  // Fonction pour obtenir les tailles disponibles basées sur le contexte
  const getContextualSizes = (): string[] => {
    // Si une catégorie est sélectionnée, utiliser SES tailles seulement
    if (selectedCategory) {
      return getCategorySizes(selectedCategory);
    }

    // Si aucune catégorie n'est sélectionnée, ne retourner AUCUNE taille
    return [];
  };

  // Fonction pour obtenir les produits paginés
  const getPaginatedProducts = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return products.slice(startIndex, endIndex);
  };

  // Fonction pour changer de page
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll vers le haut quand on change de page
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Calcul du nombre total de pages
  const totalPages = Math.ceil(products.length / itemsPerPage);

  // Générer les numéros de page à afficher
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    // Ajuster si on est près de la fin
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  // Fonction pour obtenir les produits uniques
  const getUniqueProducts = (products: any[]) => {
    const uniqueProductsByColor: Record<string, any> = {};

    products.forEach((product) => {
      if (product.colors && product.colors.length > 0) {
        product.colors.forEach((colorObj: any) => {
          const color = colorObj.color.toLowerCase();
          const productKey = `${product.id}-${color}`;

          if (!uniqueProductsByColor[productKey]) {
            uniqueProductsByColor[productKey] = {
              ...product,
              colors: [colorObj],
              uniqueId: productKey,
            };
          }
        });
      } else {
        const productKey = `no-color-${product.id}`;
        if (!uniqueProductsByColor[productKey]) {
          uniqueProductsByColor[productKey] = {
            ...product,
            uniqueId: productKey,
          };
        }
      }
    });

    return Object.values(uniqueProductsByColor);
  };

  // Fonction pour appliquer les filtres
  const applyFilters = (productsToFilter: any[]) => {
    return productsToFilter.filter((product) => {
      // Filtre par prix
      const productPrice = product.price || 0;
      if (productPrice < priceRange[0] || productPrice > priceRange[1]) {
        return false;
      }

      // Filtre par couleurs
      if (selectedColors.length > 0) {
        const productColors =
          product.colors?.map((c: any) => c.color.toLowerCase()) || [];
        const hasSelectedColor = selectedColors.some((color) =>
          productColors.includes(color.toLowerCase())
        );
        if (!hasSelectedColor) {
          return false;
        }
      }

      // Filtre par tailles
      if (selectedSizes.length > 0) {
        const productSizes = [
          ...product.sizes?.map((s: any) => s.size),
          ...product.category?.sizes?.map((s: any) => s.size),
        ];
        const hasSelectedSize = selectedSizes.some((size) =>
          productSizes.includes(size)
        );
        if (!hasSelectedSize) {
          return false;
        }
      }

      return true;
    });
  };

  // Gestion de la sélection de catégorie depuis le dropdown
  const handleCategoryDropdownSelect = (
    type: "parent" | "sub" | "all",
    value: string
  ) => {
    if (type === "sub") {
      const category = categories.find((cat) => cat.id === value);
      if (category) {
        setSelectedCategory(category);
        // Réinitialiser les sélections
        setSelectedSizes([]);
        setSelectedColors([]);
        setCurrentPage(1); // Reset à la première page
      }
    }
  };

  // Mettre à jour les filtres disponibles quand les produits changent
  useEffect(() => {
    let sourceProducts = selectedCategory
      ? products
      : displayMode === "unique"
      ? allUniqueProducts
      : allProducts;

    setAvailableColors(getAvailableColors(categories));
    setAvailableSizes(getAvailableSizes(sourceProducts, categories));
  }, [
    products,
    selectedCategory,
    displayMode,
    allUniqueProducts,
    allProducts,
    categories,
  ]);

  // Réinitialiser la pagination quand les filtres changent
  useEffect(() => {
    setCurrentPage(1);
  }, [
    selectedCategory,
    displayMode,
    priceRange,
    selectedColors,
    selectedSizes,
  ]);

  // Chargement des données initiales
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Charger les catégories
        const categoriesRes = await fetch("/api/categories");
        const categoriesData = await categoriesRes.json();
        setCategories(categoriesData);

        // Charger tous les produits
        const productsRes = await fetch("/api/unique");
        const productsData = await productsRes.json();
        const productsArray = productsData.products || productsData || [];

        setAllProducts(productsArray);

        // Obtenir les produits uniques
        const uniqueProducts = getUniqueProducts(productsArray);
        setAllUniqueProducts(uniqueProducts);
        setProducts(uniqueProducts);

        // Extraire les couleurs et tailles disponibles
        const colors = getAvailableColors(productsArray);
        const sizes = getAvailableSizes(productsArray);
        setAvailableColors(colors);
        setAvailableSizes(sizes);

        // Calculer la plage de prix maximale
        const prices = productsArray.map((p: any) => p.price || 0);
        const maxPrice = Math.ceil(Math.max(...prices, 1000));
        setPriceRange([0, maxPrice]);
      } catch (error) {
        console.error("Error fetching initial data:", error);
        setError("Erreur lors du chargement des données");
      } finally {
        setLoading((prev) => ({
          ...prev,
          categories: false,
          allProducts: false,
        }));
      }
    };
    fetchInitialData();
  }, []);

  // Charger les produits quand la catégorie ou le mode d'affichage change
  useEffect(() => {
    if (!selectedCategory) {
      let baseProducts =
        displayMode === "unique" ? allUniqueProducts : allProducts;
      setProducts(applyFilters(baseProducts));
      return;
    }

    const fetchCategoryProducts = async () => {
      try {
        setLoading((prev) => ({ ...prev, products: true }));
        setError(null);

        const endpoint =
          displayMode === "unique"
            ? `/api/categories/${selectedCategory.id}/unique-products`
            : `/api/categories/${selectedCategory.id}/products`;

        const res = await fetch(endpoint);

        if (!res.ok) {
          throw new Error(`Erreur ${res.status}: ${res.statusText}`);
        }

        const data = await res.json();
        const fetchedProducts = data.products || data || [];
        setProducts(applyFilters(fetchedProducts));
      } catch (error) {
        console.error("Erreur lors du chargement des produits:", error);
        setError("Impossible de charger les produits de cette catégorie");
      } finally {
        setLoading((prev) => ({ ...prev, products: false }));
      }
    };

    fetchCategoryProducts();
  }, [selectedCategory, displayMode, allUniqueProducts, allProducts]);

  // Appliquer les filtres quand ils changent
  useEffect(() => {
    if (selectedCategory) {
      const fetchWithFilters = async () => {
        try {
          setLoading((prev) => ({ ...prev, products: true }));
          const endpoint =
            displayMode === "unique"
              ? `/api/categories/${selectedCategory.id}/unique-products`
              : `/api/categories/${selectedCategory.id}/products`;

          const res = await fetch(endpoint);
          const data = await res.json();
          const fetchedProducts = data.products || data || [];
          setProducts(applyFilters(fetchedProducts));
        } catch (error) {
          console.error("Erreur lors du filtrage:", error);
        } finally {
          setLoading((prev) => ({ ...prev, products: false }));
        }
      };
      fetchWithFilters();
    } else {
      let baseProducts =
        displayMode === "unique" ? allUniqueProducts : allProducts;
      setProducts(applyFilters(baseProducts));
    }
  }, [priceRange, selectedColors, selectedSizes]);

  // Fonctions d'affichage
  const showAllProducts = () => {
    setDisplayMode("all");
    setSelectedCategory(null);
    setSelectedSizes([]);
    setSelectedColors([]);
    setCurrentPage(1);
    setProducts(applyFilters(allProducts));
  };

  const showAllUniqueProducts = () => {
    setDisplayMode("unique");
    setSelectedCategory(null);
    setSelectedSizes([]);
    setSelectedColors([]);
    setCurrentPage(1);
    setProducts(applyFilters(allUniqueProducts));
  };

  const handleClearCategory = () => {
    setSelectedCategory(null);
    setSelectedSizes([]);
    setSelectedColors([]);
    setCurrentPage(1);
    showAllUniqueProducts();
  };

  // Fonctions pour les filtres
  const handlePriceRangeChange = (min: number, max: number) => {
    setPriceRange([min, max]);
  };

  const handleColorToggle = (color: string) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
  };

  const handleSizeToggle = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const clearAllFilters = () => {
    setPriceRange([
      0,
      Math.ceil(Math.max(...allProducts.map((p: any) => p.price || 0), 1000)),
    ]);
    setSelectedColors([]);
    setSelectedSizes([]);
    setCurrentPage(1);
    handleClearCategory();
  };

  const maxPrice = Math.ceil(
    Math.max(...allProducts.map((p: any) => p.price || 0), 1000)
  );

  // Vérifier si des filtres sont actifs
  const hasActiveFilters =
    priceRange[0] > 0 ||
    priceRange[1] < maxPrice ||
    selectedColors.length > 0 ||
    selectedSizes.length > 0;

  if (loading.categories || loading.allProducts) {
    return (
      <div className="min-h-screen bg-white  py-8 px-4 sm:px-6 lg:px-36">
        <div className=" ">
          <div className="text-center mb-12">
            <div className="h-8 bg-gray-200 rounded w-48 mx-auto mb-4 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-96 mx-auto animate-pulse"></div>
          </div>

          <div className="flex gap-8">
            <div className="w-80 bg-white rounded-2xl shadow-lg p-6 animate-pulse">
              <div className="h-6  rounded w-32 mb-6"></div>
              {[...Array(6)].map((_, index) => (
                <div key={index} className="mb-4">
                  <div className="h-5 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                </div>
              ))}
            </div>

            <div className="flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-2xl shadow-lg animate-pulse"
                  >
                    <div className="bg-gray-200 h-60 rounded-t-2xl"></div>
                    <div className="p-4">
                      <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-24">
      <div className=" mx-auto">
        {/* Header */}
        <HeaderWrapper />

        {error && (
          <div className="mb-8 bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
            <p className="text-red-600">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-3 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Reload
            </button>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8 py-24">
          {/* Sidebar */}
          <div className="lg:w-80">
            {/* Dropdown pour mobile */}
            <div className="lg:hidden mb-6">
              <label
                htmlFor="category-select"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Filter by category
              </label>
              <select
                id="category-select"
                value={selectedCategory?.id || "all"}
                onChange={(e) => {
                  if (e.target.value === "all") {
                    showAllUniqueProducts();
                  } else if (e.target.value === "all-products") {
                    showAllProducts();
                  } else {
                    const category = categories.find(
                      (cat) => cat.id === e.target.value
                    );
                    if (category) {
                      setSelectedCategory(category);
                      setSelectedSizes([]);
                      setSelectedColors([]);
                      setCurrentPage(1);
                    }
                  }
                }}
                className="w-full p-3 border border-gray-300 rounded-2xl bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all-products">Tous les produits</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>

              <div className="mt-4 flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={showAllUniqueProducts}
                  className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${
                    displayMode === "unique"
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  Uniques
                </button>
                <button
                  onClick={showAllProducts}
                  className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${
                    displayMode === "all"
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  Tous
                </button>
              </div>
            </div>

            {/* Sidebar desktop */}
            <div className="hidden lg:block bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-bold text-gray-800">Filters</h2>
                {hasActiveFilters && (
                  <button
                    onClick={clearAllFilters}
                    className="mt-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Effacer tous les filtres
                  </button>
                )}
              </div>
              <div>
                <div className="p-4 border-b border-gray-100 bg-gray-50"></div>

                {/* Utilisation du CategoryDropdown */}
                <CategoryDropdown
                  categories={categories}
                  onCategorySelect={handleCategoryDropdownSelect}
                  selectedCategory={selectedCategory?.id}
                />
              </div>
              {/* Filtre par prix */}
              <div className="p-6 border-b border-gray-100">
                <h3 className="font-semibold text-gray-800 mb-4">Price</h3>
                <div className="space-y-4">
                  <div>
                    <Slider
                      defaultValue={[0, maxPrice]}
                      value={[priceRange[0], priceRange[1]]}
                      max={maxPrice}
                      step={1}
                      onValueChange={(value) =>
                        handlePriceRangeChange(value[0], value[1])
                      }
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-600 mt-2">
                      <span>0 dt</span>
                      <span>{maxPrice} dt</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Filtre par couleurs */}
              {availableColors.length > 0 && (
                <div className="p-6 border-b border-gray-100">
                  <h3 className="font-semibold text-gray-800 mb-4">Colors</h3>
                  <div className="flex flex-wrap gap-3 overflow-y-auto py-2">
                    {availableColors.map((color) => {
                      const isSelected = selectedColors.includes(color);
                      return (
                        <div
                          key={color}
                          onClick={() => handleColorToggle(color)}
                          className={`w-8 h-8 rounded-full border-2 cursor-pointer transition 
              ${
                isSelected
                  ? "border-black ring-2 ring-black"
                  : "border-gray-300"
              }`}
                          style={{ backgroundColor: color }}
                          title={color}
                        />
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Filtre par tailles - AFFICHER UNIQUEMENT POUR CATÉGORIE SÉLECTIONNÉE */}
              {selectedCategory && getContextualSizes().length > 0 && (
                <div className="p-6 border-b border-gray-100">
                  <h3 className="font-semibold text-gray-800 mb-4">Sizes</h3>
                  <div className="flex flex-wrap gap-2">
                    {getContextualSizes().map((size) => (
                      <label
                        key={size}
                        className="flex items-center cursor-pointer group"
                      >
                        <input
                          type="checkbox"
                          checked={selectedSizes.includes(size)}
                          onChange={() => handleSizeToggle(size)}
                          className="sr-only"
                        />
                        <div
                          className={`px-3 py-2   text-sm font-medium transition-all duration-200 capitalize ${
                            selectedSizes.includes(size)
                              ? "bg-black text-white border-black"
                              : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
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

            {/* Catégorie sélectionnée info (mobile) */}
            {selectedCategory && (
              <div className="lg:hidden mt-6 bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-3">
                  {selectedCategory.name}
                </h2>
                {selectedCategory.description && (
                  <p className="text-gray-600 mb-4">
                    {selectedCategory.description}
                  </p>
                )}
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  {selectedCategory.sizes?.length > 0 && (
                    <span>{selectedCategory.sizes.length} taille(s)</span>
                  )}
                  {selectedCategory.colors?.length > 0 && (
                    <span>{selectedCategory.colors.length} couleur(s)</span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Contenu principal - Produits */}
          <div className="flex-1">
            {loading.products ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(8)].map((_, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-2xl shadow-lg animate-pulse"
                  >
                    <div className="bg-gray-200 h-60 rounded-t-2xl"></div>
                    <div className="p-4">
                      <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                <div className="w-20 h-20 mx-auto mb-6 bg-white rounded-full flex items-center justify-center">
                  <span className="text-2xl text-gray-400">📦</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-3">
                  Aucun produit disponible
                </h3>
                <p className="text-gray-500 max-w-md mx-auto mb-6">
                  {selectedCategory
                    ? `Aucun produit n'est actuellement disponible dans la catégorie "${selectedCategory.name}" avec les filtres sélectionnés.`
                    : "Aucun produit n'est actuellement disponible avec les filtres sélectionnés."}
                </p>
                <button
                  onClick={clearAllFilters}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Effacer les filtres
                </button>
              </div>
            ) : (
              <>
                {/* En-tête des produits */}
                <div className="mb-6 flex items-center justify-end">
                  <div className="text-sm text-gray-600">
                    Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                    {Math.min(currentPage * itemsPerPage, products.length)} of{" "}
                    {products.length} Products{products.length > 1 ? "s" : ""}
                    {selectedCategory && ` dans ${selectedCategory.name}`}
                  </div>
                  {(selectedCategory || displayMode === "all") && (
                    <button
                      onClick={showAllUniqueProducts}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                      Refresh
                    </button>
                  )}
                </div>

                {/* Grid des produits PAGINÉS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  {getPaginatedProducts().map((product: any) => (
                    <Link
                      key={product.uniqueId || product.id}
                      href={`/products/${product.id}`}
                      className="group relative bg-white 
                        transition-all duration-300 overflow-hidden border border-gray-100 hover:border-gray-200"
                    >
                      {/* Image container */}
                      <div className="relative h-72 w-full overflow-hidden">
                        {product.images?.[0]?.url ? (
                          <Image
                            src={product.images[0].url}
                            alt={product.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                          />
                        ) : (
                          <div className="w-full h-full bg-white  flex items-center justify-center">
                            <span className="text-4xl text-gray-300">📦</span>
                          </div>
                        )}

                        {/* Overlay avec actions au hover */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />

                        {/* Badge de stock */}
                        <div className="absolute top-3 right-3">
                          <span
                            className={`text-xs px-2.5 py-1 rounded-full font-medium backdrop-blur-sm ${
                              product.stock > 10
                                ? "bg-green-500/10 text-green-700 border border-green-500/20"
                                : product.stock > 0
                                ? "bg-orange-500/10 text-orange-700 border border-orange-500/20"
                                : "bg-red-500/10 text-red-700 border border-red-500/20"
                            }`}
                          >
                            {product.stock > 10
                              ? "En stock"
                              : product.stock > 0
                              ? `${product.stock} restants`
                              : "Rupture"}
                          </span>
                        </div>

                        {/* Badge de promotion */}
                        {product.discount > 0 && (
                          <div className="absolute ">
                            <span className="bg-black text-white text-xs font-bold px-2.5 py-1">
                              -{product.discount}%
                            </span>
                          </div>
                        )}

                        {/* Indicateur de couleur */}
                        {product.colors?.length > 0 && (
                          <div className="absolute bottom-3 left-3 flex items-center gap-2">
                            <div className="flex items-center gap-1">
                              {product.colors
                                .slice(0, 2)
                                .map((color: any, index: any) => (
                                  <div
                                    key={index}
                                    className="w-5 h-5 rounded-full border-2 border-white shadow-sm"
                                    style={{ backgroundColor: color.color }}
                                    title={color.color}
                                  />
                                ))}
                            </div>
                            {product.colors.length > 2 && (
                              <span className="text-xs bg-black/80 text-white px-1.5 py-0.5 rounded-full backdrop-blur-sm">
                                +{product.colors.length - 2}
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Contenu du produit */}
                      <div className="p-4 space-y-3">
                        {/* Titre et rating */}
                        <div className="space-y-2">
                          <h3 className="font-semibold text-gray-900 line-clamp-2 leading-tight text-sm">
                            {product.name}
                          </h3>
                          <div className="flex items-center gap-1.5">
                            <div className="flex text-amber-400 text-sm">
                              {"★".repeat(4)}
                              <span className="text-gray-300">★</span>
                            </div>
                            <span className="text-xs text-gray-500">4.0/5</span>
                          </div>
                        </div>

                        {/* Prix et CTA */}
                        <div className="flex items-center justify-between pt-1">
                          <div className="flex items-baseline gap-2">
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

                          <Link href={`/products/${product.id}`}>
                            <button className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0  text-black p-2 rounded-full shadow-sm">
                              <FiShoppingCart />
                            </button>
                          </Link>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Composant de Pagination */}
                <div className="flex justify-between items-center space-x-2 mt-8">
                  {/* Bouton Précédent */}
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`p-2 rounded-lg border flex items-center gap-0.5 ${
                      currentPage === 1
                        ? "text-gray-400 border-gray-300 cursor-not-allowed"
                        : "text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400"
                    }`}
                  >
                    <ChevronLeft className="w-5 h-5" />
                    Previous
                  </button>

                  {/* Première page */}
                  {getPageNumbers()[0] > 1 && (
                    <>
                      <button
                        onClick={() => handlePageChange(1)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium border ${
                          currentPage === 1
                            ? "bg-gray-600 text-white border-gray-600"
                            : "text-gray-700 border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        1
                      </button>
                      {getPageNumbers()[0] > 2 && (
                        <span className="px-2 text-gray-500">...</span>
                      )}
                    </>
                  )}

                  {/* Pages numérotées */}
                  <div className="flex items-center gap-2">
                    {getPageNumbers().map((page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-3 py-2 text-sm font-medium  ${
                          currentPage === page
                            ? "bg-[#0000000F] text-black "
                            : "text-[#00000080]  "
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>

                  {/* Dernière page */}
                  {getPageNumbers()[getPageNumbers().length - 1] <
                    totalPages && (
                    <>
                      {getPageNumbers()[getPageNumbers().length - 1] <
                        totalPages - 1 && (
                        <span className="px-2 text-gray-500">...</span>
                      )}
                      <button
                        onClick={() => handlePageChange(totalPages)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium border ${
                          currentPage === totalPages
                            ? "bg-gray-600 text-white border-gray-600"
                            : "text-gray-700 border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        {totalPages}
                      </button>
                    </>
                  )}

                  {/* Bouton Suivant */}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`p-2 rounded-lg border flex items-center gap-0.5 ${
                      currentPage === totalPages
                        ? "text-gray-400 border-gray-300 cursor-not-allowed"
                        : "text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400"
                    }`}
                  >
                    Next
                    <ChevronRightIcon className="w-5 h-5" />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
