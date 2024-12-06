import axios from "axios";
import * as cheerio from "cheerio";
import { GroceryDeal } from "@/types";
import { ScraperResult } from "../types";
import { maximaConfig } from "./config";
import { generateDealId } from "../utils";

export async function scrapeMaxima(): Promise<ScraperResult> {
  try {
    const response = await axios.get(maximaConfig.baseUrl);
    const html = response.data;
    const $ = cheerio.load(html);

    const deals: GroceryDeal[] = [];
    const errors: string[] = [];

    $(maximaConfig.selectors.productCard).each((_, element) => {
      const $el = $(element);
      
      // Skip cards that don't have both current and original prices
      const hasPrimaryPrice = $el.find('.bg-primary .price-eur').length > 0;
      const hasWhitePrice = $el.find('.bg-white .price-eur').length > 0;
      const hasOriginalPrice = $el.find('.price-old div').length > 0 || 
                              ($el.find('.bg-white.rounded-start-1').length > 0 && hasWhitePrice);
      
      // Only process cards that have both prices
      if ((!hasPrimaryPrice && !hasWhitePrice) || !hasOriginalPrice) {
        return; // Skip silently
      }

      try {
        const name = $el.find(maximaConfig.selectors.name).text().trim();
        
        // Extract current price (always in the blue box)
        const priceEur = $el.find(maximaConfig.selectors.currentPrice.euro).text().trim();
        const priceCents = $el.find(maximaConfig.selectors.currentPrice.cents).text().trim();
        const price = parseFloat(`${priceEur}.${priceCents}`);
        
        // Try both original price formats
        let originalPrice: number;
        const standardPriceText = $el.find(maximaConfig.selectors.originalPrice.standard)
          .text()
          .replace(/[€\s]/g, '')
          .replace(',', '.')
          .trim();
          
        if (standardPriceText) {
          originalPrice = parseFloat(standardPriceText);
        } else {
          const altPriceEur = $el.find('.bg-white .price-eur').text().trim();
          const altPriceCents = $el.find('.bg-white .price-cents').text().trim();
          originalPrice = parseFloat(`${altPriceEur}.${altPriceCents}`);
        }

        const imageUrl = $el.find(maximaConfig.selectors.image).attr('src') || '';

        // Validation
        if (!name) throw new Error('Missing product name');
        if (isNaN(price) || price <= 0) throw new Error(`Invalid price: ${priceEur}.${priceCents}`);
        if (isNaN(originalPrice) || originalPrice <= 0) throw new Error(`Invalid original price: ${originalPrice}`);
        if (!imageUrl) throw new Error('Missing image URL');

        deals.push({
          id: generateDealId('maxima', name),
          name,
          price,
          originalPrice,
          store: 'Maxima',
          imageUrl,
        });
      } catch (error) {
        // We should rarely get here now since we pre-check the elements
        errors.push(`Failed to parse deal: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    });

    // Only log errors if no deals were parsed at all
    if (deals.length === 0 && errors.length > 0) {
      console.error('Failed to parse any deals:', errors);
    }

    return { deals, errors };
  } catch (error) {
    console.error("Maxima scraping error:", error);
    return {
      deals: [],
      errors: [error instanceof Error ? error.message : "Unknown scraping error"],
    };
  }
}