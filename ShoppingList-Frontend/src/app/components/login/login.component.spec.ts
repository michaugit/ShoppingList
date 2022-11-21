import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';

import { LoginComponent } from './login.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {RouterTestingModule} from "@angular/router/testing";
import {TranslateModule} from "@ngx-translate/core";

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoginComponent ],
      imports: [FormsModule, ReactiveFormsModule, HttpClientTestingModule, RouterTestingModule,
        TranslateModule.forRoot()]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
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

  it('submit should trigger onSubmit() function', fakeAsync(() => {
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

});
