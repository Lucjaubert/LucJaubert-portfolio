import { Component, AfterViewInit, Inject, OnInit } from '@angular/core';
import { PLATFORM_ID } from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-bio',
  templateUrl: './bio.component.html',
  styleUrls: ['./bio.component.scss'],
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule
  ]
})
export class BioComponent implements AfterViewInit {
  private gsapContext: gsap.Context | undefined;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.initBioAnimations();
    }
  }

  private initBioAnimations(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.gsapContext = gsap.context(() => {
        const paragraphs = document.querySelectorAll('.bio-content p');

        paragraphs.forEach((paragraph) => {
          gsap.to(paragraph, {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power4.out",
            scrollTrigger: {
              trigger: paragraph,
              start: "80px 70%",
              toggleActions: "play none none none",
            },
          });

          gsap.to(paragraph, {
            scale: 1.05,
            duration: 1,
            ease: "power4.out",
            scrollTrigger: {
              trigger: paragraph,
              start: "center center",
              toggleActions: "play none none none",
            },
          });
        });
      });
    }
  }
}