import { Component, OnInit, Inject, PLATFORM_ID, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { LoadingService } from '../../../services/loading.service';
import { ProjectService } from '../../../services/project.service';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-loading-screen',
  templateUrl: './loading-screen.component.html',
  styleUrls: ['./loading-screen.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class LoadingScreenComponent implements OnInit, OnDestroy {
  displayText = 'LJ.';
  isRotating = false;
  colorClasses = ['color-light-blue', 'color-light-green', 'color-yellow', 'color-orange'];
  currentColorClassIndex = 0;
  currentColorClass = this.colorClasses[0];
  colorChangeInterval: any;
  textTransformed = false;
  isHidden = false;

  constructor(
    private loadingService: LoadingService,
    private projectService: ProjectService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        this.isRotating = true;
        this.startColorCycle();
        this.cdr.detectChanges();

        Promise.all([this.preloadMedia(), this.minimumLoadTime(2500)])
          .then(() => {
            this.updateDisplayText();
            setTimeout(() => {
              this.isHidden = true;
              this.cdr.detectChanges();
              setTimeout(() => {
                this.loadingService.setLoading(false);
              }, 1000); // Durée de l'animation CSS
            }, 1000); // Temps pour afficher "100%"
          });
      }, 700); // Délai initial de 1 seconde avant de démarrer la rotation
    } else {
      this.loadingService.setLoading(false);
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

        console.log('Starting to preload media:', totalMedia);

        mediaList.forEach((mediaSrc) => {
          const isVideo = mediaSrc.endsWith('.mp4') || mediaSrc.endsWith('.webm') || mediaSrc.endsWith('.ogg');
          if (isVideo) {
            const video = document.createElement('video');
            video.src = mediaSrc;
            video.preload = 'auto';

            video.onloadeddata = () => {
              loadedMedia++;
              console.log(`Loaded video: ${mediaSrc} (${loadedMedia}/${totalMedia})`);

              if (loadedMedia === totalMedia) {
                resolve();
              }
            };

            video.onerror = () => {
              loadedMedia++;
              console.error(`Error loading video: ${mediaSrc} (${loadedMedia}/${totalMedia})`);

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
              console.log(`Loaded image: ${mediaSrc} (${loadedMedia}/${totalMedia})`);

              if (loadedMedia === totalMedia) {
                resolve();
              }
            };

            img.onerror = () => {
              loadedMedia++;
              console.error(`Error loading image: ${mediaSrc} (${loadedMedia}/${totalMedia})`);

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
      this.currentColorClassIndex = (this.currentColorClassIndex + 1) % this.colorClasses.length;
      this.currentColorClass = this.colorClasses[this.currentColorClassIndex];
    }, 300);
  }

  updateDisplayText(): void {
    // Arrêter la rotation
    this.isRotating = false;

    // Changer le texte en "100%"
    this.displayText = '100%';

    // Ajouter la classe d'animation
    this.textTransformed = true;

    // Arrêter le cycle de couleur
    if (this.colorChangeInterval) {
      clearInterval(this.colorChangeInterval);
      this.colorChangeInterval = null;
    }

    // Forcer la détection des changements
    this.cdr.detectChanges();
  }

  get progressTextClasses() {
    return {
      [this.currentColorClass]: true,
      rotate: this.isRotating,
      'transform-text': this.textTransformed
    };
  }
}
