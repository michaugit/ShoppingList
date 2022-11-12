import {ItemResponse} from "./itemResponse";

export interface ListResponse {
  listId: number;
  listName: string;
  date: string;
  items: ItemResponse[];
}
