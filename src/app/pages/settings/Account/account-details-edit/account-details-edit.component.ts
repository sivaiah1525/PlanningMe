import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormControl,FormGroup, Validators, FormArray } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ManageUsersService } from 'src/app/core/services/manage-users.service';
@Component({
  selector: 'app-account-details-edit',
  templateUrl: './account-details-edit.component.html',
  styleUrls: ['./account-details-edit.component.scss']
})
export class AccountDetailsEditComponent implements OnInit {

  AccountDetailsForm:FormGroup;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,

  ) {
    this.AccountDetailsForm = this.formBuilder.group({
      name: [''],
      AccountNumber: [''],
    });
   }

  ngOnInit(): void {
    this.AccountDetailsForm.get('name')?.setValue(this.data.x.name)
    this.AccountDetailsForm.get('AccountNumber')?.setValue(this.data.x.No)
  }
}
