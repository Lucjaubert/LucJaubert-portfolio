import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  OnDestroy,
  PLATFORM_ID,
  ViewChild
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { gsap, ScrollTrigger } from 'gsap/all';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-offres-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './offres-home.component.html',
  styleUrls: ['./offres-home.component.scss']
})
export class OffresHomeComponent implements AfterViewInit, OnDestroy {
  @ViewChild('section', { static: true }) sectionRef!: ElementRef<HTMLElement>;

  private gsapContext?: gsap.Context;

  constructor(@Inject(PLATFORM_ID) private platformId: object) {}

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    this.gsapContext = gsap.context(() => {
      const root = this.sectionRef.nativeElement;
      const eyebrow = root.querySelector('.offres-eyebrow');
      const cards = root.querySelectorAll('.offre-card');

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: 'top 80%',
          toggleActions: 'play none none none'
        }
      });

      if (eyebrow) {
        tl.fromTo(
          eyebrow,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
        );
      }

      if (cards.length > 0) {
        tl.fromTo(
          cards,
          { opacity: 0, y: 50 },
          { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out', stagger: 0.15 },
          '-=0.2'
        );
      }
    }, this.sectionRef.nativeElement);
  }

  ngOnDestroy(): void {
    this.gsapContext?.revert();
  }
}
