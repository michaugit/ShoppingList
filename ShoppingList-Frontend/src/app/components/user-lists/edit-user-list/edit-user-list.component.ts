import {Component, Input, OnInit} from '@angular/core';
import {List} from "../../../models/list";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {TranslateService} from "@ngx-translate/core";

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

  constructor(private translate: TranslateService,
              private formBuilder: FormBuilder) {
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      name: [this.list.name, Validators.required],
      date: [this.list.date, Validators.required]
    });
  }

  editList(): void{
    this.list.name = this.form.get('name')?.value
    this.list.date = this.form.get('date')?.value
    this.list.isBeingEditing = false
  }

}
