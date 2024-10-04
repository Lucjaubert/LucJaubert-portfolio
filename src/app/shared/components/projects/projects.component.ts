import { Component, AfterViewInit, AfterViewChecked, ViewChildren, ElementRef, QueryList, Inject, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import { PLATFORM_ID } from '@angular/core';
import { gsap, CSSPlugin, ScrollTrigger } from 'gsap/all'; 
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HttpClient } from '@angular/common/http';

gsap.registerPlugin(CSSPlugin, ScrollTrigger); 

interface Project {
  name: string;
  year: string;
  project: string;
  role: string;
  stacks: string;
  images: string[];
  videos: string[];
  animationType: string; 
}

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

export class ProjectsComponent implements AfterViewInit, AfterViewChecked, OnInit, OnDestroy {
  @ViewChildren('mediaElement') mediaElements!: QueryList<ElementRef>;
  private gsapContext: gsap.Context | undefined;
  private animationInitialized: boolean = false;

  projects: Project[] = [];
  currentProject: Project | null = null;
  isHovered: boolean = false;

  private animations: { [key: string]: { in: () => void; out: () => void } } = {};

  private isVideoPlaying: boolean = false;


  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private http: HttpClient,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadProjects();

      this.animations = {
        laiterieAnimation: {
          in: () => this.initLaiterieAnimation(),
          out: () => this.animateLaiterieMediaOut()
        }
      };
    }
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.initProjectAnimations();
    }
  }

  ngAfterViewChecked(): void {
    if (this.isHovered && !this.animationInitialized && this.mediaElements.length > 0 && this.currentProject) {
      this.animationInitialized = true;
      const animation = this.animations[this.currentProject.animationType || ''];
      if (animation && animation.in) {
        console.log('Lancement de l\'animation pour le projet:', this.currentProject?.name);
        animation.in();
      }
    }
  }

  ngOnDestroy(): void {
    if (this.gsapContext) {
      this.gsapContext.revert();
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

  private loadProjects(): void {
    this.http.get<Project[]>('assets/data/projects.json').subscribe((data: Project[]) => {
      this.projects = data;
    });
  }

  onProjectHover(project: Project): void {
    console.log('onProjectHover appelé avec le projet:', project.name);
    this.currentProject = project;
    this.isHovered = true;
    this.animationInitialized = false;

    this.changeDetectorRef.detectChanges();
  }

  onProjectOut(): void {
    console.log('onProjectOut appelé');
  
    if (this.isVideoPlaying) {
      return;
    }
  
    this.isHovered = false;
  
    const animation = this.animations[this.currentProject?.animationType || ''];
    if (animation && animation.out) {
      console.log('Appel de animation.out pour le projet:', this.currentProject?.name);
      animation.out();
    }
  
    this.currentProject = null;
  }
  
  getAllMedia(project: Project | null): { type: 'image' | 'video'; src: string }[] {
    if (!project) {
      return [];
    }

    const mediaSequence: { type: 'image' | 'video'; src: string }[] = [];

    const maxLength = Math.max(project.images.length, project.videos.length);
    for (let i = 0; i < maxLength; i++) {
      if (project.images[i]) {
        mediaSequence.push({ type: 'image', src: project.images[i] });
      }
      if (project.videos[i]) {
        mediaSequence.push({ type: 'video', src: project.videos[i] });
      }
    }

    return mediaSequence;
  }

  private initLaiterieAnimation(): void {
    if (this.mediaElements) {
      const timeline = gsap.timeline();
  
      this.mediaElements.forEach((elementRef, index) => {
        const element = elementRef.nativeElement;
  
        if (element.tagName.toLowerCase() === 'video') {
          element.load();
          element.play();
          this.isVideoPlaying = true;
  
          element.addEventListener('ended', () => {
            this.isVideoPlaying = false;
            gsap.to(element, {
              opacity: 0,
              duration: 0.5,
              onComplete: () => {
                element.style.display = 'none';
              }
            });
            this.currentProject = null;
          });
        }
  
        timeline.fromTo(
          element,
          {
            opacity: 0,
            display: 'block',
          },
          {
            opacity: 1,
            duration: 1.5,
            ease: 'power2.out'
          },
          index * 1.5
        );
      });
    }
  }
  
  
  private animateLaiterieMediaOut(): void {
    if (this.mediaElements) {
      const timeline = gsap.timeline();
  
      this.mediaElements.forEach((elementRef, index) => {
        const element = elementRef.nativeElement;
  
        timeline.to(
          element,
          {
            opacity: 0,
            duration: 0.1,
            ease: 'power2.in',
            onComplete: () => {
              element.style.display = 'none';
            }
          },
          index * 0.1 
        );
      });
    }
  }
  
}
