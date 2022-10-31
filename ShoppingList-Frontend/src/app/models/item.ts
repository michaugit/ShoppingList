
export class Item {
  text: string;
  num: number;
  unit: string;
  photo: any;
  done = false;
  isBeingEditing = false;

  constructor(text: string, num: number, unit: string) {
    this.text = text;
    this.num = num;
    this.unit = unit;
    this.photo = null
  }
}
