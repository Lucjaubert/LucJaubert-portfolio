import { Component, AfterViewInit, Inject, OnInit } from '@angular/core';
import { PLATFORM_ID } from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-bio',
  templateUrl: './bio.component.html',
  styleUrls: ['./bio.component.scss'],
  standalone: true,
  imports: [
    RouterModule,
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
      gsap.registerPlugin(ScrollTrigger);

      this.gsapContext = gsap.context(() => {
        const paragraphs = document.querySelectorAll('.bio-content p');
        const photo = document.querySelector('.bio-image');

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

        if (photo) {
          gsap.to(photo, {
            opacity: 1,
            scale: 1.05,
            duration: 1.5,
            ease: "power4.out",
            scrollTrigger: {
              trigger: photo,
              start: "top 80%",
              toggleActions: "play none none none",
            },
          });
        }
      });
    }
  }
}
