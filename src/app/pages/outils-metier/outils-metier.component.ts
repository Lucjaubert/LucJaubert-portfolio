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
  whenRelevant?: string[];
  typicalExample?: string;
}

const OUTILS_METIER_SECTIONS: StudioSection[] = [
  {
    name: 'Outils de planning et sectorisation',
    mission:
      "<strong class='text-orange'>Génération automatique</strong> de plannings à partir de données structurées, gestion d'habilitations, <strong class='text-orange'>règles métier complexes</strong>, anti-conflits, équilibrage de charge.",
    stacks: "Angular SSR, NestJS, Node.js, MySQL, Excel parsing, Algorithmes d'affectation",
    whenRelevant: [
      "Votre planning est aujourd'hui géré sur un Excel partagé entre plusieurs managers, et les conflits d'affectation reviennent régulièrement.",
      "Vos collaborateurs ont des compétences ou habilitations différentes, et l'attribution manuelle prend plusieurs heures par semaine.",
      "Une nouvelle affectation impose de vérifier à la main des dizaines de règles métier (disponibilités, certifications, charge déjà attribuée, secteur géographique)."
    ],
    typicalExample:
      "Une entreprise de services techniques de <strong class='text-orange'>50 collaborateurs</strong> intervient sur tout le grand Sud-Ouest. Les responsables de secteur passent une demi-journée par semaine à construire les tournées dans Excel, en jonglant entre compétences certifiées, contraintes horaires et zones d'intervention. Un outil dédié génère les plannings en <strong class='text-orange'>quelques minutes</strong> à partir des règles métier réelles, gère les conflits automatiquement, et libère les managers pour le travail à plus forte valeur ajoutée."
  },
  {
    name: 'Tableaux de bord et interfaces admin',
    mission:
      "Vues consolidées sur des données dispersées entre plusieurs outils. Indicateurs clés, filtres dynamiques, exports paramétrables. La force d'un tableau de bord utile, c'est de <strong class='text-orange'>lire la donnée dans le temps</strong> : comparer un mois au mois précédent, l'année en cours à la même période un an plus tôt, isoler un segment d'activité sur trois ans. Pour les équipes opérationnelles qui pilotent leur charge au quotidien, et pour les directions qui veulent <strong class='text-orange'>décider vite</strong> avec une information fiable.\\n\\nQuand le besoin va plus loin, j'intègre des fonctions de <strong class='text-orange'>projection</strong> basées sur les données historiques (tendances, saisonnalités) et des <strong class='text-orange'>indicateurs de vigilance</strong> déclenchés sur seuils métier (sous-activité, dépassement budgétaire, taux d'erreur). Ces fonctions sont conçues au cas par cas, en fonction des décisions qu'elles doivent réellement éclairer.",
    stacks: 'Angular, Charts, API REST, PostgreSQL, Authentification, Exports CSV / Excel, Comparaisons multi-périodes',
    whenRelevant: [
      "Les données opérationnelles sont éclatées entre plusieurs outils (CRM, comptabilité, fichier RH, exports manuels), et personne n'a la vue d'ensemble.",
      "Les rapports mensuels demandent plusieurs heures de manipulation Excel chaque mois, alors qu'ils pourraient être automatisés et comparés d'une période à l'autre.",
      "Vos décisions de pilotage reposent sur des tableaux datés de plusieurs semaines, ou pire, sur du ressenti faute de données fiables et actualisées."
    ],
    typicalExample:
      "Une PME industrielle de <strong class='text-orange'>80 personnes</strong> exporte chaque mois des données de son ERP, de son logiciel de paie et d'un fichier Excel maison, qu'un assistant de direction consolide à la main avant le comité mensuel. Un tableau de bord sur-mesure connecte les trois sources, affiche les indicateurs en temps réel, et permet à la direction de filtrer par site, par activité, par période. Les responsables peuvent comparer le mois en cours au même mois l'année précédente, suivre l'évolution sur <strong class='text-orange'>12 ou 24 mois</strong>, et identifier rapidement les écarts qui méritent une décision."
  },
  {
    name: 'Intranet et extranet',
    mission:
      "Espaces internes pour vos équipes, espaces clients ou partenaires pour vos relations externes. <strong class='text-orange'>Gestion des droits</strong>, workflows, documents, <strong class='text-orange'>échanges sécurisés</strong>.",
    stacks: 'Angular, NestJS, OAuth, JWT, MySQL, Hostinger VPS',
    whenRelevant: [
      "Vos équipes échangent encore par mail des documents internes, et personne ne sait quelle est la dernière version à jour.",
      "Vos clients ou partenaires vous demandent régulièrement les mêmes informations (devis, contrats, suivi de dossier), et vous perdez du temps à les renvoyer.",
      "Vous avez besoin de cloisonner l'accès à certaines données selon le rôle (équipe interne, client, partenaire), ce qu'un Drive partagé ne permet pas."
    ],
    typicalExample:
      "Un cabinet d'expertise de <strong class='text-orange'>25 collaborateurs</strong> accompagne plus de <strong class='text-orange'>200 clients</strong> sur des dossiers longs et confidentiels. Chaque client demande régulièrement le statut de son dossier, ses documents, ses échéances. Un extranet sur-mesure offre à chaque client un espace dédié, avec ses documents, ses échéances, et un historique des échanges, tout en respectant strictement les règles de confidentialité métier."
  },
  {
    name: 'Automatisation et traitements',
    mission:
      "Tâches répétitives, imports, calculs, envois conditionnés, transformations de données. Tout ce qui peut être <strong class='text-orange'>codé une fois</strong> et ne <strong class='text-orange'>plus jamais consommer d'heures humaines</strong>.",
    stacks: 'Node.js, Excel parsing, JSON, API REST, Cron jobs',
    whenRelevant: [
      "Certaines tâches reviennent chaque semaine ou chaque mois et consomment plusieurs heures à un collaborateur sans valeur ajoutée pour lui.",
      "Vous importez ou exportez régulièrement des fichiers entre logiciels, en passant par Excel ou par copier-coller manuel.",
      "Vous savez identifier précisément quel processus pourrait être codé une fois pour toutes, mais personne en interne n'a le temps ou les compétences pour le faire."
    ],
    typicalExample:
      "Un service comptable de PME passe chaque fin de mois <strong class='text-orange'>deux jours</strong> à rapprocher manuellement des écritures bancaires avec des factures fournisseurs, dans un fichier Excel construit au fil des années. Un script d'automatisation parse les exports bancaires, applique les règles de rapprochement déjà connues du service, et ne soumet aux humains que les cas réellement ambigus. Le service comptable passe de deux jours à <strong class='text-orange'>deux heures de validation</strong>."
  },
  {
    name: 'Méthode',
    mission:
      "<strong class='text-orange'>Cadrage terrain</strong> avec les équipes qui vont utiliser l'outil, pas les décideurs seuls. Prototype rapide, itérations courtes, accompagnement au changement. Mieux vaut <strong class='text-orange'>un outil simple bien adopté</strong> qu'un outil complet abandonné.",
    stacks: 'Cadrage, User research, Prototype, Itération, Adoption, Suivi',
    whenRelevant: [
      "Vous avez déjà tenté un outil interne ou un logiciel du marché, mais il n'est jamais devenu une habitude pour les équipes.",
      "Les décisions sur les outils internes sont aujourd'hui prises par la direction sans consultation réelle des utilisateurs finaux.",
      "Vous savez que la difficulté n'est pas seulement technique, mais aussi humaine : faire adopter un nouvel outil par une équipe installée dans ses habitudes."
    ],
    typicalExample:
      "Une organisation publique de <strong class='text-orange'>40 agents</strong> avait fait développer un outil interne par un prestataire deux ans plus tôt. L'outil fonctionnait techniquement, mais les agents ne l'utilisaient pas, restant fidèles à leurs anciens fichiers Excel. La méthode part de l'usage réel : entretiens avec les agents sur le terrain, prototype simplifié, validation à chaque itération, déploiement progressif avec accompagnement. L'outil final est plus modeste que le précédent, mais <strong class='text-orange'>utilisé tous les jours</strong>."
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
      title: "Développement d'outils métier sur-mesure à Bordeaux — LJ Studio Web",
      description:
        "Conception et développement d'outils métier sur-mesure : planning, automatisation, intranet, extranet, tableaux de bord, outils RH. Pour les équipes qui perdent du temps avec des outils inadaptés. Développeur freelance basé à Bordeaux.",
      url: 'https://lucjaubert.com/outils-metier',
      image: 'https://lucjaubert.com/assets/icons/apple-touch-icon.png'
    });
  }
}
