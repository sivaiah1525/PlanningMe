import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NavigationEnd, Router } from '@angular/router';
import { MatomoService } from 'src/app/core/services/matomo-service.service';
import { VideoComponent } from 'src/app/core/components/video/video.component';
import { MatDialog } from '@angular/material/dialog';
import { WelcomepageoptionslistService } from 'src/app/core/services/welcomepageoptionslist.service';

@Component({
  selector: 'app-management',
  templateUrl: './management.component.html',
  styleUrls: ['./management.component.css']
})
export class ManagementComponent  implements OnInit  {
  managementPoints :any= []
  Productivity:any= [];
  Performance :any= [];
  Project  :any= [];

  constructor(
    private router: Router,
    private matoService: MatomoService,
    private translate: TranslateService,
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
    }  }
  ngOnInit(): void {
    this.matoService.trackPageView('Management-page');
    const element = this.el.nativeElement;
    this.renderer.setProperty(element, 'scrollTop', 0);

    this.getManagementPoints();
  }

  getManagementPoints() {
    this.managementPoints = this.welcomepageoptionslistService.getManagementPoints();
    console.log("getttttt", this.managementPoints)
    this.managementPoints.forEach((res:any) => {
      if (res.category == "productivity") {
        this.Productivity.push(res.point)
      }
      else if (res.category == "performance") {
        this.Performance.push(res.point)
      } else if (res.category == "project") {
        this.Project.push(res.point)
      }
    });
  }


  Videoplay(url:any) {
    this.dialog.open(VideoComponent, {
     width: '840px',
     height:'480px',
     data: {url:url},
   });
 }

}
