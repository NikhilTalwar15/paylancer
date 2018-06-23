import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotifyComComponent } from './notify-com.component';

describe('NotifyComComponent', () => {
  let component: NotifyComComponent;
  let fixture: ComponentFixture<NotifyComComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotifyComComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotifyComComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
