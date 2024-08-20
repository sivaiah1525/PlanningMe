import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CheckScreenWidthPercentageService {
  screenWidth = window.innerWidth;

  constructor() { }


  screenpercentage(){
    let value:any
    if (this.screenWidth < 600) { // Small screens
      value= '100%';
    } else if (this.screenWidth < 800) { // Medium screens
      value= '80%';
    } else if (this.screenWidth < 1000) { // Medium screens && Large screens
      value= '60%';
    } else { // Large screens
      value= '50%';
    }
    return value
  }
}
