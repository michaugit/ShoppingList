import { Component, OnInit } from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import CustomValidator from "../../validators/CustomValidator";
import {StorageService} from "../../services/auth/storage.service";
import {Router} from "@angular/router";
import Swal from "sweetalert2";
import {AuthService} from "../../services/auth/auth.service";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  form!: FormGroup;
  isLoggedIn = false;
  hidePassword = true;

  constructor(private translate: TranslateService, private router: Router, private formBuilder: FormBuilder,
              private authService: AuthService, private storageService: StorageService) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
        username: ['', [Validators.required, Validators.minLength(4),  Validators.maxLength(25)]],
        password: ['', [Validators.required, Validators.minLength(4),  Validators.maxLength(25)]],
        passwordRepeat : ['', Validators.required]
    },
      {
        validators: [CustomValidator.validatePasswordEqual('password', 'passwordRepeat')]
      });
    if (this.storageService.isLoggedIn()) {
      this.router.navigate(['/user-lists']).then(() => this.reloadPage());
    }
  }

  onSubmit(): void {
    let username = this.form.get('username')?.value;
    let password = this.form.get('password')?.value;

    this.authService.register({"username": username, "password": password}).subscribe({
      next: data => {
        Swal.fire({
          title: this.translate.instant('register.success'),
          icon: 'success',
          showConfirmButton: true
        }).then( () => {this.router.navigate(['/login']).then(() => this.reloadPage());})

      },
      error: err => {
        this.form.controls['username'].setErrors({'registerFailed': true});
        this.form.controls['password'].setErrors({'registerFailed': true});
        this.form.controls['passwordRepeat'].setErrors({'registerFailed': true});
        Swal.fire({
          title: this.translate.instant('register.error'),
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
