import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {List} from "../../../models/list";
import {Router} from "@angular/router";
import {UserListsService} from "../../../services/user-lists.service";
import Swal from "sweetalert2";
import {TranslateService} from "@ngx-translate/core";



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

  constructor(private translate: TranslateService, private router: Router,
              private userListsService: UserListsService) { }

  ngOnInit(): void {}

  doEditable(list: List){
    list.isBeingEdited = true;
  }


  deleteList(list: List): void{
    this.userListsService.delete(list).subscribe({
      next: () => {
        this.removeList.emit()
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

  // goToList(): void{
  //   this.router.navigate(['/shopping-list']).then(() => this.reloadPage());
  // }
  //
  // reloadPage(): void {
  //   window.location.reload();
  // }
}
