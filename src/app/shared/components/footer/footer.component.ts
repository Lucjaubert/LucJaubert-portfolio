import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule
  ]
})
export class FooterComponent implements OnInit, OnDestroy {

  colorClasses = ['color-light-blue', 'color-light-green', 'color-yellow', 'color-orange'];
  currentColorClassIndex = 0;
  currentColorClass = this.colorClasses[0]; 
  colorChangeInterval: any;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.startColorCycle();
    }
  }

  ngOnDestroy() {
    if (isPlatformBrowser(this.platformId)) {
      if (this.colorChangeInterval) {
        clearInterval(this.colorChangeInterval);
      }
    }
  }

  startColorCycle() {
    this.colorChangeInterval = setInterval(() => {
      this.currentColorClassIndex = (this.currentColorClassIndex + 1) % this.colorClasses.length;
      this.currentColorClass = this.colorClasses[this.currentColorClassIndex];
    }, 3000); 
  }
}
