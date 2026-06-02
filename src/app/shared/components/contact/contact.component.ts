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
      gsap.to('.background-contact', {
        height: '100%',
        duration: 1.3,
        ease: 'expoScale',
        scrollTrigger: {
          trigger: '#contact',
          start: 'top 80%',
          toggleActions: 'play none none none'
        },
        onComplete: () => {
          this.animateContactText();
        }
      });
    });
  }

  private animateContactText(): void {
    gsap.to('.contact-item, .copyright', {
      opacity: 1,
      y: 0,
      delay: 0.1,
      duration: 0.8,
      ease: 'power4.out',
      stagger: 0.2
    });
  }
}
