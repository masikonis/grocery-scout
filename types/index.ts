export interface GroceryDeal {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  store: string;
  imageUrl: string;
  category: string;
}

export interface SelectedItem {
  dealId: string;
  quantity: number;
}