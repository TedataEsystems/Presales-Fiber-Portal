import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CopperFormComponent } from './copper-form.component';

describe('CopperFormComponent', () => {
  let component: CopperFormComponent;
  let fixture: ComponentFixture<CopperFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CopperFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CopperFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
