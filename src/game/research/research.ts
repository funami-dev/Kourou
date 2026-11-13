import { TECHNOLOGIES } from './technologies.constants';
import type { ResearchProgress, TechnologyBonuses, TechnologyId, TechnologyStatus } from './technology.model';

export const NEW_GAME_RESEARCH_PROGRESS: ResearchProgress = {
  researchPoints: 0,
  unlockedTechnologies: [],
  activeProject: null
};

export const NO_TECHNOLOGY_BONUSES: TechnologyBonuses = {
  weatherHoldDurationFactor: 1,
  preventedCountdownIssues: [],
  reliabilityBonus: 0,
  assemblyDurationFactor: 1,
  shippingDaysSaved: 0
};

export function technologyStatus(progress: ResearchProgress, technologyId: TechnologyId): TechnologyStatus {
  if (progress.unlockedTechnologies.includes(technologyId)) {
    return 'unlocked';
  }
  if (progress.activeProject?.technologyId === technologyId) {
    return 'inProgress';
  }
  const prerequisitesMet = TECHNOLOGIES[technologyId].prerequisites.every((prerequisite) =>
    progress.unlockedTechnologies.includes(prerequisite)
  );
  return prerequisitesMet ? 'available' : 'locked';
}

/**
 * Starts researching a technology: research points are spent right away, the money is paid by the caller.
 * Returns `null` if the technology is not available, the points are missing or another project is running.
 */
export function startResearch(
  progress: ResearchProgress,
  technologyId: TechnologyId,
  day: number
): ResearchProgress | null {
  const technology = TECHNOLOGIES[technologyId];
  const canStart =
    progress.activeProject === null &&
    technologyStatus(progress, technologyId) === 'available' &&
    progress.researchPoints >= technology.researchPointCost;
  if (!canStart) {
    return null;
  }

  return {
    ...progress,
    researchPoints: progress.researchPoints - technology.researchPointCost,
    activeProject: { technologyId, startedOnDay: day, completesOnDay: day + technology.researchDays }
  };
}

/** Unlocks the technology of the active project once its last research day is over. */
export function completeResearchIfDue(progress: ResearchProgress, day: number): ResearchProgress {
  const project = progress.activeProject;
  if (!project || project.completesOnDay > day) {
    return progress;
  }

  return {
    ...progress,
    unlockedTechnologies: [...progress.unlockedTechnologies, project.technologyId],
    activeProject: null
  };
}

export function addResearchPoints(progress: ResearchProgress, points: number): ResearchProgress {
  return { ...progress, researchPoints: progress.researchPoints + points };
}

/** Combines the effects of all unlocked technologies. */
export function technologyBonuses(unlockedTechnologies: readonly TechnologyId[]): TechnologyBonuses {
  return unlockedTechnologies.reduce((bonuses, technologyId): TechnologyBonuses => {
    const effect = TECHNOLOGIES[technologyId].effect;
    switch (effect.kind) {
      case 'shorterWeatherHolds':
        return {
          ...bonuses,
          weatherHoldDurationFactor: bonuses.weatherHoldDurationFactor * effect.holdDurationFactor
        };
      case 'preventCountdownIssue':
        return { ...bonuses, preventedCountdownIssues: [...bonuses.preventedCountdownIssues, effect.issue] };
      case 'higherReliability':
        return { ...bonuses, reliabilityBonus: bonuses.reliabilityBonus + effect.reliabilityBonus };
      case 'fasterAssembly':
        return { ...bonuses, assemblyDurationFactor: bonuses.assemblyDurationFactor * effect.assemblyDurationFactor };
      case 'fasterShipping':
        return { ...bonuses, shippingDaysSaved: bonuses.shippingDaysSaved + effect.shippingDaysSaved };
    }
  }, NO_TECHNOLOGY_BONUSES);
}
