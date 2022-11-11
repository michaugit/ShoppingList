import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {UserListsResponse} from "../models/responses/userListsResponse";
import {ListRequest} from "../models/requests/listRequest";
import {List} from "../models/list";
import {Item} from "../models/item";
import {ListOfItems} from "../models/responses/itemsResponse";
import {ItemRequest} from "../models/requests/itemRequest";

const USER_ITEM_API = 'http://localhost:8080/api/item/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class ItemService {

  constructor(private http: HttpClient) {}

  getListItems(listId: number): Observable<ListOfItems> {
    return this.http.get<ListOfItems>(USER_ITEM_API + 'all/' + listId)
  }

  create(itemRequest: ItemRequest): Observable<any> {
    return this.http.post(USER_ITEM_API + 'add', itemRequest, httpOptions)
  }

  update(item: Item): Observable<any> {
    let itemRequest: ItemRequest = { "text": item.text, "quantity": item.quantity, "unit": item.unit, "listId": item.listId}
    return this.http.post(USER_ITEM_API + 'update/' + item.id, itemRequest, httpOptions)
  }

  delete(item: Item): Observable<any> {
    return this.http.delete(USER_ITEM_API + 'delete/' + item.id)
  }
}
