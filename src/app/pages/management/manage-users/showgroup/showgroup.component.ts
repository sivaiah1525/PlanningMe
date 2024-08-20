import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { ManageUsersService } from 'src/app/core/services/manage-users.service';

@Component({
  selector: 'app-showgroup',
  templateUrl: './showgroup.component.html',
  styleUrls: ['./showgroup.component.scss']
})
export class ShowgroupComponent implements OnInit {
  details: any;
  Entity: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private translate: TranslateService ,
  ) {
    if(localStorage.getItem('lang')){
      const lang:any=localStorage.getItem('lang')
      this.translate.use(lang);
    }else{
      this.translate.use('English');
    }
  }

  ngOnInit(): void {
    console.log(this.data)
    this.Entity = this.data.entity
    this.details = this.data.data
  }

}
