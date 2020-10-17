import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScenicBackgroundComponent } from './scenic-background.component';

describe('ScenicBackgroundComponent', () => {
  let component: ScenicBackgroundComponent;
  let fixture: ComponentFixture<ScenicBackgroundComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScenicBackgroundComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScenicBackgroundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
