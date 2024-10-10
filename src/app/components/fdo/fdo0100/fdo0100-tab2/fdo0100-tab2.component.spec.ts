import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Fdo0100Tab2Component } from './fdo0100-tab2.component';

describe('Fdo0100Tab2Component', () => {
  let component: Fdo0100Tab2Component;
  let fixture: ComponentFixture<Fdo0100Tab2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Fdo0100Tab2Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Fdo0100Tab2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
