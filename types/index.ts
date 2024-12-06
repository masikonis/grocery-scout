export interface GroceryDeal {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  store: string;
  imageUrl: string;
}

export interface SelectedItem {
  dealId: string;
  quantity: number;
}