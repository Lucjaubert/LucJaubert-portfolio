import { Component, AfterViewInit, ViewChildren, ElementRef, QueryList, Inject, OnDestroy, OnInit, ChangeDetectorRef, Renderer2 } from '@angular/core';
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
export class ProjectsComponent implements AfterViewInit, OnInit, OnDestroy {
  @ViewChildren('mediaElement') mediaElements!: QueryList<ElementRef>;
  private gsapContext: gsap.Context | undefined;
  private animationInitialized: boolean = false;

  projects: Project[] = [];
  currentProject: Project | null = null;
  isHovered: boolean = false;
  activeMediaIndex: number | null = null; 

  mediaSequence: { type: 'image' | 'video'; src: string }[] = [];
  private laiterieTimeline: gsap.core.Timeline | null = null;
  private anglaisTimeline: gsap.core.Timeline | null = null;
  private limagoTimeline: gsap.core.Timeline | null = null;
  private maisonTimeline: gsap.core.Timeline | null = null;
  private animations: { [key: string]: { in: () => void; out: () => void } } = {};

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private http: HttpClient,
    private changeDetectorRef: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadProjects();
      this.animations = {
        laiterieAnimation: {
          in: () => this.initLaiterieAnimation(),
          out: () => {}
        },
        anglaisAnimation: {
          in: () => this.initAnglaisAnimation(),
          out: () => {}
        },
        limagoAnimation: {
          in: () => this.initLimagoAnimation(),
          out: () => {}
        },
        maisonAnimation: {
          in: () => this.initMaisonAnimation(),
          out: () => {}
        }
      };
    }
  } 

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.initProjectAnimations();
    }
  }

  ngOnDestroy(): void {
    if (this.gsapContext) {
      this.gsapContext.revert();
    }
    this.killTimelines();
  }

  toggleMediaPreview(index: number): void {
    if (this.activeMediaIndex === index) {
      gsap.to(`.media-preview-mobile-${index}`, {
        opacity: 0,
        scale: 0.8,
        duration: 0.4,
        ease: "power2.out",
        onComplete: () => {
          this.activeMediaIndex = null;
          this.currentProject = null;
          this.mediaSequence = [];
          this.changeDetectorRef.detectChanges();
        }
      });
    } else {
      this.activeMediaIndex = index;
      this.currentProject = this.projects[index];
      this.mediaSequence = this.getAllMedia(this.currentProject).sort(() => Math.random() - 0.5);
      this.changeDetectorRef.detectChanges();
      
      setTimeout(() => {
        gsap.fromTo(`.media-preview-mobile-${index}`, 
          { opacity: 0, scale: 0.8 }, 
          { opacity: 1, scale: 1, duration: 0.4, ease: "power2.out" }
        );
        this.initAnimationForCurrentProject();
      }, 0);
    }
  }
  
  isMediaPreviewVisible(index: number): boolean {
    return this.activeMediaIndex === index;
  }

  getMediaSequence(project: Project): { type: 'image' | 'video'; src: string }[] {
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
    return mediaSequence.sort(() => Math.random() - 0.5);
  }

  onProjectClick(project: Project): void {
    this.openProjectLink(project);
  }

  openProjectLink(project: Project | null): void {
    if (!project) return;
  
    let url: string;
    switch (project.name) {
      case 'Laiterie Burdigala':
        url = 'https://www.laiterieburdigala.fr';
        break;
      case 'Anglais Du Vin':
        url = 'https://kathrynwaltonward.com/';
        break;
      case 'Limago Reflexo':
        url = 'https://limago-reflexo.fr/';
        break;
      case 'Maison Ah-Rong':
        url = 'https://maisonahrong.com/';
        break;
      default:
        url = '#';
    }
    window.open(url, '_blank');
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

  onProjectHover(project: Project, event: MouseEvent): void {
    if (this.currentProject && this.currentProject !== project) {
      const previousAnimation = this.animations[this.currentProject.animationType || ''];
      if (previousAnimation && previousAnimation.out) {
        previousAnimation.out();
      }
    }

    this.currentProject = project;
    this.isHovered = true;
    this.animationInitialized = false;

    this.mediaSequence = this.getAllMedia(project);
    this.mediaSequence = this.mediaSequence.sort(() => Math.random() - 0.5);

    this.changeDetectorRef.detectChanges();

    setTimeout(() => {
      this.initAnimationForCurrentProject();
    }, 0);
  }

  onProjectOut(event: MouseEvent): void {
    const relatedTarget = event.relatedTarget as HTMLElement;
    if (relatedTarget && (relatedTarget.closest('.project-container') || relatedTarget.closest('.media-preview'))) {
      return;
    }

    this.isHovered = false;

    const animation = this.animations[this.currentProject?.animationType || ''];
    if (animation && animation.out) {
      animation.out();
    }

    this.currentProject = null;
    this.mediaSequence = [];
  }

  private initAnimationForCurrentProject(): void {
    if (this.isHovered && !this.animationInitialized && this.mediaElements.length > 0 && this.currentProject) {
      this.animationInitialized = true;
      const animation = this.animations[this.currentProject.animationType || ''];
      if (animation && animation.in) {
        animation.in();
      }
    }
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

  private killTimelines(): void {
    if (this.laiterieTimeline) this.laiterieTimeline.kill();
    if (this.anglaisTimeline) this.anglaisTimeline.kill();
    if (this.limagoTimeline) this.limagoTimeline.kill();
    if (this.maisonTimeline) this.maisonTimeline.kill();
  }

  private initLaiterieAnimation(): void {
    this.initProjectAnimation(this.laiterieTimeline, 'laiterie');
  }

  private initAnglaisAnimation(): void {
    this.initProjectAnimation(this.anglaisTimeline, 'anglais');
  }

  private initLimagoAnimation(): void {
    this.initProjectAnimation(this.limagoTimeline, 'limago');
  }

  private initMaisonAnimation(): void {
    this.initProjectAnimation(this.maisonTimeline, 'maison');
  }

  private initProjectAnimation(timeline: gsap.core.Timeline | null, timelineName: string): void {
    if (this.mediaElements) {
      if (timeline) {
        timeline.kill();
        timeline = null;
      }

      const shuffledMediaElements = this.mediaElements.toArray();
      timeline = gsap.timeline({ repeat: -1, defaults: { ease: 'power2.inOut' } });

      let totalDuration = 0;
      const transitionDuration = 1;
      const displayDuration = 1.5;

      const directionOptionsX = ['-100%', '0%', '100%'];
      const directionOptionsY = ['-100%', '0%', '100%'];

      shuffledMediaElements.forEach((elementRef, index) => {
        const element = elementRef.nativeElement;

        const xStart = directionOptionsX[Math.floor(Math.random() * directionOptionsX.length)];
        const yStart = directionOptionsY[Math.floor(Math.random() * directionOptionsY.length)];

        gsap.set(element, { opacity: 0, display: 'none', x: xStart, y: yStart });

        if (element.tagName.toLowerCase() === 'video') {
          element.muted = true;
          element.playsInline = true;
          element.pause();
          element.currentTime = 0;
        }

        if (timeline) {
          timeline.to(
            element,
            {
              display: 'block',
              opacity: 1,
              x: '0%',
              y: '0%',
              duration: transitionDuration,
              onStart: () => {
                if (element.tagName.toLowerCase() === 'video') {
                  element.play();
                }
              },
            },
            totalDuration
          );

          if (index > 0) {
            const previousElement = shuffledMediaElements[index - 1].nativeElement;
            timeline.to(
              previousElement,
              {
                opacity: 0,
                x: directionOptionsX[Math.floor(Math.random() * directionOptionsX.length)],
                y: directionOptionsY[Math.floor(Math.random() * directionOptionsY.length)],
                duration: transitionDuration,
                onComplete: () => {
                  previousElement.style.display = 'none';
                  if (previousElement.tagName.toLowerCase() === 'video') {
                    previousElement.pause();
                    previousElement.currentTime = 0;
                  }
                }
              },
              totalDuration
            );
          }
        }

        totalDuration += transitionDuration + displayDuration;
      });

      if (shuffledMediaElements.length > 1 && timeline) {
        const lastElement = shuffledMediaElements[shuffledMediaElements.length - 1].nativeElement;
        const firstElement = shuffledMediaElements[0].nativeElement;

        const xStart = directionOptionsX[Math.floor(Math.random() * directionOptionsX.length)];
        const yStart = directionOptionsY[Math.floor(Math.random() * directionOptionsY.length)];

        timeline.to(
          lastElement,
          {
            opacity: 0,
            x: xStart,
            y: yStart,
            duration: transitionDuration,
            onComplete: () => {
              lastElement.style.display = 'none';
              if (lastElement.tagName.toLowerCase() === 'video') {
                lastElement.pause();
                lastElement.currentTime = 0;
              }
            }
          },
          totalDuration
        );

        timeline.to(
          firstElement,
          {
            display: 'block',
            opacity: 1,
            x: '0%',
            y: '0%',
            duration: transitionDuration,
            onStart: () => {
              if (firstElement.tagName.toLowerCase() === 'video') {
                firstElement.play();
              }
            }
          },
          totalDuration
        );
      }

      switch (timelineName) {
        case 'laiterie':
          this.laiterieTimeline = timeline;
          break;
        case 'anglais':
          this.anglaisTimeline = timeline;
          break;
        case 'limago':
          this.limagoTimeline = timeline;
          break;
        case 'maison':
          this.maisonTimeline = timeline;
          break;
      }
    }
  }
}
