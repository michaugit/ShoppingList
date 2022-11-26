import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';

import { UserListsComponent } from './user-lists.component';
import * as Rx from "rxjs";
import {throwError} from "rxjs";
import Swal from "sweetalert2";
import {HttpTestingController} from "@angular/common/http/testing";
import {commonTestImports, materialTestImports} from "../../app.providers";
import {AddUserListComponent} from "./add-user-list/add-user-list.component";
import {List} from "../../models/list";
import {StorageService} from "../../services/auth/storage.service";
import {Router} from "@angular/router";
import {UserListComponent} from "./user-list/user-list.component";
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from "@angular/material/core";
import {MomentDateAdapter} from "@angular/material-moment-adapter";
import {CUSTOM_DATE_FORMATS} from "../../models/custom-date-formats";
import {UserListsResponse} from "../../models/responses/userListsResponse";
import {UserListsService} from "../../services/user-lists.service";

describe('UserListsComponent', () => {
  let component: UserListsComponent;
  let fixture: ComponentFixture<UserListsComponent>;
  let httpTestingController: HttpTestingController;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserListsComponent, AddUserListComponent, UserListComponent],
      imports: [... commonTestImports, ... materialTestImports],
      providers: [
        {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
        {provide: MAT_DATE_FORMATS, useValue: CUSTOM_DATE_FORMATS}]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserListsComponent);
    component = fixture.componentInstance;
    component.lists.push(new List("test name", "2022-11-26", 1))
    fixture.detectChanges();
    router = TestBed.inject(Router)
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should redirect if user is not logged in', () => {
    const storageService = fixture.debugElement.injector.get(StorageService)
    spyOn(storageService, 'isLoggedIn').and.returnValue(false)
    const spyRouter = spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));
    component.ngOnInit()
    expect(spyRouter).toHaveBeenCalledWith(['/login'])
  });

  it('should fetch lists if user is logged in', () => {
    const storageService = fixture.debugElement.injector.get(StorageService)
    spyOn(storageService, 'isLoggedIn').and.returnValue(true)
    const spyRefreshLists = spyOn(component, 'refreshUserLists')
    component.ngOnInit()
    expect(spyRefreshLists).toHaveBeenCalled()
  });

  it('should contain add-user-list-component', () => {
    const addListItemComponent = fixture.debugElement.nativeElement.querySelector('app-user-list')
    expect(addListItemComponent).toBeDefined()
  });

  it('should contain user-list-component when number of items more than zero', () => {
    expect(component.lists.length).toBeGreaterThan(0)
    const listItemComponent = fixture.debugElement.nativeElement.querySelector('app-user-list')
    expect(listItemComponent).toBeDefined()
  });

  it('should not contain user-list-component when number of items equals zero', () => {
    component.lists = []
    fixture.detectChanges()
    expect(component.lists.length).toBe(0)
    const listItemComponent = fixture.debugElement.nativeElement.querySelector('app-user-list')
    expect(listItemComponent).toBeNull()
  });

  it('items should be refreshed when request successful', fakeAsync( () => {
    const listService = fixture.debugElement.injector.get(UserListsService)
    const response: UserListsResponse={
      "shoppingLists": [
        {"id": 1, "name": "test name", "date": "2022-11-26"},
        {"id": 2, "name": "test name2", "date": "2022-11-27"}]}
    spyOn(listService, 'getUserLists').and.returnValue(Rx.of(response))
    component.refreshUserLists()
    expect(component.lists.length).toBe(2)
  }));

  it('should display sweetAlert when request error', fakeAsync( () => {
    const listService = fixture.debugElement.injector.get(UserListsService)
    const mockErrorResponse = { status: 401, statusText:"Unauthorized", error: { message: 'Smth went wrong' } };
    spyOn(listService, 'getUserLists').and.returnValue(throwError(() => mockErrorResponse))
    const spySweetAlert = spyOn(Swal, "fire")
    component.refreshUserLists()
    tick(1000)

    expect(component.lists.length).toBe(1)
    expect(spySweetAlert).toHaveBeenCalled()
  }));

  it( 'removeList() should remove list from components list', fakeAsync( () => {
    const listToRemove = component.lists[0]
    component.removeList(listToRemove)
    expect(component.lists.find(function (list){return list.id == listToRemove.id})).toBeUndefined()
  }));
});
