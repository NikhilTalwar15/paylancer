import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EcontractComponent } from './econtract.component';

describe('EcontractComponent', () => {
  let component: EcontractComponent;
  let fixture: ComponentFixture<EcontractComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EcontractComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EcontractComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
