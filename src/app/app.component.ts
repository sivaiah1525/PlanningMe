import { Component, OnInit, ViewChild } from '@angular/core';
import { GooglePlaceDirective } from 'ngx-google-places-autocomplete';
import { ResizeService } from '../app/core/services/resize.service';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public windowWidth: number | undefined;


  constructor(
    private resizeService: ResizeService,
    private router: Router
  ) {
    window.scrollTo(0, 0);
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        window.scrollTo(0, 0); // Scroll to the top on route change
      }
    });
  }
  resizeHandler($event:any): void {
    //this.resizeService.setData($event.target.innerWidth);
    this.resizeService.loadSize({ size: $event.target.innerWidth });


  }
  ngOnInit(): void {
    this.windowWidth = window.innerWidth;
    // this.resizeService.setData(this.windowWidth);
  }




  


}
