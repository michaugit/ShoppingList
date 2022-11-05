import {Component, OnInit} from '@angular/core';
import {Item} from "../../models/item";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit {

  items: Item[];
  isValid = true;

  constructor(private translate: TranslateService) {
    this.items = [];
  }

  ngOnInit(): void {
  }

  removeItem(item: Item) {
    console.log(this.items)
    this.items.splice(this.items.indexOf(item), 1);
  }
}
