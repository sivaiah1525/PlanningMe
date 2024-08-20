import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'pm-group-planning-modal',
  templateUrl: './group-planning-modal.component.html',
  styleUrls: ['./group-planning-modal.component.scss'],
})
export class GroupPlanningModalComponent implements OnInit {
  graphFilterForm!: FormGroup;
  constructor(
    private matDialogRef: MatDialogRef<GroupPlanningModalComponent>,
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

  ngOnInit() { }

  groupEvent() { }
  

}
