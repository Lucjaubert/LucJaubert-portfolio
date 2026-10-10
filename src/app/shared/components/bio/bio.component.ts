import {
  Component,
  AfterViewInit,
  OnDestroy,
  Inject,
  PLATFORM_ID
} from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { REVEAL, prefersReducedMotion } from '../../utils/motion';

@Component({
  selector: 'app-bio',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './bio.component.html',
  styleUrls: ['./bio.component.scss']
})
export class BioComponent implements AfterViewInit, OnDestroy {
  private gsapContext?: gsap.Context;

  constructor(@Inject(PLATFORM_ID) private platformId: object) {}

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.initAnimations();
    }
  }

  ngOnDestroy(): void {
    this.gsapContext?.revert();
  }

  private initAnimations(): void {
    gsap.registerPlugin(ScrollTrigger);

    this.gsapContext = gsap.context(() => {
      const paragraphs = document.querySelectorAll('.bio-content p');
      const photo = document.querySelector('.bio-image');

      // Mouvement réduit : pas de déplacement, uniquement le fondu
      if (prefersReducedMotion()) {
        gsap.set([...Array.from(paragraphs), photo].filter(Boolean), { y: 0 });
      }

      paragraphs.forEach(p => {
        gsap.to(p, {
          opacity: 1,
          y: 0,
          duration: REVEAL.duration,
          ease: REVEAL.ease,
          scrollTrigger: {
            trigger: p,
            start: '80px 70%',
            toggleActions: 'play none none none'
          }
        });
      });

      if (photo && paragraphs.length) {
        const lastP = paragraphs[paragraphs.length - 1];

        gsap.to(photo, {
          opacity: 1,
          y: 0,
          scale: 1.05,
          duration: REVEAL.duration,
          ease: REVEAL.ease,
          scrollTrigger: {
            trigger: lastP,
            start: 'bottom 80%',
            toggleActions: 'play none none none'
          }
        });
      }
    });
  }
}
