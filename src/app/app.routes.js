"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.routes = void 0;
exports.routes = [
    { path: '', loadComponent: function () { return Promise.resolve().then(function () { return require('./pages/homepage/homepage.component'); }).then(function (m) { return m.HomepageComponent; }); }, title: 'Accueil' },
    { path: '404', loadComponent: function () { return Promise.resolve().then(function () { return require('./pages/not-found/not-found.component'); }).then(function (m) { return m.NotFoundComponent; }); }, title: 'Page non trouvée' },
    { path: '**', redirectTo: '404' }
];
