import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { StudioWebComponent } from '../../shared/components/studio-web/studio-web.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { SeoService } from '../../core/seo.service';

interface StudioSection {
  name: string;
  mission: string;
  stacks: string;
}

const OUTILS_METIER_SECTIONS: StudioSection[] = [
  {
    name: 'Outils de planning et sectorisation',
    mission:
      "<strong class='text-orange'>Génération automatique de plannings</strong> à partir de données structurées, gestion d'habilitations, <strong class='text-orange'>règles métier complexes</strong>, anti-conflits, équilibrage de charge.",
    stacks: 'Angular SSR, NestJS, Node.js, MySQL, Excel parsing, Algorithmes d\'affectation'
  },
  {
    name: 'Tableaux de bord et interfaces admin',
    mission:
      "<strong class='text-orange'>Vues consolidées sur des données dispersées</strong>. KPIs, filtres, exports. Pour les équipes opérationnelles et les directions qui veulent <strong class='text-orange'>décider vite avec une information fiable</strong>.",
    stacks: 'Angular, Charts, API REST, PostgreSQL, Authentification'
  },
  {
    name: 'Intranet et extranet',
    mission:
      "Espaces internes pour vos équipes, espaces clients ou partenaires pour vos relations externes. <strong class='text-orange'>Gestion des droits, workflows, documents, échanges sécurisés</strong>.",
    stacks: 'Angular, NestJS, OAuth, JWT, MySQL, Hostinger VPS'
  },
  {
    name: 'Automatisation et traitements',
    mission:
      "Tâches répétitives, imports, calculs, envois conditionnés, transformations de données. Tout ce qui peut être <strong class='text-orange'>codé une fois et ne plus jamais consommer d'heures humaines</strong>.",
    stacks: 'Node.js, Excel parsing, JSON, API REST, Cron jobs'
  },
  {
    name: 'Méthode',
    mission:
      "<strong class='text-orange'>Cadrage terrain avec les équipes qui vont utiliser l'outil</strong>, pas les décideurs seuls. Prototype rapide, itérations courtes, accompagnement au changement. <strong class='text-orange'>Mieux vaut un outil simple bien adopté qu'un outil complet abandonné</strong>.",
    stacks: 'Cadrage, User research, Prototype, Itération, Adoption, Suivi'
  }
];

@Component({
  selector: 'app-outils-metier',
  standalone: true,
  imports: [CommonModule, RouterModule, StudioWebComponent, FooterComponent],
  templateUrl: './outils-metier.component.html',
  styleUrls: ['./outils-metier.component.scss']
})
export class OutilsMetierComponent implements OnInit {
  sections = OUTILS_METIER_SECTIONS;

  constructor(private seoService: SeoService) {}

  ngOnInit(): void {
    this.seoService.update({
      title: "Développement d'outils métier sur-mesure pour entreprises, LJ Studio Web",
      description:
        "Conception et développement d'outils métier sur-mesure : planning, automatisation, intranet, tableaux de bord, outils RH. Pour les équipes qui perdent du temps avec des outils inadaptés. Freelance Bordeaux, France entière.",
      url: 'https://lucjaubert.com/outils-metier',
      image: 'https://lucjaubert.com/assets/icons/apple-touch-icon.png'
    });
  }
}
