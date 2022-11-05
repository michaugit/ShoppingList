
export class Item {
  text: string;
  num: number;
  unit: string;
  photo?: File;
  done = false;
  isBeingEditing = false;

  constructor(text: string, num: number, unit: string, photo?: File) {
    this.text = text;
    this.num = num;
    this.unit = unit;
    this.photo = photo;
  }
}
