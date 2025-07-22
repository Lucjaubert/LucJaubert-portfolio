import { Component, AfterViewInit, OnDestroy, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SeoService } from '../../../core/seo.service';

@Component({
  selector: 'app-bio',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './bio.component.html',
  styleUrls: ['./bio.component.scss']
})
export class BioComponent implements OnInit, AfterViewInit, OnDestroy {
  private gsapContext?: gsap.Context;

  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    private seo: SeoService
  ) {}

  ngOnInit(): void {
    this.seo.update({
      title: 'Bio – Luc Jaubert',
      description: 'Parcours et expertise de Luc Jaubert, développeur web freelance à Bordeaux.',
      url: 'https://lucjaubert.com/bio',
      image: 'https://lucjaubert.com/assets/icons/apple-touch-icon.png'
    });
  }

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
      const photo      = document.querySelector('.bio-image');

      paragraphs.forEach(p => {
        gsap.to(p, {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power4.out',
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
          duration: 1.5,
          ease: 'power4.out',
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
