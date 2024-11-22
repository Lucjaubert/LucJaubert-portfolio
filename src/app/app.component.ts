import { CommonModule } from '@angular/common';
import {
  Component,
  HostListener,
  OnInit,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { HeaderComponent } from './shared/components/header/header.component';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, CommonModule, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  isAtBottom = false;

  constructor(
    private titleService: Title,
    private metaService: Meta,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.updateSEO(
      'Luc Jaubert - Création de Sites Internet | Développeur Web Freelance',
      'Je crée des sites internet sur mesure : vitrines, e-commerce, click & collect, avec une expertise en SEO. Basé à Bordeaux, je suis à votre service pour développer votre présence en ligne.',
      'https://lucjaubert.com/assets/icons/apple-touch-icon.png'
    );

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        if (event.url === '/contact') {
          this.updateSEO(
            'Contact - Luc Jaubert',
            'Contactez-moi pour discuter de vos projets de création de site internet.',
            'https://lucjaubert.com/assets/icons/contact-page-image.png'
          );
        } else {
          this.updateSEO(
            'Luc Jaubert - Création de Sites Internet | Développeur Web Freelance',
            'Je crée des sites internet sur mesure : vitrines, e-commerce, click & collect, avec une expertise en SEO. Basé à Bordeaux, je suis à votre service pour développer votre présence en ligne.',
            'https://lucjaubert.com/assets/icons/apple-touch-icon.png'
          );
        }
      }
    });
  }

  /**
   * Met à jour les balises meta pour le SEO
   * @param title Titre de la page
   * @param description Description de la page
   * @param image
   */
  updateSEO(title: string, description: string, image: string): void {
    this.titleService.setTitle(title);

    this.metaService.updateTag({
      name: 'description',
      content: description,
    });

    this.metaService.updateTag({ property: 'og:title', content: title });
    this.metaService.updateTag({
      property: 'og:description',
      content: description,
    });
    this.metaService.updateTag({ property: 'og:image', content: image });
    this.metaService.updateTag({
      property: 'og:url',
      content: 'https://lucjaubert.com/home',
    });
    this.metaService.updateTag({
      property: 'og:site_name',
      content: 'Luc Jaubert Portfolio',
    });
    this.metaService.updateTag({ property: 'og:type', content: 'website' });

    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: title });
    this.metaService.updateTag({
      name: 'twitter:description',
      content: description,
    });
    this.metaService.updateTag({ name: 'twitter:image', content: image });

    this.metaService.updateTag({
      name: 'robots',
      content: 'index, follow, max-image-preview:large',
    });
    this.metaService.updateTag({ name: 'theme-color', content: '#537ce2' });
    this.metaService.updateTag({
      rel: 'canonical',
      href: 'https://lucjaubert.com/home',
    });
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const scrollTop =
      document.documentElement.scrollTop || document.body.scrollTop;
    const windowHeight = window.innerHeight;
    const documentHeight =
      document.documentElement.scrollHeight || document.body.scrollHeight;

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
