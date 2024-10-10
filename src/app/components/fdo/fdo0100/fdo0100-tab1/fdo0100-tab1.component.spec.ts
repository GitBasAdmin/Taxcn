import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Fdo0100Tab1Component } from './fdo0100-tab1.component';

describe('Fdo0100Tab1Component', () => {
  let component: Fdo0100Tab1Component;
  let fixture: ComponentFixture<Fdo0100Tab1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Fdo0100Tab1Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Fdo0100Tab1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
