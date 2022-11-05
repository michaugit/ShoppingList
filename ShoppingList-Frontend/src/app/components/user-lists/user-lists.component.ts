import {Component, OnInit} from '@angular/core';
import {List} from "../../models/list";
import {TranslateService} from "@ngx-translate/core";
import {FormGroup} from "@angular/forms";

@Component({
  selector: 'app-user-lists',
  templateUrl: './user-lists.component.html',
  styleUrls: ['./user-lists.component.css']
})
export class UserListsComponent implements OnInit {

  lists: List[];

  constructor(private translate: TranslateService) {
    this.lists = []
  }

  ngOnInit(): void {
    this.loadData()
  }

  removeList(list: List) {
    this.lists.splice(this.lists.indexOf(list), 1);
  }

  loadData() {
    this.lists.push(new List("Zakupy do domu", "12-02-2022"))
    this.lists.push(new List("Zakupy do pracy", "22-02-2022"))
    this.lists.push(new List("Zakupy do szkoły", "12-12-2022"))
  }
}
