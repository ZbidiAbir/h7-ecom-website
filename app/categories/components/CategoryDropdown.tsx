// components/category/CategoryDropdown.tsx
"use client";

import { useState } from "react";
import { ChevronRight, ChevronDown } from "lucide-react";

export interface Category {
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

export function CategoryDropdown({
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
    <div
      className={`w-full bg-white rounded-lg border border-gray-200 ${className}`}
    >
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
