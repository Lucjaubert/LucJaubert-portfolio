import {
  Component,
  OnInit,
  Inject,
  PLATFORM_ID,
  OnDestroy,
  ChangeDetectorRef,
} from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
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
  isHidden = false;
  showPercentage = false;
  isImageVisible = true;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    @Inject(PLATFORM_ID) private platformId: Object,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    if (this.route.snapshot.routeConfig?.path === "intro") {
      if (isPlatformBrowser(this.platformId)) {
        setTimeout(() => {
          this.isRotating = true;
          this.cdr.detectChanges();

          setTimeout(() => {
            this.updateDisplayText();
            this.startTextColorCycle();

            setTimeout(() => {
              this.isHidden = true;
              this.cdr.detectChanges();
              this.router.navigate(["/home"]);
            }, 1000);
          }, 2000);
        });
      }
    }
  }

  ngOnDestroy(): void {
    if (this.colorChangeInterval) {
      clearInterval(this.colorChangeInterval);
    }
    if (this.textColorChangeInterval) {
      clearInterval(this.textColorChangeInterval);
    }
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
    };
  }
}
