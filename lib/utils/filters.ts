import { GroceryDeal } from "@/types";

export function filterDealsByStore(deals: GroceryDeal[], store: string | null): GroceryDeal[] {
  if (!store) return deals;
  return deals.filter((deal) => deal.store === store);
}

export function filterDealsByCategory(deals: GroceryDeal[], category: string | null): GroceryDeal[] {
  if (!category) return deals;
  return deals.filter((deal) => deal.category === category);
}

export function sortDeals(deals: GroceryDeal[], sortBy: string): GroceryDeal[] {
  return [...deals].sort((a, b) => {
    switch (sortBy) {
      case "savings":
        const aSavings = a.originalPrice - a.price;
        const bSavings = b.originalPrice - b.price;
        return bSavings - aSavings;
      case "price":
        return a.price - b.price;
      default:
        return 0;
    }
  });
}