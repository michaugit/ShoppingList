import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';

import { ListItemComponent } from './list-item.component';
import {commonTestImports, materialTestImports} from "../../../app.providers";
import {HttpTestingController} from "@angular/common/http/testing";
import {Item} from "../../../models/item";
import UnitService from "../../../services/unitService";
import * as Rx from 'rxjs';
import {ItemService} from "../../../services/item.service";
import {throwError} from "rxjs";
import Swal from "sweetalert2";
import {By} from "@angular/platform-browser";

describe('ListItemComponent', () => {
  let component: ListItemComponent;
  let fixture: ComponentFixture<ListItemComponent>;
  let httpTestingController: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListItemComponent ],
      imports: [... commonTestImports, ... materialTestImports]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListItemComponent);
    component = fixture.componentInstance;
    let imageBase64 = "iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAApgAAAKYB3X3/OAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAANCSURBVEiJtZZPbBtFFMZ/M7ubXdtdb1xSFyeilBapySVU8h8OoFaooFSqiihIVIpQBKci6KEg9Q6H9kovIHoCIVQJJCKE1ENFjnAgcaSGC6rEnxBwA04Tx43t2FnvDAfjkNibxgHxnWb2e/u992bee7tCa00YFsffekFY+nUzFtjW0LrvjRXrCDIAaPLlW0nHL0SsZtVoaF98mLrx3pdhOqLtYPHChahZcYYO7KvPFxvRl5XPp1sN3adWiD1ZAqD6XYK1b/dvE5IWryTt2udLFedwc1+9kLp+vbbpoDh+6TklxBeAi9TL0taeWpdmZzQDry0AcO+jQ12RyohqqoYoo8RDwJrU+qXkjWtfi8Xxt58BdQuwQs9qC/afLwCw8tnQbqYAPsgxE1S6F3EAIXux2oQFKm0ihMsOF71dHYx+f3NND68ghCu1YIoePPQN1pGRABkJ6Bus96CutRZMydTl+TvuiRW1m3n0eDl0vRPcEysqdXn+jsQPsrHMquGeXEaY4Yk4wxWcY5V/9scqOMOVUFthatyTy8QyqwZ+kDURKoMWxNKr2EeqVKcTNOajqKoBgOE28U4tdQl5p5bwCw7BWquaZSzAPlwjlithJtp3pTImSqQRrb2Z8PHGigD4RZuNX6JYj6wj7O4TFLbCO/Mn/m8R+h6rYSUb3ekokRY6f/YukArN979jcW+V/S8g0eT/N3VN3kTqWbQ428m9/8k0P/1aIhF36PccEl6EhOcAUCrXKZXXWS3XKd2vc/TRBG9O5ELC17MmWubD2nKhUKZa26Ba2+D3P+4/MNCFwg59oWVeYhkzgN/JDR8deKBoD7Y+ljEjGZ0sosXVTvbc6RHirr2reNy1OXd6pJsQ+gqjk8VWFYmHrwBzW/n+uMPFiRwHB2I7ih8ciHFxIkd/3Omk5tCDV1t+2nNu5sxxpDFNx+huNhVT3/zMDz8usXC3ddaHBj1GHj/As08fwTS7Kt1HBTmyN29vdwAw+/wbwLVOJ3uAD1wi/dUH7Qei66PfyuRj4Ik9is+hglfbkbfR3cnZm7chlUWLdwmprtCohX4HUtlOcQjLYCu+fzGJH2QRKvP3UNz8bWk1qMxjGTOMThZ3kvgLI5AzFfo379UAAAAASUVORK5CYII="
    component.item = new Item(1, 2, "test item text", 3, UnitService.getDefaultUnit()[2], false, imageBase64 )
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display image if exists', () => {
    const image = fixture.debugElement.nativeElement.querySelector('img')
    expect(image).toBeDefined()
    expect(image.hidden).toBeFalse()
    expect(image.src).toBe('data:image/jpeg;base64,' +  component.item.image)
  });

  it('should not display image if not exists', () => {
    component.item.image = undefined
    fixture.detectChanges()
    const image = fixture.debugElement.nativeElement.querySelector('img')
    expect(image.hidden).toBeTruthy()
  });

  it('delete button should trigger deleteItem()', () => {
    const deleteBtn = fixture.debugElement.nativeElement.querySelector(".delete_button")
    expect(deleteBtn).toBeDefined()
    const spyDeleteItem = spyOn(component, 'deleteItem')
    deleteBtn.click()

    expect(spyDeleteItem).toHaveBeenCalledWith(component.item)
  });

  it('edit button should do editable item', () => {
    const editBtn = fixture.debugElement.nativeElement.querySelector(".edit_button")
    expect(editBtn).toBeDefined()
    const spyDoEditable = spyOn(component, 'doEditable').and.callThrough()
    editBtn.click()

    expect(spyDoEditable).toHaveBeenCalledWith(component.item)
    expect(component.item.isBeingEditing).toBeTruthy()
  });


  it('should emit removeItem when successful deletion', fakeAsync(() => {
    const itemService = fixture.debugElement.injector.get(ItemService)
    spyOn(itemService, 'delete').and.returnValue(Rx.of(""))
    const spyRemoveEmit = spyOn(component.removeItem, 'emit')
    component.deleteItem(component.item)
    tick(1000)

    expect(spyRemoveEmit).toHaveBeenCalled()
  }));

  it('should show sweetAlert when deletion failed', fakeAsync(() => {
    const itemService = fixture.debugElement.injector.get(ItemService)
    const mockErrorResponse = { status: 401, statusText:"Unauthorized", error: { message: 'Smth went wrong' } };
    spyOn(itemService, 'delete').and.returnValue(throwError(() => mockErrorResponse));
    const spySweetAlert = spyOn(Swal, 'fire')

    component.deleteItem(component.item)
    tick(1000)

    expect(spySweetAlert).toHaveBeenCalled()
  }));

  it( 'toggle checkbox should trigger toggle()', fakeAsync(() => {
    const checkbox = fixture.debugElement.query(By.css('mat-checkbox'))
    const spyToggle = spyOn(component, 'toggle')
    checkbox.triggerEventHandler('change')
    tick(1000)

    expect(spyToggle).toHaveBeenCalledWith(component.item)
  }));


  it('should change state when toggle successfully', fakeAsync(() => {
    const entryState = component.item.done
    const itemService = fixture.debugElement.injector.get(ItemService)
    spyOn(itemService, 'update').and.returnValue(Rx.of())
    component.toggle(component.item)
    tick(1000)

    expect(component.item.done).not.toBe(entryState)
  }));

  it('should not change state when toggle error', fakeAsync(() => {
    const entryState = component.item.done
    const itemService = fixture.debugElement.injector.get(ItemService)
    const mockErrorResponse = { status: 401, statusText:"Unauthorized", error: { message: 'Smth went wrong' } };
    spyOn(itemService, 'update').and.returnValue(throwError(() => mockErrorResponse))
    const spySweetAlert = spyOn(Swal, "fire")
    component.toggle(component.item)
    tick(1000)

    expect(component.item.done).toBe(entryState)
    expect(spySweetAlert).toHaveBeenCalled()
  }));
});
