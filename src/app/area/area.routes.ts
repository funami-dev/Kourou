import { Routes } from '@angular/router';

export const areaRoutes: Routes = [
  {
    path: 'area',
    loadComponent: () => import('./area.component').then(m => m.AreaComponent)
  },
  {
    path: 'ground',
    loadComponent: () => import('./ground/ground.component').then(m => m.GroundComponent)
  }
];
