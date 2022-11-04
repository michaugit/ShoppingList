import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListItemEditComponent } from './list-item-edit.component';

describe('ListItemEditComponent', () => {
  let component: ListItemEditComponent;
  let fixture: ComponentFixture<ListItemEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListItemEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListItemEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
