import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-success-page-for-other-user',
  templateUrl: './success-page-for-other-user.component.html',
  styleUrls: ['./success-page-for-other-user.component.scss']
})
export class SuccessPageForOtherUserComponent implements OnInit {
  UserId=null
  constructor(
    private router: Router,
    private route: ActivatedRoute,
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
    this.route.queryParams.subscribe(params => {
      console.log(params)
      if(params?.['UserId']) {
        this.UserId=params?.['UserId']
      } 
    }); 
  }


  


  backtoOtherUserPassword(){
    if(this.UserId!=null){
      this.router.navigate(['/mail/SetPassword'],{ queryParams: { UserId:this.UserId} });
    }
  }

}
