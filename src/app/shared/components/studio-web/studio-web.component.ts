import { Component, ViewChildren, ElementRef, QueryList, AfterViewInit, Inject, OnInit } from '@angular/core';
import { PLATFORM_ID } from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterOutlet } from '@angular/router';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-studio-web',
  templateUrl: './studio-web.component.html',
  styleUrls: ['./studio-web.component.scss'],
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule
  ]
})
export class StudioWebComponent implements AfterViewInit {
  @ViewChildren('studioSectionContainer') studioSectionContainers!: QueryList<ElementRef>;
  private gsapContext: gsap.Context | undefined;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.initStudioSectionAnimations();
    }
  }

  private initStudioSectionAnimations(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.gsapContext = gsap.context(() => {
        this.studioSectionContainers.forEach((section: ElementRef) => {
          gsap.to(section.nativeElement, {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power4.out",
            scrollTrigger: {
              trigger: section.nativeElement,
              start: "top 80%",
              toggleActions: "play none none none",
            },
          });
        });
      });
    }
  }
}
