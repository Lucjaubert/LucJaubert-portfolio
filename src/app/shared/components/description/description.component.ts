import { Component, OnInit, AfterViewInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SeoService } from '../../../core/seo.service';

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

  constructor(@Inject(PLATFORM_ID) private platformId: object, private seo: SeoService) {}

  ngOnInit(): void {
    this.seo.update({
      title: 'Description – Luc Jaubert',
      description: 'Présentation des services et de la méthodologie de Luc Jaubert, développeur web freelance.',
      url: 'https://lucjaubert.com/description',
      image: 'https://lucjaubert.com/assets/icons/apple-touch-icon.png'
    });
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.ctx = gsap.context(() => {
        const h2 = document.querySelector('.description-section h2');
        const h3 = document.querySelector('.description-section h3');

        if (h2 && h3) {
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: '.description-section',
              start: 'top 80%',
              toggleActions: 'play none none none'
            }
          });

          tl.from(h2, { opacity: 0, y: 50, duration: 1.5, ease: 'power4.out' })
            .from(h3, { opacity: 0, y: 50, duration: 1, ease: 'power4.out' }, '+=0.5');
        }
      });
    }
  }

  ngOnDestroy(): void {
    this.ctx?.revert();
  }
}
