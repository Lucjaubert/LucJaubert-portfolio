import { Component, ViewChildren, ElementRef, QueryList, AfterViewInit, Inject } from '@angular/core';
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
                const sectionElement = section.nativeElement as HTMLElement;
                const background = sectionElement.querySelector('.background-sides');
                const title = sectionElement.querySelector('h3.text-slide');
                const detailsText = sectionElement.querySelector('span');
                const video = sectionElement.querySelector('.section-details-preview');

                ScrollTrigger.create({
                    trigger: sectionElement,
                    start: "top down",
                    end: "bottom top", 
                    pin: true, 
                    pinSpacing: false,
                    scrub: true 
                });

                if (background) {
                    gsap.fromTo(background, {
                        backgroundPositionY: "100%",
                    }, {
                        backgroundPositionY: "0%",
                        ease: "none",
                        scrollTrigger: {
                            trigger: sectionElement,
                            start: "top center", 
                            end: "bottom top", 
                            scrub: true,
                        }
                    });
                }

                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: sectionElement,
                        start: "top 80%", 
                        end: "bottom 20%", 
                        toggleActions: "play none none reverse",
                    }
                });

                if (title) {
                    tl.from(title, {
                        opacity: 0,
                        y: 100,
                        duration: 1.5,
                        ease: "power4.out"
                    }, 0); 
                }

                if (detailsText) {
                    tl.from(detailsText, {
                        opacity: 0,
                        y: 100,
                        duration: 1.75,
                        ease: "power4.out"
                    }, 0.2); 
                }

                if (video) {
                    tl.from(video, {
                        opacity: 0,
                        x: 200,
                        duration: 1.75,
                        ease: "power4.out"
                    }, 0.4); 
                }
            });
        });
    }
  }
}
