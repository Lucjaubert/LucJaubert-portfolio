import 'zone.js/node';
import express, { Request, Response } from 'express';
import { join } from 'path';
import { CommonEngine } from '@angular/ssr';
import bootstrap from './src/main.server';
import { APP_BASE_HREF } from '@angular/common';

const app = express();

const DIST_FOLDER = '/var/www/lucjaubert_c_usr14/data/www/lucjaubert.com/lucjaubert';

app.get(
  '*.*',
  express.static(DIST_FOLDER, {
    maxAge: '1y',
  })
);

// Redirection 301 permanente : ancienne URL ARMony => canonique (SEO).
// Doit précéder le handler Angular ci-dessous.
app.get('/projets/armony', (_req: Request, res: Response) => {
  res.redirect(301, '/projets/outils-metier/armony');
});

app.get('*', (req: Request, res: Response) => {
  const engine = new CommonEngine();
  engine
    .render({
      bootstrap,
      documentFilePath: join(DIST_FOLDER, 'index.html'),
      url: req.originalUrl,
      publicPath: DIST_FOLDER,
      providers: [{ provide: APP_BASE_HREF, useValue: req.baseUrl }],
    })
    .then((html) => res.status(200).send(html))
    .catch((err) => {
      console.error('Erreur lors du rendu SSR', err);
      res.status(500).send('Une erreur est survenue');
    });
});

app.listen(4000, () => {
  console.log(`Serveur Node écoutant sur http://localhost:4000`);
});
