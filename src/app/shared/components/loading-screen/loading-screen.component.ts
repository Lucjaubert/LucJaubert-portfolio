import {
  Component,
  OnInit,
  Inject,
  PLATFORM_ID,
  OnDestroy,
  ChangeDetectorRef,
} from "@angular/core";
import { Router } from "@angular/router";
import { ProjectService } from "../../../services/project.service";
import { LoadingService } from "../../../services/loading.service";
import { isPlatformBrowser, CommonModule } from "@angular/common";

@Component({
  selector: "app-loading-screen",
  templateUrl: "./loading-screen.component.html",
  styleUrls: ["./loading-screen.component.scss"],
  standalone: true,
  imports: [CommonModule],
})
export class LoadingScreenComponent implements OnInit, OnDestroy {
  displayText = "100%";
  isRotating = false;
  colorClasses = [
    "color-light-blue",
    "color-light-green",
    "color-yellow",
    "color-orange",
  ];
  currentColorClassIndex = 0;
  currentColorClass = this.colorClasses[0];
  colorChangeInterval: any;
  textColorChangeInterval: any;
  textTransformed = false;
  isHidden = false;
  showPercentage = false;
  isImageVisible = true;

  constructor(
    private router: Router,
    private projectService: ProjectService,
    private loadingService: LoadingService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadingService.setLoading(true);

    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        this.isRotating = true;
        this.cdr.detectChanges();

        Promise.all([this.preloadMedia(), this.minimumLoadTime(1000)]).then(() => {
          this.updateDisplayText();
          this.startTextColorCycle();

          setTimeout(() => {
            this.isHidden = true;
            this.loadingService.setLoading(false);
            this.cdr.detectChanges();
            this.router.navigate(['/']);
          }, 2500);
        });
      }, 1000);
    } else {
      this.loadingService.setLoading(false);
    }
  }

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId)) {
      if (this.colorChangeInterval) {
        clearInterval(this.colorChangeInterval);
      }
      if (this.textColorChangeInterval) {
        clearInterval(this.textColorChangeInterval);
      }
    }
  }

  preloadMedia(): Promise<void> {
    return new Promise((resolve) => {
      this.projectService.getAllMedia().subscribe((mediaList) => {
        let loadedMedia = 0;
        const totalMedia = mediaList.length;

        if (totalMedia === 0) {
          resolve();
          return;
        }

        mediaList.forEach((mediaSrc) => {
          const isVideo =
            mediaSrc.endsWith(".mp4") ||
            mediaSrc.endsWith(".webm") ||
            mediaSrc.endsWith(".ogg");
          if (isVideo) {
            const video = document.createElement("video");
            video.src = mediaSrc;
            video.preload = "auto";

            video.onloadeddata = () => {
              loadedMedia++;
              if (loadedMedia === totalMedia) {
                resolve();
              }
            };

            video.onerror = () => {
              loadedMedia++;
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

  startTextColorCycle(): void {
    this.textColorChangeInterval = setInterval(() => {
      this.currentColorClassIndex =
        (this.currentColorClassIndex + 1) % this.colorClasses.length;
      this.currentColorClass = this.colorClasses[this.currentColorClassIndex];
      this.cdr.detectChanges();
    }, 100);
  }

  updateDisplayText(): void {
    this.isRotating = false;
    this.isImageVisible = false;
    this.showPercentage = true;
    this.cdr.detectChanges();
  }

  get progressTextClasses() {
    return {
      [this.currentColorClass]: true,
      rotate: this.isRotating,
      "transform-text": this.textTransformed,
    };
  }
}
