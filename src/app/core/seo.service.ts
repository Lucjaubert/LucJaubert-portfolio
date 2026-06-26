import { Injectable, Inject } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';

export interface SeoConfig {
  title: string;
  description: string;
  url: string;
  image?: string;
  /** og:type — laissé tel quel (défaut "website" de l'index.html) si absent. */
  type?: 'website' | 'article';
  /** Titre social distinct du <title> ; retombe sur title si absent. */
  ogTitle?: string;
}

@Injectable({ providedIn: 'root' })
export class SeoService {

  constructor(
    private titleSrv: Title,
    private meta: Meta,
    @Inject(DOCUMENT) private doc: Document
  ) {}

  update(cfg: SeoConfig): void {

    /* Titre social distinct du <title> si fourni, sinon identique */
    const socialTitle = cfg.ogTitle ?? cfg.title;

    /* Title & meta description */
    this.titleSrv.setTitle(cfg.title);
    this.meta.updateTag({ name: 'description', content: cfg.description });

    /* Open Graph (Facebook, LinkedIn…) */
    if (cfg.type) {
      this.meta.updateTag({ property: 'og:type', content: cfg.type });
    }
    this.meta.updateTag({ property: 'og:title', content: socialTitle });
    this.meta.updateTag({ property: 'og:description', content: cfg.description });
    this.meta.updateTag({ property: 'og:url', content: cfg.url });
    if (cfg.image) {
      this.meta.updateTag({ property: 'og:image', content: cfg.image });
    }

    /* Twitter Cards (même contenu que OG) */
    this.meta.updateTag({ name: 'twitter:title', content: socialTitle });
    this.meta.updateTag({ name: 'twitter:description', content: cfg.description });
    if (cfg.image) {
      this.meta.updateTag({ name: 'twitter:image', content: cfg.image });
    }

    /* Canonical dynamique */
    let link: HTMLLinkElement | null =
      this.doc.head.querySelector('link[rel="canonical"]');
    if (!link) {
      link = this.doc.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.doc.head.appendChild(link);
    }
    link.setAttribute('href', cfg.url);
  }
}
