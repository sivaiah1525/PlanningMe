import { Component, Inject, OnInit } from '@angular/core';
import { ChooseTaskOptionComponent } from '../create-initiatives/choose-task-option/choose-task-option.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-conformation',
  templateUrl: './conformation.component.html',
  styleUrls: ['./conformation.component.scss']
})
export class ConformationComponent implements OnInit {
screentype=''
form: FormGroup;
todaydate = new Date();
deleteType='1'
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<ChooseTaskOptionComponent>,
  ) {

    this.form = this.formBuilder.group({
      StartDate: [this.todaydate, [Validators.required]],
      EndDate: ['', [Validators.required]],
    })
   }

  ngOnInit(): void {
    this.screentype=this.data.type
  }

  onRadioChange(event:any){
    console.log(event)
    this.deleteType=event.value
  }


  onSubmit(value:any){
   this.dialogRef.close(value)
  }

  onSubmit1(){
    this.dialogRef.close(this.form.value)
   }
   onSubmit2(){
    this.dialogRef.close(this.deleteType)
   }

}
