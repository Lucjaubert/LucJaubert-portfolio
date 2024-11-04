import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/components/header/header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    HeaderComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'lucjaubert';

  isAtBottom = false;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const pos = (document.documentElement.scrollTop || document.body.scrollTop) + window.innerHeight;
    const max = document.documentElement.scrollHeight || document.body.scrollHeight;

    if (max - pos < 100) {
      this.isAtBottom = true;
    } else {
      this.isAtBottom = false;
    }
  }

  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
}
