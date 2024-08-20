import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  ElementRef,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { ViewportScroller } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { MatomoService } from 'src/app/core/services/matomo-service.service';
import { MatDialog } from '@angular/material/dialog';
import { CookiesComponent } from 'src/app/core/components/cookies/cookies.component';
import { ResizeService } from 'src/app/core/services/resize.service';
import { WelcomepageoptionslistService} from '../../../../core/services/welcomepageoptionslist.service'
@Component({
  selector: 'app-welcome-page',
  templateUrl: './welcome-page.component.html',
  styleUrls: ['./welcome-page.component.scss'],
})
export class WelcomePageComponent implements OnInit {
  @ViewChild('scrollElement') scrollElement!: ElementRef;
  screensize: number = 1200;
  acceptedCookies = true;
  @Input() private valueChange!: EventEmitter<boolean>;

  managementPoints:any = [];
  management:any = []
  planning:any = []
  map:any = []
  reporting:any = []
  settings:any = []


  constructor(
    private router: Router,
    private viewportScroller: ViewportScroller,
    private translate: TranslateService,
    private matoService: MatomoService,
    private dialog: MatDialog,
    private resizeService: ResizeService,
    private el: ElementRef,
    private welcomepageoptionslistService : WelcomepageoptionslistService,
    private renderer: Renderer2
  ) {
      if(localStorage.getItem('lang')){
        const lang:any=localStorage.getItem('lang')
        this.translate.use(lang);
      }else{
        this.translate.use('English');
      }   
     }

  ngOnInit(): void {
    const element = this.el.nativeElement;
    this.renderer.setProperty(element, 'scrollTop', 0);
    this.renderer.setStyle(element, 'scrollTop', '0');
      this.calculateTimeDifference();
    this.resizeService.size$.subscribe((screen: any) => {
      if (screen) {
        this.screensize = screen.size;
      }
    });
    this.getManagementPoints();
  }

  getManagementPoints() {
    this.managementPoints = this.welcomepageoptionslistService.getManagementPoints();
    console.log("getttttt", this.managementPoints)
    this.managementPoints.forEach((res:any) => {
      if (res.category == "Management") {
        this.management.push(res.point)
      }
      else if (res.category == "Planning") {
        this.planning.push(res.point)
      } else if (res.category == "Discussion") {
        this.map.push(res.point)
      } else if (res.category == "Management1") {
        this.reporting.push(res.point)
      } else if (res.category =="Planning1") {
        this.settings.push(res.point)
      }
    });
  }

  calculateTimeDifference() {
    const storedDate:any = localStorage.getItem('CookiesDate');
    console.log(storedDate);
    const date1 = new Date(storedDate); // First date and time
    const date2 = new Date(); // Second date and time
    console.log(date1);
    console.log(date2);
    const timeDifference = date2.getTime() - date1.getTime();
    const hoursDifference = Math.floor(timeDifference / (1000 * 60 * 60));
    if (hoursDifference > 24) {
      this.ShowCookiesPopup();
      console.log(hoursDifference);
      this.matoService.trackPageView('Welcome-page');
    } else {
      this.matoService.trackPageView('Welcome-page');
      console.log(hoursDifference);
    }
  }

  locationchange(value: string) {
    if (value == 'Management') {
      this.router.navigate(['/home/dash/Management']);
    } else if (value == 'Planning') {
      this.router.navigate(['/home/dash/Planning']);
    } else if (value == 'Map') {
      this.router.navigate(['/home/dash/Map']);
    } else if (value == 'Reporting') {
      this.router.navigate(['/home/dash/Reporting']);
    } else if (value == 'Settings') {
      this.router.navigate(['/home/dash/Settings']);
    } else if (value == 'Fichiers&notes') {
      this.router.navigate(['/home/dash/FichiersNotes']);
    } else if (value == 'LiveDemo') {
      this.router.navigate(['/home/dash/login']);
      localStorage.setItem('DemoOrganation', 'true');
    }else if(value == 'TestIt'){
      localStorage.setItem("DemoOrganation", 'false');
      this.router.navigate(['/app/login'],{ queryParams: { IsTrail :'true'} });
      
    }
  }

  ShowCookiesPopup() {
    const Cookies=this.dialog.open(CookiesComponent, {
      width: '100%',
      position: { bottom: '0' },
      disableClose: true,
    });
    Cookies.afterClosed().subscribe(result => {
      this.matoService.trackPageView('Welcome-page');
    });
  }
}
