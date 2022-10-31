import { Component, OnInit } from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import CustomValidator from "../../validators/CustomValidator";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  form!: FormGroup;
  isLoggedIn = false;
  hidePassword = true;

  constructor(private translate: TranslateService,
              private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
        username: ['', [Validators.required, Validators.minLength(4),  Validators.maxLength(25)]],
        password: ['', [Validators.required, Validators.minLength(4),  Validators.maxLength(25)]],
        passwordRepeat : ['', Validators.required]
    },
      {
        validators: [CustomValidator.validatePasswordEqual('password', 'passwordRepeat')]
      });
  }

  onSubmit(): void {
    console.log(this.form.get('username')?.value, this.form.get('password')?.value)
  }

  reloadPage(): void {
    window.location.reload();
  }

}
