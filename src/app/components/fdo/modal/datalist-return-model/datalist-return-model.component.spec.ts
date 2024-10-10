import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatalistReturnModelComponent } from './datalist-return-model.component';

describe('DatalistReturnModelComponent', () => {
  let component: DatalistReturnModelComponent;
  let fixture: ComponentFixture<DatalistReturnModelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DatalistReturnModelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DatalistReturnModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
