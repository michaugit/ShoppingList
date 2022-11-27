import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';

import { EditUserListComponent } from './edit-user-list.component';
import {commonTestImports, materialTestImports} from "../../../app.providers";
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from "@angular/material/core";
import {MomentDateAdapter} from "@angular/material-moment-adapter";
import {CUSTOM_DATE_FORMATS} from "../../../models/custom-date-formats";
import {List} from "../../../models/list";
import {formatDate} from "@angular/common";
import {UserListsService} from "../../../services/user-lists.service";
import * as Rx from "rxjs";
import {ListRequest} from "../../../models/requests/listRequest";
import {SimpleListResponse} from "../../../models/responses/simpleListResponse";
import {throwError} from "rxjs";
import Swal from "sweetalert2";

describe('EditUserListComponent', () => {
  let component: EditUserListComponent;
  let fixture: ComponentFixture<EditUserListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditUserListComponent ],
      imports: [... commonTestImports, ... materialTestImports],
      providers: [
        {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
        {provide: MAT_DATE_FORMATS, useValue: CUSTOM_DATE_FORMATS}]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditUserListComponent);
    component = fixture.componentInstance;
    component.list = new List("test shopping list name", "2022-12-16", 2)
    component.list.isBeingEditing = true
    component.index = 1
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should present data from item', () => {
    const {name, date} = component.form.controls
    expect(name.value).toBe(component.list.name)
    expect(formatDate(date.value, 'yyyy-MM-dd', 'en_US')).toBe(component.list.date)
  });

  it('empty form should be invalid', () =>{
    const {name, date} = component.form.controls
    name.setValue("")
    date.setValue("")
    expect(component.form.valid).toBeFalsy()
  });

  it('without date form should be invalid', () =>{
    const {name, date} = component.form.controls
    name.setValue("test shopping list name")
    date.setValue("")
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

  it('edit button should be disabled if form not valid', () => {
    const {name, date} = component.form.controls
    name.setValue("")
    date.setValue("")
    fixture.detectChanges()
    expect(component.form.valid).toBeFalsy()
    const addButton = fixture.debugElement.nativeElement.querySelector('.edit_button')
    expect(addButton.disabled).toBeTruthy()
  });

  it('edit button should be visible if form valid', () => {
    const addButton = fixture.debugElement.nativeElement.querySelector('.edit_button')

    expect(component.form.valid).toBeTruthy()
    expect(addButton.disabled).toBeFalsy()
  });

  it('edit button should trigger editList() function', fakeAsync( () => {
    const spyEditList = spyOn(component, 'editList');
    const editBtn = fixture.debugElement.nativeElement.querySelector('.edit_button')
    editBtn.click()
    tick(1000)

    expect(spyEditList).toHaveBeenCalled();
  }));

  it('cancel button change list.isBeingEdited to false and do not introduce changes', fakeAsync( () => {
    const oldName = component.list.name
    const oldDate = component.list.date
    const {name, date} = component.form.controls
    name.setValue("test shopping list name update")
    date.setValue("2024-12-20")
    fixture.detectChanges()

    expect(component.list.isBeingEditing).toBeTruthy()
    const cancelBtn = fixture.debugElement.nativeElement.querySelector('.cancel_button')
    cancelBtn.click()
    tick(1000)

    fixture.detectChanges()
    expect(component.list.isBeingEditing).toBeFalsy()
    expect(component.list.name).toBe(oldName)
    expect(component.list.date).toBe(oldDate)
  }));

  it('editList should call listService with proper data', fakeAsync(() => {
    const listService = fixture.debugElement.injector.get(UserListsService)
    const spyListService = spyOn(listService, 'update').and.returnValue(Rx.of())
    const {name, date} = component.form.controls;
    name.setValue("test shopping list name2")
    date.setValue("2022-12-14")
    component.editList()

    const expectedListRequest: ListRequest = {'name': 'test shopping list name2', 'date': "2022-12-14"}

    expect(spyListService).toHaveBeenCalledWith(component.list.id, expectedListRequest)
  }));

  it('should refresh list when successfully edited', fakeAsync(() => {
    const {name, date} = component.form.controls;
    name.setValue("test shopping list name2")
    date.setValue("2022-12-14")
    const testResponse: SimpleListResponse = {'id': 1, 'name': 'test shopping list name2', 'date': "2022-12-14"}
    const listService = fixture.debugElement.injector.get(UserListsService)
    spyOn(listService, 'update').and.returnValue(Rx.of(testResponse))
    const spyRefresh = spyOn(component, 'refreshList').and.callThrough()
    component.editList()
    tick(1000)

    expect(spyRefresh).toHaveBeenCalled()
    expect(component.list.name).toBe(testResponse.name)
    expect(component.list.date).toBe(testResponse.date)
    expect(component.list.isBeingEditing).toBe(false)
  }));

  it('should show sweetAlert when list adding failed', fakeAsync(() => {
    const {name, date} = component.form.controls;
    name.setValue("test shopping list name")
    date.setValue("2022-12-14")
    const listService = fixture.debugElement.injector.get(UserListsService)
    const mockErrorResponse = { status: 401, statusText:"Unauthorized", error: { message: 'Smth went wrong' } };
    spyOn(listService, 'update').and.returnValue(throwError(() => mockErrorResponse));
    const spySweetAlert = spyOn(Swal, 'fire')

    component.editList()
    tick(1000)

    expect(spySweetAlert).toHaveBeenCalled()
  }));

  it('should format date from String to Date', () => {
    const strDate = "2022-10-23"
    expect(component.formatDate(strDate)).toBeInstanceOf(Date)
  });
});
