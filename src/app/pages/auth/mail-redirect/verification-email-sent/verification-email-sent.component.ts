import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-verification-email-sent',
  templateUrl: './verification-email-sent.component.html',
  styleUrls: ['./verification-email-sent.component.scss']
})
export class VerificationEmailSentComponent implements OnInit {

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
