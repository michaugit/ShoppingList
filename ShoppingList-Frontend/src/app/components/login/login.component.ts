import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {TranslateService} from "@ngx-translate/core";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  form!: FormGroup;
  isLoggedIn = false;
  username ='';
  password ='';
  hidePassword = true;

  constructor(private translate: TranslateService,
              private formBuilder: FormBuilder,
              private router: Router) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    this.username  = this.form.get('username')?.value;
    this.password = this.form.get('password')?.value;
    console.log(this.username, this.password)
    this.router.navigate(['/user-lists']).then(() => this.reloadPage());
  }

  reloadPage(): void {
    window.location.reload();
  }

}
