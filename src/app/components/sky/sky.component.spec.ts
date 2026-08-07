import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideStore } from '@ngxs/store';

import { CrewState, GuiState } from '../../../store';
import { SkyComponent } from './sky.component';

describe('SkyComponent', () => {
  let fixture: ComponentFixture<SkyComponent>;
  let component: SkyComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkyComponent],
      providers: [provideRouter([]), provideStore([CrewState, GuiState])]
    }).compileComponents();

    fixture = TestBed.createComponent(SkyComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
