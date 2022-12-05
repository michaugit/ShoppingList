import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Item} from "../../../models/item";
import {TranslateService} from "@ngx-translate/core";
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

  constructor(private translate: TranslateService, private itemService: ItemService) { }

  ngOnInit(): void {  }

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
