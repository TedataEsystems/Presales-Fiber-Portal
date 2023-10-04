import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FiberFormComponent } from './fiber-form.component';

describe('FiberFormComponent', () => {
  let component: FiberFormComponent;
  let fixture: ComponentFixture<FiberFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FiberFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FiberFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
