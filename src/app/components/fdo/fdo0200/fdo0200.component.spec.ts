import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Fdo0200Component } from './fdo0200.component';

describe('Fdo0200Component', () => {
  let component: Fdo0200Component;
  let fixture: ComponentFixture<Fdo0200Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Fdo0200Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Fdo0200Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
