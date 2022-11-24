import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';

import { LoginComponent } from './login.component';
import {HttpTestingController} from "@angular/common/http/testing";
import {AuthService} from "../../services/auth/auth.service";
import {commonTestImports, materialTestImports} from "../../app.providers";
import * as Rx from 'rxjs';
import {Router} from "@angular/router";
import {StorageService} from "../../services/auth/storage.service";
import {throwError} from 'rxjs'
import Swal from "sweetalert2";


describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let httpTestingController: HttpTestingController;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoginComponent ],
      imports: [... commonTestImports, ... materialTestImports],
      providers: [AuthService]
      // schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    httpTestingController = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router)
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('empty form should be invalid', () =>{
    expect(component.form.valid).toBeFalsy()
  });

  it('empty username field should be invalid', ()=> {
    const {username} = component.form.controls
    expect(username.valid).toBeFalse()
  })

  it('empty password field should be invalid', ()=> {
    const {password} = component.form.controls
    expect(password.valid).toBeFalse()
  })

  it('properly filled form should be valid', () => {
    const { username, password } = component.form.controls;
    expect(username.valid).toBeFalsy();
    expect(password.valid).toBeFalsy();

    username.setValue('test');
    password.setValue('pass');
    expect(component.form.valid).toBeTruthy();
    expect(component.form.controls['username'].value).toEqual('test');
    expect(component.form.controls['password'].value).toEqual('pass');
  });

  it('submit should call onSubmit() function', fakeAsync(() => {
    const { username, password } = component.form.controls;
    username.setValue('test');
    password.setValue('pass');
    expect(component.form.valid).toBeTruthy();
    fixture.detectChanges();

    spyOn(component, 'onSubmit');
    const btn = fixture.debugElement.nativeElement.querySelector('.login-btn')
    btn.click()
    expect(component.onSubmit).toHaveBeenCalled();
  }));

  it('password should be type password', () => {
    const password = fixture.debugElement.nativeElement.querySelector('input[formControlName=password]')
    expect(password.type).toBe('password')
  });

  it('password should be type text after visibility button change', () => {
    const password = fixture.debugElement.nativeElement.querySelector('input[formControlName=password]')
    expect(password.type).toBe('password')
    expect(component.hidePassword).toBeTrue()

    const visibilityBtn = fixture.debugElement.nativeElement.querySelector('button[mat-icon-button]')
    visibilityBtn.click()
    fixture.detectChanges();
    expect(password.type).toBe('text')
    expect(component.hidePassword).toBeFalse()
  });

  it('test valid form onSubmit() with valid response', fakeAsync(() => {
    const { username, password } = component.form.controls;
    username.setValue('test');
    password.setValue('pass');
    expect(component.form.valid).toBeTruthy();

    const response = {"id": 1, "username": "michal", "roles": ["ROLE_USER"]}
    const authService = fixture.debugElement.injector.get(AuthService)
    const storageService = fixture.debugElement.injector.get(StorageService)
    spyOn(authService, 'login').and.returnValue(Rx.of(response))
    spyOn(storageService, 'saveUser')
    spyOn(component, 'reloadPage')
    const spyRouter = spyOn(router, 'navigate')

    component.onSubmit();
    tick(1000)

    expect(component.isLoggedIn).toBeTrue()
    expect(spyRouter).toHaveBeenCalledWith(['/user-lists'])
  }));

  it('test form onSubmit() with error response', fakeAsync(() => {
    const { username, password } = component.form.controls;

    const authService = fixture.debugElement.injector.get(AuthService)
    const mockErrorResponse = { status: 401, statusText:"Unauthorized", error: { message: 'Nieprawidłowa nazwa użytkownika lub hasło.' } };
    spyOn(authService, 'login').and.returnValue(throwError(() => mockErrorResponse));
    const spySweetAlert = spyOn(Swal,"fire")

    component.onSubmit();
    tick(1000)

    expect(component.isLoggedIn).toBeFalse()
    expect(username.valid).toBeFalse()
    expect(password.valid).toBeFalse()
    expect(spySweetAlert).toHaveBeenCalled()
  }));

  it('test ngOnInit() when user is logged in', fakeAsync(() => {
    const storageService = fixture.debugElement.injector.get(StorageService)
    spyOn(storageService, 'isLoggedIn').and.returnValue(true)
    spyOn(component, 'reloadPage')
    const spyRouter = spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));
    component.ngOnInit()
    expect(spyRouter).toHaveBeenCalledWith(['/user-lists'])
  }));


});
