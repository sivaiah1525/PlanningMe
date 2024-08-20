import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AccountDetailsEditComponent } from '../account-details-edit/account-details-edit.component';

@Component({
  selector: 'app-account-details',
  templateUrl: './account-details.component.html',
  styleUrls: ['./account-details.component.scss']
})
export class AccountDetailsComponent implements OnInit {
  AccountDetails = [{ name: 'siva', No: '-098987646738920' }, { name: 'Arun', No: '34567646738920' }, { name: 'Krieshna', No: '87657646738920' }, { name: 'sarath', No: '23456646738920' }]
  constructor(
    private dialog: MatDialog,

  ) { }

  ngOnInit(): void {
  }


  UpdateAccount(x:any) {
    this.dialog.closeAll()
    this.dialog.open(AccountDetailsEditComponent, {
      width: '500px',
      data: { x }
    })
  }

}
