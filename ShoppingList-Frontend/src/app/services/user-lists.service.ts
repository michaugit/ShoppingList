import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {UserListsResponse} from "../models/responses/userListsResponse";
import {List} from "../models/list";
import {ListRequest} from "../models/requests/listRequest";

const USER_LISTS_API = 'http://localhost:8080/api/list/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class UserListsService {

  constructor(private http: HttpClient) {}

  getUserLists(): Observable<UserListsResponse> {
    return this.http.get<UserListsResponse>(USER_LISTS_API + 'all')
  }

  delete(list: List): Observable<any> {
    return this.http.delete(USER_LISTS_API + 'delete/' + list.id)
  }

  create(list: List): Observable<any> {
    let request: ListRequest = new class implements ListRequest {
      name = list.name;
      date = list.date;
    }
    return this.http.post(USER_LISTS_API + 'add', request)
  }

  create2(listRequest: ListRequest): Observable<any> {
    return this.http.post(USER_LISTS_API + 'add', listRequest, httpOptions)
  }

}
