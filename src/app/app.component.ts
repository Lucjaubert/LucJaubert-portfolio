import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, HostListener, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/components/header/header.component';
import { LoadingScreenComponent } from './shared/components/loading-screen/loading-screen.component';
import { LoadingService } from './services/loading.service';
import { ProjectService } from './services/project.service';
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
    NgIf,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  isAtBottom = false;
  isLoading$: Observable<boolean>;

  constructor(
    private loadingService: LoadingService,
    private titleService: Title,
    private metaService: Meta,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isLoading$ = this.loadingService.loading$;
  }

  ngOnInit(): void {
    this.startLoading();

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        if (event.url === '/contact') {
          this.updateSEO(
            'Contact - Luc Jaubert',
            'Contactez-moi pour discuter de vos projets de création de site internet sur-mesure.',
            'https://lucjaubert.com/assets/icons/contact-page-image.png'
          );
        } else if (event.url === '/home' || event.url === '/') {
          this.updateSEO(
            'Luc Jaubert - Création de Sites Internet | Développeur Web Freelance',
            'Création de sites internet sur-mesure à Bordeaux : vitrines modernes, boutiques e-commerce performantes et optimisées pour tous les supports. Je vous aide à booster votre visibilité en ligne et à atteindre vos objectifs avec des solutions adaptées.',
            'https://lucjaubert.com/assets/icons/apple-touch-icon.png'
          );
        }
      }
    });
  }

  startLoading(): void {
    this.loadingService.setLoading(true);
    Promise.all([this.minimumLoadTime(2500)])
      .then(() => {
        this.loadingService.setLoading(false);
      })
      .catch((error) => {
        console.error('Erreur de chargement des ressources :', error);
        this.loadingService.setLoading(false);
      });
  }

  minimumLoadTime(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  updateSEO(title: string, description: string, image: string): void {
    this.titleService.setTitle(title);
    this.metaService.updateTag({ name: 'description', content: description });
    this.metaService.updateTag({ property: 'og:title', content: title });
    this.metaService.updateTag({ property: 'og:description', content: description });
    this.metaService.updateTag({ property: 'og:image', content: image });
    this.metaService.updateTag({ property: 'og:url', content: 'https://lucjaubert.com/home' });
    this.metaService.updateTag({ name: 'robots', content: 'index, follow' });

    this.updateCanonicalURL('https://lucjaubert.com/home');
  }

  updateCanonicalURL(url: string): void {
    let link: HTMLLinkElement | null = document.querySelector("link[rel='canonical']");
    if (link) {
      link.setAttribute('href', url);
    } else {
      link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      link.setAttribute('href', url);
      document.head.appendChild(link);
    }
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight || document.body.scrollHeight;

    const atBottom = scrollTop + windowHeight >= documentHeight - 100;
    if (this.isAtBottom !== atBottom) {
      this.isAtBottom = atBottom;
    }
  }

  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }
}
