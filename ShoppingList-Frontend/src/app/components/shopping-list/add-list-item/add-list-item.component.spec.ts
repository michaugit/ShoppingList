import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';

import { AddListItemComponent } from './add-list-item.component';
import {HttpTestingController} from "@angular/common/http/testing";
import {Router} from "@angular/router";
import {commonTestImports, materialTestImports} from "../../../app.providers";
import * as Rx from "rxjs";
import {By} from "@angular/platform-browser";
import {ItemService} from "../../../services/item.service";
import {ItemRequest} from "../../../models/requests/itemRequest";
import {throwError} from "rxjs";
import Swal from "sweetalert2";
import {TranslateService} from "@ngx-translate/core";

describe('AddListItemComponent', () => {
  let component: AddListItemComponent;
  let fixture: ComponentFixture<AddListItemComponent>;
  let httpTestingController: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddListItemComponent ],
      imports: [... commonTestImports, ... materialTestImports]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddListItemComponent);
    component = fixture.componentInstance;
    component.listId = 45;
    fixture.detectChanges();
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('empty form should be invalid', () =>{
    expect(component.form.valid).toBeFalsy()
  });

  it('form with text of Item should be valid', () => {
    const {text} = component.form.controls
    text.setValue("some item to buy name")
    expect(text.valid).toBeTruthy()
  });

  it('empty autocomplete input should contains all default products', async () => {
    const text = fixture.debugElement.query(By.css('.text-input'))
    text.nativeElement.dispatchEvent(new Event('focusin'));
    text.nativeElement.value = "";
    text.nativeElement.dispatchEvent(new Event('input'));

    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const matOptions = document.querySelectorAll('mat-option')
    expect(matOptions.length).toBe(component.commonProducts.length)
  });

  it('non empty autocomplete input should contains less products than default', async () => {
    const text = fixture.debugElement.query(By.css('.text-input'))
    text.nativeElement.dispatchEvent(new Event('focusin'));
    text.nativeElement.value = "mmmm";
    text.nativeElement.dispatchEvent(new Event('input'));

    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const matOptions = document.querySelectorAll('mat-option')
    expect(matOptions.length).toBeLessThan(component.commonProducts.length)
  });

  it('text input should call onSelectionChanged when option selected', async () => {
    const text = fixture.debugElement.query(By.css('.text-input'))
    text.nativeElement.dispatchEvent(new Event('focusin'));
    const matOptions = document.querySelectorAll('mat-option')
    const optionToClick = matOptions[0] as HTMLElement
    const spyOnSelectionChanged = spyOn(component, 'onSelectionChanged')
    optionToClick.click()

    fixture.detectChanges();
    await fixture.whenStable();

    expect(spyOnSelectionChanged).toHaveBeenCalled()
  });

  it('image input should call selectFiles() after change', async () => {
    const spySelectFiles = spyOn(component, 'selectFiles')
    const image = fixture.debugElement.query(By.css('#fileInput'))
    image.nativeElement.dispatchEvent(new Event('change'));

    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(spySelectFiles).toHaveBeenCalled()
  });

  it('add button should call addItem() function', fakeAsync(() => {
    const {text} = component.form.controls;
    text.setValue('test');
    expect(component.form.valid).toBeTruthy();
    fixture.detectChanges();

    spyOn(component, 'addItem');
    const addBtn = fixture.debugElement.nativeElement.querySelector('.add_button')
    addBtn.click()
    expect(component.addItem).toHaveBeenCalled();
  }));

  it('cancel button should call clearForm() function', fakeAsync(() => {
    spyOn(component, 'clearForm');
    const cancelBtn = fixture.debugElement.nativeElement.querySelector('.cancel_button')
    cancelBtn.click()
    expect(component.clearForm).toHaveBeenCalled();
  }));

  it('onInit() should set default values in form', fakeAsync(() => {
    const {quantity, unit} = component.form.controls
    const spySetDefaultValues = spyOn(component, 'setDefaultValues').and.callThrough()
    component.ngOnInit()
    fixture.detectChanges();
    expect(spySetDefaultValues).toHaveBeenCalled()
    expect(component.filteredOptions).toBeDefined()
    expect(quantity.value).toBe("1")
    expect(unit.value).not.toBe("")
  }));


  it('addItem should call itemService with proper data', fakeAsync(() => {
    const itemService = fixture.debugElement.injector.get(ItemService)
    const spyItemService = spyOn(itemService, 'create').and.returnValue(Rx.of(""))
    const {text, quantity, unit} = component.form.controls
    text.setValue("any product")
    quantity.setValue('2')
    unit.setValue("kg")
    let blob = new Blob([""], { type: 'image' });
    component.selectedFile =  <File>blob;
    component.addItem()

    const expectedItemRequest: ItemRequest = {'text': 'any product', 'quantity': 2, 'unit': 'kg', 'listId': + component.listId, 'done': false}

    expect(spyItemService).toHaveBeenCalledWith(expectedItemRequest, component.selectedFile)
  }));

  it('should emit refresh when item successfully added', fakeAsync(() => {
    const itemService = fixture.debugElement.injector.get(ItemService)
    spyOn(itemService, 'create').and.returnValue(Rx.of(""))
    const spyRefreshEmit = spyOn(component.refreshItems, 'emit')
    component.addItem()
    tick(1000)
    expect(spyRefreshEmit).toHaveBeenCalled()
  }));

  it('should show sweetAlert when item adding failed', fakeAsync(() => {
    const itemService = fixture.debugElement.injector.get(ItemService)
    const mockErrorResponse = { status: 401, statusText:"Unauthorized", error: { message: 'Smth went wrong' } };
    spyOn(itemService, 'create').and.returnValue(throwError(() => mockErrorResponse));
    const spySweetAlert = spyOn(Swal, 'fire')

    component.addItem()
    tick(1000)

    expect(spySweetAlert).toHaveBeenCalled()
  }));

  it('onSelectionChanged() should translate selected option', fakeAsync( () => {
    const translateService = fixture.debugElement.injector.get(TranslateService)
    const spyTranslateService = spyOn(translateService, 'instant').and.returnValue("translatedValue")
    const event = {option: {value: "selectedValue"}}
    const {text} = component.form.controls

    component.onSelectionChanged(event)

    expect(spyTranslateService).toHaveBeenCalled()
    expect(text.value).toBe("translatedValue")
  }));


  it('selectFiles() should set name of file', fakeAsync( () => {
    const file = new File([""], 'testName')
    const event = {target: {files: [file], result: "testResult"}}
    const {image} = component.form.controls

    component.selectFiles(event)
    fixture.detectChanges()
    tick()

    expect(image.value).toBe('testName')
  }));

  it('delete picture button should be hidden when selectedFile is undefined', fakeAsync( () => {
    component.selectedFile = undefined
    fixture.detectChanges()
    const delBtn = fixture.debugElement.query(By.css('.add_item_image_row button'))
    expect(delBtn.nativeElement.hidden).toBeTruthy()
  }));

  it('delete picture button should be visible when selectedFile is defined', fakeAsync( () => {
    component.selectedFile =  new File([""], 'testName')
    fixture.detectChanges()
    expect(component.selectedFile).toBeDefined()
    const delBtn = fixture.debugElement.query(By.css('.add_item_image_row button'))
    expect(delBtn.nativeElement.hidden).toBeFalse()
  }));

  it('delete picture button should clear image data', fakeAsync( () => {
    component.selectedFile =  new File([""], 'testName')
    expect(component.selectedFile).toBeDefined()
    fixture.detectChanges()
    const delBtn = fixture.debugElement.query(By.css('.add_item_image_row button'))
    const delBtnHtml = delBtn.nativeElement as HTMLElement
    const spyDeletePicture = spyOn(component, 'deletePicture').and.callThrough()

    delBtnHtml.click()

    expect(spyDeletePicture).toHaveBeenCalled()
    expect(component.selectedFile).toBeUndefined()
    expect(component.photoPreview).toBeUndefined()
  }));



});
