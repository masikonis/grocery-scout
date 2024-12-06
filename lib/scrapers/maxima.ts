import { ScraperConfig } from "./types";

export const maximaConfig: ScraperConfig = {
  baseUrl: "https://www.maxima.lt/pasiulymai",
  selectors: {
    container: ".offers-wrapper",
    productCard: ".card-body.offer-card",
    name: "h4.text-truncate",
    price: ".price-eur, .price-cents", // We'll need to handle this special case
    originalPrice: ".price-old",
    image: ".offer-image img",
  }
};