import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-mail-conformation-failed',
  templateUrl: './mail-conformation-failed.component.html',
  styleUrls: ['./mail-conformation-failed.component.scss']
})
export class MailConformationFailedComponent implements OnInit {

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
