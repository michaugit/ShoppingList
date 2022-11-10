import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {List} from "../../../models/list";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {TranslateService} from "@ngx-translate/core";
import {FormGroupDirective} from '@angular/forms';
import {formatDate} from '@angular/common';
import {UserListsService} from "../../../services/user-lists.service";
import Swal from "sweetalert2";


@Component({
  selector: 'app-add-user-list',
  templateUrl: './add-user-list.component.html',
  styleUrls: ['./add-user-list.component.css'],
})
export class AddUserListComponent implements OnInit {

  @Output()
  refreshUserLists: EventEmitter<any> = new EventEmitter();

  form!: FormGroup;

  constructor(private translate: TranslateService, private formBuilder: FormBuilder,
              private userListService: UserListsService) {
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      date: ['', Validators.required]
    });
  }

  addList() {
    let name = this.form.get('name')?.value;
    let date = formatDate(this.form.get('date')?.value, 'yyyy-MM-dd', 'en_US')

    this.userListService.create({"name": name, "date": date}).subscribe({
      next: () => {
        this.refreshUserLists.emit()
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
    this.form.reset();
  }

  submitForm(formDirective: FormGroupDirective): void {
    this.form.reset();
    formDirective.resetForm();
  }

  cancel(formDirective: FormGroupDirective): void {
    this.form.reset();
    formDirective.resetForm();
  }
}
