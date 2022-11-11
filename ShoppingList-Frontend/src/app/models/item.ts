
export class Item {
  id: number;
  listId: number;
  text: string;
  quantity: number;
  unit: string;
  photo?: File;
  done = false;
  isBeingEditing = false;

  constructor(id: number, listId: number, text: string, num: number, unit: string, photo?: File) {
    this.id = id;
    this.listId = listId;
    this.text = text;
    this.quantity = num;
    this.unit = unit;
    this.photo = photo;
  }
}
