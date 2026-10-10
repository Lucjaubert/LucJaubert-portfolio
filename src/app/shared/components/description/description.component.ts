import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  Inject,
  PLATFORM_ID
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { REVEAL, revealOffset } from '../../utils/motion';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-description',
  templateUrl: './description.component.html',
  styleUrls: ['./description.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class DescriptionComponent implements OnInit, AfterViewInit, OnDestroy {
  private ctx?: gsap.Context;

  constructor(@Inject(PLATFORM_ID) private platformId: object) {}

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.ctx = gsap.context(() => {
        // Le titre visible (le premier h2 de la section est celui, invisible, destiné au référencement)
        const h2 = document.querySelector('.description-section > h2:not(.visually-hidden)');
        const h3 = document.querySelector('.description-section > h3');
        const y = revealOffset();

        if (h2 && h3) {
          gsap.timeline({
            scrollTrigger: {
              trigger: '.description-section',
              start: 'top 80%',
              toggleActions: 'play none none none'
            }
          })
          .from(h2, {
            opacity: 0,
            y,
            duration: REVEAL.duration,
            ease: REVEAL.ease
          })
          .from(
            h3,
            {
              opacity: 0,
              y,
              duration: REVEAL.duration,
              ease: REVEAL.ease
            },
            0.1
          );
        }
      });
    }
  }

  ngOnDestroy(): void {
    this.ctx?.revert();
  }
}
