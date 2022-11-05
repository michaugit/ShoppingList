
export class List{
  name: string;
  date: string;
  isBeingEditing = false;
  id: number = 0;

  constructor(name: string, date: string) {
    this.name = name
    this.date = date
  }
}
