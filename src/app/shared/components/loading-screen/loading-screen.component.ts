import { Component, OnInit, Inject, PLATFORM_ID, OnDestroy } from '@angular/core';
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
  loadingProgress = 0;
  colorClasses = ['color-light-blue', 'color-light-green', 'color-yellow', 'color-orange'];
  currentColorClassIndex = 0;
  currentColorClass = this.colorClasses[0];
  colorChangeInterval: any;

  constructor(
    private loadingService: LoadingService,
    private projectService: ProjectService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.startColorCycle();

      Promise.all([this.preloadMedia(), this.minimumLoadTime(3000)]).then(() => {
        this.loadingService.setLoading(false);
      });
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
              this.loadingProgress = Math.floor((loadedMedia / totalMedia) * 100);
              console.log(`Loaded video: ${mediaSrc} (${loadedMedia}/${totalMedia})`);

              if (loadedMedia === totalMedia) {
                resolve();
              }
            };

            video.onerror = () => {
              loadedMedia++;
              this.loadingProgress = Math.floor((loadedMedia / totalMedia) * 100);
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
              this.loadingProgress = Math.floor((loadedMedia / totalMedia) * 100);
              console.log(`Loaded image: ${mediaSrc} (${loadedMedia}/${totalMedia})`);

              if (loadedMedia === totalMedia) {
                resolve();
              }
            };

            img.onerror = () => {
              loadedMedia++;
              this.loadingProgress = Math.floor((loadedMedia / totalMedia) * 100);
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
}
