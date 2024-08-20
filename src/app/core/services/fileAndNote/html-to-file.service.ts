import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HtmlToFileService {

  constructor() { }






  htmlContentToFileConvert(htmlcontent:any){
    var f = new File([htmlcontent], 'file.html', { type: 'text/html' });
    return f
  }
}
