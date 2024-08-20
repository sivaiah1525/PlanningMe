import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSelect } from '@angular/material/select';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { GlobalTranslationService } from 'src/app/core/services/global-translation.service';
import { ResizeService } from 'src/app/core/services/resize.service';

@Component({
  selector: 'pnm-top-navbar',
  templateUrl: './top-navbar.component.html',
  styleUrls: ['./top-navbar.component.scss']
})
export class TopNavbarComponent implements OnInit {
  @ViewChild('selectField') selectField!: MatSelect;

  size: any;
  width!: number;
  isMobileView!: boolean; 
  language:any;
   languages:any = [];
  languagesimage=''
  constructor(
    private router: Router,
    public dialog: MatDialog,
    private translate: TranslateService,
    private resizeService: ResizeService,
    private globaltranslate: GlobalTranslationService,
  ) {
    this.languages=this.globaltranslate.getAlllanguages()
    this.language=this.globaltranslate.setselectedlanguage()
    this.languagesimage=this.language.img
    if(localStorage.getItem('lang')){
      const lang:any=localStorage.getItem('lang')
      this.translate.use(lang);
    }else{
      this.translate.use('English');
    }
  }

  openSelect() {
    this.selectField.open();
  }

  ngOnInit(): void {
    this.resizeService.size$.subscribe(
      user => {
        this.size = user.size;
        if (this.size < 992) {
          this.isMobileView = true;
        } else {
          this.isMobileView = false;
        }
      }
    );
    this.width = window.innerWidth;
    if (!this.size && this.width < 992) {
      this.isMobileView = true;
    } else if (!this.size && this.width > 992) {
      this.isMobileView = false;
    }
  }


  locationchange(value:string){

    if(value=='Features&Pricing'){
      this.router.navigate(['/home/dash/Pricing'])
    }
    else if(value=='UserGuide'){
      this.router.navigate(['/home/dash/UserGuide'])
    }
    else if(value=='WhiteBook'){
      this.router.navigate(['/home/dash/Whitebook'])

    }
    else if(value=='Releasenote'){
      window.open('http://planning-me-ui-demo.s3-website.eu-west-3.amazonaws.com','_blank');
    }
    else if(value=='SSO'){
      window.open('http://planning-me-ui-demo.s3-website.eu-west-3.amazonaws.com','_blank');
    }
    else if(value=='GuidedVisit'){
      localStorage.setItem("DemoOrganation", 'true');
      this.router.navigate(['/home/dash/login']);
    }
    else if(value=='Swagger'){
      this.router.navigate(['/home/dash/Swagger'])
    }
    else if(value=='login'){
      localStorage.setItem("DemoOrganation", 'false');
      this.router.navigate(['/app/login'],{ queryParams: { IsTrail :'false'} });
      
    } 
        else if(value=='Dashboard'){
      this.router.navigate(['/home/dash/Welcome-Page'])
    }
  }






  closedialogbox(){
    this.dialog.closeAll()
  }

  selectLanguage(value:any) {
    console.log(value)
    this.languagesimage=value.img
    this.language = this.languages.find((lang:any) => lang.value === value.label);
    localStorage.setItem('lang', this.language.value);
    window.location.reload();
  }


}
