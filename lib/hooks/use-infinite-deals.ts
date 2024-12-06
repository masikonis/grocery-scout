"use client";

import { useState, useEffect } from 'react';
import { GroceryDeal } from '@/types';

export function useInfiniteDeals(
  deals: GroceryDeal[],
  selectedStore: string | null,
  sortBy: string,
  pageSize: number = 12
) {
  const [displayedDeals, setDisplayedDeals] = useState<GroceryDeal[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  // Filter and sort deals
  const filteredDeals = deals
    .filter((deal) => !selectedStore || deal.store === selectedStore)
    .sort((a, b) => {
      if (sortBy === 'highest-savings') {
        const savingsA = a.originalPrice - a.price;
        const savingsB = b.originalPrice - b.price;
        return savingsB - savingsA;  // Sort highest dollar savings first
      }
      if (sortBy === 'biggest-discount') {
        const discountA = ((a.originalPrice - a.price) / a.originalPrice) * 100;
        const discountB = ((b.originalPrice - b.price) / b.originalPrice) * 100;
        return discountB - discountA;  // Sort highest percentage discount first
      }
      return a.price - b.price; // Default 'price' sorting
    });

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
    setDisplayedDeals(filteredDeals.slice(0, pageSize));
    setIsInitialLoading(false);
  }, [selectedStore, sortBy, deals, pageSize]);

  const loadMore = () => {
    const nextDeals = filteredDeals.slice(0, (currentPage + 1) * pageSize);
    setDisplayedDeals(nextDeals);
    setCurrentPage(prev => prev + 1);
  };

  const hasMore = displayedDeals.length < filteredDeals.length;

  return {
    displayedDeals,
    hasMore,
    loadMore,
    isInitialLoading,
  };
}