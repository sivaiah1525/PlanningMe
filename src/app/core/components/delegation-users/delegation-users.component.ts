import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'pm-delegation-users',
  templateUrl: './delegation-users.component.html',
  styleUrls: ['./delegation-users.component.scss'],
})
export class DelegationUsersComponent implements OnInit {
  data: any;

  constructor(
    private matDialogRef: MatDialogRef<DelegationUsersComponent>, 
    private formBuilder: FormBuilder,
    private translate: TranslateService ,
  ) {
    if(localStorage.getItem('lang')){
      const lang:any=localStorage.getItem('lang')
      this.translate.use(lang);
    }else{
      this.translate.use('English');
    }   
   }

  ngOnInit() {
    //this.data = this.navParams.get('data');
    console.log(this.data);
  }

  dismiss() {
    this.matDialogRef.close();
  }
}
