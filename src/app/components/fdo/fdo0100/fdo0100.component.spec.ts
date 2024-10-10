import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Fdo0100Component } from './fdo0100.component';

describe('Fdo0100Component', () => {
  let component: Fdo0100Component;
  let fixture: ComponentFixture<Fdo0100Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Fdo0100Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Fdo0100Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
