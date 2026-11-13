import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { provideStore } from '@ngxs/store';

import {
  BuildingsState,
  ClockState,
  ContractsState,
  CrewState,
  FinanceState,
  GuiState,
  LaunchState,
  ReputationState,
  ResearchContractsState,
  ResearchState,
  RocketsState
} from '../../store';
import { LayoutComponent } from './layout.component';

describe('LayoutComponent', () => {
  let fixture: ComponentFixture<LayoutComponent>;
  let component: LayoutComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LayoutComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        provideStore([
          BuildingsState,
          ClockState,
          ContractsState,
          CrewState,
          FinanceState,
          GuiState,
          LaunchState,
          ReputationState,
          ResearchContractsState,
          ResearchState,
          RocketsState
        ])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LayoutComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
