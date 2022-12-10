import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';

import { MainNavigationComponent } from './main-navigation.component';
import {Router} from "@angular/router";
import {commonTestImports, materialTestImports} from "../../app.providers";
import {StorageService} from "../../services/auth/storage.service";
import {AuthService} from "../../services/auth/auth.service";
import * as Rx from "rxjs";

describe('MainNavigationComponent', () => {
  let component: MainNavigationComponent;
  let fixture: ComponentFixture<MainNavigationComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MainNavigationComponent ],
      imports: [... commonTestImports, ... materialTestImports],
    })
    .compileComponents();

    fixture = TestBed.createComponent(MainNavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    router = TestBed.inject(Router)
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should redirect when user is logged out', fakeAsync(() => {
    const storageService = fixture.debugElement.injector.get(StorageService)
    spyOn(storageService, 'isLoggedIn').and.returnValue(false)
    spyOn(component, 'reloadPage')
    const spyRouter = spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));
    component.ngOnInit()
    expect(spyRouter).toHaveBeenCalledWith(['/login'])
  }));

  it('should present logged nav when user is logged in', fakeAsync(() => {
    const storageService = fixture.debugElement.injector.get(StorageService)
    spyOn(storageService, 'isLoggedIn').and.returnValue(true)
    component.ngOnInit()
    fixture.detectChanges()
    expect(component.isLoggedIn).toBeTruthy()
    expect(fixture.debugElement.nativeElement.querySelector('.user_lists_btn')).toBeDefined()
    expect(fixture.debugElement.nativeElement.querySelector('.logout_btn')).toBeDefined()
    expect(fixture.debugElement.nativeElement.querySelector('.login_btn')).toBeNull()
    expect(fixture.debugElement.nativeElement.querySelector('.register_btn')).toBeNull()
  }));

  it('should present logout nav when user is logged out', fakeAsync(() => {
    component.isLoggedIn = false
    fixture.detectChanges()
    expect(fixture.debugElement.nativeElement.querySelector('.user_lists_btn')).toBeNull()
    expect(fixture.debugElement.nativeElement.querySelector('.logout_btn')).toBeNull()
    expect(fixture.debugElement.nativeElement.querySelector('.login_btn')).toBeDefined()
    expect(fixture.debugElement.nativeElement.querySelector('.register_btn')).toBeDefined()
  }));

  it('click logout button should trigger logout()', fakeAsync(() => {
    const storageService = fixture.debugElement.injector.get(StorageService)
    spyOn(storageService, 'isLoggedIn').and.returnValue(true)
    component.ngOnInit()
    fixture.detectChanges()
    expect(component.isLoggedIn).toBeTruthy()
    const logoutBtn = fixture.debugElement.nativeElement.querySelector('.logout_btn')

    spyOn(component, 'logout')
    logoutBtn.click()

    expect(component.logout).toHaveBeenCalled()
  }));

  it('test logout function calls', fakeAsync(() => {
    const authService = fixture.debugElement.injector.get(AuthService)
    const storageService = fixture.debugElement.injector.get(StorageService)
    const spyAuthService = spyOn(authService, 'logout').and.returnValue(Rx.of({"message": "You've been signed out!"}))
    const spyStorageService = spyOn(storageService, 'clean')
    const spyRouter = spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));
    const spyReload = spyOn(component, 'reloadPage')

    component.logout()
    tick(1000)

    expect(spyAuthService).toHaveBeenCalled()
    expect(spyStorageService).toHaveBeenCalled()
    expect(spyRouter).toHaveBeenCalledWith(['/login'])
    expect(spyReload).toHaveBeenCalled()
  }));

});
