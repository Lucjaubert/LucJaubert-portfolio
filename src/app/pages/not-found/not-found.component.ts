import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Meta } from '@angular/platform-browser';
import { SeoService } from '../../core/seo.service';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
  ],
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss']
})
export class NotFoundComponent implements OnInit {
  constructor(
    private router: Router,
    private seoService: SeoService,
    private meta: Meta
  ) {}

  ngOnInit(): void {
    this.seoService.update({
      title: 'Page non trouvée, LJ Studio Web',
      description: 'La page que vous cherchez n\'existe pas. Retournez à l\'accueil.',
      url: 'https://lucjaubert.com/404',
      image: 'https://lucjaubert.com/assets/icons/apple-touch-icon.png'
    });
    this.meta.updateTag({ name: 'robots', content: 'noindex, follow' });
  }

  goToHomePage(): void {
    this.router.navigate(['/']);
  }
}
