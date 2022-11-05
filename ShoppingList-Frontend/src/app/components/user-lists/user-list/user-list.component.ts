import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {List} from "../../../models/list";



@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  @Input()
  list!: List;

  @Input()
  index!: number;

  @Output()
  public removeList: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  doEditable(list: List){
    list.isBeingEditing = true;
  }

}
