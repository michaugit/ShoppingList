import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {TranslateService} from "@ngx-translate/core";
import {Router} from "@angular/router";
import Swal from 'sweetalert2';
import {AuthService} from "../../services/auth/auth.service";
import {StorageService} from "../../services/auth/storage.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  form!: FormGroup;
  isLoggedIn = false;
  hidePassword = true;

  constructor(private translate: TranslateService, private formBuilder: FormBuilder, private router: Router,
              private authService: AuthService, private storageService: StorageService) {
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
    if (this.storageService.isLoggedIn()) {
      this.router.navigate(['/user-lists']).then(() => this.reloadPage());
    }

  }

  onSubmit(): void {
    let username = this.form.get('username')?.value;
    let password = this.form.get('password')?.value;

    this.authService.login({"username": username, "password": password}).subscribe({
      next: data => {
        this.storageService.saveUser(data);
        this.isLoggedIn = true;
        this.reloadPage()
        this.router.navigate(['/user-lists'])
      },
      error: err => {
        this.isLoggedIn = false;
        this.form.controls['username'].setErrors({'loginFailed': true});
        this.form.controls['password'].setErrors({'loginFailed': true});
        Swal.fire({
          title: this.translate.instant('login.error'),
          text: err.error.message,
          icon: 'error',
          showConfirmButton: false
        })
      }
    });
  }

  reloadPage(): void {
    window.location.reload();
  }

}
