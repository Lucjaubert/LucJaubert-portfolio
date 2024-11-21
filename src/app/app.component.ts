import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/components/header/header.component';
import { LoadingScreenComponent } from './shared/components/loading-screen/loading-screen.component';
import { LoadingService } from './services/loading.service';
import { Title, Meta } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    HeaderComponent,
    LoadingScreenComponent,
    NgIf
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  isAtBottom = false;
  isLoading$: Observable<boolean>;

  constructor(
    private loadingService: LoadingService,
    private titleService: Title,
    private metaService: Meta
  ) {
    this.isLoading$ = this.loadingService.loading$;
  }

  ngOnInit(): void {
    this.titleService.setTitle('Luc Jaubert - Développeur Web Freelance à Bordeaux');
    this.metaService.updateTag({
      name: 'description',
      content: 'Création de sites internet sur mesure, vitrines, e-commerce, et optimisation SEO à Bordeaux.'
    });
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const pos = (document.documentElement.scrollTop || document.body.scrollTop) + window.innerHeight;
    const max = document.documentElement.scrollHeight || document.body.scrollHeight;

    this.isAtBottom = max - pos < 100;
  }

  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
}
