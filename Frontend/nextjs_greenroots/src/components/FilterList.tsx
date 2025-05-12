"use client";

import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useEffect, useState } from "react";
import { fetchCategories } from "@/utils/functions/filter.function";

interface Category {
  name: string;
  id: number;
  checked: boolean;
}

interface FilterListProps {
  onCategoryChange?: (categoriesId: number[]) => boolean;
  onPriceChange?: (min: number, max: number) => void;
}

export default function FilterList({
  onCategoryChange,
  onPriceChange,
}: FilterListProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesSelected, setCategoriesSelected] = useState<number[]>([]);

  // Fetch des categories pour leurs noms au montage du composant
  const fetchCategoriesName= async () => {
    const data = await fetchCategories();
    setCategories(data);
  };

  useEffect(() => {
    if (categories.length === 0) {
      fetchCategoriesName();
    }
  }, []);

  const priceRanges = [
    "Moins de 30€",
    "30€ à 100€",
    "100€ à 150€",
    "150€ à 500€",
    "500€ à 10000€",
  ];
  useEffect(() => {
    setCategories(categories);
  }, [categories]);

  // Appel de la fonction onCategoryChange pour notifier le parent des catégories sélectionnées
  const handleCategoryChange = (categoryId: number, isChecked: boolean) => {
    const updated = categories.map((cat) =>
      cat.id === categoryId ? { ...cat, checked: isChecked } : cat
    );
    setCategories(updated);
    const selectedIds = updated.filter((c) => c.checked).map((c) => c.id);
    setCategoriesSelected(selectedIds);
    onCategoryChange?.(selectedIds);
  };

  return (
    <div className="w-full max-w-sm space-y-8 p-4 rounded-xs border border-gray-200 shadow-xs overflow-hidden">
      {/* Catégories */}
      <div className="space-y-4">
        <h3 className="font-semibold text-lg flex items-center justify-between">
          Catégories
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
            <path
              d="M19 9l-7 7-7-7"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </h3>
        <div>
          {categories.map((category) => {
            const inputId = `category-${category.id}`;
            return (
              <div key={category.id} className="flex items-center space-x-2 space-y-2">
                <Checkbox
                  id={inputId}
                  checked={category.checked}
                  // onCheckedChange édite le checked auto, mais on peut aussi utiliser onClick
                  onCheckedChange={(checked) =>
                    handleCategoryChange(category.id, !!checked)
                  }
                  // onClick={() => handleCategoryChange(category.id)}
                />
                <label
                  htmlFor={inputId}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {category.name}
                </label>
              </div>
            );
          })}
        </div>
      </div>

      {/* Prix */}
      <div className="space-y-4">
        <h3 className="font-semibold text-lg flex items-center justify-between">
          Prix
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
            <path
              d="M19 9l-7 7-7-7"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </h3>
        <div className="space-y-2">
          {priceRanges.map((range) => (
            <div key={range} className="flex items-center space-x-2">
              <Checkbox id={range} />
              <label
                htmlFor={range}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {range}
              </label>
            </div>
          ))}
        </div>
        <div className="flex space-x-2">
          <Input type="number" placeholder="300" className="w-24" />
          <span className="text-gray-500">à</span>
          <Input type="number" placeholder="3500" className="w-24" />
        </div>
      </div>

      {/* Taille */}
      <div>
        <h3 className="font-semibold text-lg flex items-center justify-between">
          Taille
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
            <path
              d="M19 9l-7 7-7-7"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </h3>
      </div>
    </div>
  );
}
