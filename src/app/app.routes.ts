import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/homepage/homepage.component').then(m => m.HomepageComponent),
    title: 'LJ Studio Web, sites web et outils métier sur-mesure, Bordeaux et France'
  },

  // Compat : anciens liens /home => /
  {
    path: 'home',
    redirectTo: '',
    pathMatch: 'full'
  },

  // Compat : anciens liens /intro => / (tu pourras supprimer plus tard)
  {
    path: 'intro',
    redirectTo: '',
    pathMatch: 'full'
  },

  {
    path: 'sites-web',
    loadComponent: () =>
      import('./pages/sites-web/sites-web.component').then(m => m.SitesWebComponent),
    title: 'Création de sites web sur-mesure à Bordeaux, vitrine, e-commerce, Angular, LJ Studio Web'
  },

  {
    path: 'outils-metier',
    loadComponent: () =>
      import('./pages/outils-metier/outils-metier.component').then(m => m.OutilsMetierComponent),
    title: 'Développement d\'outils métier sur-mesure pour entreprises, LJ Studio Web'
  },

  {
    path: 'projets/:category',
    loadComponent: () =>
      import('./pages/projets/projets-liste/projets-liste.component').then(m => m.ProjetsListeComponent)
  },

  {
    path: 'projets/:category/:slug',
    loadComponent: () =>
      import('./pages/projets/projet-detail/projet-detail.component').then(m => m.ProjetDetailComponent)
  },

  {
    path: '404',
    loadComponent: () =>
      import('./pages/not-found/not-found.component').then(m => m.NotFoundComponent),
    title: 'Page non trouvée, LJ Studio Web'
  },

  {
    path: '**',
    redirectTo: '404'
  }
];
