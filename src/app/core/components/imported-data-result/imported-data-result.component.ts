import { Component, Inject, OnInit } from '@angular/core';
import { DialogData } from '../event-lists/event-lists.component';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-imported-data-result',
  templateUrl: './imported-data-result.component.html',
  styleUrls: ['./imported-data-result.component.scss']
})
export class ImportedDataResultComponent implements OnInit {
impordataResult:any
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
    console.log(this.data.data)
    if(this.data){
this.impordataResult=this.data.data
    }
  }

}
