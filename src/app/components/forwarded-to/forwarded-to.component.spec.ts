import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForwardedToComponent } from './forwarded-to.component';

describe('ForwardedToComponent', () => {
  let component: ForwardedToComponent;
  let fixture: ComponentFixture<ForwardedToComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ForwardedToComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ForwardedToComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
