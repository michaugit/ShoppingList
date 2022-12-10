
export class Item {
  id: number;
  listId: number;
  text: string;
  quantity: number;
  unit: string;
  image?: string;
  done = false;
  isBeingEdited = false;

  constructor(id: number, listId: number, text: string, num: number, unit: string, done: boolean, image?: string) {
    this.id = id;
    this.listId = listId;
    this.text = text;
    this.quantity = num;
    this.unit = unit;
    this.done = done;
    this.image = image;
  }
}
