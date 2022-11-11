import {Component, OnInit} from '@angular/core';
import {List} from "../../models/list";
import {TranslateService} from "@ngx-translate/core";
import {Router} from "@angular/router";
import {StorageService} from "../../services/auth/storage.service";
import {UserListsService} from "../../services/user-lists.service";
import Swal from "sweetalert2";


@Component({
  selector: 'app-user-lists',
  templateUrl: './user-lists.component.html',
  styleUrls: ['./user-lists.component.css']
})
export class UserListsComponent implements OnInit {

  lists: List[];

  constructor(private translate: TranslateService, private router: Router,
              private userListsService: UserListsService, private storageService: StorageService) {
    this.lists = []
  }

  ngOnInit(): void {
    if (!this.storageService.isLoggedIn()) {
      this.router.navigate(['/login'])
    } else {
      this.refreshUserLists()
    }
  }

  removeList(list: List) {
    this.lists.splice(this.lists.indexOf(list), 1);
  }

  refreshUserLists(): void {
    this.userListsService.getUserLists().subscribe({
      next: (data) => {
        data.shoppingLists.forEach((shoppingList) => {
          if (this.lists.find(function (list) {
            return list.id == shoppingList.id
          }) == undefined) {
            this.lists.push(new List(shoppingList.name, shoppingList.date, shoppingList.id));
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

}
