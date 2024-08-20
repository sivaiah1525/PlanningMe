import { Component, EventEmitter, OnInit, Output, TemplateRef } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { CookiesPolicyComponent } from 'src/app/pages/PnmDashboard/components/cookies-policy/cookies-policy.component';

@Component({
  selector: 'app-cookies',
  templateUrl: './cookies.component.html',
  styleUrls: ['./cookies.component.scss']
})
export class CookiesComponent implements OnInit {
  @Output()
  viewChange: EventEmitter<string> = new EventEmitter<string>();
  constructor(
    private matDialogRef: MatDialogRef<CookiesComponent>,
    private translate: TranslateService,
    private dialog: MatDialog,
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

  cancel(){
    localStorage.setItem('Cookies','false')
    const dateString = new Date().toISOString();
    console.log(dateString)
     localStorage.setItem('CookiesDate', dateString);
    this.matDialogRef.close()
  }

  onSubmit(){
    localStorage.setItem('Cookies','true')
    const dateString = new Date().toISOString();
    console.log(dateString)
     localStorage.setItem('CookiesDate', dateString);
    this.matDialogRef.close()
  }


 



  Infobutton() {
    this.dialog.open(CookiesPolicyComponent, {
     width: '1000px',
     data: {},
     position: { top: '10px' },

   });
 }


}
