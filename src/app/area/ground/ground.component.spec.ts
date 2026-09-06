import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideStore } from '@ngxs/store';

import { CrewState, GuiState } from '../../../store';
import { GroundComponent } from './ground.component';

describe('GroundComponent', () => {
  let fixture: ComponentFixture<GroundComponent>;
  let component: GroundComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroundComponent],
      providers: [provideRouter([]), provideStore([CrewState, GuiState])]
    }).compileComponents();

    fixture = TestBed.createComponent(GroundComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
