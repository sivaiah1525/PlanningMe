import { Component, ElementRef, Inject, OnInit, Renderer2, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MatomoService } from 'src/app/core/services/matomo-service.service';
import { VideoComponent } from 'src/app/core/components/video/video.component';
import { MatDialog } from '@angular/material/dialog';
import { DOCUMENT } from '@angular/common';
import { WelcomepageoptionslistService } from 'src/app/core/services/welcomepageoptionslist.service';
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  managementPoints :any= []
  Map:any= [];
  Alignment :any= [];
  Governance  :any= [];

  constructor(
    private router: Router,
    private matoService: MatomoService,
    private translate: TranslateService,
    private dialog: MatDialog,
    private renderer: Renderer2,
    private welcomepageoptionslistService : WelcomepageoptionslistService,
     @Inject(DOCUMENT) private document: Document,
     private el: ElementRef

  ){
    if(localStorage.getItem('lang')){
      const lang:any=localStorage.getItem('lang')
      this.translate.use(lang);
    }else{
      this.translate.use('English');
    }  }
  ngOnInit(): void {
    this.matoService.trackPageView('Map-page');
    this.getManagementPoints();
  }


  getManagementPoints() {
    this.managementPoints = this.welcomepageoptionslistService.getManagementPoints();
    console.log("getttttt", this.managementPoints)
    this.managementPoints.forEach((res:any) => {
      if (res.category == "map") {
        this.Map.push(res.point)
      }
      else if (res.category == "alignment") {
        this.Alignment.push(res.point)
      } else if (res.category == "Governance") {
        this.Governance.push(res.point)
      }
    });
  }

  Videoplay(url:string) {
    this.dialog.open(VideoComponent, {
     width: '840px',
     height:'480px',
     data: {url:url},

   });
 }

}
