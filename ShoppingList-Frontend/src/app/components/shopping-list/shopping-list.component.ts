import { Component, OnInit } from '@angular/core';
import {Item} from "../../models/item";
import {TranslateService} from "@ngx-translate/core";
import {map, Observable, startWith} from "rxjs";
import {FormControl} from '@angular/forms';
import CommonProductsService from "../../services/commonProductsService";
import UnitService from "../../services/unitService";

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit {

  items: Item[];
  isValid = true;
  selectedUnit: string
  unitTypes: string[] = [];

  selectedFile?: File
  selectedFileName: string = ''
  preview: string = ''

  productName = new FormControl('');
  commonProducts: string[];
  filteredOptions: Observable<string[]> | undefined;

  constructor(private translate: TranslateService) {
    this.items = [];
    this.unitTypes = UnitService.getUnits()
    this.selectedUnit = UnitService.getDefaultUnit()
    this.commonProducts = CommonProductsService.getCommonProducts()
  }

  ngOnInit(): void {
    this.filteredOptions = this.productName.valueChanges.pipe(
      startWith(''), map(value => this._filter(value || '')),
    );
  }


  addItem(text: string, num: string, unit: string) {
    if (text === "") return;
    this.items.push(new Item(text, +num, unit, this.selectedFile));
    this.filteredOptions = this.productName.valueChanges.pipe(
      startWith(''), map(value => this._filter(value || '')),
    );
    this.deletePicture()
  }

  removeItem(item: Item) {
    console.log(this.items)
    this.items.splice(this.items.indexOf(item), 1);
  }

  doEditable(item: Item){
    item.isBeingEditing = true;
    console.log(item)
  }

  editItem(item: Item, text: string, num: string, unit: string) {
    item.text = text
    item.num = +num
    item.unit = unit
    item.isBeingEditing = false
  }

  editItem2(editedItem: Item, indexOfEditedItem: number){
    this.items[indexOfEditedItem] = editedItem
  }


  toggle(item: Item) {
    item.done = !item.done;
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.commonProducts.filter(
      option => (this.translate.instant("commonProducts."+option)).toLowerCase().includes(filterValue));
  }

  onSelectionChanged($event: any) {
    const translatedValue = this.translate.instant("commonProducts." + $event.option.value);
    this.productName.setValue(translatedValue)
  }

  selectFiles(event: any): void {
    this.selectedFile = event.target.files[0]
    this.selectedFileName  = event.target.files[0].name

    const reader = new FileReader();
    reader.readAsDataURL(event.target.files[0])

    reader.onload = (e: any) => {
      this.preview = e.target.result
    }
  }

  editItemFilePreview(item: Item, event: any): void {
    this.selectedFile = event.target.files[0]
    this.selectedFileName  = event.target.files[0].name

    const reader = new FileReader();
    reader.readAsDataURL(event.target.files[0])

    reader.onload = (e: any) => {
      this.preview = e.target.result
    }
  }

  deletePicture(): void{
    this.selectedFile = undefined
    this.selectedFileName = ''
    this.preview = ''
  }

}
