"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Store, SortAsc } from "lucide-react";

interface FilterBarProps {
  stores: string[];
  selectedStore: string | null;
  sortBy: string;
  onStoreChange: (store: string | null) => void;
  onSortChange: (sort: string) => void;
}

export function FilterBar({
  stores,
  selectedStore,
  sortBy,
  onStoreChange,
  onSortChange,
}: FilterBarProps) {
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