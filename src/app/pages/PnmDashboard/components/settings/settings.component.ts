import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MatomoService } from 'src/app/core/services/matomo-service.service';
import { VideoComponent } from 'src/app/core/components/video/video.component';
import { MatDialog } from '@angular/material/dialog';
import { WelcomepageoptionslistService } from 'src/app/core/services/welcomepageoptionslist.service';
@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit  {


  managementPoints :any= []
  Security:any= [];
  Tools :any= [];
  Storage  :any= [];

  constructor(
    private router: Router,
    private translate: TranslateService,
    private dialog: MatDialog,
    private matoService: MatomoService,
    private el: ElementRef,
    private welcomepageoptionslistService : WelcomepageoptionslistService,
    private renderer: Renderer2
  ){
    this.matoService.trackPageView('Settings-page');
    if(localStorage.getItem('lang')){
      const lang:any=localStorage.getItem('lang')
      this.translate.use(lang);
    }else{
      this.translate.use('English');
    }  }
  ngOnInit(): void {
    const element = this.el.nativeElement;
    this.renderer.setProperty(element, 'scrollTop', 0);
    this.getManagementPoints()
  }

  getManagementPoints() {
    this.managementPoints = this.welcomepageoptionslistService.getManagementPoints();
    console.log("getttttt", this.managementPoints)
    this.managementPoints.forEach((res:any) => {
      if (res.category == "Security") {
        this.Security.push(res.point)
      }
      else if (res.category == "Tools") {
        this.Tools.push(res.point)
      } else if (res.category == "Storage") {
        this.Storage.push(res.point)
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
