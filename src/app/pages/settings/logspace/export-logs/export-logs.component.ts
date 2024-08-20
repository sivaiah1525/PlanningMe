import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-export-logs',
  templateUrl: './export-logs.component.html',
  styleUrls: ['./export-logs.component.scss']
})
export class ExportLogsComponent implements OnInit {
  logForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private translate: TranslateService,
    ){
      if(localStorage.getItem('lang')){
        const lang:any=localStorage.getItem('lang')
        this.translate.use(lang);
      }else{
        this.translate.use('English');
      }      this.logForm = this.formBuilder.group({
      StartDate: [''],
      EndDate: [''],
      exportType: [''],


    });
  }

  ngOnInit(): void {
  }





  onSubmit(){

  }

}
