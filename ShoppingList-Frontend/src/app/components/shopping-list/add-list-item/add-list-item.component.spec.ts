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
import {UserListsService} from "../../../services/user-lists.service";

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


  it('#integration successful add new item', fakeAsync(() => {
    const expectedDataResponse = {
      "id": 1,
      "text": "Chleb",
      "quantity": 1.0,
      "unit": "COUNT",
      "image": "iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAApgAAAKYB3X3/OAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAANCSURBVEiJtZZPbBtFFMZ/M7ubXdtdb1xSFyeilBapySVU8h8OoFaooFSqiihIVIpQBKci6KEg9Q6H9kovIHoCIVQJJCKE1ENFjnAgcaSGC6rEnxBwA04Tx43t2FnvDAfjkNibxgHxnWb2e/u992bee7tCa00YFsffekFY+nUzFtjW0LrvjRXrCDIAaPLlW0nHL0SsZtVoaF98mLrx3pdhOqLtYPHChahZcYYO7KvPFxvRl5XPp1sN3adWiD1ZAqD6XYK1b/dvE5IWryTt2udLFedwc1+9kLp+vbbpoDh+6TklxBeAi9TL0taeWpdmZzQDry0AcO+jQ12RyohqqoYoo8RDwJrU+qXkjWtfi8Xxt58BdQuwQs9qC/afLwCw8tnQbqYAPsgxE1S6F3EAIXux2oQFKm0ihMsOF71dHYx+f3NND68ghCu1YIoePPQN1pGRABkJ6Bus96CutRZMydTl+TvuiRW1m3n0eDl0vRPcEysqdXn+jsQPsrHMquGeXEaY4Yk4wxWcY5V/9scqOMOVUFthatyTy8QyqwZ+kDURKoMWxNKr2EeqVKcTNOajqKoBgOE28U4tdQl5p5bwCw7BWquaZSzAPlwjlithJtp3pTImSqQRrb2Z8PHGigD4RZuNX6JYj6wj7O4TFLbCO/Mn/m8R+h6rYSUb3ekokRY6f/YukArN979jcW+V/S8g0eT/N3VN3kTqWbQ428m9/8k0P/1aIhF36PccEl6EhOcAUCrXKZXXWS3XKd2vc/TRBG9O5ELC17MmWubD2nKhUKZa26Ba2+D3P+4/MNCFwg59oWVeYhkzgN/JDR8deKBoD7Y+ljEjGZ0sosXVTvbc6RHirr2reNy1OXd6pJsQ+gqjk8VWFYmHrwBzW/n+uMPFiRwHB2I7ih8ciHFxIkd/3Omk5tCDV1t+2nNu5sxxpDFNx+huNhVT3/zMDz8usXC3ddaHBj1GHj/As08fwTS7Kt1HBTmyN29vdwAw+/wbwLVOJ3uAD1wi/dUH7Qei66PfyuRj4Ik9is+hglfbkbfR3cnZm7chlUWLdwmprtCohX4HUtlOcQjLYCu+fzGJH2QRKvP3UNz8bWk1qMxjGTOMThZ3kvgLI5AzFfo379UAAAAASUVORK5CYII=",
      "done": false
    }

    const {text, quantity, unit} = component.form.controls
    text.setValue("Chleb")
    quantity.setValue('1.0')
    unit.setValue("COUNT")
    component.selectedFile =  new File([""], 'testName')
    expect(component.form.valid).toBeTruthy()
    fixture.detectChanges()

    const itemService = fixture.debugElement.injector.get(ItemService)
    const spyItemCreate = spyOn(itemService, 'create').and.callThrough()
    const spyRefreshEmit = spyOn(component.refreshItems, 'emit')

    const addBtn = fixture.debugElement.nativeElement.querySelector('.add_button')
    addBtn.click()
    tick(1000)

    const request = httpTestingController.expectOne('http://localhost:8080/api/item/'+ 'add');
    expect(request.request.method).toBe('POST');
    expect(request.request.responseType).toBe('json')
    request.flush(expectedDataResponse);

    expect(spyItemCreate).toHaveBeenCalled()
    expect(spyRefreshEmit).toHaveBeenCalled()
  }));

  it('#integration error add new item', fakeAsync(() => {
    const mockErrorResponse = { status: 401, statusText:"Unauthorized", error: { message: 'Full authentication is required to access this resource.' } };
    const expectedDataResponse = {
      "path": "/api/list/add",
      "error": "Unauthorized",
      "message": "Full authentication is required to access this resource",
      "status": 401
    }

    const {text, quantity, unit} = component.form.controls
    text.setValue("Chleb")
    quantity.setValue('1.0')
    unit.setValue("COUNT")
    component.selectedFile =  new File([""], 'testName')
    expect(component.form.valid).toBeTruthy()
    fixture.detectChanges()

    const itemService = fixture.debugElement.injector.get(ItemService)
    const spyItemCreate = spyOn(itemService, 'create').and.callThrough()
    const spyRefreshEmit = spyOn(component.refreshItems, 'emit')
    const spySweetAlert = spyOn(Swal,"fire")

    const addBtn = fixture.debugElement.nativeElement.querySelector('.add_button')
    addBtn.click()
    tick(1000)

    const request = httpTestingController.expectOne('http://localhost:8080/api/item/'+ 'add');
    expect(request.request.method).toBe('POST');
    expect(request.request.responseType).toBe('json')
    request.flush(expectedDataResponse, mockErrorResponse);

    expect(spyItemCreate).toHaveBeenCalled()
    expect(spyRefreshEmit).not.toHaveBeenCalled()
    expect(spySweetAlert).toHaveBeenCalled()
  }));


});
