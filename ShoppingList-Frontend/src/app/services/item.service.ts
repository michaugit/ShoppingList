import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {Item} from "../models/item";
import {ItemRequest} from "../models/requests/itemRequest";
import {ItemResponse} from "../models/responses/itemResponse";
import {ListResponse} from "../models/responses/listResponse";

const USER_ITEM_API = 'http://localhost:8080/api/item/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class ItemService {

  constructor(private http: HttpClient) {}

  create(itemRequest: ItemRequest, image?: File): Observable<any> {
    const formData = new FormData();
    if(image) {formData.append("image", image);}
    const itemInfo = new Blob([JSON.stringify(itemRequest)], {type: 'application/json'})
    formData.append('itemInfo', itemInfo);

    return this.http.post(USER_ITEM_API + 'add', formData)
  }

  update(id: number, itemRequest: ItemRequest, image?: File ): Observable<ItemResponse> {
    const formData = new FormData();
    if(image) {formData.append("image", image);}
    const itemInfo = new Blob([JSON.stringify(itemRequest)], {type: 'application/json'})
    formData.append('itemInfo', itemInfo);

    return this.http.post<ItemResponse>(USER_ITEM_API + 'update/' +id, formData)
  }

  delete(item: Item): Observable<any> {
    return this.http.delete(USER_ITEM_API + 'delete/' + item.id)
  }

  getListItems(listId: number): Observable<ListResponse> {
    return this.http.get<ListResponse>(USER_ITEM_API + 'all/' + listId)
  }
}
