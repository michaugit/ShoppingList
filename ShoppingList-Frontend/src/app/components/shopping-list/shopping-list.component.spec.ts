import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';

import { ShoppingListComponent } from './shopping-list.component';
import {HttpTestingController} from "@angular/common/http/testing";
import {commonTestImports, materialTestImports} from "../../app.providers";
import {Observable, throwError} from "rxjs";
import {ControlContainer} from "@angular/forms";
import {ActivatedRoute} from "@angular/router";
import {AddListItemComponent} from "./add-list-item/add-list-item.component";
import {Item} from "../../models/item";
import UnitService from "../../services/unitService";
import {ListItemComponent} from "./list-item/list-item.component";
import {ItemService} from "../../services/item.service";
import {ListResponse} from "../../models/responses/listResponse";
import * as Rx from "rxjs";
import Swal from "sweetalert2";

describe('ShoppingListComponent', () => {
  let component: ShoppingListComponent;
  let fixture: ComponentFixture<ShoppingListComponent>;
  let httpTestingController: HttpTestingController;

  class ActivatedRouteMock {
    queryParams = new Observable(observer => {
      const urlParams = {
        listId: 12,
      }
      observer.next(urlParams);
      observer.complete();
    });
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShoppingListComponent, AddListItemComponent, ListItemComponent],
      imports: [... commonTestImports, ... materialTestImports],
      providers: [ControlContainer, { provide: ActivatedRoute, useClass: ActivatedRouteMock}]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShoppingListComponent);
    component = fixture.componentInstance;
    let imageBase64 = "iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAApgAAAKYB3X3/OAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAANCSURBVEiJtZZPbBtFFMZ/M7ubXdtdb1xSFyeilBapySVU8h8OoFaooFSqiihIVIpQBKci6KEg9Q6H9kovIHoCIVQJJCKE1ENFjnAgcaSGC6rEnxBwA04Tx43t2FnvDAfjkNibxgHxnWb2e/u992bee7tCa00YFsffekFY+nUzFtjW0LrvjRXrCDIAaPLlW0nHL0SsZtVoaF98mLrx3pdhOqLtYPHChahZcYYO7KvPFxvRl5XPp1sN3adWiD1ZAqD6XYK1b/dvE5IWryTt2udLFedwc1+9kLp+vbbpoDh+6TklxBeAi9TL0taeWpdmZzQDry0AcO+jQ12RyohqqoYoo8RDwJrU+qXkjWtfi8Xxt58BdQuwQs9qC/afLwCw8tnQbqYAPsgxE1S6F3EAIXux2oQFKm0ihMsOF71dHYx+f3NND68ghCu1YIoePPQN1pGRABkJ6Bus96CutRZMydTl+TvuiRW1m3n0eDl0vRPcEysqdXn+jsQPsrHMquGeXEaY4Yk4wxWcY5V/9scqOMOVUFthatyTy8QyqwZ+kDURKoMWxNKr2EeqVKcTNOajqKoBgOE28U4tdQl5p5bwCw7BWquaZSzAPlwjlithJtp3pTImSqQRrb2Z8PHGigD4RZuNX6JYj6wj7O4TFLbCO/Mn/m8R+h6rYSUb3ekokRY6f/YukArN979jcW+V/S8g0eT/N3VN3kTqWbQ428m9/8k0P/1aIhF36PccEl6EhOcAUCrXKZXXWS3XKd2vc/TRBG9O5ELC17MmWubD2nKhUKZa26Ba2+D3P+4/MNCFwg59oWVeYhkzgN/JDR8deKBoD7Y+ljEjGZ0sosXVTvbc6RHirr2reNy1OXd6pJsQ+gqjk8VWFYmHrwBzW/n+uMPFiRwHB2I7ih8ciHFxIkd/3Omk5tCDV1t+2nNu5sxxpDFNx+huNhVT3/zMDz8usXC3ddaHBj1GHj/As08fwTS7Kt1HBTmyN29vdwAw+/wbwLVOJ3uAD1wi/dUH7Qei66PfyuRj4Ik9is+hglfbkbfR3cnZm7chlUWLdwmprtCohX4HUtlOcQjLYCu+fzGJH2QRKvP3UNz8bWk1qMxjGTOMThZ3kvgLI5AzFfo379UAAAAASUVORK5CYII="
    component.items.push(new Item(1, 2, "test item text", 3, UnitService.getDefaultUnit()[2], false, imageBase64 ))
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should read listId query param', () => {
    const spyRefreshItems = spyOn(component, 'refreshItems')
    component.ngOnInit()

    expect(spyRefreshItems).toHaveBeenCalled()
    expect(component.listId).toBe(12)
  });

  it('should contain add-list-item-component', () => {
    const addListItemComponent = fixture.debugElement.nativeElement.querySelector('app-add-list-item')
    expect(addListItemComponent).toBeDefined()
  });

  it('should contain list-item-component when number of items more than zero', () => {
    expect(component.items.length).toBeGreaterThan(0)
    const listItemComponent = fixture.debugElement.nativeElement.querySelector('app-list-item')
    expect(listItemComponent).toBeDefined()
  });

  it('should not contain list-item-component when number of items equals zero', () => {
    component.items = []
    fixture.detectChanges()
    expect(component.items.length).toBe(0)
    const listItemComponent = fixture.debugElement.nativeElement.querySelector('app-list-item')
    expect(listItemComponent).toBeNull()
  });

  it('items should be refreshed when request successful', fakeAsync( () => {
    const itemService = fixture.debugElement.injector.get(ItemService)
    const response: ListResponse={
      "listId": component.listId,
      "listName": "testName",
      "date" : "2022-11-26",
      "items": [{'id': 1, 'text': 'any product', 'quantity': 2, 'unit': UnitService.getDefaultUnit()[1], 'done': false, "image": null},
        {'id': 2, 'text': 'any product', 'quantity': 2, 'unit': UnitService.getDefaultUnit()[1], 'done': false, "image": null}]}
    spyOn(itemService, 'getListItems').and.returnValue(Rx.of(response))
    component.refreshItems()
    expect(component.items.length).toBe(2)
  }));

  it('should display sweetAlert when request error', fakeAsync( () => {
    const itemService = fixture.debugElement.injector.get(ItemService)
    const mockErrorResponse = { status: 401, statusText:"Unauthorized", error: { message: 'Smth went wrong' } };
    spyOn(itemService, 'getListItems').and.returnValue(throwError(() => mockErrorResponse))
    const spySweetAlert = spyOn(Swal, "fire")
    component.refreshItems()
    tick(1000)

    expect(component.items.length).toBe(1)
    expect(spySweetAlert).toHaveBeenCalled()
  }));

  it( 'removeItem() should remove items from components list', fakeAsync( () => {
    const itemToRemove = component.items[0]
    component.removeItem(itemToRemove)
    expect(component.items.find(function (listItem){return listItem.id == itemToRemove.id})).toBeUndefined()
  }));
});
