import { Component, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

@Component({
  selector: 'app-description',
  templateUrl: './description.component.html',
  styleUrls: ['./description.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class DescriptionComponent implements AfterViewInit {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      gsap.registerPlugin(ScrollTrigger);

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

        tl.from(h2, {
          opacity: 0,
          y: 50,
          duration: 1.5,
          ease: "power4.out"
        })
        .from(h3, {
          opacity: 0,
          y: 50,
          duration: 1,
          ease: "power4.out"
        }, '+=0.5');
      }
    }
  }
}
