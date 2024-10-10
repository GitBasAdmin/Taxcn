import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Fdo9000Component } from './fdo9000.component';

describe('Fdo9000Component', () => {
  let component: Fdo9000Component;
  let fixture: ComponentFixture<Fdo9000Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Fdo9000Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Fdo9000Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
