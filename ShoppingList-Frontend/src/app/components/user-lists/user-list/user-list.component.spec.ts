import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';

import { UserListComponent } from './user-list.component';
import {List} from "../../../models/list";
import {commonTestImports, materialTestImports} from "../../../app.providers";
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from "@angular/material/core";
import {MomentDateAdapter} from "@angular/material-moment-adapter";
import {CUSTOM_DATE_FORMATS} from "../../../models/custom-date-formats";
import * as Rx from "rxjs";
import {throwError} from "rxjs";
import Swal from "sweetalert2";
import {UserListsService} from "../../../services/user-lists.service";

describe('UserListComponent', () => {
  let component: UserListComponent;
  let fixture: ComponentFixture<UserListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserListComponent ],
      imports: [... commonTestImports, ... materialTestImports],
      providers: [
        {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
        {provide: MAT_DATE_FORMATS, useValue: CUSTOM_DATE_FORMATS}]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserListComponent);
    component = fixture.componentInstance;
    component.list = new List("test shopping list name", "2022-12-16", 2)
    component.list.isBeingEditing = false
    component.index = 1
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('delete button should trigger deleteList()', () => {
    const deleteBtn = fixture.debugElement.nativeElement.querySelector(".delete_button")
    expect(deleteBtn).toBeDefined()
    const spyDeleteItem = spyOn(component, 'deleteList')
    deleteBtn.click()

    expect(spyDeleteItem).toHaveBeenCalledWith(component.list)
  });

  it('edit button should do editable list', () => {
    const editBtn = fixture.debugElement.nativeElement.querySelector(".edit_button")
    expect(editBtn).toBeDefined()
    const spyDoEditable = spyOn(component, 'doEditable').and.callThrough()
    editBtn.click()

    expect(spyDoEditable).toHaveBeenCalledWith(component.list)
    expect(component.list.isBeingEditing).toBeTruthy()
  });

  it('should emit removeList when successful deletion', fakeAsync(() => {
    const listService = fixture.debugElement.injector.get(UserListsService)
    spyOn(listService, 'delete').and.returnValue(Rx.of(""))
    const spyRemoveEmit = spyOn(component.removeList, 'emit')
    component.deleteList(component.list)
    tick(1000)

    expect(spyRemoveEmit).toHaveBeenCalled()
  }));

  it('should show sweetAlert when deletion failed', fakeAsync(() => {
    const listService = fixture.debugElement.injector.get(UserListsService)
    const mockErrorResponse = { status: 401, statusText:"Unauthorized", error: { message: 'Smth went wrong' } };
    spyOn(listService, 'delete').and.returnValue(throwError(() => mockErrorResponse));
    const spySweetAlert = spyOn(Swal, 'fire')

    component.deleteList(component.list)
    tick(1000)

    expect(spySweetAlert).toHaveBeenCalled()
  }));

});
