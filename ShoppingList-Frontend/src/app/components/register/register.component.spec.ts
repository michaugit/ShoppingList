import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';

import { RegisterComponent } from './register.component';
import {HttpTestingController} from "@angular/common/http/testing";
import {Router} from "@angular/router";
import {commonTestImports, materialTestImports} from "../../app.providers";
import {AuthService} from "../../services/auth/auth.service";
import {StorageService} from "../../services/auth/storage.service";
import * as Rx from "rxjs";
import {throwError} from "rxjs";
import Swal from "sweetalert2";

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let httpTestingController: HttpTestingController;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegisterComponent ],
      imports: [... commonTestImports, ... materialTestImports],
      providers: [AuthService]
      // schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
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

  it('to short filled password should be invalid', ()=> {
    const {password} = component.form.controls
    password.setValue("aa")
    expect(password.valid).toBeFalse()
  })

  it('to long filled password should be invalid', ()=> {
    const {password} = component.form.controls
    password.setValue('x'.repeat(26))
    expect(password.valid).toBeFalse()
  })

  it('properly filled form should be valid', () => {
    const { username, password, passwordRepeat } = component.form.controls;
    expect(username.valid).toBeFalsy();
    expect(password.valid).toBeFalsy();
    expect(passwordRepeat.valid).toBeFalsy();

    username.setValue('test');
    password.setValue('pass');
    passwordRepeat.setValue('pass')
    expect(component.form.valid).toBeTruthy();
    expect(component.form.controls['username'].value).toEqual('test');
    expect(component.form.controls['password'].value).toEqual('pass');
    expect(component.form.controls['passwordRepeat'].value).toEqual('pass');
  });

  it( 'form should be invalid when password confirm is different ', () => {
    const {password, passwordRepeat } = component.form.controls;
    password.setValue('pass')
    passwordRepeat.setValue('pass2')
    fixture.detectChanges();

    expect(component.form.valid).toBeFalse()
    expect(passwordRepeat.valid).toBeFalse()
  });

  it('submit should call onSubmit() function', fakeAsync(() => {
    const { username, password, passwordRepeat } = component.form.controls;
    username.setValue('test');
    password.setValue('pass');
    passwordRepeat.setValue('pass')
    expect(component.form.valid).toBeTruthy();
    fixture.detectChanges();

    spyOn(component, 'onSubmit');
    const btn = fixture.debugElement.nativeElement.querySelector('.register-btn')
    btn.click()
    expect(component.onSubmit).toHaveBeenCalled();
  }));

  it('password should be type password', () => {
    const password = fixture.debugElement.nativeElement.querySelector('input[formControlName=password]')
    const passwordRepeat = fixture.debugElement.nativeElement.querySelector('input[formControlName=passwordRepeat]')
    expect(password.type).toBe('password')
    expect(passwordRepeat.type).toBe('password')
  });

  it('password should be type text after visibility button change', () => {
    const password = fixture.debugElement.nativeElement.querySelector('input[formControlName=password]')
    const passwordRepeat = fixture.debugElement.nativeElement.querySelector('input[formControlName=passwordRepeat]')
    expect(password.type).toBe('password')
    expect(passwordRepeat.type).toBe('password')
    expect(component.hidePassword).toBeTrue()

    const visibilityBtn = fixture.debugElement.nativeElement.querySelector('button[mat-icon-button]')
    visibilityBtn.click()
    fixture.detectChanges();
    expect(password.type).toBe('text')
    expect(passwordRepeat.type).toBe('text')
    expect(component.hidePassword).toBeFalse()
  });

  it('test valid form onSubmit() with valid response', fakeAsync(() => {
    const { username, password, passwordRepeat } = component.form.controls;
    username.setValue('test');
    password.setValue('pass');
    passwordRepeat.setValue('pass')
    expect(component.form.valid).toBeTruthy();

    const response = {"id": 1, "username": "michal", "roles": ["ROLE_USER"]}
    const authService = fixture.debugElement.injector.get(AuthService)
    spyOn(authService, 'register').and.returnValue(Rx.of(response))
    spyOn(component, 'reloadPage')
    const spyRouter = spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));
    const spySweetAlert = spyOn(Swal ,'fire').and.callThrough()

    component.onSubmit();
    expect(Swal.isVisible()).toBeTruthy()
    Swal.clickConfirm()
    tick(1000)

    expect(spyRouter).toHaveBeenCalledWith(['/login'])
    expect(spySweetAlert).toHaveBeenCalled()
  }));

  it('test form onSubmit() with error response', fakeAsync(() => {
    const { username, password, passwordRepeat } = component.form.controls;

    const authService = fixture.debugElement.injector.get(AuthService)
    const mockErrorResponse = { status: 401, statusText:"Unauthorized", error: { message: 'Something went wrong.' } };
    spyOn(authService, 'register').and.returnValue(throwError(() => mockErrorResponse));
    const spySweetAlert = spyOn(Swal,"fire")

    component.onSubmit();
    tick(1000)

    expect(spySweetAlert).toHaveBeenCalled()
    expect(username.valid).toBeFalse()
    expect(password.valid).toBeFalse()
    expect(passwordRepeat.valid).toBeFalse()
  }));

  it('should redirect when user is logged in', fakeAsync(() => {
    const storageService = fixture.debugElement.injector.get(StorageService)
    spyOn(storageService, 'isLoggedIn').and.returnValue(true)
    spyOn(component, 'reloadPage')
    const spyRouter = spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));
    component.ngOnInit()
    expect(spyRouter).toHaveBeenCalledWith(['/user-lists'])
  }));

  it('#intergration  successful register', fakeAsync(() => {
    const expectedDataResponse = {
      "id": 1,
      "username": "test",
      "roles": [
        "ROLE_USER"
      ]
    }

    const { username, password, passwordRepeat} = component.form.controls;
    username.setValue('test');
    password.setValue('pass');
    passwordRepeat.setValue('pass');
    expect(component.form.valid).toBeTruthy();
    fixture.detectChanges();

    const authService = fixture.debugElement.injector.get(AuthService)
    const storageService = fixture.debugElement.injector.get(StorageService)
    const spyAuthRegister = spyOn(authService, 'register').and.callThrough()
    const spyOnSubmit = spyOn(component, 'onSubmit').and.callThrough()
    const spyRouter = spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));
    const spySweetAlert = spyOn(Swal,"fire").and.callThrough()
    spyOn(component, 'reloadPage')

    const btn = fixture.debugElement.nativeElement.querySelector('.register-btn')
    btn.click()

    const request = httpTestingController.expectOne('http://localhost:8080/api/auth/'+ 'signup');
    expect(request.request.method).toBe('POST');
    expect(request.request.responseType).toBe('json')
    request.flush(expectedDataResponse);

    expect(Swal.isVisible()).toBeTruthy()
    Swal.clickConfirm()
    tick(1000)

    expect(spyAuthRegister).toHaveBeenCalled()
    expect(spyOnSubmit).toHaveBeenCalled()
    expect(spyRouter).toHaveBeenCalledWith(['/login'])
    expect(storageService.isLoggedIn()).toBeFalsy()
    expect(component.isLoggedIn).toBeFalsy()
    expect(spySweetAlert).toHaveBeenCalled()
  }));

  it('#intergration  error register', fakeAsync(() => {
    const mockErrorResponse = { status: 500, statusText:"Unauthorized", error: { message: 'Server error' } };
    const expectedErrorData = {
      "path": "/api/auth/signin",
      "error": "Unauthorized",
      "message": "server error ",
      "status": 500
    }

    const { username, password, passwordRepeat} = component.form.controls;
    username.setValue('test');
    password.setValue('pass');
    passwordRepeat.setValue('pass');
    expect(component.form.valid).toBeTruthy();
    fixture.detectChanges();

    const authService = fixture.debugElement.injector.get(AuthService)
    const storageService = fixture.debugElement.injector.get(StorageService)
    const spyAuthRegister = spyOn(authService, 'register').and.callThrough()
    const spyOnSubmit = spyOn(component, 'onSubmit').and.callThrough()
    const spyRouter = spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));
    const spySweetAlert = spyOn(Swal,"fire")

    const btn = fixture.debugElement.nativeElement.querySelector('.register-btn')
    btn.click()

    const request = httpTestingController.expectOne('http://localhost:8080/api/auth/'+ 'signup');
    expect(request.request.method).toBe('POST');
    expect(request.request.responseType).toBe('json')
    request.flush(expectedErrorData, mockErrorResponse);
    tick(1000)

    expect(spyAuthRegister).toHaveBeenCalled()
    expect(spyOnSubmit).toHaveBeenCalled()
    expect(spyRouter).not.toHaveBeenCalledWith(['/login'])
    expect(storageService.isLoggedIn()).toBeFalsy()
    expect(component.isLoggedIn).toBeFalsy()
    expect(spySweetAlert).toHaveBeenCalled()
    expect(username.valid).toBeFalsy()
    expect(password.valid).toBeFalsy()
    expect(passwordRepeat.valid).toBeFalsy()
  }));
});
