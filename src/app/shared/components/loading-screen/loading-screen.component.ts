import {
  Component,
  OnInit,
  Inject,
  PLATFORM_ID,
  OnDestroy,
  ChangeDetectorRef,
} from '@angular/core';
import { ProjectService } from '../../../services/project.service';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-loading-screen',
  templateUrl: './loading-screen.component.html',
  styleUrls: ['./loading-screen.component.scss'],
  standalone: true,
})
export class LoadingScreenComponent implements OnInit, OnDestroy {
  displayText = '100%';
  isRotating = false;
  colorClasses = [
    'color-light-blue',
    'color-light-green',
    'color-yellow',
    'color-orange',
  ];
  currentColorClassIndex = 0;
  currentColorClass = this.colorClasses[0];
  colorChangeInterval: any;
  textTransformed = false;
  isHidden = false;
  showPercentage = false;
  isImageVisible = true;

  constructor(
    private projectService: ProjectService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        this.isRotating = true;
        this.startColorCycle();
        this.cdr.detectChanges();

        Promise.all([this.preloadMedia(), this.minimumLoadTime(2500)]).then(
          () => {
            this.updateDisplayText();

            setTimeout(() => {
              this.isImageVisible = false;
              this.isHidden = true;
              this.cdr.detectChanges();

              this.router.navigate(['/home']);
            }, 1000);
          }
        );
      }, 700);
    } else {
      this.router.navigate(['/home']);
    }
  }

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId)) {
      if (this.colorChangeInterval) {
        clearInterval(this.colorChangeInterval);
      }
    }
  }

  preloadMedia(): Promise<void> {
    return new Promise((resolve) => {
      this.projectService.getAllMedia().subscribe((mediaList) => {
        let loadedMedia = 0;
        const totalMedia = mediaList.length;

        if (totalMedia === 0) {
          console.warn('No media to load.');
          resolve();
          return;
        }

        mediaList.forEach((mediaSrc) => {
          const isVideo =
            mediaSrc.endsWith('.mp4') ||
            mediaSrc.endsWith('.webm') ||
            mediaSrc.endsWith('.ogg');
          if (isVideo) {
            const video = document.createElement('video');
            video.src = mediaSrc;
            video.preload = 'auto';

            video.onloadeddata = () => {
              loadedMedia++;
              if (loadedMedia === totalMedia) {
                resolve();
              }
            };

            video.onerror = () => {
              loadedMedia++;
              console.error(
                `Error loading video: ${mediaSrc} (${loadedMedia}/${totalMedia})`
              );
              if (loadedMedia === totalMedia) {
                resolve();
              }
            };

            video.load();
          } else {
            const img = new Image();
            img.src = mediaSrc;

            img.onload = () => {
              loadedMedia++;
              if (loadedMedia === totalMedia) {
                resolve();
              }
            };

            img.onerror = () => {
              loadedMedia++;
              console.error(
                `Error loading image: ${mediaSrc} (${loadedMedia}/${totalMedia})`
              );
              if (loadedMedia === totalMedia) {
                resolve();
              }
            };
          }
        });
      });
    });
  }

  minimumLoadTime(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  startColorCycle(): void {
    this.colorChangeInterval = setInterval(() => {
      this.currentColorClassIndex =
        (this.currentColorClassIndex + 1) % this.colorClasses.length;
      this.currentColorClass = this.colorClasses[this.currentColorClassIndex];
      this.cdr.detectChanges();
    }, 300);
  }

  updateDisplayText(): void {
    this.isRotating = false;
    this.showPercentage = true;
    this.textTransformed = true;
    this.cdr.detectChanges();
  }

  get progressTextClasses(): string {
    let classes = this.currentColorClass;
    if (this.isRotating) {
      classes += ' rotate';
    }
    if (this.textTransformed) {
      classes += ' transform-text';
    }
    return classes;
  }
}
