import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-cookies-policy',
  templateUrl: './cookies-policy.component.html',
  styleUrls: ['./cookies-policy.component.scss']
})
export class CookiesPolicyComponent implements OnInit {

  constructor(
    private router: Router, 
    private dialog: MatDialog,
    private translate: TranslateService,
    private matDialogRef: MatDialogRef<CookiesPolicyComponent>,

    ) {
      if(localStorage.getItem('lang')){
        const lang:any=localStorage.getItem('lang')
        this.translate.use(lang);
      }else{
        this.translate.use('English');
      }      this.router.events.subscribe((event) => {
        if (event instanceof NavigationEnd) {
          window.scrollTo(0, 0);
        }
      });
    }


   
  ngOnInit(): void {
  }

  popupcolse(){
      this.matDialogRef.close()
  }

  cancel(){
    localStorage.setItem('Cookies','false')
    this.matDialogRef.close()
  }

  onSubmit(){
    localStorage.setItem('Cookies','true')
    this.matDialogRef.close()
  }

 
  }
