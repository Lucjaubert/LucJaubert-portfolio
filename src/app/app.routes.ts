import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'intro',
        loadComponent: () => import('./shared/components/loading-screen/loading-screen.component').then(m => m.LoadingScreenComponent),
        title: 'Intro'
    },
    {
        path: '',
        redirectTo: 'intro',
        pathMatch: 'full'
    },
    {
        path: 'home',
        loadComponent: () => import('./pages/homepage/homepage.component').then(m => m.HomepageComponent),
        title: 'Accueil'
    },
    {
        path: '404',
        loadComponent: () => import('./pages/not-found/not-found.component').then(m => m.NotFoundComponent),
        title: 'Page non trouvée'
    },
    {
        path: '**',
        redirectTo: '404'
    }
];
