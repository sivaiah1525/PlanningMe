import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProfilePickFormatService {

  constructor() { }



  getuserFLnames(value:any){
    const data=value.split(' ')
    let firstTwo1 = data[0].substring(0, 1)
    let firstTwo2 = data[1].substring(0, 1)
     const value1= firstTwo1+firstTwo2
     return value1.toUpperCase()
  }
  getColor(index:number) {
    const darkColors = [
      "#1B2631", // very dark blue grey
      "#1A5276", // dark blue
      "#154360", // dark navy blue
      "#1B4F72", // dark ocean blue
      "#2E86C1", // dark sky blue
      "#2874A6" , // dark medium blue
        "#2C3E50", // dark blue
        "#34495E", // dark grey blue
        "#1F618D", // darker blue
        "#283747", // dark blue grey
        "#2E4053", // another dark grey blue
        "#17202A", // very dark blue black
        "#1C2833", // very dark grey blue
        "#2C3E50", // dark grey blue
        "#212F3C", // dark grey blue with a bit of green 
    ];
    return darkColors[index % darkColors.length];
  }
}
