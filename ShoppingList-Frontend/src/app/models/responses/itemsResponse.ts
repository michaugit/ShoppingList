export interface Item {
  id: number;
  text: string;
  quantity: number;
  unit: string;
  done: boolean;
}

export interface ListOfItems {
  listId: number;
  listName: string;
  date: string;
  items: Item[];
}
