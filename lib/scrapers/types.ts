import { GroceryDeal } from "@/types";

export interface ScraperConfig {
  baseUrl: string;
  selectors: {
    container: string;
    productCard: string;
    name: string;
    currentPrice: {
      euro: string;
      cents: string;
    };
    originalPrice: {
      standard: string;
      alternate: string;
    };
    image: string;
  };
}

export interface ScraperResult {
  deals: GroceryDeal[];
  errors?: string[];
}