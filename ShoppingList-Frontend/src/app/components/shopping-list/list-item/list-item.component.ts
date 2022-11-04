import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Item} from "../../../models/item";
import {FormControl} from "@angular/forms";
import {map, Observable, startWith} from "rxjs";
import {TranslateService} from "@ngx-translate/core";
import UnitService from "../../../services/unitService";
import CommonProductsService from "../../../services/commonProductsService";

@Component({
  selector: 'app-list-item',
  templateUrl: './list-item.component.html',
  styleUrls: ['./list-item.component.css']
})
export class ListItemComponent implements OnInit {

  @Input()
  item!: Item;

  @Input()
  index!: number;

  @Output()
  public removeItem: EventEmitter<any> = new EventEmitter();


  itemPhoto?: String

  constructor() { }

  ngOnInit(): void {
    if(this.item.photo !== undefined){
      const reader = new FileReader();
      reader.readAsDataURL(this.item.photo)

      reader.onload = (e: any) => {
        this.itemPhoto = e.target.result
      }
    }
  }

  doEditable(item: Item){
    item.isBeingEditing = true;
  }

  toggle(item: Item) {
    item.done = !item.done;
  }

}
