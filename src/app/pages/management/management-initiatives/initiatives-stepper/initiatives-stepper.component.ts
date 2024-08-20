import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-initiatives-stepper',
  templateUrl: './initiatives-stepper.component.html',
  styleUrls: ['./initiatives-stepper.component.scss']
})
export class InitiativesStepperComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<InitiativesStepperComponent>,

  ) { }

  ngOnInit(): void {
  }


  onSubmit(value:any){
    this.dialogRef.close(value)
   }

}
