"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Store, Tags, SortAsc } from "lucide-react";

interface FilterBarProps {
  stores: string[];
  categories: string[];
  selectedStore: string | null;
  selectedCategory: string | null;
  sortBy: string;
  onStoreChange: (store: string | null) => void;
  onCategoryChange: (category: string | null) => void;
  onSortChange: (sort: string) => void;
}

export function FilterBar({
  stores,
  categories,
  selectedStore,
  selectedCategory,
  sortBy,
  onStoreChange,
  onCategoryChange,
  onSortChange,
}: FilterBarProps) {
  const sortOptions = [
    { value: "savings", label: "Highest Savings" },
    { value: "price", label: "Lowest Price" }
  ];

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-8">
      <Select 
        value={selectedStore ?? "all"} 
        onValueChange={(v) => onStoreChange(v === "all" ? null : v)}
      >
        <SelectTrigger className="w-full md:w-[200px]">
          <Store className="mr-2 h-4 w-4" />
          <SelectValue placeholder="All Stores" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Stores</SelectItem>
          {stores.map((store) => (
            <SelectItem key={store} value={store}>
              {store}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select 
        value={selectedCategory ?? "all"} 
        onValueChange={(v) => onCategoryChange(v === "all" ? null : v)}
      >
        <SelectTrigger className="w-full md:w-[200px]">
          <Tags className="mr-2 h-4 w-4" />
          <SelectValue placeholder="All Categories" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>
          {categories.map((category) => (
            <SelectItem key={category} value={category}>
              {category}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={sortBy} onValueChange={onSortChange}>
        <SelectTrigger className="w-full md:w-[200px]">
          <SortAsc className="mr-2 h-4 w-4" />
          <SelectValue placeholder="Sort By" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="savings">Highest Savings</SelectItem>
          <SelectItem value="price">Lowest Price</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}