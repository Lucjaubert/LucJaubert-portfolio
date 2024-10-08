import { Component, AfterViewInit, ViewChildren, ElementRef, QueryList, Inject, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import { PLATFORM_ID } from '@angular/core';
import { gsap, CSSPlugin, ScrollTrigger } from 'gsap/all';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { SlugifyPipe } from '../../pipe/slugify.pipe';

gsap.registerPlugin(CSSPlugin, ScrollTrigger);

interface StudioSection {
  name: string;
  stacks: string;
}

@Component({
  selector: 'app-studio-web',
  templateUrl: './studio-web.component.html',
  styleUrls: ['./studio-web.component.scss'],
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    SlugifyPipe
  ]
})
export class StudioWebComponent implements AfterViewInit, OnInit, OnDestroy {
  @ViewChildren('studioSectionContainer') studioSectionContainers!: QueryList<ElementRef>;
  private gsapContext: gsap.Context | undefined;

  sections: StudioSection[] = [];
  currentSection: StudioSection | null = null;
  isHovered: boolean = false;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private http: HttpClient,
    private changeDetectorRef: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadStudioSections();
    }
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        this.initStudioSectionAnimations();
      });
    }
  }

  ngOnDestroy(): void {
    if (this.gsapContext) {
      this.gsapContext.revert();
    }
  }

  getSectionClass(index: number): string {
    switch (index) {
      case 0:
        return 'design-section d-flex col-md-12 py-md-10';
      case 1:
        return 'development-section d-flex col-md-12 py-md-10';
      case 2:
        return 'marketing-section d-flex col-md-12 py-md-10';
      case 3:
        return 'process-section d-flex col-md-12 py-md-10';
      default:
        return 'default-section-class';
    }
  }

  private loadStudioSections(): void {
    this.http.get<StudioSection[]>('assets/data/studio-web.json').subscribe((data: StudioSection[]) => {
      this.sections = data;
      console.log('Sections chargées:', this.sections);
      this.changeDetectorRef.detectChanges();
      this.initStudioSectionAnimations();
    });
  }

  private initStudioSectionAnimations(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.gsapContext = gsap.context(() => {
        this.studioSectionContainers.forEach((section: ElementRef, index: number) => {
          const sectionElement = section.nativeElement as HTMLElement;
          const currentSectionData = this.sections[index];

          const title = sectionElement.querySelector('h3.text-slide') as HTMLElement | null;
          const detailsText = sectionElement.querySelector('.stacks-slide') as HTMLElement | null;
          const mediaGallery = sectionElement.querySelector('.media-gallery') as HTMLElement | null;

          let endValue: string | (() => string);
          if (sectionElement.classList.contains('process-section')) {
            endValue = () => `+=${sectionElement.clientHeight - 600}`;
          } else {
            endValue = () => `+=${sectionElement.clientHeight}`;
          }

          ScrollTrigger.create({
            trigger: sectionElement,
            start: "top top",
            end: endValue,
            pin: true,
            pinSpacing: false,
            scrub: true,
          });

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: sectionElement,
              start: "top 80%",
              end: "bottom 20%",
              toggleActions: "play none none reverse",
            }
          });

          if (title) {
            tl.fromTo(title, {
              opacity: 0,
              y: 50,
            }, {
              opacity: 1,
              y: 0,
              duration: 1,
              ease: "power4.out"
            }, 0.1);
          }

          if (detailsText) {
            tl.from(detailsText, {
              opacity: 0,
              x: 100,
              duration: 1.5,
              ease: "power4.out"
            }, 0.5);
          }
        });
      });
    }
  }
}
