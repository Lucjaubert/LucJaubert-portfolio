import { CommonModule } from '@angular/common';
import { Component, OnInit, Inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { catchError, Observable, of } from 'rxjs';
import { PLATFORM_ID } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
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

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private titleService: Title,
    private metaService: Meta
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

    this.headerComponent = await import('../../shared/components/header/header.component').then(
      (m) => m.HeaderComponent
    );
    this.namePresentationComponent = await import('../../shared/components/name-presentation/name-presentation.component').then(
      (m) => m.NamePresentationComponent
    );
    this.projectsComponent = await import('../../shared/components/projects/projects.component').then(
      (m) => m.ProjectsComponent
    );
    this.studioWebComponent = await import('../../shared/components/studio-web/studio-web.component').then(
      (m) => m.StudioWebComponent
    );
    this.bioComponent = await import('../../shared/components/bio/bio.component').then(
      (m) => m.BioComponent
    );
    this.contactComponent = await import('../../shared/components/contact/contact.component').then(
      (m) => m.ContactComponent
    );
    this.footerComponent = await import('../../shared/components/footer/footer.component').then(
      (m) => m.FooterComponent
    );
  }
}
