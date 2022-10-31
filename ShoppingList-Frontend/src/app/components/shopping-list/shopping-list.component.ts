import { Component, OnInit } from '@angular/core';
import {Item} from "../../models/item";

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

  constructor() {
    this.items = [];
    this.unitTypes.push('count')
    this.unitTypes.push('kg')
    this.unitTypes.push('dag')
    this.unitTypes.push('g')
    this.selectedUnit = 'count'
  }

  ngOnInit(): void {
  }


  addItem(text: string, num: string, unit: string) {
    if (text === "") return;
    this.items.push(new Item(text, +num, unit));
  }

  removeItem(item: Item) {
    this.items.splice(this.items.indexOf(item), 1);
  }

  doEditable(item: Item){
    item.isBeingEditing = true;
  }

  editItem(item: Item, text: string, num: string, unit: string) {
    item.text = text
    item.num = +num
    item.unit = unit
    item.isBeingEditing = false
  }

  toggle(item: Item) {
    item.done = !item.done;
  }
}
