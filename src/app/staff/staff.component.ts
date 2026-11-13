import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { dispatch, select } from '@ngxs/store';

import {
  assembleStationCrew,
  dailySalary,
  experienceLevel,
  recruitingFee,
  totalDailySalaries,
  unstaffedRoles
} from '../../game/staff/staff';
import { CREW_ROLES, EXPERIENCE_LEVEL_THRESHOLDS } from '../../game/staff/staff.constants';
import type { Candidate, CrewMember } from '../../game/staff/staff.model';
import { DismissCrewMember, FinanceState, HireCandidate, StaffState } from '../../store';
import { EurosPipe } from '../shared/euros.pipe';
import { roleLabel, traitDescription, traitLabel } from './staff-texts';

/** The team in mission control, and applicants who would like to join it. */
@Component({
  selector: 'app-staff',
  imports: [MatButtonModule, EurosPipe],
  templateUrl: './staff.component.html',
  styleUrl: './staff.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'game-page' }
})
export class StaffComponent {
  private readonly members = select(StaffState.members);
  private readonly balance = select(FinanceState.balance);
  protected readonly candidates = select(StaffState.candidates);
  protected readonly staffCapacity = StaffState.staffCapacity();

  protected readonly roleLabel = roleLabel;
  protected readonly traitLabel = traitLabel;
  protected readonly traitDescription = traitDescription;
  protected readonly dailySalary = dailySalary;
  protected readonly recruitingFee = recruitingFee;
  protected readonly experienceLevel = experienceLevel;

  protected readonly teamSize = computed(() => this.members().length);
  protected readonly isFull = computed(() => this.teamSize() >= this.staffCapacity);
  protected readonly dailySalaries = computed(() => totalDailySalaries(this.members()));
  protected readonly unstaffedRoles = computed(() => unstaffedRoles(this.members()));

  /** Team members sorted by role; the one who takes the position in a countdown is marked. */
  protected readonly team = computed(() => {
    const crew = assembleStationCrew(this.members());
    const atPositionIds = new Set(crew ? Object.values(crew).map(({ memberId }) => memberId) : []);
    return [...this.members()]
      .sort((first, second) => CREW_ROLES.indexOf(first.role) - CREW_ROLES.indexOf(second.role))
      .map((member) => ({
        member,
        isAtPosition: atPositionIds.has(member.id),
        nextLevelAt: EXPERIENCE_LEVEL_THRESHOLDS[experienceLevel(member.experiencePoints)] ?? null
      }));
  });

  private readonly dispatchHire = dispatch(HireCandidate);
  private readonly dispatchDismiss = dispatch(DismissCrewMember);

  protected canHire(candidate: Candidate): boolean {
    return !this.isFull() && this.balance() >= recruitingFee(candidate);
  }

  protected hire(candidate: Candidate): void {
    this.dispatchHire(candidate.id);
  }

  protected dismiss(member: CrewMember): void {
    const isConfirmed = confirm($localize`:@@staff.dismiss.confirm:${member.name}:name: wirklich entlassen?`);
    if (isConfirmed) {
      this.dispatchDismiss(member.id);
    }
  }
}
