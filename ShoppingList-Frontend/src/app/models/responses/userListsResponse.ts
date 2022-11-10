export interface ShoppingList {
  id: number;
  name: string;
  date: string;
}

export interface UserListsResponse {
  shoppingLists: ShoppingList[];
}
