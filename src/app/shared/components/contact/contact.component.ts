import { Component, OnInit, AfterViewInit, OnDestroy, Inject, PLATFORM_ID, ViewEncapsulation } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SeoService } from '../../../core/seo.service';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  standalone: true,
  imports: [RouterModule, CommonModule]
})
export class ContactComponent implements OnInit, AfterViewInit, OnDestroy {
  private gsapContext?: gsap.Context;

  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    private seo: SeoService
  ) {}

  ngOnInit(): void {
    this.seo.update({
      title: 'Contact – Luc Jaubert',
      description: 'Contactez Luc Jaubert, développeur web freelance à Bordeaux, pour discuter de votre projet.',
      url: 'https://lucjaubert.com/contact',
      image: 'https://lucjaubert.com/assets/icons/apple-touch-icon.png'
    });
  }

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
