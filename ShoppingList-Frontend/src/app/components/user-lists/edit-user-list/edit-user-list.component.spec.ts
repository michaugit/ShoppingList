import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditUserListComponent } from './edit-user-list.component';

xdescribe('EditUserListComponent', () => {
  let component: EditUserListComponent;
  let fixture: ComponentFixture<EditUserListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditUserListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditUserListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
