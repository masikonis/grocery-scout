import { GroceryDeal } from "@/types";

export interface ScraperConfig {
  baseUrl: string;
  selectors: {
    container: string;      // Main deals container
    productCard: string;    // Individual deal card
    name: string;          // Product name
    price: string;         // Current price
    originalPrice: string; // Original price
    image: string;         // Product image
  };
}

export interface ScraperResult {
  deals: GroceryDeal[];
  errors?: string[];
}