import { Component, AfterViewInit, Inject, OnInit } from '@angular/core';
import { PLATFORM_ID } from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
  standalone: true,
  imports: [
    RouterModule,
    CommonModule
  ]
})
export class ContactComponent implements AfterViewInit {
  private gsapContext: gsap.Context | undefined;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.initContactAnimations();
    }
  }

  private initContactAnimations(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.gsapContext = gsap.context(() => {
        gsap.to(".background-contact", {
          height: '100%',
          duration: 1.3,
          ease: 'expoScale',
          scrollTrigger: {
            trigger: "#contact",
            start: "top 80%",
            toggleActions: "play none none none"
          },
          onComplete: () => {
            this.animateContactText();
          }
        });
      });
    }
  }

  private animateContactText(): void {
    gsap.to(".contact-item, .copyright", {
      opacity: 1,
      y: 0,
      delay: 0.1,
      duration: 0.8,
      ease: "power4.out",
      stagger: 0.2
    });
  }
}
