import { ScraperResult } from "./types";
import { scrapeMaxima } from "./maxima/scraper";

export async function scrapeDeals(store: string = "maxima"): Promise<ScraperResult> {
  switch (store.toLowerCase()) {
    case "maxima":
      return scrapeMaxima();
    default:
      return {
        deals: [],
        errors: [`Unsupported store: ${store}`],
      };
  }
}