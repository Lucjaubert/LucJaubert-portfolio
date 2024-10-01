import { Component, AfterViewInit, ViewChild, ViewChildren, ElementRef, QueryList, Inject } from '@angular/core';
import { PLATFORM_ID } from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterOutlet } from '@angular/router';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule
  ]
})
export class ProjectsComponent implements AfterViewInit {
  @ViewChild('videoPlayer') videoPlayer!: ElementRef;
  @ViewChild('videoPreview') videoPreview!: ElementRef;
  @ViewChildren('projectContainer') projectContainers!: QueryList<ElementRef>;
  private gsapContext: gsap.Context | undefined;

  currentProject = {
    project: '',
    role: '',
    stacks: '',
    video: '',
  };

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.initProjectAnimations();
    }
  }

  onProjectHover(event: any): void {
    const target = event.currentTarget as HTMLElement;

    this.currentProject = {
      project: target.getAttribute('data-project') || '',
      role: target.getAttribute('data-role') || '',
      stacks: target.getAttribute('data-stacks') || '',
      video: target.getAttribute('data-video') || '',
    };

    if (this.videoPlayer && this.videoPlayer.nativeElement) {
      this.videoPlayer.nativeElement.load();
    }

    if (this.videoPreview && this.videoPreview.nativeElement) {
      this.videoPreview.nativeElement.classList.add('visible');
    }
  }

  onProjectOut(): void {
    if (this.videoPreview && this.videoPreview.nativeElement) {
      this.videoPreview.nativeElement.classList.remove('visible');
    }
  }

  private initProjectAnimations(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.gsapContext = gsap.context(() => {
        gsap.to(".background-sides", {
          height: '100%',
          duration: 1.3,
          ease: 'expoScale',
          scrollTrigger: {
            trigger: "#projects",
          },
          onComplete: () => {
            this.animateTextSlides();
          }
        });
      });
    }
  }

  private animateTextSlides(): void {
    gsap.to(".text-slide", {
      opacity: 1,
      y: 0,
      delay: 0.1,
      duration: 0.8,
      ease: "power4.out",
      stagger: 0.2,
      onComplete: () => {
        this.enableInteractions();
      }
    });
  }

  private enableInteractions(): void {
    const projectPresentation = document.querySelector('.project-presentation') as HTMLElement;
    if (projectPresentation) {
      projectPresentation.style.pointerEvents = 'auto';
    }
  }
}