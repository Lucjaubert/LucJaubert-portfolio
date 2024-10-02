import { CommonModule } from '@angular/common';
import { Component, OnInit, Inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { WordpressService } from '../../services/wordpress.service';
import { catchError, Observable, of } from 'rxjs';
import { HomepageData } from '../../models/homepage-data.model';
import { PLATFORM_ID } from '@angular/core';

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

  homepageData$!: Observable<HomepageData[] | null>;

  constructor(
    private wordpressService: WordpressService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  async ngOnInit(): Promise<void> {
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

    // Charger les données de la page d'accueil
    this.homepageData$ = this.wordpressService.getHomepageData().pipe(
      catchError((error) => {
        console.error('Error retrieving homepage data:', error);
        return of(null);
      })
    );
  }
}
