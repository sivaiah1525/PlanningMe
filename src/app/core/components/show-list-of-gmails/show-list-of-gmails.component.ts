import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { GoogleApiService } from 'src/app/core/services/SYNC/google-api.service';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-show-list-of-gmails',
  templateUrl: './show-list-of-gmails.component.html',
  styleUrls: ['./show-list-of-gmails.component.scss']
})
export class ShowListOfGmailsComponent implements OnInit {
  listofemails=[]
  color = 'primary';
  mode = 'indeterminate';
  value = 50;
  loader = false
  ActionName = ''
  form: FormGroup;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private matDialogRef: MatDialogRef<ShowListOfGmailsComponent>,
    private google: GoogleApiService,
    private formBuilder: FormBuilder,
  ) {
    this.form = this.formBuilder.group({
      subject: [''],
      contactEmail: [''],
      date: [''],
      StartDate: [''],
      EndDate: [''],
      mediaType:[],
      isContact: [false]
    })
  }

  ngOnInit(): void {
    console.log(this.data)
    this.ActionName = this.data.ActionName
    this.form.get('mediaType')?.setValue(this.data.ActionName)
  }



  Applusubmit() {
    this.matDialogRef.close(this.form.value)
    console.log("formmmvaluee", this.form.value)
  }
}
