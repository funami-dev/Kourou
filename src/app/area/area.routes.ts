import { Routes } from '@angular/router';

export const areaRoutes: Routes = [
  {
    path: 'area',
    loadComponent: () => import('./area.component').then((m) => m.AreaComponent)
  },
  {
    path: 'contracts',
    loadComponent: () => import('../contracts/contracts.component').then((m) => m.ContractsComponent)
  },
  {
    path: 'finances',
    loadComponent: () => import('../finances/finances.component').then((m) => m.FinancesComponent)
  },
  {
    path: 'ground',
    loadComponent: () => import('./ground/ground.component').then((m) => m.GroundComponent)
  }
];
