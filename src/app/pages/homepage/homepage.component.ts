import { CommonModule } from '@angular/common';
import { Component, OnInit, Inject } from '@angular/core';
import { PLATFORM_ID } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { NamePresentationComponent } from '../../shared/components/name-presentation/name-presentation.component';
import { ProjectsComponent } from '../../shared/components/projects/projects.component';
import { StudioWebComponent } from '../../shared/components/studio-web/studio-web.component';
import { BioComponent } from '../../shared/components/bio/bio.component';
import { ContactComponent } from '../../shared/components/contact/contact.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    NamePresentationComponent,
    ProjectsComponent,
    StudioWebComponent,
    BioComponent,
    ContactComponent,
    FooterComponent,
  ],
})
export class HomepageComponent implements OnInit {
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private titleService: Title,
    private metaService: Meta
  ) {}

  ngOnInit(): void {
    this.titleService.setTitle(
      'Luc Jaubert - Création de Sites Internet | Développeur Web Freelance'
    );
    this.metaService.updateTag({
      name: 'description',
      content:
        'Création de sites internet sur mesure, vitrines, e-commerce, et optimisation SEO à Bordeaux.',
    });
    this.metaService.updateTag({
      property: 'og:title',
      content:
        'Luc Jaubert - Création de Sites Internet | Développeur Web Freelance',
    });
    this.metaService.updateTag({
      property: 'og:description',
      content:
        'Découvrez mes projets de développement web : vitrines, e-commerce, click & collect sur mesure, avec une expertise en SEO.',
    });
    this.metaService.updateTag({
      property: 'og:image',
      content: 'https://lucjaubert.com/assets/icons/apple-touch-icon.png',
    });
  }
}
