import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, OnInit, AfterViewInit, Inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { WordpressService } from '../../services/wordpress.service';
import { catchError, Observable, of } from 'rxjs';
import { HomepageData } from '../../models/homepage-data.model';
import anime from 'animejs/lib/anime.es.js';
import { PLATFORM_ID } from '@angular/core';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
  ],
})
export class HomepageComponent implements OnInit, AfterViewInit {

  homepageData$!: Observable<HomepageData[] | null>;

  constructor(
    private wordpressService: WordpressService,
    @Inject(PLATFORM_ID) private platformId: Object 
  ) {}

  ngOnInit(): void {
    this.homepageData$ = this.wordpressService.getHomepageData().pipe(
      catchError(error => {
        console.error('Error retrieving homepage data:', error);
        return of(null); 
      })
    );
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const textWrappers1 = document.querySelectorAll('.ml11 .letters-1');
      textWrappers1.forEach((textWrapper) => {
        if (textWrapper && textWrapper.textContent) {
          textWrapper.innerHTML = textWrapper.textContent.replace(/([^\x00-\x80]|\w)/g, "<span class='letter'>$&</span>");
        }
      });
  
      const textWrappers2 = document.querySelectorAll('.ml11 .letters-2');
      textWrappers2.forEach((textWrapper) => {
        if (textWrapper && textWrapper.textContent) {
          textWrapper.innerHTML = textWrapper.textContent.replace(/([^\x00-\x80]|\w)/g, "<span class='letter'>$&</span>");
        }
      });
  
      const timeline = anime.timeline({ loop: false });
      timeline
        .add({
          targets: '.ml11 .first-line',  
          scaleY: [0, 1],
          opacity: [0.5, 1],
          easing: "easeOutExpo",
          duration: 500
        })
        .add({
          targets: '.ml11 .first-line',  
          translateX: [0, (() => {
            const letters1 = document.querySelector('.ml11 .letters-1');
            if (letters1) {
              return letters1.getBoundingClientRect().width + 5;
            }
            return 0;
          })()],
          easing: "easeOutExpo",
          duration: 500,
        })        
        .add({
          targets: '.ml11 .letters-1 .letter',  
          opacity: [0, 1],
          easing: "easeOutExpo",
          duration: 600,
          delay: (el: HTMLElement, i: number) => 50 * (i + 1)
        })
        .add({
          targets: '.ml11 .first-line', 
          opacity: 0,
          duration: 1000,
          easing: "easeOutExpo",
          complete: () => {
            const lineElement = document.querySelector('.ml11 .second-line') as HTMLElement; 
            if (lineElement) {
              lineElement.style.transform = 'translateX(0px)';
            }
  
            anime.timeline({ loop: false })
              .add({
                targets: '.ml11 .second-line', 
                scaleY: [0, 1],
                opacity: [0.5, 1],
                easing: "easeOutExpo",
                duration: 500
              })
              .add({
                targets: '.ml11 .second-line',  
                translateX: [0, (() => {
                  const letters2 = document.querySelector('.ml11 .letters-2');
                  if (letters2) {
                    return letters2.getBoundingClientRect().width -45;
                  }
                  return 0;
                })()],
                easing: "easeOutExpo",
                duration: 500,
              })
              .add({
                targets: '.ml11 .letters-2', 
                opacity: 1,  
                duration: 0, 
              })
              .add({
                targets: '.ml11 .letters-2 .letter',  
                opacity: [0, 1],
                easing: "easeOutExpo",
                duration: 600,
                delay: (el: HTMLElement, i: number) => 50 * (i + 1)
              })
              .add({
                targets: '.ml11 .second-line',  
                opacity: 0,
                easing: "easeOutExpo"
              });
          }
        });
    }
  }
  
  
}
