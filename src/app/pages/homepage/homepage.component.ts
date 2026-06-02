import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { LoadingService } from '../../services/loading.service';
import { SeoService } from '../../core/seo.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule],
})
export class HomepageComponent implements OnInit {
  namePresentationComponent: any;
  descriptionComponent: any;
  offresHomeComponent: any;
  projectsComponent: any;
  bioComponent: any;
  contactComponent: any;
  headerComponent: any;
  footerComponent: any;

  isLoaded = false;

  constructor(
    private loadingService: LoadingService,
    private seoService: SeoService,
    private route: ActivatedRoute,
    @Inject(PLATFORM_ID) private platformId: object
  ) {}

  async ngOnInit(): Promise<void> {
    this.seoService.update({
      title: 'LJ Studio Web, sites web et outils métier sur-mesure, Bordeaux et France',
      description:
        "Développeur freelance à Bordeaux. Création de sites web (vitrine, e-commerce, Angular, WordPress headless) et conception d'outils métier sur-mesure pour entreprises et organisations partout en France.",
      url: 'https://lucjaubert.com/',
      image: 'https://lucjaubert.com/assets/icons/apple-touch-icon.png'
    });

    await Promise.all([
      import('../../shared/components/header/header.component').then(
        (m) => (this.headerComponent = m.HeaderComponent)
      ),
      import('../../shared/components/name-presentation/name-presentation.component').then(
        (m) => (this.namePresentationComponent = m.NamePresentationComponent)
      ),
      import('../../shared/components/description/description.component').then(
        (m) => (this.descriptionComponent = m.DescriptionComponent)
      ),
      import('../../shared/components/offres-home/offres-home.component').then(
        (m) => (this.offresHomeComponent = m.OffresHomeComponent)
      ),
      import('../../shared/components/projects/projects.component').then(
        (m) => (this.projectsComponent = m.ProjectsComponent)
      ),
      import('../../shared/components/bio/bio.component').then(
        (m) => (this.bioComponent = m.BioComponent)
      ),
      import('../../shared/components/contact/contact.component').then(
        (m) => (this.contactComponent = m.ContactComponent)
      ),
      import('../../shared/components/footer/footer.component').then(
        (m) => (this.footerComponent = m.FooterComponent)
      ),
    ]);

    this.isLoaded = true;
    this.loadingService.setLoading(false);

    this.scrollToFragmentIfAny();
  }

  /**
   * Les sous-composants de la home sont rendus via *ngComponentOutlet uniquement
   * après isLoaded === true. anchorScrolling d'Angular scrolle dès NavigationEnd,
   * donc trop tôt : la cible (#contact, #bio, #projects) n'existe pas encore dans
   * le DOM. On scrolle manuellement après le rendu.
   */
  private scrollToFragmentIfAny(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const fragment = this.route.snapshot.fragment;
    if (!fragment) return;

    setTimeout(() => {
      document.getElementById(fragment)?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }, 100);
  }
}
