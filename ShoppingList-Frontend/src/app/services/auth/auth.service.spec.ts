import { TestBed } from '@angular/core/testing';

import { AuthService } from './auth.service';
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {LoginRequest} from "../../models/requests/loginRequest";
import {RegisterRequest} from "../../models/requests/registerRequest";

describe('AuthService', () => {
  let service: AuthService;
  let httpTestingController: HttpTestingController;
  const AUTH_API = 'http://localhost:8080/api/auth/';


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    })
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthService);
    httpTestingController = TestBed.inject(HttpTestingController)
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('login should be POST and return info about user when success', () => {
    const expectedDataResponse = {
      "id": 1,
      "username": "testuser",
      "roles": [
        "ROLE_USER"
      ]
    }
    const loginRequest: LoginRequest = {"username": "testuser", "password": "pass"}
    service.login(loginRequest).subscribe(data => {
      expect(data).toEqual(expectedDataResponse)
    })

    const request = httpTestingController.expectOne(AUTH_API + 'signin');
    expect(request.request.method).toBe('POST');
    expect(request.request.responseType).toBe('json')
    request.flush(expectedDataResponse);
  });

  it('register should be POST and return info about user when success', () => {
    const expectedDataResponse = {
      "id": 1,
      "username": "testuser",
      "roles": [
        "ROLE_USER"
      ]
    }
    const loginRequest: RegisterRequest = {"username": "testuser", "password": "pass"}
    service.register(loginRequest).subscribe(data => {
      expect(data).toEqual(expectedDataResponse)
    })

    const request = httpTestingController.expectOne(AUTH_API + 'signup');
    expect(request.request.method).toBe('POST');
    expect(request.request.responseType).toBe('json')
    request.flush(expectedDataResponse);
  });

  it('logout should be POST with empty json body', () => {
    const expectedDataResponse = {
      "message": "You've been signed out!"
    }
    service.logout().subscribe(data => {
      expect(data).toEqual(expectedDataResponse)
    })

    const request = httpTestingController.expectOne(AUTH_API + 'signout');
    expect(request.request.method).toBe('POST');
    expect(request.request.responseType).toBe('json')
    request.flush(expectedDataResponse);
  });


});
