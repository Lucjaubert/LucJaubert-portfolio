import 'zone.js/node';
import express, { Request, Response } from 'express';
import { join } from 'path';
import { CommonEngine } from '@angular/ssr';
import bootstrap from './src/main.server';
import { APP_BASE_HREF } from '@angular/common';

const app = express();

const DIST_FOLDER = join(process.cwd(), 'lucjaubert');

app.get(
  '*.*',
  express.static(DIST_FOLDER, {
    maxAge: '1y',
  })
);

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
