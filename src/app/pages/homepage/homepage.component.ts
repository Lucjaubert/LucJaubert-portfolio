import { CommonModule } from '@angular/common';
import { Component, OnInit, Inject } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { PLATFORM_ID } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { LoadingService } from '../../services/loading.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
  ],
})
export class HomepageComponent implements OnInit {
  namePresentationComponent: any;
  projectsComponent: any;
  studioWebComponent: any;
  bioComponent: any;
  contactComponent: any;
  headerComponent: any;
  footerComponent: any;

  isLoaded: boolean = false;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private titleService: Title,
    private metaService: Meta,
    private loadingService: LoadingService
  ) {}

  async ngOnInit(): Promise<void> {
    this.titleService.setTitle('Luc Jaubert - Développeur Web Freelance à Bordeaux');
    this.metaService.updateTag({
      name: 'description',
      content: "Création de sites internet sur mesure, vitrines, e-commerce, et optimisation SEO à Bordeaux."
    });
    this.metaService.updateTag({
      property: 'og:title',
      content: 'Luc Jaubert - Développeur Web Freelance à Bordeaux'
    });
    this.metaService.updateTag({
      property: 'og:description',
      content: "Découvrez mes projets de développement web : e-commerce, vitrines, click&collect sur mesure."
    });
    this.metaService.updateTag({
      property: 'og:image',
      content: 'https://lucjaubert.com/assets/icons/apple-touch-icon.png'
    });

    await Promise.all([
      import('../../shared/components/header/header.component').then(
        (m) => (this.headerComponent = m.HeaderComponent)
      ),
      import('../../shared/components/name-presentation/name-presentation.component').then(
        (m) => (this.namePresentationComponent = m.NamePresentationComponent)
      ),
      import('../../shared/components/projects/projects.component').then(
        (m) => (this.projectsComponent = m.ProjectsComponent)
      ),
      import('../../shared/components/studio-web/studio-web.component').then(
        (m) => (this.studioWebComponent = m.StudioWebComponent)
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
  }
}
