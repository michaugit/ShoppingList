import { TestBed } from '@angular/core/testing';

import { StorageService } from './storage.service';

describe('StorageService', () => {
  let service: StorageService;
  const USER_KEY = 'auth-user';

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StorageService);
    window.sessionStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('saveUser should save user to session', () => {
    expect(window.sessionStorage.getItem(USER_KEY)).toBeNull()
    const user = {
      "id": 1,
      "username": "testuser",
      "roles": [
        "ROLE_USER"
      ]
    }
    service.saveUser(user)
    expect(window.sessionStorage.getItem(USER_KEY)).toBeDefined()
  });

  it('getUser should return user when is saved in session', () => {
    const user = {
      "id": 1,
      "username": "testuser",
      "roles": [
        "ROLE_USER"
      ]
    }
    service.saveUser(user)
    const result = service.getUser()
    expect(result).toEqual(user)
  });

  it('getUser should return empty when user is not saved in session', () => {
    const result = service.getUser()
    expect(result).toEqual({})
  });

  it('clean should erase authenticated user from session', () => {
    const user = {
      "id": 1,
      "username": "testuser",
      "roles": [
        "ROLE_USER"
      ]
    }
    service.saveUser(user)

    service.clean()
    expect(window.sessionStorage.getItem(USER_KEY)).toBeNull()
  });

  it('isLoggedIn should return true when user is saved in session', () => {
    const user = {
      "id": 1,
      "username": "testuser",
      "roles": [
        "ROLE_USER"
      ]
    }
    service.saveUser(user)
    expect(service.isLoggedIn()).toBeTruthy()
  })

  it('isLoggedIn should return false when user is not saved in session', () => {
    expect(service.isLoggedIn()).toBeFalsy()
  })
});
