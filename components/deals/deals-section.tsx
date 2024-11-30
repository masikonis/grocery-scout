"use client";

import { useRef, useCallback } from 'react';
import { GroceryDeal } from '@/types';
import { DealsGrid } from './deals-grid';
import { LoadingGrid } from './loading-grid';
import { useInfiniteDeals } from '@/lib/hooks/use-infinite-deals';
import { Loader2 } from 'lucide-react';

interface DealsSectionProps {
  deals: GroceryDeal[];
  selectedDeals: Set<string>;
  selectedStore: string | null;
  selectedCategory: string | null;
  sortBy: string;
  onDealSelect: (dealId: string) => void;
}

export function DealsSection({
  deals,
  selectedDeals,
  selectedStore,
  selectedCategory,
  sortBy,
  onDealSelect,
}: DealsSectionProps) {
  const { displayedDeals, hasMore, loadMore, isInitialLoading } = useInfiniteDeals(
    deals,
    selectedStore,
    selectedCategory,
    sortBy
  );

  const observer = useRef<IntersectionObserver>();
  const lastDealElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (observer.current) observer.current.disconnect();
      
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMore();
        }
      });

      if (node) observer.current.observe(node);
    },
    [hasMore, loadMore]
  );

  if (isInitialLoading) {
    return <LoadingGrid />;
  }

  if (displayedDeals.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-muted-foreground">
          No deals found. Try adjusting your filters.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <DealsGrid
        deals={displayedDeals}
        selectedDeals={selectedDeals}
        onDealSelect={onDealSelect}
        lastDealRef={lastDealElementRef}
      />
      
      {hasMore && (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      )}
    </div>
  );
}