import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEmployeesComponent } from './add-employees.component';

describe('AddEmployeesComponent', () => {
  let component: AddEmployeesComponent;
  let fixture: ComponentFixture<AddEmployeesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddEmployeesComponent]
    });
    fixture = TestBed.createComponent(AddEmployeesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
