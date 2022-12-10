import { Component, OnInit } from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import {Router} from "@angular/router";
import {StorageService} from "../../services/auth/storage.service";
import {AuthService} from "../../services/auth/auth.service";

@Component({
  selector: 'app-main-navigation',
  templateUrl: './main-navigation.component.html',
  styleUrls: ['./main-navigation.component.css']
})
export class MainNavigationComponent implements OnInit {

  isLoggedIn = false;
  username?: string;

  constructor(public translate: TranslateService, private router: Router,
              private authService: AuthService, private storageService: StorageService) { }

  ngOnInit(): void {
    if(this.storageService.isLoggedIn()){
      this.isLoggedIn = true
      // this.router.navigate(['/user-lists'])
    } else {
      this.router.navigate(['/login'])
    }
  }

  logout(): void {
    this.authService.logout().subscribe( ()=> {
      this.storageService.clean();
      this.router.navigate(['/login']).then(() => this.reloadPage());
    });
  }

  reloadPage(): void {
    window.location.reload();
  }

}
