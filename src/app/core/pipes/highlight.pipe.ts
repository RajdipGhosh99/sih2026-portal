import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'highlight',
  standalone: true
})
export class HighlightPipe implements PipeTransform {
  transform(text: string | undefined | null, search: string | undefined | null): string {
    if (!text) return '';
    if (!search || !search.trim()) return text;
    
    const escaped = search.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
    const regex = new RegExp(`(${escaped})`, 'gi');
    return text.replace(regex, '<mark class="highlight-match">$1</mark>');
  }
}
