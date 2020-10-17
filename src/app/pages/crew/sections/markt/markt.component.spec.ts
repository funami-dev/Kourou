import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarktComponent } from './markt.component';

describe('MarktComponent', () => {
  let component: MarktComponent;
  let fixture: ComponentFixture<MarktComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarktComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarktComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
