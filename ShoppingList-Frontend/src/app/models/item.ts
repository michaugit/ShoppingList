
export class Item {
  text: string;
  num: number;
  unit: string;
  photo?: File;
  // photoPreview: string = ''
  done = false;
  isBeingEditing = false;

  constructor(text: string, num: number, unit: string, photo?: File) {
    this.text = text;
    this.num = num;
    this.unit = unit;
    this.photo = photo;

    // if (this.photo !== undefined){
    //   const reader = new FileReader();
    //   reader.readAsDataURL(this.photo)
    //
    //   reader.onload = (e: any) => {
    //     this.photoPreview = e.target.result
    //   }
    // }
  }
}
