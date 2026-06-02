import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ]
})
export class HeaderComponent implements OnInit, OnDestroy {

  animateHeader = false;
  private routerSubscription?: Subscription;

  constructor(private router: Router) {}

  ngOnInit(): void {
    // État initial (au chargement)
    this.checkIfHomePage(this.router.url);

    // Suivi des navigations
    this.routerSubscription = this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.checkIfHomePage(event.urlAfterRedirects);
      });
  }

  ngOnDestroy(): void {
    this.routerSubscription?.unsubscribe();
  }

  private checkIfHomePage(url: string): void {
    // On enlève les fragments et query params
    const urlWithoutFragment = url.split('#')[0].split('?')[0];

    // Avec ton routing actuel, la home canonique = "/"
    // Si /home existe encore, il redirige vers "/" donc urlAfterRedirects sera "/"
    const homeRoutes = ['/', ''];

    this.animateHeader = homeRoutes.includes(urlWithoutFragment);
  }
}
