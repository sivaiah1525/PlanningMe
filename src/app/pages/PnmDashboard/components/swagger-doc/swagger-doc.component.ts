import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-swagger-doc',
  templateUrl: './swagger-doc.component.html',
  styleUrls: ['./swagger-doc.component.scss']
})
export class SwaggerDocComponent implements OnInit {
  sidenavstatus=true
  panelOpenState = false;
  panelOpenStateforAPI=false
  selectLocationtype='OverView'
  windowHeight=1000
  constructor() {
    this.windowHeight=window.innerHeight-125
   }

  ngOnInit(): void {
  }
}
