"use client";

import { useState } from "react";
import { deals } from "@/lib/data";
import { SelectedItems } from "@/components/shopping-list/selected-items";
import { FilterBar } from "@/components/filters/filter-bar";
import { DealsSection } from "@/components/deals/deals-section";
import { Leaf } from "lucide-react";

export default function Home() {
  const [selectedDeals, setSelectedDeals] = useState<Set<string>>(new Set());
  const [selectedStore, setSelectedStore] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState("savings");

  const handleDealSelect = (dealId: string) => {
    setSelectedDeals((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(dealId)) {
        newSet.delete(dealId);
      } else {
        newSet.add(dealId);
      }
      return newSet;
    });
  };

  const stores = Array.from(new Set(deals.map((deal) => deal.store)));
  const categories = Array.from(new Set(deals.map((deal) => deal.category)));
  const selectedDealItems = deals.filter((deal) => selectedDeals.has(deal.id));

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Leaf className="h-8 w-8 text-green-600" />
            <h1 className="text-4xl font-bold">Grocery Scout</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Your smart shopping companion. Find the best grocery deals and save money
            on your favorite products, all in one place.
          </p>
        </header>

        <FilterBar
          stores={stores}
          categories={categories}
          selectedStore={selectedStore}
          selectedCategory={selectedCategory}
          sortBy={sortBy}
          onStoreChange={setSelectedStore}
          onCategoryChange={setSelectedCategory}
          onSortChange={setSortBy}
        />

        <DealsSection
          deals={deals}
          selectedDeals={selectedDeals}
          selectedStore={selectedStore}
          selectedCategory={selectedCategory}
          sortBy={sortBy}
          onDealSelect={handleDealSelect}
        />

        <SelectedItems
          selectedDeals={selectedDealItems}
          onRemoveItem={handleDealSelect}
        />
      </div>
    </main>
  );
}