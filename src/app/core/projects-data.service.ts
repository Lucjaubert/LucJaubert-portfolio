import { Injectable } from '@angular/core';
import projectsData from '../../assets/data/projects.json';

/** Section de contenu riche (page détail). `gallery: true` rend la galerie à cette position. */
export interface ContentSection {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
  gallery?: boolean;
}

/** Image de galerie de la page détail, avec son alt dédié. */
export interface GalleryImage {
  src: string;
  alt: string;
}

/** Métadonnées SEO spécifiques (reprend les OG d'une page dédiée existante). */
export interface ProjectSeo {
  title: string;
  description: string;
  ogTitle?: string;
  ogImage?: string;
}

export interface ProjectData {
  name: string;
  slug: string;
  category: 'outils-metier' | 'sites-web';
  year: string;
  project: string;
  role: string;
  stacks: string;
  url: string;
  internalRoute?: string;
  description: string;
  images: string[];
  videos: string[];
  animationType: string;
  /** Contenu riche optionnel (étude de cas). Les projets sans `content` gardent le rendu simple. */
  content?: ContentSection[];
  /** Galerie de la page détail (séparée de `images`, l'aperçu home). */
  galleryImages?: GalleryImage[];
  /** SEO/OG dédiés optionnels. */
  seo?: ProjectSeo;
}

/**
 * Accès aux projets via import direct du JSON (synchrone, donc rendu serveur garanti
 * sans HttpClient ni garde isPlatformBrowser).
 */
@Injectable({ providedIn: 'root' })
export class ProjectsDataService {
  private readonly projects = projectsData as ProjectData[];

  getAll(): ProjectData[] {
    return this.projects;
  }

  getByCategory(category: string): ProjectData[] {
    return this.projects.filter((p) => p.category === category);
  }

  getBySlug(category: string, slug: string): ProjectData | undefined {
    return this.projects.find((p) => p.category === category && p.slug === slug);
  }
}
