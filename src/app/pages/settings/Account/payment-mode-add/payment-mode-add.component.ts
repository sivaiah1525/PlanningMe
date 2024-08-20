import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormControl,FormGroup, Validators, FormArray } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ManageUsersService } from 'src/app/core/services/manage-users.service';

@Component({
  selector: 'app-payment-mode-add',
  templateUrl: './payment-mode-add.component.html',
  styleUrls: ['./payment-mode-add.component.scss']
})
export class PaymentModeAddComponent implements OnInit {
  AccountDetailsForm:FormGroup;
  constructor(
    private formBuilder: FormBuilder,

  ) {
    this.AccountDetailsForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: [''],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      dropdownname: [''],
      keyword: [''],
    });
   }

  ngOnInit(): void {
  }

}
