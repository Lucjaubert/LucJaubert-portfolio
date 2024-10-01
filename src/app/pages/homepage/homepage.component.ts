import { CommonModule } from '@angular/common';
import { Component, OnInit, Inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { WordpressService } from '../../services/wordpress.service';
import { catchError, Observable, of } from 'rxjs';
import { HomepageData } from '../../models/homepage-data.model';
import { PLATFORM_ID } from '@angular/core';
import { BioComponent } from '../../shared/components/bio/bio.component';
import { ContactComponent } from '../../shared/components/contact/contact.component';
import { NamePresentationComponent } from '../../shared/components/name-presentation/name-presentation.component';
import { ProjectsComponent } from '../../shared/components/projects/projects.component';
import { StudioWebComponent } from '../../shared/components/studio-web/studio-web.component';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    BioComponent,
    ContactComponent,
    NamePresentationComponent,
    ProjectsComponent,
    StudioWebComponent,
    HeaderComponent,
    FooterComponent
  ],
})
export class HomepageComponent implements OnInit {
  homepageData$!: Observable<HomepageData[] | null>;

  constructor(
    private wordpressService: WordpressService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.homepageData$ = this.wordpressService.getHomepageData().pipe(
      catchError(error => {
        console.error('Error retrieving homepage data:', error);
        return of(null);
      })
    );
  }
}
