import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';

import { EditListItemComponent } from './edit-list-item.component';
import {HttpTestingController} from "@angular/common/http/testing";
import {Item} from "../../../models/item";
import UnitService from "../../../services/unitService";
import {commonTestImports, materialTestImports} from "../../../app.providers";
import {By} from "@angular/platform-browser";
import {ItemService} from "../../../services/item.service";
import * as Rx from "rxjs";
import {ItemRequest} from "../../../models/requests/itemRequest";
import {ItemResponse} from "../../../models/responses/itemResponse";
import {throwError} from "rxjs";
import Swal from "sweetalert2";
import {TranslateService} from "@ngx-translate/core";

describe('EditListItemComponent', () => {
  let component: EditListItemComponent;
  let fixture: ComponentFixture<EditListItemComponent>;
  let httpTestingController: HttpTestingController;


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditListItemComponent ],
      imports: [... commonTestImports, ... materialTestImports]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditListItemComponent);
    component = fixture.componentInstance;
    let imageBase64 = "iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAApgAAAKYB3X3/OAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAANCSURBVEiJtZZPbBtFFMZ/M7ubXdtdb1xSFyeilBapySVU8h8OoFaooFSqiihIVIpQBKci6KEg9Q6H9kovIHoCIVQJJCKE1ENFjnAgcaSGC6rEnxBwA04Tx43t2FnvDAfjkNibxgHxnWb2e/u992bee7tCa00YFsffekFY+nUzFtjW0LrvjRXrCDIAaPLlW0nHL0SsZtVoaF98mLrx3pdhOqLtYPHChahZcYYO7KvPFxvRl5XPp1sN3adWiD1ZAqD6XYK1b/dvE5IWryTt2udLFedwc1+9kLp+vbbpoDh+6TklxBeAi9TL0taeWpdmZzQDry0AcO+jQ12RyohqqoYoo8RDwJrU+qXkjWtfi8Xxt58BdQuwQs9qC/afLwCw8tnQbqYAPsgxE1S6F3EAIXux2oQFKm0ihMsOF71dHYx+f3NND68ghCu1YIoePPQN1pGRABkJ6Bus96CutRZMydTl+TvuiRW1m3n0eDl0vRPcEysqdXn+jsQPsrHMquGeXEaY4Yk4wxWcY5V/9scqOMOVUFthatyTy8QyqwZ+kDURKoMWxNKr2EeqVKcTNOajqKoBgOE28U4tdQl5p5bwCw7BWquaZSzAPlwjlithJtp3pTImSqQRrb2Z8PHGigD4RZuNX6JYj6wj7O4TFLbCO/Mn/m8R+h6rYSUb3ekokRY6f/YukArN979jcW+V/S8g0eT/N3VN3kTqWbQ428m9/8k0P/1aIhF36PccEl6EhOcAUCrXKZXXWS3XKd2vc/TRBG9O5ELC17MmWubD2nKhUKZa26Ba2+D3P+4/MNCFwg59oWVeYhkzgN/JDR8deKBoD7Y+ljEjGZ0sosXVTvbc6RHirr2reNy1OXd6pJsQ+gqjk8VWFYmHrwBzW/n+uMPFiRwHB2I7ih8ciHFxIkd/3Omk5tCDV1t+2nNu5sxxpDFNx+huNhVT3/zMDz8usXC3ddaHBj1GHj/As08fwTS7Kt1HBTmyN29vdwAw+/wbwLVOJ3uAD1wi/dUH7Qei66PfyuRj4Ik9is+hglfbkbfR3cnZm7chlUWLdwmprtCohX4HUtlOcQjLYCu+fzGJH2QRKvP3UNz8bWk1qMxjGTOMThZ3kvgLI5AzFfo379UAAAAASUVORK5CYII="
    component.item = new Item(1, 2, "test item text", 3, UnitService.getDefaultUnit()[2], false, imageBase64 )
    component.item.isBeingEditing = true
    component.index = 45;
    fixture.detectChanges();
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should present data from item', () => {
    const {text, quantity, unit, image} = component.form.controls

    expect(text.value).toBe(component.item.text)
    expect(quantity.value).toBe(component.item.quantity)
    expect(unit.value).toBe(component.item.unit)
    expect(image.value).toBe("")
  });

  it('empty text should be invalid form', () => {
    const {text} = component.form.controls
    text.setValue("")
    expect(text.value).toBe("")

    expect(component.form.valid).toBeFalse()
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
    const {text} = component.form.controls
    text.setValue("")
    fixture.detectChanges()
    const textDebug = fixture.debugElement.query(By.css('.text-input'))
    textDebug.nativeElement.dispatchEvent(new Event('focusin'));
    const matOptions = document.querySelectorAll('mat-option')
    const optionToClick = matOptions[0] as HTMLElement
    const spyOnSelectionChanged = spyOn(component, 'onSelectionChanged')
    optionToClick.click()

    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(spyOnSelectionChanged).toHaveBeenCalled()
  });

  it('image input should call selectFile() after change', async () => {
    const spySelectFiles = spyOn(component, 'selectFile')
    const image = fixture.debugElement.query(By.css('#fileInput'))
    image.nativeElement.dispatchEvent(new Event('change'));

    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(spySelectFiles).toHaveBeenCalled()
  });

  it('edit button should call editItem() function', fakeAsync(() => {
    const {text} = component.form.controls;
    text.setValue('test');
    expect(component.form.valid).toBeTruthy();
    fixture.detectChanges();

    spyOn(component, 'editItem');
    const editBtn = fixture.debugElement.nativeElement.querySelector('.edit_button')
    editBtn.click()
    expect(component.editItem).toHaveBeenCalled();
  }));

  it('cancel button should set isBeingEdited to false', fakeAsync(() => {
    const cancelBtn = fixture.debugElement.nativeElement.querySelector('.cancel_button')
    cancelBtn.click()
    expect(component.item.isBeingEditing).toBeFalse()
  }));

  it('editItem should call editService with proper data', fakeAsync(() => {
    const itemService = fixture.debugElement.injector.get(ItemService)
    const spyItemService = spyOn(itemService, 'update').and.returnValue(Rx.of())
    const {text, quantity, unit} = component.form.controls
    text.setValue("any product")
    quantity.setValue('2')
    unit.setValue("kg")
    let blob = new Blob([""], { type: 'image' });
    component.selectedFile =  <File>blob;
    component.editItem()

    const expectedItemRequest: ItemRequest = {'text': 'any product', 'quantity': 2, 'unit': 'kg', 'listId': + component.item.listId, 'done': false}
    expect(spyItemService).toHaveBeenCalledWith(component.item.id, expectedItemRequest, component.selectedFile)
  }));

  it('should call refresh item and change isBeingEdited when successfully edited', fakeAsync(() => {
    const testResponse: ItemResponse = {'id':component.item.id, 'text': 'any product', 'quantity': 2, 'unit': 'kg', 'done': false, "image": component.item.image}
    const itemService = fixture.debugElement.injector.get(ItemService)
    spyOn(itemService, 'update').and.returnValue(Rx.of(testResponse))
    const spyRefreshItem = spyOn(component, 'refreshItem')
    component.editItem()
    tick(1000)
    expect(spyRefreshItem).toHaveBeenCalled()
    expect(component.item.isBeingEditing).toBeFalse()
  }));

  it('should show sweetAlert when item adding failed', fakeAsync(() => {
    const itemService = fixture.debugElement.injector.get(ItemService)
    const mockErrorResponse = { status: 401, statusText:"Unauthorized", error: { message: 'Smth went wrong' } };
    spyOn(itemService, 'update').and.returnValue(throwError(() => mockErrorResponse));
    const spySweetAlert = spyOn(Swal, 'fire')

    component.editItem()
    tick(1000)

    expect(spySweetAlert).toHaveBeenCalled()
  }));

  it('should load photo from item if exists', fakeAsync( () => {
    component.loadPhoto()
    expect(component.photoPreview).toBe( 'data:image/jpeg;base64,' + component.item.image)
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

  it('selectFile() should set name of file', fakeAsync( () => {
    const file = new File([""], 'testName')
    const event = {target: {files: [file], result: "testResult"}}
    const {image} = component.form.controls

    component.selectFile(event)
    fixture.detectChanges()
    tick()

    expect(image.value).toBe('testName')
  }));

  it('delete picture button should be hidden when preview is undefined', fakeAsync( () => {
    component.photoPreview = undefined
    fixture.detectChanges()
    const delBtn = fixture.debugElement.query(By.css('.edit_item_image_row button'))
    expect(delBtn.nativeElement.hidden).toBeTruthy()
  }));

  it('delete picture button should be visible when preview is defined', fakeAsync( () => {
    expect(component.photoPreview).toBeDefined()
    const delBtn = fixture.debugElement.query(By.css('.edit_item_image_row button'))
    expect(delBtn.nativeElement.hidden).toBeFalse()
  }));

  it('delete picture button should clear image data', fakeAsync( () => {
    expect(component.photoPreview).toBeDefined()
    const delBtn = fixture.debugElement.query(By.css('.edit_item_image_row button'))
    const delBtnHtml = delBtn.nativeElement as HTMLElement
    const spyDeletePicture = spyOn(component, 'deletePicture').and.callThrough()

    delBtnHtml.click()

    expect(spyDeletePicture).toHaveBeenCalled()
    expect(component.selectedFile).toBeUndefined()
    expect(component.photoPreview).toBeUndefined()
  }));

  it('call refreshItem should refresh owning item', fakeAsync( () => {
    const testResponse: ItemResponse = {'id':component.item.id, 'text': 'any product', 'quantity': 2, 'unit': 'kg', 'done': false, "image": component.item.image}
    component.refreshItem(testResponse)

    expect(component.item.text).toBe(testResponse.text)
    expect(component.item.quantity).toBe(testResponse.quantity)
    expect(component.item.unit).toBe(testResponse.unit)
    expect(component.item.done).toBe(testResponse.done)
    expect(component.item.image).toBe(testResponse.image)
    expect(component.item.id).toBe(testResponse.id)
  }));


  it('test getDynamicPlaceholder when photo is set', fakeAsync( () => {
    const translateService = fixture.debugElement.injector.get(TranslateService)
    const spyTranslateService = spyOn(translateService, 'instant').and.returnValue("translatedValue")
    expect(component.item.image).toBeDefined()
    expect(component.photoPreview).toBeDefined()

    let response = component.getDynamicImagePlaceholder()

    expect(spyTranslateService).toHaveBeenCalledWith('item_managing.change_image')
    expect(response).toBe("translatedValue")
  }));

  it('test getDynamicPlaceholder when photo is unset', fakeAsync( () => {
    const translateService = fixture.debugElement.injector.get(TranslateService)
    const spyTranslateService = spyOn(translateService, 'instant').and.returnValue("translatedValue")
    component.item.image = undefined
    component.photoPreview = undefined
    expect(component.item.image).toBeUndefined()
    expect(component.photoPreview).toBeUndefined()

    let response = component.getDynamicImagePlaceholder()

    expect(spyTranslateService).toHaveBeenCalledWith('item_managing.add_image')
    expect(response).toBe("translatedValue")
  }));



});
