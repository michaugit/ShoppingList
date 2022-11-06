import { Component, OnInit } from '@angular/core';
import {TranslateService} from "@ngx-translate/core";
import {Router} from "@angular/router";

@Component({
  selector: 'app-main-navigation',
  templateUrl: './main-navigation.component.html',
  styleUrls: ['./main-navigation.component.css']
})
export class MainNavigationComponent implements OnInit {

  isLoggedIn = false;
  username?: string;

  constructor(public translate: TranslateService, private router: Router) { }

  ngOnInit(): void {
  }

  logout(): void {
    // this.tokenStorageService.signOut();
    this.isLoggedIn = false
    this.router.navigate(['/login']).then(() => this.reloadPage());
  }

  reloadPage(): void {
    window.location.reload();
  }

}
