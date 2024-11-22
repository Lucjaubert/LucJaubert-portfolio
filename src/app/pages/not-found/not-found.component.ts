import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';

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
    private titleService: Title,
    private metaService: Meta
  ) {}

  ngOnInit(): void {
    this.titleService.setTitle('Erreur 404 - Page non trouvée | Luc Jaubert');
    this.metaService.updateTag({
      name: 'description',
      content: 'La page que vous cherchez est introuvable. Retournez à l’accueil ou vérifiez l’URL.'
    });
  }

  goToHomePage(): void {
    this.router.navigate(['/']);
  }
}
