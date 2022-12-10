import {ComponentFixture, fakeAsync, flush, TestBed, tick} from '@angular/core/testing';

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

    const response = {"id": 1, "username": "test", "roles": ["ROLE_USER"]}
    const authService = fixture.debugElement.injector.get(AuthService)
    const storageService = fixture.debugElement.injector.get(StorageService)
    spyOn(authService, 'login').and.returnValue(Rx.of(response))
    spyOn(storageService, 'saveUser')
    spyOn(component, 'reloadPage')
    const spyRouter = spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));

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

  it('#intergration  successful login', fakeAsync(() => {
    const expectedDataResponse = {
      "id": 1,
      "username": "test",
      "roles": [
        "ROLE_USER"
      ]
    }

    const { username, password } = component.form.controls;
    username.setValue('test');
    password.setValue('pass');
    expect(component.form.valid).toBeTruthy();
    fixture.detectChanges();

    const authService = fixture.debugElement.injector.get(AuthService)
    const storageService = fixture.debugElement.injector.get(StorageService)
    const spyAuthLogin = spyOn(authService, 'login').and.callThrough()
    const spyStorageSaveUser = spyOn  (storageService, 'saveUser').and.callThrough()
    const spyOnSubmit = spyOn(component, 'onSubmit').and.callThrough()
    const spyRouter = spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));
    spyOn(component, 'reloadPage')

    const btn = fixture.debugElement.nativeElement.querySelector('.login-btn')
    btn.click()

    const request = httpTestingController.expectOne('http://localhost:8080/api/auth/'+ 'signin');
    expect(request.request.method).toBe('POST');
    expect(request.request.responseType).toBe('json')
    request.flush(expectedDataResponse);

    expect(spyAuthLogin).toHaveBeenCalled()
    expect(spyStorageSaveUser).toHaveBeenCalled()
    expect(spyOnSubmit).toHaveBeenCalled()
    expect(spyRouter).toHaveBeenCalledWith(['/user-lists'])
    expect(storageService.isLoggedIn()).toBeTruthy()
    expect(component.isLoggedIn).toBeTruthy()
    expect(storageService.getUser()).toEqual(expectedDataResponse)
  }));


  it('#intergration error login', fakeAsync(() => {
    const mockErrorResponse = { status: 401, statusText:"Unauthorized", error: { message: 'Nieprawidłowa nazwa użytkownika lub hasło.' } };
    const expectedErrorData = {
      "path": "/api/auth/signin",
      "error": "Unauthorized",
      "message": "Nieprawidłowa nazwa użytkownika lub hasło. ",
      "status": 401
    }

    const { username, password } = component.form.controls;
    username.setValue('invalidName');
    password.setValue('invalidPass');
    expect(component.form.valid).toBeTruthy();
    fixture.detectChanges();

    const authService = fixture.debugElement.injector.get(AuthService)
    const storageService = fixture.debugElement.injector.get(StorageService)
    const spyAuthLogin = spyOn(authService, 'login').and.callThrough()
    const spyStorageSaveUser = spyOn  (storageService, 'saveUser').and.callThrough()
    const spyOnSubmit = spyOn(component, 'onSubmit').and.callThrough()
    const spyRouter = spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));
    const spySweetAlert = spyOn(Swal,"fire")
    spyOn(component, 'reloadPage')
    storageService.clean()

    const btn = fixture.debugElement.nativeElement.querySelector('.login-btn')
    btn.click()

    const request = httpTestingController.expectOne('http://localhost:8080/api/auth/'+ 'signin');
    expect(request.request.method).toBe('POST');
    expect(request.request.responseType).toBe('json')
    request.flush(expectedErrorData, mockErrorResponse);

    expect(spyAuthLogin).toHaveBeenCalled()
    expect(spyOnSubmit).toHaveBeenCalled()
    expect(spyStorageSaveUser).not.toHaveBeenCalled()
    expect(spyRouter).not.toHaveBeenCalledWith(['/user-lists'])
    expect(storageService.isLoggedIn()).toBeFalsy()
    expect(component.isLoggedIn).toBeFalsy()
    expect(storageService.getUser()).toEqual({})
    expect(spySweetAlert).toHaveBeenCalled()
    expect(username.valid).toBeFalse()
    expect(password.valid).toBeFalse()
    flush()
  }));


});
