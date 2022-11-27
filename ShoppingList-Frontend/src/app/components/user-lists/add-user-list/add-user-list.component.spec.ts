import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';

import { AddUserListComponent } from './add-user-list.component';
import {commonTestImports, materialTestImports} from "../../../app.providers";
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from "@angular/material/core";
import {MomentDateAdapter} from "@angular/material-moment-adapter";
import {CUSTOM_DATE_FORMATS} from "../../../models/custom-date-formats";
import * as Rx from "rxjs";
import {UserListsService} from "../../../services/user-lists.service";
import {ListRequest} from "../../../models/requests/listRequest";
import {throwError} from "rxjs";
import Swal from "sweetalert2";
import {SimpleListResponse} from "../../../models/responses/simpleListResponse";

describe('AddUserListComponent', () => {
  let component: AddUserListComponent;
  let fixture: ComponentFixture<AddUserListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddUserListComponent ],
      imports: [... commonTestImports, ... materialTestImports],
      providers: [
        {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
        {provide: MAT_DATE_FORMATS, useValue: CUSTOM_DATE_FORMATS}]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddUserListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('empty form should be invalid', () =>{
    expect(component.form.valid).toBeFalsy()
  });

  it('without date form should be invalid', () =>{
    const {name, date} = component.form.controls
    name.setValue("test shopping list name")
    fixture.detectChanges()
    expect(date.value).toBe("")
    expect(component.form.valid).toBeFalsy()
  });

  it('properly filled form should be valid', () =>{
    const {name, date} = component.form.controls
    name.setValue("test shopping list name")
    date.setValue("2022-12-14")
    fixture.detectChanges()
    expect(component.form.valid).toBeTruthy()
  });

  it('wrong date format in filled form should be invalid', () =>{
    const {name, date} = component.form.controls
    name.setValue("test shopping list name")
    date.setValue("20-12-2022")
    fixture.detectChanges()
    expect(component.form.valid).toBeFalsy()
  });

  it('add button should be disabled if form not valid', () =>{
    expect(component.form.valid).toBeFalsy()
    const addButton = fixture.debugElement.nativeElement.querySelector('.add_button')
    expect(addButton.disabled).toBeTruthy()
  });

  it('add button should be visible if form valid', () =>{
    const {name, date} = component.form.controls
    const addButton = fixture.debugElement.nativeElement.querySelector('.add_button')
    name.setValue("test shopping list name")
    date.setValue("2022-12-14")
    fixture.detectChanges()

    expect(component.form.valid).toBeTruthy()
    expect(addButton.disabled).toBeFalsy()
  });

  it('add button should trigger addList() function', fakeAsync( () => {
    const {name, date} = component.form.controls
    name.setValue("test shopping list name")
    date.setValue("2022-12-14")
    fixture.detectChanges()

    const spyAddList = spyOn(component, 'addList');
    const addBtn = fixture.debugElement.nativeElement.querySelector('.add_button')
    addBtn.click()
    tick(1000)

    expect(spyAddList).toHaveBeenCalled();
  }));

  it('cancel button should clear form', fakeAsync( () => {
    const {name, date} = component.form.controls;
    name.setValue("test shopping list name")
    date.setValue("2022-12-14")
    fixture.detectChanges()

    const spyCancel = spyOn(component, 'cancel').and.callThrough()
    const cancelBtn = fixture.debugElement.nativeElement.querySelector('.cancel_button')
    cancelBtn.click()
    tick(1000)

    fixture.detectChanges()
    expect(spyCancel).toHaveBeenCalled()
    expect(name.value).toBeNull()
    expect(date.value).toBeNull()
  }));

  it('addList should call listService with proper data', fakeAsync(() => {
    const listService = fixture.debugElement.injector.get(UserListsService)
    const spyListService = spyOn(listService, 'create').and.returnValue(Rx.of())
    const {name, date} = component.form.controls;
    name.setValue("test shopping list name")
    date.setValue("2022-12-14")
    component.addList()

    const expectedListRequest: ListRequest = {'name': 'test shopping list name', 'date': "2022-12-14"}

    expect(spyListService).toHaveBeenCalledWith(expectedListRequest)
  }));

  it('should emit refresh when list successfully added', fakeAsync(() => {
    const {name, date} = component.form.controls;
    name.setValue("test shopping list name")
    date.setValue("2022-12-14")
    const testResponse: SimpleListResponse = {'id': 1, 'name': 'test shopping list name', 'date': "2022-12-14"}
    const listService = fixture.debugElement.injector.get(UserListsService)
    spyOn(listService, 'create').and.returnValue(Rx.of(testResponse))
    const spyRefreshEmit = spyOn(component.refreshUserLists, 'emit')
    component.addList()
    tick(1000)

    expect(spyRefreshEmit).toHaveBeenCalled()
  }));

  it('should show sweetAlert when list adding failed', fakeAsync(() => {
    const {name, date} = component.form.controls;
    name.setValue("test shopping list name")
    date.setValue("2022-12-14")
    const listService = fixture.debugElement.injector.get(UserListsService)
    const mockErrorResponse = { status: 401, statusText:"Unauthorized", error: { message: 'Smth went wrong' } };
    spyOn(listService, 'create').and.returnValue(throwError(() => mockErrorResponse));
    const spySweetAlert = spyOn(Swal, 'fire')

    component.addList()
    tick(1000)

    expect(spySweetAlert).toHaveBeenCalled()
  }));

});
