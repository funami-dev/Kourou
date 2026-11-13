import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Store, provideStore } from '@ngxs/store';

import { STARTING_CREW } from '../../game/staff/staff.constants';
import { FinanceState, StaffState } from '../../store';
import { StaffComponent } from './staff.component';

describe('StaffComponent', () => {
  let fixture: ComponentFixture<StaffComponent>;
  let store: Store;

  const text = (): string => (fixture.nativeElement as HTMLElement).textContent!;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StaffComponent],
      providers: [provideRouter([]), provideStore([FinanceState, StaffState])]
    }).compileComponents();

    store = TestBed.inject(Store);
    fixture = TestBed.createComponent(StaffComponent);
    await fixture.whenStable();
  });

  it('lists the team', () => {
    for (const member of STARTING_CREW) {
      expect(text()).toContain(member.name);
    }
  });

  it('warns when a position is not covered', async () => {
    store.reset({ ...store.snapshot(), staff: { ...store.snapshot().staff, members: STARTING_CREW.slice(1) } });
    await fixture.whenStable();

    expect(text()).toContain('ohne diese Positionen kann kein Countdown starten');
    expect(text()).toContain('Flugleitung');
  });

  it('hires an applicant', async () => {
    const candidate = { ...STARTING_CREW[0]!, id: 50, name: 'Yara Mensah', availableUntilDay: 9 };
    store.reset({ ...store.snapshot(), staff: { ...store.snapshot().staff, candidates: [candidate] } });
    await fixture.whenStable();

    (fixture.nativeElement as HTMLElement).querySelector<HTMLButtonElement>('.candidate button')!.click();
    await fixture.whenStable();

    expect(store.selectSnapshot(StaffState.members)).toContainEqual(expect.objectContaining({ name: 'Yara Mensah' }));
  });
});
