import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd, Event } from '@angular/router';
import { LoadingService } from '../../../services/loading.service';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [
    CommonModule
  ]
})
export class HeaderComponent implements OnInit, OnDestroy {

  animateHeader = false;
  private loadingSubscription!: Subscription;
  private routerSubscription!: Subscription;

  constructor(private router: Router, private loadingService: LoadingService) { }

  ngOnInit() {
    if (!this.loadingService.isLoading()) {
      this.checkIfHomePage(this.router.url);
    } else {
      this.loadingSubscription = this.loadingService.loading$.subscribe(isLoading => {
        if (!isLoading) {
          this.checkIfHomePage(this.router.url);
        }
      });
    }

    this.routerSubscription = this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      if (!this.loadingService.isLoading()) {
        this.checkIfHomePage(event.urlAfterRedirects);
      }
    });
  }

  ngOnDestroy() {
    if (this.loadingSubscription) {
      this.loadingSubscription.unsubscribe();
    }
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  private checkIfHomePage(url: string) {
    const homeRoutes = ['/', '/home', '/accueil'];
    if (homeRoutes.includes(url)) {
      this.animateHeader = true;
    } else {
      this.animateHeader = false;
    }
  }
}
