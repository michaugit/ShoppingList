import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditListItemComponent } from './edit-list-item.component';

describe('EditListItemComponent', () => {
  let component: EditListItemComponent;
  let fixture: ComponentFixture<EditListItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditListItemComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
