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
  ChangeDetectionStrategy
} from '@angular/core';
import { gsap, CSSPlugin, ScrollTrigger } from 'gsap/all';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BreakpointObserver } from '@angular/cdk/layout';
import { SeoService } from '../../../core/seo.service';

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
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectsComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChildren('mediaElement') mediaElements!: QueryList<ElementRef>;

  projects: Project[] = [];
  currentProject: Project | null = null;
  isHovered = false;
  activeMediaIndex: number | null = null;
  mediaSequence: { type: 'image' | 'video'; src: string }[] = [];

  private cb2pTimeline: gsap.core.Timeline | null = null;
  private laiterieTimeline: gsap.core.Timeline | null = null;
  private anglaisTimeline: gsap.core.Timeline | null = null;
  private limagoTimeline: gsap.core.Timeline | null = null;
  private maisonTimeline: gsap.core.Timeline | null = null;
  private abcTimeline: gsap.core.Timeline | null = null;
  private animations: { [key: string]: { in: () => void; out: () => void } } = {};
  private animationInitialized = false;
  private gsapContext?: gsap.Context;

  isDesktop = false;
  circleX = 0;
  circleY = 0;
  isCircleVisible = false;
  private mobileSlideshowInterval: any;

  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private breakpointObserver: BreakpointObserver,
    private ngZone: NgZone,
    private seo: SeoService
  ) {}

  ngOnInit(): void {
    this.seo.update({
      title: 'Projets – Luc Jaubert',
      description: 'Portfolio des projets réalisés par Luc Jaubert, développeur web freelance à Bordeaux.',
      url: 'https://lucjaubert.com/projets',
      image: 'https://lucjaubert.com/assets/icons/apple-touch-icon.png'
    });

    if (isPlatformBrowser(this.platformId)) {
      this.loadProjects();
      this.animations = {
        cb2pAnimation: { in: () => this.initProjectAnimation('cb2p'), out: () => {} },
        laiterieAnimation: { in: () => this.initProjectAnimation('laiterie'), out: () => {} },
        anglaisAnimation: { in: () => this.initProjectAnimation('anglais'), out: () => {} },
        limagoAnimation: { in: () => this.initProjectAnimation('limago'), out: () => {} },
        maisonAnimation: { in: () => this.initProjectAnimation('maison'), out: () => {} },
        abcAnimation: { in: () => this.initProjectAnimation('abc'), out: () => {} }
      };

      this.breakpointObserver.observe(['(min-width: 768px)']).subscribe(state => {
        this.isDesktop = state.matches;
        this.cdr.markForCheck();
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
      this.animateProjectItemsOnScroll();
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
      this.cdr.detectChanges();

      if (this.mobileSlideshowInterval) {
        clearInterval(this.mobileSlideshowInterval);
        this.mobileSlideshowInterval = null;
      }
    } else {
      this.activeMediaIndex = index;
      this.currentProject = this.projects[index];

      this.mediaSequence = this.currentProject.mediaSequence || [];

      this.animationInitialized = false;
      this.cdr.detectChanges();

      setTimeout(() => {
        this.cdr.detectChanges();

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
    this.isCircleVisible = true;
    this.animationInitialized = false;

    this.mediaSequence = this.getAllMedia(project);
    this.mediaSequence = this.mediaSequence.sort(() => Math.random() - 0.5);

    this.cdr.detectChanges();

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
    this.isCircleVisible = false;
    this.animationInitialized = false;

    const animation = this.animations[this.currentProject?.animationType || ''];
    if (animation && animation.out) {
      animation.out();
    }

    this.currentProject = null;
    this.mediaSequence = [];
    this.cdr.detectChanges();

    if (this.mobileSlideshowInterval) {
      clearInterval(this.mobileSlideshowInterval);
      this.mobileSlideshowInterval = null;
    }
  }

  onProjectHoverMove(event: MouseEvent): void {
    if (!this.isDesktop) return;
    this.circleX = event.offsetX - 40;
    this.circleY = event.offsetY - 40;
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
      this.cdr.detectChanges();
    });
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

    const firstElement = elements[0]?.nativeElement;
    if (firstElement && firstElement.tagName.toLowerCase() === 'video') {
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

      this.cdr.detectChanges();
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
    [
      this.cb2pTimeline,
      this.laiterieTimeline,
      this.anglaisTimeline,
      this.limagoTimeline,
      this.maisonTimeline,
      this.abcTimeline
    ].forEach(tl => tl?.kill());
    this.animationInitialized = false;
  }

  private initProjectAnimation(timelineName: string): void {
    if (!this.mediaElements || this.mediaElements.length === 0) return;

    const resetTimeline = (ref: gsap.core.Timeline | null) => {
      if (ref) ref.kill();
      return null;
    };

    switch (timelineName) {
      case 'cb2p':
        this.cb2pTimeline = resetTimeline(this.cb2pTimeline);
        break;
      case 'laiterie':
        this.laiterieTimeline = resetTimeline(this.laiterieTimeline);
        break;
      case 'anglais':
        this.anglaisTimeline = resetTimeline(this.anglaisTimeline);
        break;
      case 'limago':
        this.limagoTimeline = resetTimeline(this.limagoTimeline);
        break;
      case 'maison':
        this.maisonTimeline = resetTimeline(this.maisonTimeline);
        break;
      case 'abc':
        this.abcTimeline = resetTimeline(this.abcTimeline);
        break;
    }

    const tl = gsap.timeline({ repeat: -1, defaults: { ease: 'power1.inOut' } });
    const transition = 0.4;
    const stay = 1.5;
    const dirX = ['-100%', '0%', '100%'];
    const dirY = ['-100%', '0%', '100%'];

    this.mediaElements.toArray().forEach((ref, i) => {
      const el = ref.nativeElement as HTMLElement;
      const xStart = dirX[Math.floor(Math.random() * dirX.length)];
      const yStart = dirY[Math.floor(Math.random() * dirY.length)];

      tl.to(el, {
        opacity: 1,
        x: '0%',
        y: '0%',
        display: 'block',
        duration: transition,
        onStart: () => {
          if (el.tagName.toLowerCase() === 'video') (el as HTMLVideoElement).play().catch(() => {});
        }
      }, i * stay)
      .to(el, {
        opacity: 0,
        x: xStart,
        y: yStart,
        display: 'none',
        duration: transition,
        onComplete: () => {
          if (el.tagName.toLowerCase() === 'video') {
            const vid = el as HTMLVideoElement;
            vid.pause();
            vid.currentTime = 0;
          }
        }
      }, i * stay + stay);
    });

    switch (timelineName) {
      case 'cb2p':
        this.cb2pTimeline = tl;
        break;
      case 'laiterie':
        this.laiterieTimeline = tl;
        break;
      case 'anglais':
        this.anglaisTimeline = tl;
        break;
      case 'limago':
        this.limagoTimeline = tl;
        break;
      case 'maison':
        this.maisonTimeline = tl;
        break;
      case 'abc':
        this.abcTimeline = tl;
        break;
    }
  }

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
