import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideStore } from '@ngxs/store';

import { ClockState, ContractsState, CrewState, FinanceState, GuiState } from '../../store';
import { LayoutComponent } from './layout.component';

describe('LayoutComponent', () => {
  let fixture: ComponentFixture<LayoutComponent>;
  let component: LayoutComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LayoutComponent],
      providers: [provideRouter([]), provideStore([ClockState, ContractsState, CrewState, FinanceState, GuiState])]
    }).compileComponents();

    fixture = TestBed.createComponent(LayoutComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
