import { Component, OnInit, AfterViewInit, Inject } from '@angular/core';
import { PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import anime from 'animejs/lib/anime.es.js';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-name-presentation',
  templateUrl: './name-presentation.component.html',
  styleUrls: ['./name-presentation.component.scss'],
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule
  ]
})
export class NamePresentationComponent implements OnInit, AfterViewInit {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.initAnimeJS();
      this.initDotReturn(); 
    }
  }

  private initAnimeJS(): void {
    const textWrappers1 = document.querySelectorAll('.ml11 .letters-1');
    textWrappers1.forEach((textWrapper) => {
      if (textWrapper && textWrapper.textContent) {
        textWrapper.innerHTML = textWrapper.textContent.replace(
          /([^\x00-\x80]|\w)/g,
          "<span class='letter'>$&</span>"
        );
      }
    });

    const textWrappers2 = document.querySelectorAll('.ml11 .letters-2');
    textWrappers2.forEach((textWrapper) => {
      if (textWrapper && textWrapper.textContent) {
        textWrapper.innerHTML = textWrapper.textContent.replace(
          /([^\x00-\x80]|\w)/g,
          "<span class='letter'>$&</span>"
        );
      }
    });

    const timeline = anime.timeline({ loop: false });
    timeline
      .add({
        targets: '.ml11 .first-line',
        translateX: [
          0,
          (() => {
            const letters1 = document.querySelector('.ml11 .letters-1');
            return letters1 ? letters1.getBoundingClientRect().width + 5 : 0;
          })(),
        ],
        easing: 'easeOutExpo',
        duration: 800,
      })
      .add({
        targets: '.ml11 .letters-1 .letter',
        opacity: [0, 1],
        easing: 'easeOutExpo',
        duration: 800,
        delay: (el: HTMLElement, i: number) => 180 * (i + 1),
      })
      .add({
        targets: '.ml11 .first-line',
        opacity: 0,
        duration: 800,
        easing: 'easeOutExpo',
        complete: () => {
          this.triggerSecondLine();
        },
      });
  }

  private triggerSecondLine(): void {
    const dotElement = document.querySelector('.dot') as HTMLElement;
    if (dotElement) {
      dotElement.style.left = '0';
    }

    const lineElement = document.querySelector('.ml11 .second-line') as HTMLElement;
    if (lineElement) {
      lineElement.style.transform = 'translateX(0px)';
    }

    anime.timeline({ loop: false })
      .add({
        targets: '.ml11 .letters-2',
        opacity: 1,
        duration: 800,
      })
      .add({
        targets: '.ml11 .letters-2 .letter',
        opacity: [0, 1],
        easing: 'easeOutExpo',
        duration: 800,
        delay: (el: HTMLElement, i: number) => 180 * (i + 1),
      })
      .add({
        targets: '.ml11 .second-line',
        opacity: 0,
        duration: 800,
        easing: 'easeOutExpo',
        complete: () => {
          this.animateDeveloperTitle();
        },
      });
  }

  private animateDeveloperTitle(): void {
    gsap.to('.ml13 .letters-3', {
      opacity: 1,
      duration: 0.5,
      stagger: 0.05,
      ease: "power1.out",
    });
  }

  private initDotReturn(): void {
    if (isPlatformBrowser(this.platformId)) {
      let scrollDirection = 'down';
      let lastScroll = 0;

      window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY;
        scrollDirection = scrollPosition > lastScroll ? 'down' : 'up';
        lastScroll = scrollPosition;

        if (scrollDirection === 'down' && scrollPosition > 100) {
          gsap.to('.ml11 .letters-1 .letter', {
            y: (i: number) => -20 * Math.sin(i * 0.5),
            duration: 0.6,
            stagger: 0.05,
            ease: "power1.inOut",
            opacity: 0,
          });

          gsap.to('.ml11 .letters-2 .letter', {
            y: (i: number) => -20 * Math.sin(i * 0.7),
            duration: 0.6,
            stagger: 0.1,
            ease: "power1.inOut",
            opacity: 0,
            onComplete: () => {
              gsap.to('.ml11 .logo-letter, .ml11 .letters-1', {
                opacity: 1,
                duration: 0.5,
              });

              const dotElement = document.querySelector('.dot') as HTMLElement;
              if (dotElement) {
                if (window.matchMedia("(min-width: 769px)").matches) {
                  gsap.to(dotElement, {
                    duration: 0.5,
                    left: '-35.7rem',
                  });
                } else {
                  gsap.to(dotElement, {
                    duration: 0.5,
                    left: '-16.2rem', 
                  });
                }
              }

            }
          });
        } else if (scrollDirection === 'up' && scrollPosition < 100) {
          gsap.to('.ml11 .letters-2 .letter', {
            y: 0,
            opacity: 1,
            duration: 0.4,
            stagger: 0.2,
            ease: "power1.inOut",
            onUpdate: () => {
              const letters2Width = document.querySelector('.ml11 .letters-2')?.getBoundingClientRect().width || 0;
              const jElementWidth = document.querySelector('.ml11 .last-name span')?.getBoundingClientRect().width || 0;
              const totalWidth = letters2Width + jElementWidth;

              const dotElement = document.querySelector('.dot') as HTMLElement;
              if (dotElement) {
                gsap.to(dotElement, {
                  x: totalWidth,
                  left: '0',
                  duration: 0.1,
                  stagger: 0.3,
                  ease: "power1.inOut",
                });
              }
            }
          });

          gsap.to('.ml11 .letters-1 .letter', {
            y: 0,
            opacity: 1,
            duration: 0.9,
            stagger: 0.05,
            ease: "power1.inOut",
          });
        }
      });
    }
  }
}
