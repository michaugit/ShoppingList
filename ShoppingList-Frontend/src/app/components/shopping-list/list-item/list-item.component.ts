import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Item} from "../../../models/item";
import {FormControl} from "@angular/forms";
import {map, Observable, startWith} from "rxjs";
import {TranslateService} from "@ngx-translate/core";
import UnitService from "../../../services/unitService";
import CommonProductsService from "../../../services/commonProductsService";
import Swal from "sweetalert2";
import {ItemService} from "../../../services/item.service";

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

  constructor(private translate: TranslateService, private itemService: ItemService) { }

  ngOnInit(): void {
    // if(this.item.image !== undefined){
    //   const reader = new FileReader();
    //   reader.readAsDataURL(this.item.photo)
    //
    //   reader.onload = (e: any) => {
    //     this.itemPhoto = e.target.result
    //   }
    // }
  }

  deleteItem(item: Item){
    this.itemService.delete(item).subscribe({
      next: () => {
        this.removeItem.emit()
      },
      error: err => {
        Swal.fire({
          title: this.translate.instant('common.fail'),
          text: err.error.message,
          icon: 'error',
          showConfirmButton: false
        })
      }
    })
  }

  doEditable(item: Item){
    item.isBeingEditing = true;
  }

  toggle(item: Item) {
    item.done = !item.done;
    this.itemService.update(this.item.id, item).subscribe({
      next: () => {},
      error: err => {
        item.done = !item.done
        Swal.fire({
          title: this.translate.instant('common.fail'),
          text: err.error.message,
          icon: 'error',
          showConfirmButton: false
        })
      }
    })
  }

}
