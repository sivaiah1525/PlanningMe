import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-token-expiry-page',
  templateUrl: './token-expiry-page.component.html',
  styleUrls: ['./token-expiry-page.component.scss']
})
export class TokenExpiryPageComponent implements OnInit {

  constructor(
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

}
