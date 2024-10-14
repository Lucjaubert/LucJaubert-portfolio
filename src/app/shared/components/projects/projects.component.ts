import {
  Component,
  OnInit,
  OnDestroy,
  ViewChildren,
  ElementRef,
  QueryList,
  Inject,
  ChangeDetectorRef,
  AfterViewInit,
} from '@angular/core';
import { PLATFORM_ID } from '@angular/core';
import { gsap, CSSPlugin, ScrollTrigger } from 'gsap/all';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BreakpointObserver } from '@angular/cdk/layout';

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
  imports: [RouterOutlet, CommonModule],
})
export class ProjectsComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChildren('mediaElement') mediaElements!: QueryList<ElementRef>;

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
  private animationInitialized: boolean = false;
  private gsapContext: gsap.Context | undefined;

  isDesktop: boolean = false;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private http: HttpClient,
    private changeDetectorRef: ChangeDetectorRef,
    private breakpointObserver: BreakpointObserver
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadProjects();
      this.animations = {
        laiterieAnimation: {
          in: () => this.initProjectAnimation('laiterie'),
          out: () => {},
        },
        anglaisAnimation: {
          in: () => this.initProjectAnimation('anglais'),
          out: () => {},
        },
        limagoAnimation: {
          in: () => this.initProjectAnimation('limago'),
          out: () => {},
        },
        maisonAnimation: {
          in: () => this.initProjectAnimation('maison'),
          out: () => {},
        },
      };

      this.breakpointObserver.observe(['(min-width: 768px)']).subscribe((state) => {
        this.isDesktop = state.matches;
      });
    }
  }

  ngAfterViewInit(): void {
    this.mediaElements.changes.subscribe(() => {
      if (this.mediaElements.length > 0 && this.currentProject) {
        this.initAnimationForCurrentProject();
      }
    });

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
      // Fermer l'aperçu
      this.activeMediaIndex = null;
      this.currentProject = null;
      this.mediaSequence = [];
      this.animationInitialized = false;
      this.changeDetectorRef.detectChanges();
    } else {
      this.activeMediaIndex = index;
      this.currentProject = this.projects[index];

      this.mediaSequence = this.getAllMedia(this.currentProject).sort(() => Math.random() - 0.5);

      this.animationInitialized = false;
      this.changeDetectorRef.detectChanges();

      // Attendre que les éléments soient rendus
      setTimeout(() => {
        this.changeDetectorRef.detectChanges();

        // S'abonner aux changements des mediaElements
        this.mediaElements.changes.subscribe(() => {
          if (this.mediaElements.length > 0 && this.currentProject) {
            this.initAnimationForCurrentProject();
          }
        });

        // Vérifier si les mediaElements sont déjà disponibles
        if (this.mediaElements.length > 0 && this.currentProject) {
          this.initAnimationForCurrentProject();
        }
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

  onProjectContainerClick(index: number): void {
    if (!this.isDesktop) {
      // Sur mobile, afficher l'aperçu du projet
      this.toggleMediaPreview(index);
    } else {
      // Sur desktop, ouvrir le lien du projet
      this.openProjectLink(this.projects[index]);
    }
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
        gsap.to('.background-sides', {
          height: '100%',
          duration: 1.3,
          ease: 'expoScale',
          scrollTrigger: {
            trigger: '#projects',
          },
          onComplete: () => {
            this.animateTextSlides();
          },
        });
      });
    }
  }

  private animateTextSlides(): void {
    gsap.to('.text-slide', {
      opacity: 1,
      y: 0,
      delay: 0.1,
      duration: 0.8,
      ease: 'power4.out',
      stagger: 0.2,
      onComplete: () => {
        this.enableInteractions();
      },
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
    if (!this.isDesktop) return;

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
      if (this.mediaElements.length > 0) {
        this.initAnimationForCurrentProject();
      }
    }, 0);
  }

  onProjectOut(event: MouseEvent): void {
    if (!this.isDesktop) return;

    const relatedTarget = event.relatedTarget as HTMLElement;
    if (
      relatedTarget &&
      (relatedTarget.closest('.project-container') || relatedTarget.closest('.media-preview'))
    ) {
      return;
    }

    this.isHovered = false;
    this.animationInitialized = false;

    const animation = this.animations[this.currentProject?.animationType || ''];
    if (animation && animation.out) {
      animation.out();
    }

    this.currentProject = null;
    this.mediaSequence = [];
  }

  private initAnimationForCurrentProject(): void {
    if (!this.animationInitialized && this.mediaElements.length > 0 && this.currentProject) {
      this.animationInitialized = true;
      const animation = this.animations[this.currentProject.animationType || ''];
      if (animation && animation.in) {
        animation.in();
      } else {
        console.warn('No animation found for:', this.currentProject.animationType);
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
    [this.laiterieTimeline, this.anglaisTimeline, this.limagoTimeline, this.maisonTimeline].forEach(
      (timeline) => {
        if (timeline) {
          timeline.kill();
        }
      }
    );
    this.animationInitialized = false;
  }

  private initProjectAnimation(timelineName: string): void {
    if (this.mediaElements && this.mediaElements.length > 0) {
      let timeline: gsap.core.Timeline | null = null;

      switch (timelineName) {
        case 'laiterie':
          if (this.laiterieTimeline) {
            this.laiterieTimeline.kill();
            this.laiterieTimeline = null;
          }
          break;
        case 'anglais':
          if (this.anglaisTimeline) {
            this.anglaisTimeline.kill();
            this.anglaisTimeline = null;
          }
          break;
        case 'limago':
          if (this.limagoTimeline) {
            this.limagoTimeline.kill();
            this.limagoTimeline = null;
          }
          break;
        case 'maison':
          if (this.maisonTimeline) {
            this.maisonTimeline.kill();
            this.maisonTimeline = null;
          }
          break;
      }

      const shuffledMediaElements = this.mediaElements.toArray();
      timeline = gsap.timeline({ repeat: -1, defaults: { ease: 'power2.inOut' } });

      const transitionDuration = 1;
      const displayDuration = 1.5;

      const directionOptionsX = ['-100%', '0%', '100%'];
      const directionOptionsY = ['-100%', '0%', '100%'];

      shuffledMediaElements.forEach((elementRef) => {
        const element = elementRef.nativeElement;
        const xStart =
          directionOptionsX[Math.floor(Math.random() * directionOptionsX.length)];
        const yStart =
          directionOptionsY[Math.floor(Math.random() * directionOptionsY.length)];
        gsap.set(element, {
          opacity: 0,
          display: 'none',
          x: xStart,
          y: yStart,
        });

        if (element.tagName.toLowerCase() === 'video') {
          element.muted = true;
          element.playsInline = true;
          element.pause();
          element.currentTime = 0;
        }
      });

      shuffledMediaElements.forEach((elementRef, index) => {
        const element = elementRef.nativeElement;
        const xStart =
          directionOptionsX[Math.floor(Math.random() * directionOptionsX.length)];
        const yStart =
          directionOptionsY[Math.floor(Math.random() * directionOptionsY.length)];

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
          index * (transitionDuration + displayDuration)
        );

        timeline.to(
          element,
          {
            opacity: 0,
            x: xStart,
            y: yStart,
            duration: transitionDuration,
            onComplete: () => {
              element.style.display = 'none';
              if (element.tagName.toLowerCase() === 'video') {
                element.pause();
                element.currentTime = 0;
              }
            },
          },
          index * (transitionDuration + displayDuration) + displayDuration
        );
      });

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
