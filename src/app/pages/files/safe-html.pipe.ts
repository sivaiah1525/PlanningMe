import { Pipe, PipeTransform } from '@angular/core';
import {DomSanitizer} from "@angular/platform-browser";
@Pipe({
  name: 'safeHtml',
})
export class SafeHtmlPipe implements PipeTransform {
  constructor(
    public sanitizer:DomSanitizer
  ){}
  transform(html:any) {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }
}