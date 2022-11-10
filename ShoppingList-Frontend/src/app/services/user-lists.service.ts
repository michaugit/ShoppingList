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

  create(listRequest: ListRequest): Observable<any> {
    return this.http.post(USER_LISTS_API + 'add', listRequest, httpOptions)
  }

  update(list: List): Observable<any> {
    let listRequest: ListRequest = {"name": list.name, "date": list.date}
    return this.http.post(USER_LISTS_API + 'update/' + list.id, listRequest, httpOptions)
  }

  delete(list: List): Observable<any> {
    return this.http.delete(USER_LISTS_API + 'delete/' + list.id)
  }



}
