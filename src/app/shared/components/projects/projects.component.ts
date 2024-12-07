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
  PLATFORM_ID,
  NgZone,
  ChangeDetectionStrategy,
} from '@angular/core';
import { gsap, CSSPlugin, ScrollTrigger } from 'gsap/all';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BreakpointObserver } from '@angular/cdk/layout';

gsap.registerPlugin(CSSPlugin, ScrollTrigger);

interface Project {
  name: string;
  year: string;
  project: string;
  role: string;
  stacks: string;
  url: string;
  images: string[];
  videos: string[];
  animationType: string;
  mediaSequence?: { type: 'image' | 'video'; src: string }[];
}

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
  standalone: true,
  imports: [RouterModule, CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
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

  private mobileSlideshowInterval: any;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private http: HttpClient,
    private changeDetectorRef: ChangeDetectorRef,
    private breakpointObserver: BreakpointObserver,
    private ngZone: NgZone
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
        this.changeDetectorRef.markForCheck();
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
      this.animateProjectItemsOnScroll(); // Ajout de l'animation au scroll pour les project-items
    }
  }

  ngOnDestroy(): void {
    if (this.gsapContext) {
      this.gsapContext.revert();
    }
    this.killTimelines();

    if (this.mobileSlideshowInterval) {
      clearInterval(this.mobileSlideshowInterval);
    }
  }

  toggleMediaPreview(index: number): void {
    if (this.activeMediaIndex === index) {
      this.activeMediaIndex = null;
      this.currentProject = null;
      this.mediaSequence = [];
      this.animationInitialized = false;
      this.changeDetectorRef.detectChanges();

      if (this.mobileSlideshowInterval) {
        clearInterval(this.mobileSlideshowInterval);
        this.mobileSlideshowInterval = null;
      }
    } else {
      this.activeMediaIndex = index;
      this.currentProject = this.projects[index];

      this.mediaSequence = this.currentProject.mediaSequence || [];

      this.animationInitialized = false;
      this.changeDetectorRef.detectChanges();

      setTimeout(() => {
        this.changeDetectorRef.detectChanges();

        this.mediaElements.changes.subscribe(() => {
          if (this.mediaElements.length > 0 && this.currentProject) {
            this.initAnimationForCurrentProject();
          }
        });

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
      this.toggleMediaPreview(index);
    } else {
      this.openProjectLink(this.projects[index]);
    }
  }

  openProjectLink(project: Project | null): void {
    if (!project) return;

    let url = project.url.trim();

    if (!/^https?:\/\//i.test(url)) {
        url = 'https://' + url;
    }

    window.open(url, '_blank');
  }

  private initProjectAnimations(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.ngZone.runOutsideAngular(() => {
        this.gsapContext = gsap.context(() => {
          gsap.to('.background-sides', {
            height: '80%',
            duration: 1,
            ease: 'expoScale',
            scrollTrigger: {
              trigger: '#projects',
            },
            onComplete: () => {
              this.animateTextSlides();
            },
          });
        });
      });
    }
  }

  private animateTextSlides(): void {
    this.ngZone.runOutsideAngular(() => {
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
      this.projects = data.map((project) => {
        const mediaSequence = this.getAllMedia(project);
        const shuffledMediaSequence = mediaSequence.sort(() => Math.random() - 0.5);
        return {
          ...project,
          mediaSequence: shuffledMediaSequence,
        };
      });
      this.changeDetectorRef.detectChanges();
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
    this.changeDetectorRef.detectChanges();

    if (this.mobileSlideshowInterval) {
      clearInterval(this.mobileSlideshowInterval);
      this.mobileSlideshowInterval = null;
    }
  }

  private initAnimationForCurrentProject(): void {
    if (this.animationInitialized || this.mediaElements.length === 0 || !this.currentProject) {
      return;
    }

    this.animationInitialized = true;

    if (this.isDesktop) {
      const animation = this.animations[this.currentProject.animationType || ''];
      if (animation && animation.in) {
        this.ngZone.runOutsideAngular(() => {
          animation.in();
        });
      } else {
        console.warn('No animation found for:', this.currentProject.animationType);
      }
    } else {
      this.initMobileSlideshow();
    }
  }

  private initMobileSlideshow(): void {
    if (this.mobileSlideshowInterval) {
      clearInterval(this.mobileSlideshowInterval);
    }

    const elements = this.mediaElements.toArray();
    let currentIndex = 0;

    elements.forEach((elementRef, index) => {
      const element = elementRef.nativeElement;
      element.style.display = index === 0 ? 'block' : 'none';

      if (element.tagName.toLowerCase() === 'video') {
        element.pause();
        element.currentTime = 0;
      }
    });

    const firstElement = elements[0].nativeElement;
    if (firstElement.tagName.toLowerCase() === 'video') {
      firstElement.play();
    }

    this.mobileSlideshowInterval = setInterval(() => {
      const previousElement = elements[currentIndex].nativeElement;

      previousElement.style.display = 'none';

      if (previousElement.tagName.toLowerCase() === 'video') {
        previousElement.pause();
        previousElement.currentTime = 0;
      }

      currentIndex = (currentIndex + 1) % elements.length;
      const currentElement = elements[currentIndex].nativeElement;

      currentElement.style.display = 'block';

      if (currentElement.tagName.toLowerCase() === 'video') {
        currentElement.play();
      }

      this.changeDetectorRef.detectChanges();
    }, 1500);
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

      timeline = gsap.timeline({ repeat: -1, defaults: { ease: 'power1.inOut' } });

      const transitionDuration = 0.4;
      const displayDuration = 1.5;
      const timeBetweenElements = displayDuration;
      const directionOptionsX = ['-100%', '0%', '100%'];
      const directionOptionsY = ['-100%', '0%', '100%'];

      const shuffledMediaElements = this.mediaElements.toArray();
      shuffledMediaElements.forEach((elementRef, index) => {
        const element = elementRef.nativeElement;
        const xStart = directionOptionsX[Math.floor(Math.random() * directionOptionsX.length)];
        const yStart = directionOptionsY[Math.floor(Math.random() * directionOptionsY.length)];

        timeline!.to(
          element,
          {
            opacity: 1,
            x: '0%',
            y: '0%',
            display: 'block',
            duration: transitionDuration,
            onStart: () => {
              if (element.tagName.toLowerCase() === 'video') {
                element.play().catch((error: any) => {
                  console.error('Erreur de lecture de la vidéo :', error);
                });
              }
            },
          },
          index * timeBetweenElements
        );

        timeline!.to(
          element,
          {
            opacity: 0,
            x: xStart,
            y: yStart,
            display: 'none',
            duration: transitionDuration,
            onComplete: () => {
              if (element.tagName.toLowerCase() === 'video') {
                element.pause();
                element.currentTime = 0;
              }
            },
          },
          index * timeBetweenElements + displayDuration
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

  // Ajout de la méthode pour animer les .project-item (ici les h5) lors du scroll
  private animateProjectItemsOnScroll(): void {
    gsap.registerPlugin(ScrollTrigger);

    const projectItems = document.querySelectorAll('.project-item h5');

    if (projectItems.length > 0) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: '#projects',
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      });

      tl.from(projectItems, {
        opacity: 0,
        y: 20,
        duration: 0.8,
        ease: 'power4.out',
        stagger: 0.2,
      });
    }
  }

}
