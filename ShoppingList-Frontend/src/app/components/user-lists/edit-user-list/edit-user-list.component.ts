import {Component, Input, OnInit} from '@angular/core';
import {List} from "../../../models/list";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {TranslateService} from "@ngx-translate/core";
import {formatDate} from "@angular/common";

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
      date: [this.formatDate(this.list.date), Validators.required]
    });
    // this.list.name.replace('-','/')
  }

  editList(): void{
    this.list.name = this.form.get('name')?.value
    this.list.date = formatDate(this.form.get('date')?.value, 'dd-MM-yyyy', 'en_US')
    this.list.isBeingEditing = false
  }

  formatDate(date: string): Date{
    let splitedData = date.split('-')
    return new Date(splitedData[1] + '/' + splitedData[0] + '/' + splitedData[2])
  }

}
