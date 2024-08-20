import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserDetailsComponent } from '../../management/manage-users/user-details/user-details.component';
import { ManageUsersService } from 'src/app/core/services/manage-users.service';
import { ProfilePickFormatService } from 'src/app/core/services/profile-pick-format.service';
import { ManageTransactionsService } from 'src/app/core/services/manage-transactions.service';
import { TransactionDetailsComponent } from '../../management/manage-transactions/transaction-details/transaction-details.component';

@Component({
  selector: 'app-popup-for-all',
  templateUrl: './popup-for-all.component.html',
  styleUrls: ['./popup-for-all.component.scss']
})
export class PopupForAllComponent implements OnInit {
  color = 'primary';
  mode = 'indeterminate';
  value = 50;
  loader: boolean = false; // Variable to control overlay visibility
  type: any;
  option:any
  teamname=''
  list:any=[]
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private MatDialogRefDelet: MatDialogRef<PopupForAllComponent>,
    public snackBar: MatSnackBar,
    private dialog: MatDialog,
    private manageUsersService: ManageUsersService,
    private profilepickformat:ProfilePickFormatService,
    private ManageTransactions:ManageTransactionsService
  ) { }
  getuserFLnames(value:any){
    return this.profilepickformat.getuserFLnames(value)
  }
  getColor(index:any) {
    return this.profilepickformat.getColor(index)
  }
  ngOnInit(): void {
    console.log(this.data)
    this.type = this.data.type
    this.teamname=this.data.data['teamname']
    this.list=this.data.data
    console.log(this.list)
    console.log(this.data.data['teamname'])
    if(this.type=='transactionKeyword'||this.type=='orderKeyword'){
    this.gettransationdetails()
    }else if(this.type=='discountKeyword'){
      this.gettransationdetails()
    }else if(this.type=='groupKeyword'){
    this.gettransationdetails()
    }
   
  }

  gettransationdetails(){
    this.loader=true
this.ManageTransactions.fetchTransactions(this.data.data.ids.toString()).subscribe((result:any)=>{
  if(result){
    this.loader=false
    this.list=result.data
    console.log(result)
  }
},error=>{
  if(error){
    this.loader=false
  }
})
  }

    // user detail & user group detail
    openTransactionDialog(data:any): void {
      this.dialog.open(TransactionDetailsComponent, {
        disableClose: true,
        data: { data: data, type: 'transation' },
        width: '500px',
      });
    }
  

  getteamusers(data:any) {
    this.manageUsersService.FindUsersOFTeam(this.data.data['Initiativeid'],data.id).subscribe((result:any)=>{
      if(result.length!=0){
        console.log(result)
        result.teamname=data.teamName
        result.Initiativeid=this.data.data['Initiativeid']
        this.InitiativeTeam(result,'teamusers')
      }
    })
  }
    // openUserDialog
    InitiativeTeam(row:any, type: string) {
      this.dialog.open(PopupForAllComponent, {
        width: '500px',
        position: { top: '125px', left: '700px' },
        autoFocus: false,
        disableClose: true,
        data: { data: row, type: type },
      });
    }

  getoption(value:Number){
    this.option=value

  }

    // user detail & user group detail
    openUserDialog(id: number, row:any, type: string): void {
      this.dialog.open(UserDetailsComponent, {
        data: { data: row, type: type },
        disableClose: true,
        width: '500px',
      });
    }

  clearpopup(){
    this.MatDialogRefDelet.close(this.option)
  }


}
