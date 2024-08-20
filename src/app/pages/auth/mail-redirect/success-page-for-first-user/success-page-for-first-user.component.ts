import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-success-page-for-first-user',
  templateUrl: './success-page-for-first-user.component.html',
  styleUrls: ['./success-page-for-first-user.component.scss']
})
export class SuccessPageForFirstUserComponent implements OnInit {

  constructor(
    private router: Router,
    private translate: TranslateService,
  ) {
    if(localStorage.getItem('lang')){
      const lang:any=localStorage.getItem('lang')
      this.translate.use(lang);
    }else{
      this.translate.use('English');
    }
   }

  ngOnInit(): void {
  }




  backtologin(){
    localStorage.setItem("DemoOrganation", 'false');
      this.router.navigate(['/app/login'],{ queryParams: { IsTrail :'false'} });
  }

}
