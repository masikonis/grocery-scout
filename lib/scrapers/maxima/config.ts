import { ScraperConfig } from "../types";

export const maximaConfig: ScraperConfig = {
  baseUrl: "https://www.maxima.lt/pasiulymai",
  selectors: {
    container: ".offers-wrapper",
    productCard: ".card-body.offer-card",
    name: "h4.text-truncate",
    currentPrice: {
      euro: ".bg-primary .price-eur",
      cents: ".bg-primary .price-cents"
    },
    originalPrice: {
      standard: ".price-old",
      alternate: ".bg-white.rounded-start-1 .price-eur, .bg-white.rounded-start-1 .price-cents"
    },
    image: ".offer-image img",
  }
};