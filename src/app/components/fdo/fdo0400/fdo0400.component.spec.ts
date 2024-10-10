import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Fdo0400Component } from './fdo0400.component';

describe('Fdo0400Component', () => {
  let component: Fdo0400Component;
  let fixture: ComponentFixture<Fdo0400Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Fdo0400Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Fdo0400Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
