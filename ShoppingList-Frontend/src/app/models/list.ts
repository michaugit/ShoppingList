import {ShoppingList} from "./responses/userListsResponse";

export class List{
  name: string;
  date: string;
  isBeingEditing = false;
  id: number;

  constructor(name: string, date: string, id: number) {
    this.name = name
    this.date = date
    this.id = id
  }
}
