import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RocketDashboardComponent } from './rocket-dashboard.component';

describe('RocketDashboardComponent', () => {
  let component: RocketDashboardComponent;
  let fixture: ComponentFixture<RocketDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RocketDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RocketDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
