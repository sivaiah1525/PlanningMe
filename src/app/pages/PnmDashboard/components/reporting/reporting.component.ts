import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MatomoService } from 'src/app/core/services/matomo-service.service';
import { VideoComponent } from 'src/app/core/components/video/video.component';
import { MatDialog } from '@angular/material/dialog';
import { WelcomepageoptionslistService } from 'src/app/core/services/welcomepageoptionslist.service';
@Component({
  selector: 'app-reporting',
  templateUrl: './reporting.component.html',
  styleUrls: ['./reporting.component.css']
})
export class ReportingComponent   implements OnInit{

  managementPoints :any= []
  Workflow :any= [];
  Alert  :any= [];
  Automated :any= []


  constructor(
    private router: Router,
    private matoService: MatomoService,
    private translate: TranslateService ,
    private dialog: MatDialog,
    private el: ElementRef,
    private welcomepageoptionslistService : WelcomepageoptionslistService,
    private renderer: Renderer2
  ){
    if(localStorage.getItem('lang')){
      const lang:any=localStorage.getItem('lang')
      this.translate.use(lang);
    }else{
      this.translate.use('English');
    }    this.matoService.trackPageView('Reporting-page');
  }
  ngOnInit(): void {
    const element = this.el.nativeElement;
    this.renderer.setProperty(element, 'scrollTop', 0);
    this.getManagementPoints()
  }

  getManagementPoints() {
    this.managementPoints = this.welcomepageoptionslistService.getManagementPoints();
    console.log("getttttt", this.managementPoints)
    this.managementPoints.forEach((res:any) => {
      if (res.category == "Automated") {
        this.Automated.push(res.point)
      }
      else if (res.category == "Workflow") {
        this.Workflow.push(res.point)
      } else if (res.category == "Alert") {
        this.Alert.push(res.point)
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
