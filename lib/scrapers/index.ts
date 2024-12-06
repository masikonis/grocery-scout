import { GroceryDeal } from "@/types";
import { ScraperConfig, ScraperResult } from "./types";
import { maximaConfig } from "./maxima";
import axios from "axios";
import * as cheerio from "cheerio";

// Map of available scrapers
export const scrapers: Record<string, ScraperConfig> = {
  maxima: maximaConfig,
};

export async function scrapeDeals(store: string = "maxima"): Promise<ScraperResult> {
  try {
    // Get the config for the requested store
    const config = scrapers[store];
    if (!config) {
      throw new Error(`No scraper configuration found for store: ${store}`);
    }

    // Fetch the HTML content
    const response = await axios.get(config.baseUrl);
    const html = response.data;
    const $ = cheerio.load(html);

    const deals: GroceryDeal[] = [];
    const errors: string[] = [];

    // Find all product cards
    $(config.selectors.productCard).each((_, element) => {
      try {
        const $el = $(element);
        
        // Extract name
        const name = $el.find(config.selectors.name).text().trim();
        
        // Extract price (handling the special euro/cents case)
        const priceEur = $el.find('.price-eur').text().trim();
        const priceCents = $el.find('.price-cents').text().trim();
        const price = parseFloat(`${priceEur}.${priceCents}`);
        
        // Extract original price
        const originalPriceText = $el.find(config.selectors.originalPrice)
          .text()
          .replace(/[€\s]/g, '') // Remove € symbol and whitespace
          .replace(',', '.') // Replace comma with dot for decimal
          .trim();
        const originalPrice = parseFloat(originalPriceText);
        
        // Extract image URL
        const imageUrl = $el.find(config.selectors.image).attr('src') || '';

        // Validate all required fields
        if (!name) {
          throw new Error('Missing product name');
        }
        if (isNaN(price) || price <= 0) {
          throw new Error(`Invalid price: ${priceEur}.${priceCents}`);
        }
        if (isNaN(originalPrice) || originalPrice <= 0) {
          throw new Error(`Invalid original price: ${originalPriceText}`);
        }
        if (!imageUrl) {
          throw new Error('Missing image URL');
        }

        deals.push({
          id: generateDealId(store, name),
          name,
          price,
          originalPrice,
          store: store.charAt(0).toUpperCase() + store.slice(1), // Capitalize store name
          imageUrl,
        });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        errors.push(`Failed to parse deal: ${errorMessage}`);
      }
    });

    if (deals.length === 0 && errors.length > 0) {
      console.error('No deals were parsed successfully. Errors:', errors);
    }

    return { deals, errors };
  } catch (error) {
    console.error("Scraping error:", error);
    return {
      deals: [],
      errors: [error instanceof Error ? error.message : "Unknown scraping error"],
    };
  }
}

// Helper function to generate unique IDs for deals
export function generateDealId(store: string, name: string): string {
  return `${store}-${name}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}