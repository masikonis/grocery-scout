"use client";

import { useState, useEffect } from 'react';
import { GroceryDeal } from '@/types';
import { filterDealsByStore, filterDealsByCategory, sortDeals } from '@/lib/utils/filters';

const ITEMS_PER_PAGE = 4;
const INITIAL_LOAD_DELAY = 500; // Simulate network delay

export function useInfiniteDeals(
  deals: GroceryDeal[],
  selectedStore: string | null,
  selectedCategory: string | null,
  sortBy: string
) {
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [displayedDeals, setDisplayedDeals] = useState<GroceryDeal[]>([]);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    // Reset pagination when filters change
    setPage(1);
    setDisplayedDeals([]);
    setHasMore(true);
    setIsInitialLoading(true);

    const timer = setTimeout(() => {
      let filteredDeals = deals;
      filteredDeals = filterDealsByStore(filteredDeals, selectedStore);
      filteredDeals = filterDealsByCategory(filteredDeals, selectedCategory);
      filteredDeals = sortDeals(filteredDeals, sortBy);

      const initialDeals = filteredDeals.slice(0, ITEMS_PER_PAGE);
      setDisplayedDeals(initialDeals);
      setHasMore(initialDeals.length < filteredDeals.length);
      setIsInitialLoading(false);
    }, INITIAL_LOAD_DELAY);

    return () => clearTimeout(timer);
  }, [deals, selectedStore, selectedCategory, sortBy]);

  useEffect(() => {
    if (page === 1) return;

    let filteredDeals = deals;
    filteredDeals = filterDealsByStore(filteredDeals, selectedStore);
    filteredDeals = filterDealsByCategory(filteredDeals, selectedCategory);
    filteredDeals = sortDeals(filteredDeals, sortBy);

    const totalItems = page * ITEMS_PER_PAGE;
    const newDeals = filteredDeals.slice(0, totalItems);
    
    setDisplayedDeals(newDeals);
    setHasMore(newDeals.length < filteredDeals.length);
  }, [deals, selectedStore, selectedCategory, sortBy, page]);

  const loadMore = () => {
    setPage((prev) => prev + 1);
  };

  return {
    displayedDeals,
    hasMore,
    loadMore,
    isInitialLoading,
  };
}