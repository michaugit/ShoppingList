import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {LoginComponent} from "../../components/login/login.component";
import {LoginRequest} from "../../models/requests/loginRequest";
import {RegisterRequest} from "../../models/requests/registerRequest";

const AUTH_API = 'http://localhost:8080/api/auth/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient) {}

  login(loginRequest: LoginRequest): Observable<any> {
    return this.http.post(AUTH_API + 'signin',
      loginRequest,
      httpOptions);
  }

  register(registerRequest: RegisterRequest): Observable<any> {
    return this.http.post(
      AUTH_API + 'signup',
      registerRequest,
      httpOptions
    );
  }

  logout(): Observable<any> {
    return this.http.post(AUTH_API + 'signout', { }, httpOptions);
  }
}
