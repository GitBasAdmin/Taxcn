import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Fdo0500Component } from './fdo0500.component';

describe('Fdo0500Component', () => {
  let component: Fdo0500Component;
  let fixture: ComponentFixture<Fdo0500Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Fdo0500Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Fdo0500Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
