import { AfterViewInit, Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MatomoService } from 'src/app/core/services/matomo-service.service';
import { NgZone } from '@angular/core';
import { VideoComponent } from 'src/app/core/components/video/video.component';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-fichiers-notes',
  templateUrl: './fichiers-notes.component.html',
  styleUrls: ['./fichiers-notes.component.css']
})
export class FichiersNotesComponent  implements OnInit {

  constructor(
    private router: Router,
    private matoService: MatomoService,
    private translate: TranslateService,
    private zone: NgZone,
    private dialog: MatDialog,
    private el: ElementRef,
    private renderer: Renderer2

  ){
    if(localStorage.getItem('lang')){
      const lang:any=localStorage.getItem('lang')
      this.translate.use(lang);
    }else{
      this.translate.use('English');
    }    const element = this.el.nativeElement;
    this.renderer.setProperty(element, 'scrollTop', 0);
  }


  ngOnInit(): void {
    this.matoService.trackPageView('FichiersNotes-page');
  }


  Videoplay(url:string) {
    this.dialog.open(VideoComponent, {
     width: '840px',
     height:'480px',
     data: {url:url},
   });
 }

}
