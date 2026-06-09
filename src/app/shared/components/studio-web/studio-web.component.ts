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
  ChangeDetectorRef,
  Input
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { gsap, CSSPlugin, ScrollTrigger } from 'gsap/all';
import { HttpClient } from '@angular/common/http';
import { SlugifyPipe } from '../../pipe/slugify.pipe';
import { LineBreaksPipe } from '../../pipe/line-breaks.pipe';

gsap.registerPlugin(CSSPlugin, ScrollTrigger);

interface StudioSection {
  name: string;
  mission: string;
  stacks: string;
  whenRelevant?: string[];
  typicalExample?: string;
}

@Component({
  selector: 'app-studio-web',
  templateUrl: './studio-web.component.html',
  styleUrls: ['./studio-web.component.scss'],
  standalone: true,
  imports: [RouterModule, CommonModule, SlugifyPipe, LineBreaksPipe]
})
export class StudioWebComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChildren('studioSectionContainer') studioSectionContainers!: QueryList<ElementRef>;

  @Input() sections: StudioSection[] = [];

  private gsapContext?: gsap.Context;

  currentSection: StudioSection | null = null;
  isHovered = false;

  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    if (this.sections && this.sections.length > 0) {
      return;
    }

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
    this.gsapContext?.revert();
  }

  getSectionClass(index: number): string {
    const classes = [
      'design-section',
      'development-section',
      'marketing-section',
      'process-section'
    ];
    return `${classes[index % classes.length]} d-flex col-md-12 py-md-7`;
  }

  private loadStudioSections(): void {
    this.http.get<StudioSection[]>('assets/data/studio-web.json').subscribe((data: StudioSection[]) => {
      this.sections = data;
      this.cdr.detectChanges();
      this.initStudioSectionAnimations();
    });
  }

  private initStudioSectionAnimations(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    if (!this.studioSectionContainers || this.studioSectionContainers.length === 0) return;

    // évite de recréer des triggers si rappelée plusieurs fois
    this.gsapContext?.revert();

    this.gsapContext = gsap.context(() => {
      this.studioSectionContainers.forEach((section: ElementRef) => {
        const sectionElement = section.nativeElement as HTMLElement;

        const title = sectionElement.querySelector('h3.text-slide') as HTMLElement | null;
        const mission = sectionElement.querySelector('.mission-slide') as HTMLElement | null;
        const horizontalLine = sectionElement.querySelector('.horizontal-line') as HTMLElement | null;
        const verticalLine = sectionElement.querySelector('.vertical-line') as HTMLElement | null;
        const detailsText = sectionElement.querySelector('.stacks-slide') as HTMLElement | null;
        const whenRelevant = sectionElement.querySelector('.when-relevant-block') as HTMLElement | null;
        const typicalExample = sectionElement.querySelector('.typical-example-block') as HTMLElement | null;

        ScrollTrigger.create({
          trigger: sectionElement,
          start: 'top top',
          end: 'bottom top',
          pin: true,
          pinSpacing: true,
          scrub: false
        });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionElement,
            start: 'top top',
            end: 'bottom top',
            scrub: false
          }
        });

        if (title) {
          tl.fromTo(
            title,
            { opacity: 0, y: 50 },
            { opacity: 1, y: 0, duration: 1, ease: 'power4.out' }
          );
        }

        if (horizontalLine) {
          tl.fromTo(
            horizontalLine,
            { width: '0%' },
            { width: '100%', duration: 1, ease: 'none' },
            '-=0.5'
          );
        }

        if (mission) {
          tl.fromTo(
            mission,
            { opacity: 0, y: 50 },
            { opacity: 1, y: 0, duration: 1, ease: 'power4.out' },
            '-=0.5'
          );
        }

        if (whenRelevant) {
          tl.fromTo(
            whenRelevant,
            { opacity: 0, y: 40 },
            { opacity: 1, y: 0, duration: 0.8, ease: 'power4.out' },
            '-=0.4'
          );
        }

        if (typicalExample) {
          tl.fromTo(
            typicalExample,
            { opacity: 0, y: 40 },
            { opacity: 1, y: 0, duration: 0.8, ease: 'power4.out' },
            '-=0.4'
          );
        }

        if (verticalLine) {
          tl.fromTo(
            verticalLine,
            { height: '0%' },
            { height: '100%', duration: 1, ease: 'none' },
            '-=0.5'
          );
        }

        if (detailsText) {
          tl.from(
            detailsText,
            { opacity: 0, x: 100, duration: 1, ease: 'power4.out' },
            '-=0.5'
          );
        }
      });
    });
  }
}
