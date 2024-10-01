import { Component, OnInit, AfterViewInit, Inject } from '@angular/core';
import { PLATFORM_ID } from '@angular/core';
import anime from 'animejs/lib/anime.es.js';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterOutlet } from '@angular/router';

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
    }
  }

  // TITLE ANIMATIONS SECTION
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

  animateDeveloperTitle(): void {
    gsap.to('.ml13 .letters-3', {
      opacity: 1,
      duration: 0.5,
      stagger: 0.05, 
      ease: "power1.out", 
    });
  }
}