import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideStore } from '@ngxs/store';

import { CrewState, GuiState } from '../../store';
import { LocationPickerComponent } from './location-picker.component';

describe('LocationPickerComponent', () => {
  let fixture: ComponentFixture<LocationPickerComponent>;
  let component: LocationPickerComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LocationPickerComponent],
      providers: [provideRouter([]), provideStore([CrewState, GuiState])]
    }).compileComponents();

    fixture = TestBed.createComponent(LocationPickerComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
