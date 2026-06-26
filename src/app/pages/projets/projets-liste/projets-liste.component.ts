import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FooterComponent } from '../../../shared/components/footer/footer.component';
import { SeoService } from '../../../core/seo.service';
import { ProjectsDataService, ProjectData } from '../../../core/projects-data.service';

const KNOWN_CATEGORIES = ['outils-metier', 'sites-web'];

@Component({
  selector: 'app-projets-liste',
  standalone: true,
  imports: [CommonModule, RouterModule, FooterComponent],
  templateUrl: './projets-liste.component.html',
  styleUrls: ['./projets-liste.component.scss']
})
export class ProjetsListeComponent implements OnInit {
  category = '';
  projects: ProjectData[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private seo: SeoService,
    private data: ProjectsDataService
  ) {}

  ngOnInit(): void {
    // Lecture synchrone : rendu serveur garanti, aucun garde navigateur.
    const category = this.route.snapshot.paramMap.get('category') ?? '';

    if (!KNOWN_CATEGORIES.includes(category)) {
      this.router.navigateByUrl('/404');
      return;
    }

    this.category = category;
    this.projects = this.data.getByCategory(category);

    const label = this.categoryLabel(category);
    this.seo.update({
      title: `${label} — projets | Luc Jaubert`,
      description: `Projets ${label.toLowerCase()} réalisés par Luc Jaubert, développeur web freelance à Bordeaux.`,
      url: `https://lucjaubert.com/projets/${category}`,
      image: 'https://lucjaubert.com/assets/icons/apple-touch-icon.png',
      type: 'website'
    });
  }

  cleanName(name: string): string {
    return name.replace(' (en cours)', '').replace(/\s*\.\s*$/, '').trim();
  }

  categoryLabel(category: string): string {
    return category === 'outils-metier' ? 'Outils métier' : 'Sites web';
  }

  excerpt(p: ProjectData): string {
    return p.project || p.description;
  }
}
