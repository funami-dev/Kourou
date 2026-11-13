import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { provideStore } from '@ngxs/store';

import { BuildingsState, ClockState, CrewState, GuiState } from '../../store';
import { AreaComponent } from './area.component';

describe('AreaComponent', () => {
  let fixture: ComponentFixture<AreaComponent>;
  let component: AreaComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AreaComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        provideStore([BuildingsState, ClockState, CrewState, GuiState])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AreaComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
