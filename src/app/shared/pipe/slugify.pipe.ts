import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'slugify',
  standalone: true
})
export class SlugifyPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) {
      return '';
    }
    return value
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')      
      .replace(/[^\w\-]+/g, '')  
      .replace(/\-\-+/g, '-');  
  }
}
