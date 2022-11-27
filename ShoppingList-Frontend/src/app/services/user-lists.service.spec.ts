import { TestBed } from '@angular/core/testing';

import { UserListsService } from './user-lists.service';
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {ListRequest} from "../models/requests/listRequest";
import {List} from "../models/list";

describe('UserListsService', () => {
  let service: UserListsService;
  let httpTestingController: HttpTestingController;
  const USER_LISTS_API = 'http://localhost:8080/api/list/';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    })
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserListsService);
    httpTestingController = TestBed.inject(HttpTestingController)
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getUserLists should return UserListsResponse when success', () => {
    const expectedDataResponse = {
      "shoppingLists": [
        {
          "id": 23,
          "name": "test 1",
          "date": "2020-07-15"
        },
        {
          "id": 24,
          "name": "test 2",
          "date": "2022-11-25"
        },
        {
          "id": 28,
          "name": "test 3",
          "date": "2022-11-09"
        }
      ]
    }
    service.getUserLists().subscribe(data => {
      expect(data).toEqual(expectedDataResponse)
    })

    const request = httpTestingController.expectOne(USER_LISTS_API + 'all');
    expect(request.request.method).toBe('GET');
    expect(request.request.responseType).toBe('json')
    request.flush(expectedDataResponse);
  });

  it('create should return SimpleListResponse when success', () => {
    const expectedDataResponse = {
      "id": 29,
      "name": "lista",
      "date": "2022-08-02"
    }
    const requestBody: ListRequest = {"name": "lista", "date": "2022-08-02"}
    service.create(requestBody).subscribe(data => {
      expect(data).toEqual(expectedDataResponse)
    })

    const request = httpTestingController.expectOne(USER_LISTS_API + 'add');
    expect(request.request.method).toBe('POST');
    expect(request.request.responseType).toBe('json')
    request.flush(expectedDataResponse);
  });

  it('update should return SimpleListResponse when success', () => {
    const id = 1
    const expectedDataResponse = {
      "id": 29,
      "name": "lista",
      "date": "2022-08-02"
    }
    const requestBody: ListRequest = {"name": "lista", "date": "2022-08-02"}
    service.update(1,requestBody).subscribe(data => {
      expect(data).toEqual(expectedDataResponse)
    })

    const request = httpTestingController.expectOne(USER_LISTS_API + 'update/' + id);
    expect(request.request.method).toBe('POST');
    expect(request.request.responseType).toBe('json')
    request.flush(expectedDataResponse);
  });


  it('delete should be DELETE request with id', () => {
    const id = 1
    const list = new List("test", "2022-08-02", id)
    service.delete(list).subscribe(data => {
      expect(data).toEqual("ok")
    })

    const request = httpTestingController.expectOne(USER_LISTS_API + 'delete/' + id);
    expect(request.request.method).toBe('DELETE');
    request.flush("ok");
  });

});
