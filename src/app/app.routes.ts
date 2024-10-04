import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: '', loadComponent: () => import('./pages/homepage/homepage.component').then(m => m.HomepageComponent), title: 'Accueil' },
    { path: '**', redirectTo: '' } 
];
