import { ScraperResult } from "./types";
import { scrapeMaxima } from "./maxima/scraper";

interface CacheEntry {
  data: ScraperResult;
  timestamp: number;
}

interface ScraperCache {
  [store: string]: CacheEntry;
}

const CACHE_DURATION = 12 * 60 * 60 * 1000; // 12 hours in milliseconds
const cache: ScraperCache = {};

export async function scrapeDeals(store: string = "maxima"): Promise<ScraperResult> {
  const normalizedStore = store.toLowerCase();

  // Check cache first
  if (cache[normalizedStore]) {
    const now = Date.now();
    const age = now - cache[normalizedStore].timestamp;
    
    if (age < CACHE_DURATION) {
      console.log(`Using cached ${store} deals (${Math.round(age / 1000 / 60)} minutes old)`);
      return cache[normalizedStore].data;
    } else {
      console.log(`Cache expired for ${store}, fetching fresh deals`);
      delete cache[normalizedStore];
    }
  }

  try {
    // Get fresh data
    let result: ScraperResult;
    
    switch (normalizedStore) {
      case "maxima":
        result = await scrapeMaxima();
        break;
      default:
        return {
          deals: [],
          errors: [`Unsupported store: ${store}`],
        };
    }

    // Only cache successful results
    if (result.deals.length > 0) {
      cache[normalizedStore] = {
        data: result,
        timestamp: Date.now()
      };
    }

    return result;
  } catch (error) {
    // If scraping fails and we have stale cache, use it as fallback
    if (cache[normalizedStore]) {
      console.warn(`Scraping failed for ${store}, using stale cache as fallback`);
      return cache[normalizedStore].data;
    }

    console.error(`${store} scraping error:`, error);
    return {
      deals: [],
      errors: [error instanceof Error ? error.message : "Unknown scraping error"],
    };
  }
}

// Optional: Add methods to manage cache
export function clearCache(store?: string) {
  if (store) {
    delete cache[store.toLowerCase()];
  } else {
    Object.keys(cache).forEach(key => delete cache[key]);
  }
}

export function getCacheStatus() {
  return Object.entries(cache).map(([store, entry]) => ({
    store,
    age: Math.round((Date.now() - entry.timestamp) / 1000 / 60),
    dealsCount: entry.data.deals.length
  }));
}