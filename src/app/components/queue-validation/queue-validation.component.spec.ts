import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QueueValidationComponent } from './queue-validation.component';

describe('QueueValidationComponent', () => {
  let component: QueueValidationComponent;
  let fixture: ComponentFixture<QueueValidationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QueueValidationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QueueValidationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
