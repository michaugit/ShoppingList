import { TestBed } from '@angular/core/testing';

import { ItemService } from './item.service';
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {Item} from "../models/item";
import {ItemRequest} from "../models/requests/itemRequest";

describe('ItemService', () => {
  let service: ItemService;
  let httpTestingController: HttpTestingController;
  const USER_ITEM_API = 'http://localhost:8080/api/item/';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    })
    TestBed.configureTestingModule({});
    service = TestBed.inject(ItemService);
    httpTestingController = TestBed.inject(HttpTestingController)
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('create should be multipart and return created item when success', () => {
    const expectedDataResponse = {
      "id": 1,
      "text": "Chleb",
      "quantity": 1.0,
      "unit": "COUNT",
      "image": "base64",
      "done": false
    }
    const requestBody: ItemRequest = {
      "text": "Chleb",
      "listId": 1,
      "quantity": 1.0,
      "unit": "COUNT",
      "done": false
    }
    const file = new File([""], 'testName')

    service.create(requestBody, file).subscribe(data => {
      expect(data).toEqual(expectedDataResponse)
    })

    const request = httpTestingController.expectOne(USER_ITEM_API + 'add');
    expect(request.request.method).toBe('POST');
    expect(request.request.responseType).toBe('json')
    request.flush(expectedDataResponse);
  });

  it('update should be multipart and return updated item when success', () => {
    const id = 1
    const expectedDataResponse = {
      "id": 1,
      "text": "Chleb",
      "quantity": 1.0,
      "unit": "COUNT",
      "image": "base64",
      "done": false
    }
    const requestBody: ItemRequest = {
      "text": "Chleb",
      "listId": 1,
      "quantity": 1.0,
      "unit": "COUNT",
      "done": false
    }
    const file = new File([""], 'testName')

    service.update(id, requestBody, file).subscribe(data => {
      expect(data).toEqual(expectedDataResponse)
    })

    const request = httpTestingController.expectOne(USER_ITEM_API + 'update/' + id);
    expect(request.request.method).toBe('POST');
    expect(request.request.responseType).toBe('json')
    request.flush(expectedDataResponse);
  });

  it('delete should be DELETE request with id', () => {
    const item = new Item(1,1,"test item", 1, "KG", false, undefined )
    service.delete(item).subscribe(data => {
      expect(data).toEqual("ok")
    })

    const request = httpTestingController.expectOne(USER_ITEM_API + 'delete/' + item.id);
    expect(request.request.method).toBe('DELETE');
    request.flush("ok");
  });

  it('getListItems should return ListResponse when success', () => {
    const id = 1
    const expectedDataResponse = {
      "listId": 1,
      "listName": "testowa lista",
      "date": "2020-07-15",
      "items": [
        {
          "id": 24,
          "text": "Chleb",
          "quantity": 1.0,
          "unit": "COUNT",
          "image": null,
          "done": false
        },
        {
          "id": 25,
          "text": "Mleko",
          "quantity": 1.0,
          "unit": "COUNT",
          "image": null,
          "done": true
        }
      ]
    }
    service.getListItems(id).subscribe(data => {
      expect(data).toEqual(expectedDataResponse)
    })

    const request = httpTestingController.expectOne(USER_ITEM_API + 'all/' + id);
    expect(request.request.method).toBe('GET');
    expect(request.request.responseType).toBe('json')
    request.flush(expectedDataResponse);
  });
});
