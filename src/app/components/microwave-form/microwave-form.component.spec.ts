import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MicrowaveFormComponent } from './microwave-form.component';

describe('MicrowaveFormComponent', () => {
  let component: MicrowaveFormComponent;
  let fixture: ComponentFixture<MicrowaveFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MicrowaveFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MicrowaveFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
