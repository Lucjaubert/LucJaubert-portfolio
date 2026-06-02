import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  ViewChildren,
  QueryList
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { StudioWebComponent } from '../../shared/components/studio-web/studio-web.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { SeoService } from '../../core/seo.service';

interface StudioSection {
  name: string;
  mission: string;
  stacks: string;
}

interface ProjetRecent {
  title: string;
  url: string | null;
  description: string;
  testimonial: string | null;
  testimonialAuthor: string | null;
}

export const METHODE_SECTIONS: StudioSection[] = [
  {
    name: 'Cadrage stratégique et architecture',
    mission:
      "On commence par comprendre votre activité, vos cibles, vos objectifs business. Pas de maquette avant cette phase. Ensuite, avant les pixels, je structure le contenu : quelles pages, dans quel ordre, avec quelle hiérarchie, avec quels parcours utilisateurs. Cette étape s'appuie sur ma <strong class='text-yellow'>formation d'architecte</strong> : un site web se conçoit comme <strong class='text-yellow'>un espace qu'on parcourt</strong>.",
    stacks: 'Brief stratégique, Personas, User journeys, Zoning, Arborescence, Wireframes, Maquettes Figma'
  },
  {
    name: 'Design et identité visuelle',
    mission:
      "Design des pages clés à partir de votre charte graphique existante, ou en collaboration avec un graphiste ou une agence si la création visuelle est confiée à des spécialistes — comme avec <strong class='text-yellow'>Studio Dada</strong> sur le projet Groupe ABC. Je veille à une cohérence visuelle au service du parcours utilisateur, pas à des <strong class='text-yellow'>effets décoratifs gratuits</strong>.",
    stacks: 'Figma, Adobe XD, UI Design, UX Design, Responsive Design, Identité visuelle, Charte graphique, Création de logo'
  },
  {
    name: 'Développement, SEO et performance',
    mission:
      "Stack adaptée au projet : Angular 18 avec rendu côté serveur pour les sites institutionnels exigeants, ou WordPress en configuration headless quand le client veut garder la main éditoriale. <strong class='text-yellow'>Pas de template, pas de page builder limitant</strong>. Du code propre, conçu pour durer. Optimisation des temps de chargement, balisage sémantique, structure pour le référencement, Core Web Vitals — soit en autonomie, soit en collaboration avec un référenceur spécialisé comme <strong class='text-yellow'>Matthieu Laberibe</strong> sur Groupe ABC.",
    stacks: 'Angular 18 SSR, WordPress Headless, WordPress, Shopify, HTML5, CSS3, TypeScript, API REST, GSAP, SEO technique, Core Web Vitals, Schema.org'
  },
  {
    name: 'Mise en ligne et accompagnement',
    mission:
      "Déploiement, mise en place de l'hébergement, vérifications post-lancement. Et un suivi sur les premières semaines, parce que les ajustements qui apparaissent après une mise en ligne sont normaux et doivent être pris en charge. Mon objectif n'est pas de <strong class='text-yellow'>livrer puis disparaître</strong> : c'est de remettre un <strong class='text-yellow'>outil web qui tient dans le temps</strong>.",
    stacks: 'Déploiement VPS, Nginx, PM2, Monitoring, Sauvegardes, Maintenance, Formation client, Suivi post-livraison'
  }
];

export const PROJETS_RECENTS: ProjetRecent[] = [
  {
    title: "Groupe ABC — réseau national d'experts immobiliers",
    url: 'https://groupe-abc.fr/',
    description:
      "Site institutionnel pour un réseau d'experts agréés présents à Paris, en régions et en Outre-mer. Architecture évolutive sous <strong class='text-yellow'>Angular 18 SSR et WordPress Headless</strong>, en collaboration avec <strong class='text-yellow'>Studio Dada</strong> pour la charte graphique et Matthieu Laberibe pour le SEO.",
    testimonial: 'Très bonne relation avec Luc, qui est très compétent.',
    testimonialAuthor: 'Groupe ABC'
  },
  {
    title: "Laiterie Burdigala — e-commerce et vente d'ateliers",
    url: 'https://laiterieburdigala.fr/',
    description:
      "Site e-commerce avec <strong class='text-yellow'>click and collect</strong> et <strong class='text-yellow'>tunnel Stripe sur-mesure</strong> pour la vente d'ateliers et de produits laitiers. Intégration de paiement personnalisée et optimisation du parcours d'achat.",
    testimonial:
      "J'ai été enchantée de collaborer avec Luc Jaubert pour le développement de mon site web de la Laiterie Burdigala. Il a été pédagogue, disponible et à l'écoute. Le monde de l'informatique n'étant pas mon métier, il a su se faire comprendre et rendre intuitive l'alimentation du site (renseignement des Textes). De plus, ayant mon entreprise et étant prise par de nombreuses urgences, il n'a pas hésité à me relancer, afin de pouvoir terminer dans les temps. Je recommande son travail à 200%, vous pouvez lui faire confiance les yeux fermés.",
    testimonialAuthor: 'Laiterie Burdigala'
  }
];

@Component({
  selector: 'app-sites-web',
  standalone: true,
  imports: [CommonModule, RouterModule, StudioWebComponent, FooterComponent],
  templateUrl: './sites-web.component.html',
  styleUrls: ['./sites-web.component.scss']
})
export class SitesWebComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChildren('fadeIn') fadeInElements!: QueryList<ElementRef<HTMLElement>>;

  methodeSections = METHODE_SECTIONS;
  projetsRecents = PROJETS_RECENTS;

  private observer?: IntersectionObserver;

  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    private seoService: SeoService
  ) {}

  ngOnInit(): void {
    this.seoService.update({
      title: 'Création de sites web sur-mesure à Bordeaux — LJ Studio Web',
      description:
        "Développeur web freelance à Bordeaux, j'accompagne les entreprises établies dans la refonte de leur site. Angular SSR, WordPress Headless, design soigné.",
      url: 'https://lucjaubert.com/sites-web',
      image: 'https://lucjaubert.com/assets/icons/apple-touch-icon.png'
    });
  }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            this.observer?.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    this.fadeInElements.forEach((el) => this.observer?.observe(el.nativeElement));
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
