export interface GroceryDeal {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  store: string;
  description: string;
  imageUrl: string;
  category: string;
  expiresAt: string;
}

export interface SelectedItem {
  dealId: string;
  quantity: number;
}