import {Component, Input, OnInit} from '@angular/core';
import {List} from "../../../models/list";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {TranslateService} from "@ngx-translate/core";
import {FormGroupDirective} from '@angular/forms';

@Component({
  selector: 'app-add-user-list',
  templateUrl: './add-user-list.component.html',
  styleUrls: ['./add-user-list.component.css']
})
export class AddUserListComponent implements OnInit {

  @Input()
  lists!: List[]

  form!: FormGroup;

  constructor(private translate: TranslateService,
              private formBuilder: FormBuilder) {
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      date: ['', Validators.required]
    });
  }

  addList() {
    let name = this.form.get('name')?.value;
    let date = this.form.get('date')?.value;

    this.lists.push(new List(name, date))
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
