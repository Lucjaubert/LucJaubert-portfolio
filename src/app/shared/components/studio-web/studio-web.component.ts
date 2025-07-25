import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ViewChildren,
  ElementRef,
  QueryList,
  Inject,
  PLATFORM_ID,
  ChangeDetectorRef
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { gsap, CSSPlugin, ScrollTrigger } from 'gsap/all';
import { HttpClient } from '@angular/common/http';
import { SlugifyPipe } from '../../pipe/slugify.pipe';
import { LineBreaksPipe } from '../../pipe/line-breaks.pipe';
import { SeoService } from '../../../core/seo.service';

gsap.registerPlugin(CSSPlugin, ScrollTrigger);

interface StudioSection {
  name: string;
  mission: string;
  stacks: string;
}

@Component({
  selector: 'app-studio-web',
  templateUrl: './studio-web.component.html',
  styleUrls: ['./studio-web.component.scss'],
  standalone: true,
  imports: [RouterModule, CommonModule, SlugifyPipe, LineBreaksPipe]
})
export class StudioWebComponent implements OnInit, AfterViewInit, OnDestroy {
  [x: string]: any;
  @ViewChildren('studioSectionContainer') studioSectionContainers!: QueryList<ElementRef>;
  private gsapContext?: gsap.Context;
  sections: StudioSection[] = [];
  currentSection: StudioSection | null = null;
  isHovered = false;

  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private seo: SeoService
  ) {}

  ngOnInit(): void {
    this.seo.update({
      title: 'Studio Web – Luc Jaubert',
      description: 'Expertise développement, design et SEO de Luc Jaubert pour vos projets web.',
      url: 'https://lucjaubert.com/studio-web',
      image: 'https://lucjaubert.com/assets/icons/apple-touch-icon.png'
    });

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
        return 'design-section d-flex col-md-12 py-md-7';
      case 1:
        return 'development-section d-flex col-md-12 py-md-7';
      case 2:
        return 'marketing-section d-flex col-md-12 py-md-7';
      case 3:
        return 'process-section d-flex col-md-12 py-md-7';
      default:
        return 'default-section-class';
    }
  }

  private loadStudioSections(): void {
    this.http.get<StudioSection[]>('assets/data/studio-web.json').subscribe((data: StudioSection[]) => {
      this.sections = data;
      this.cdr.detectChanges();
      this.initStudioSectionAnimations();
    });
  }

  private initStudioSectionAnimations(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.gsapContext = gsap.context(() => {
        this.studioSectionContainers.forEach((section: ElementRef, index: number) => {
          const sectionElement = section.nativeElement as HTMLElement;
          const title = sectionElement.querySelector('h3.text-slide') as HTMLElement | null;
          const mission = sectionElement.querySelector('.mission-slide') as HTMLElement | null;
          const horizontalLine = sectionElement.querySelector('.horizontal-line') as HTMLElement | null;
          const verticalLine = sectionElement.querySelector('.vertical-line') as HTMLElement | null;
          const detailsText = sectionElement.querySelector('.stacks-slide') as HTMLElement | null;


          ScrollTrigger.create({
            trigger: sectionElement,
            start: "top top",
            end: "bottom top",
            pin: true,
            pinSpacing: true,
            scrub: false,
          });

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: sectionElement,
              start: "top top",
              end: "bottom top",
              scrub: false,
            }
          });

          if (title) {
            tl.fromTo(
              title,
              {
                opacity: 0,
                y: 50,
              },
              {
                opacity: 1,
                y: 0,
                duration: 1,
                ease: "power4.out",
              }
            );
          }


          if (horizontalLine) {
            tl.fromTo(horizontalLine, {
              width: '0%',
            }, {
              width: '100%',
              duration: 1,
              ease: 'none'
            }, "-=0.5");
          }


          if (mission) {
            tl.fromTo(mission, {
                opacity: 0,
                y: 50,
              }, {
                opacity: 1,
                y: 0,
                duration: 1,
                ease: "power4.out"
            }, "-=0.5");
          }

          if (verticalLine) {
            tl.fromTo(verticalLine, {
              height: '0%',
            }, {
              height: '100%',
              duration: 1,
              ease: 'none'
            }, "-=0.5");
          }

          if (detailsText) {
            tl.from(detailsText, {
              opacity: 0,
              x: 100,
              duration: 1,
              ease: "power4.out"
            }, "-=0.5");
          }
        });
      });
    }
  }
}
