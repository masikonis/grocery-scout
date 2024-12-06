"use client";

import { useState, useEffect } from "react";
import { GroceryDeal } from "@/types";
import { deals as dummyDeals } from "@/lib/data";
import { SelectedItems } from "@/components/shopping-list/selected-items";
import { FilterBar } from "@/components/filters/filter-bar";
import { DealsSection } from "@/components/deals/deals-section";
import { WhyChooseSection } from "@/components/features/why-choose";

export default function Home() {
  const [deals, setDeals] = useState<GroceryDeal[]>(dummyDeals);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDeals, setSelectedDeals] = useState<Set<string>>(new Set());
  const [selectedStore, setSelectedStore] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState("savings");

  useEffect(() => {
    async function fetchDeals() {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch('/api/deals', {
          headers: {
            'Accept': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch deals');
        }
        
        const data = await response.json();
        if (!data.deals || !Array.isArray(data.deals)) {
          throw new Error('Invalid data format received');
        }
        
        setDeals(data.deals);
      } catch (error) {
        console.error('Error fetching deals:', error);
        setDeals(dummyDeals);
        setError('Using offline data - could not fetch latest deals!');
      } finally {
        setIsLoading(false);
      }
    }

    fetchDeals();
  }, []);

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
  const selectedDealItems = deals.filter((deal) => selectedDeals.has(deal.id));

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading deals...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <img src="/images/logo.png" alt="Grocery Scout Logo" className="h-16 w-auto" />
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Save Smart. Shop Healthy. Live Well.
          </p>
          {error && (
            <div className="mt-4 p-2 bg-yellow-50 text-yellow-700 rounded-md text-sm">
              {error}
            </div>
          )}
        </header>

        <FilterBar
          stores={stores}
          selectedStore={selectedStore}
          sortBy={sortBy}
          onStoreChange={setSelectedStore}
          onSortChange={setSortBy}
        />

        <DealsSection
          deals={deals}
          selectedDeals={selectedDeals}
          selectedStore={selectedStore}
          sortBy={sortBy}
          onDealSelect={handleDealSelect}
        />

        <SelectedItems
          selectedDeals={selectedDealItems}
          onRemoveItem={handleDealSelect}
        />

        <WhyChooseSection />
      </div>
    </main>
  );
}