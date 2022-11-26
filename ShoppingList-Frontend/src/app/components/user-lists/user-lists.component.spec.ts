import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';

import { UserListsComponent } from './user-lists.component';
import {ItemService} from "../../services/item.service";
import {ListResponse} from "../../models/responses/listResponse";
import UnitService from "../../services/unitService";
import * as Rx from "rxjs";
import {throwError} from "rxjs";
import Swal from "sweetalert2";
import {HttpTestingController} from "@angular/common/http/testing";
import {commonTestImports, materialTestImports} from "../../app.providers";
import {AddUserListComponent} from "./add-user-list/add-user-list.component";
import {EditUserListComponent} from "./edit-user-list/edit-user-list.component";
import {List} from "../../models/list";
import {StorageService} from "../../services/auth/storage.service";
import {Router} from "@angular/router";
import {UserListComponent} from "./user-list/user-list.component";
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from "@angular/material/core";
import {MomentDateAdapter} from "@angular/material-moment-adapter";
import {CUSTOM_DATE_FORMATS} from "../../models/custom-date-formats";

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
  //
  // it('should contain add-list-item-component', () => {
  //   const addListItemComponent = fixture.debugElement.nativeElement.querySelector('app-add-list-item')
  //   expect(addListItemComponent).toBeDefined()
  // });
  //
  // it('should contain list-item-component when number of items more than zero', () => {
  //   expect(component.items.length).toBeGreaterThan(0)
  //   const listItemComponent = fixture.debugElement.nativeElement.querySelector('app-list-item')
  //   expect(listItemComponent).toBeDefined()
  // });
  //
  // it('should not contain list-item-component when number of items equals zero', () => {
  //   component.items = []
  //   fixture.detectChanges()
  //   expect(component.items.length).toBe(0)
  //   const listItemComponent = fixture.debugElement.nativeElement.querySelector('app-list-item')
  //   expect(listItemComponent).toBeNull()
  // });
  //
  // it('items should be refreshed when request successful', fakeAsync( () => {
  //   const itemService = fixture.debugElement.injector.get(ItemService)
  //   const response: ListResponse={
  //     "listId": component.listId,
  //     "listName": "testName",
  //     "date" : "2022-11-26",
  //     "items": [{'id': 1, 'text': 'any product', 'quantity': 2, 'unit': UnitService.getDefaultUnit()[1], 'done': false, "image": null},
  //       {'id': 2, 'text': 'any product', 'quantity': 2, 'unit': UnitService.getDefaultUnit()[1], 'done': false, "image": null}]}
  //   spyOn(itemService, 'getListItems').and.returnValue(Rx.of(response))
  //   component.refreshItems()
  //   expect(component.items.length).toBe(2)
  // }));
  //
  // it('should display sweetAlert when request error', fakeAsync( () => {
  //   const itemService = fixture.debugElement.injector.get(ItemService)
  //   const mockErrorResponse = { status: 401, statusText:"Unauthorized", error: { message: 'Smth went wrong' } };
  //   spyOn(itemService, 'getListItems').and.returnValue(throwError(() => mockErrorResponse))
  //   const spySweetAlert = spyOn(Swal, "fire")
  //   component.refreshItems()
  //   tick(1000)
  //
  //   expect(component.items.length).toBe(1)
  //   expect(spySweetAlert).toHaveBeenCalled()
  // }));
  //
  // it( 'removeItem() should remove items from components list', fakeAsync( () => {
  //   const itemToRemove = component.items[0]
  //   component.removeItem(itemToRemove)
  //   expect(component.items.find(function (listItem){return listItem.id == itemToRemove.id})).toBeUndefined()
  // }));
});
