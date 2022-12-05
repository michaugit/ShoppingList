import {Component, OnInit} from '@angular/core';
import {Item} from "../../models/item";
import {TranslateService} from "@ngx-translate/core";
import {ActivatedRoute} from "@angular/router";
import {ItemService} from "../../services/item.service";
import Swal from "sweetalert2";

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit {

  listId!: number;
  listTitle?: string;
  items: Item[];


  constructor(private route: ActivatedRoute, private translate: TranslateService,
              private itemService: ItemService) {
    this.items = [];
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe( params => {
      this.listId = params['listId'];
      this.refreshItems();
    })
  }

  refreshItems(){
    this.itemService.getListItems(this.listId).subscribe({
      next: (data) => {
        this.listTitle = data.listName;
        data.items.forEach((item) =>{
          if (this.items.find(function (listItem){return listItem.id == item.id}) == undefined){
            this.items.push(new Item(item.id, data.listId, item.text, item.quantity, item.unit, item.done, item.image));
          }
        })
      },
      error: err => {
        Swal.fire({
          title: this.translate.instant('common.fail'),
          text: err.error.message,
          icon: 'error',
          showConfirmButton: false
        })
      }
    });
  }

  removeItem(item: Item) {
    this.items.splice(this.items.indexOf(item), 1);
  }
}
