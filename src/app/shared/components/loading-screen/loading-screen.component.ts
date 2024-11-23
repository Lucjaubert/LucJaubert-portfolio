import {
  Component,
  OnInit,
  Inject,
  PLATFORM_ID,
  OnDestroy,
  ChangeDetectorRef,
} from "@angular/core";
import { LoadingService } from "../../../services/loading.service";
import { ProjectService } from "../../../services/project.service";
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
    private loadingService: LoadingService,
    private projectService: ProjectService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        this.isRotating = true;
        this.cdr.detectChanges();

        Promise.all([this.preloadMedia(), this.minimumLoadTime(1000)]).then(() => {
          this.updateDisplayText();

          this.startTextColorCycle();

          setTimeout(() => {
            this.isHidden = true;
            this.cdr.detectChanges();
            this.loadingService.setLoading(false);
          }, 3000); // "100%" reste affiché pendant 3 secondes au total
        });
      }, 1000); // Temps de départ figé de l'image
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
      setTimeout(resolve, 500);
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
