import { TestBed } from '@angular/core/testing';

import { UserListsService } from './user-lists.service';

describe('UserListsService', () => {
  let service: UserListsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserListsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
