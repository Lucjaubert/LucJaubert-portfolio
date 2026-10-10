import {
  Component,
  AfterViewInit,
  OnDestroy,
  Inject,
  PLATFORM_ID,
  ViewEncapsulation
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { REVEAL, prefersReducedMotion } from '../../utils/motion';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  standalone: true,
  imports: [RouterModule, CommonModule]
})
export class ContactComponent implements AfterViewInit, OnDestroy {
  private gsapContext?: gsap.Context;

  constructor(@Inject(PLATFORM_ID) private platformId: object) {}

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.initContactAnimations();
    }
  }

  ngOnDestroy(): void {
    this.gsapContext?.revert();
  }

  private initContactAnimations(): void {
    this.gsapContext = gsap.context(() => {
      const reduce = prefersReducedMotion();

      // Le fond monte en scaleY (transform, sur la carte graphique) au lieu d'animer height,
      // et les liens apparaissent en même temps au lieu d'attendre la fin du fond.
      // GSAP reprend la main sur l'état initial posé en CSS (scaleY(0) au premier rendu SSR)
      gsap.set('.background-contact', { scaleY: reduce ? 1 : 0, transformOrigin: 'bottom' });
      if (reduce) {
        gsap.set('.contact-item, .copyright', { y: 0 });
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: '#contact',
          start: 'top 80%',
          toggleActions: 'play none none none'
        }
      });

      if (!reduce) {
        tl.to('.background-contact', {
          scaleY: 1,
          duration: 0.6,
          ease: REVEAL.ease
        });
      }

      tl.to('.contact-item, .copyright', {
        opacity: 1,
        y: 0,
        duration: REVEAL.duration,
        ease: REVEAL.ease,
        stagger: REVEAL.stagger
      }, reduce ? 0 : 0.1);
    });
  }
}
