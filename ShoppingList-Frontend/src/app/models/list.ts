export class List{
  name: string;
  date: string;
  isBeingEdited = false;
  id: number;

  constructor(name: string, date: string, id: number) {
    this.name = name
    this.date = date
    this.id = id
  }
}
