import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { SeoService } from '../../../core/seo.service';
import { ProjectsDataService, ProjectData, GalleryImage } from '../../../core/projects-data.service';

@Component({
  selector: 'app-projet-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FooterComponent],
  templateUrl: './projet-detail.component.html',
  styleUrls: ['./projet-detail.component.scss']
})
export class ProjetDetailComponent implements OnInit {
  project?: ProjectData;

  readonly bookingUrl =
    'https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ2noGgcNtZash82WCL0Mkb_q2kBUWt_KSD5kjBf60waEpjl2AH9RKzp51BQ1E6vCRDCPxbR-_sM';

  // Lightbox — confort JS, les <img> restent en dur (rendu SSR).
  lightboxOpen = false;
  lightboxSrc = '';
  lightboxAlt = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private seo: SeoService,
    private data: ProjectsDataService
  ) {}

  ngOnInit(): void {
    // Lecture synchrone des params + données : rendu serveur garanti, aucun garde navigateur.
    const category = this.route.snapshot.paramMap.get('category') ?? '';
    const slug = this.route.snapshot.paramMap.get('slug') ?? '';
    const project = this.data.getBySlug(category, slug);

    if (!project) {
      this.router.navigateByUrl('/404');
      return;
    }

    this.project = project;

    const url = `https://lucjaubert.com/projets/${project.category}/${project.slug}`;

    if (project.seo) {
      // OG dédiés (ex. ARMony) repris tels quels, url canonique sur la route générique.
      this.seo.update({
        title: project.seo.title,
        description: project.seo.description,
        url,
        image: project.seo.ogImage ?? this.firstImageAbsolute(project),
        type: 'article',
        ogTitle: project.seo.ogTitle ?? this.cleanName(project.name)
      });
    } else {
      this.seo.update({
        title: `${this.cleanName(project.name)} — étude de projet | Luc Jaubert`,
        description: project.description,
        url,
        image: this.firstImageAbsolute(project),
        type: 'article',
        ogTitle: this.cleanName(project.name)
      });
    }
  }

  private firstImageAbsolute(project: ProjectData): string {
    const first = project.galleryImages?.[0]?.src ?? project.images?.[0];
    return first
      ? `https://lucjaubert.com/${first.replace(/^\//, '')}`
      : 'https://lucjaubert.com/assets/icons/apple-touch-icon.png';
  }

  /** Galerie de la page détail : galleryImages si présent, sinon images (avec alt généré). */
  galleryItems(): GalleryImage[] {
    if (!this.project) return [];
    if (this.project.galleryImages?.length) {
      return this.project.galleryImages;
    }
    const name = this.cleanName(this.project.name);
    return (this.project.images ?? []).map((src, i) => ({
      src,
      alt: `${name} — visuel ${i + 1}`
    }));
  }

  /** Retire le suffixe " ." final et l'éventuel "(en cours)". */
  cleanName(name: string): string {
    return name.replace(' (en cours)', '').replace(/\s*\.\s*$/, '').trim();
  }

  get hasExternalUrl(): boolean {
    return !!this.project?.url && this.project.url.trim().length > 0;
  }

  externalUrl(): string {
    const url = (this.project?.url ?? '').trim();
    return /^https?:\/\//i.test(url) ? url : 'https://' + url;
  }

  categoryLabel(category: string): string {
    return category === 'outils-metier' ? 'Outils métier' : 'Sites web';
  }

  openLightbox(event: Event): void {
    const img = (event.currentTarget as HTMLElement).querySelector('img');
    if (!img) return;
    this.lightboxSrc = img.getAttribute('src') ?? '';
    this.lightboxAlt = img.getAttribute('alt') ?? '';
    this.lightboxOpen = true;
  }

  closeLightbox(): void {
    this.lightboxOpen = false;
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.lightboxOpen) {
      this.closeLightbox();
    }
  }
}
