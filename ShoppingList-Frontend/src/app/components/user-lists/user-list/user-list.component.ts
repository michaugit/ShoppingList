import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {List} from "../../../models/list";
import {Router} from "@angular/router";



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

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  doEditable(list: List){
    list.isBeingEditing = true;
  }

  goToList(): void{
    this.router.navigate(['/shopping-list']).then(() => this.reloadPage());
  }

  reloadPage(): void {
    window.location.reload();
  }
}
