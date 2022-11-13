import {Component, Input, OnInit} from '@angular/core';
import {List} from "../../../models/list";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {TranslateService} from "@ngx-translate/core";
import {formatDate} from "@angular/common";
import Swal from "sweetalert2";
import {UserListsService} from "../../../services/user-lists.service";
import {ListRequest} from "../../../models/requests/listRequest";
import {SimpleListResponse} from "../../../models/responses/simpleListResponse";

@Component({
  selector: 'app-edit-user-list',
  templateUrl: './edit-user-list.component.html',
  styleUrls: ['./edit-user-list.component.css']
})
export class EditUserListComponent implements OnInit {

  @Input()
  list!: List;

  @Input()
  index!: number;

  form!: FormGroup;

  constructor(private translate: TranslateService, private formBuilder: FormBuilder,
              private userListService: UserListsService) {
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      name: [this.list.name, Validators.required],
      date: [this.formatDate(this.list.date), Validators.required]
    });
  }

  editList(): void{
    let listRequest: ListRequest = {
      "name": this.form.get('name')?.value,
      "date": formatDate(this.form.get('date')?.value, 'yyyy-MM-dd', 'en_US')
    }

    this.userListService.update(this.list.id, listRequest).subscribe({
      next: (simpleListResponse) => {
        this.refreshList(simpleListResponse)
        this.list.isBeingEditing = false
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

  formatDate(date: string): Date{
    let splitedData = date.split('-')
    return new Date(splitedData[1] + '/' + splitedData[2] + '/' + splitedData[0])
  }

  refreshList(simpleListResponse: SimpleListResponse){
    this.list.name = simpleListResponse.name;
    this.list.date = simpleListResponse.date;
  }

}
