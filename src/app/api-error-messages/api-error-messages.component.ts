import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { PaymentCardDetailsComponent } from '../core/components/payment-card-details/payment-card-details.component';
import { CreditcardService } from '../core/services/creditcard.service';
import { MessageService } from '../core/services/message.service';

@Component({
  selector: 'app-api-error-messages',
  templateUrl: './api-error-messages.component.html',
  styleUrls: ['./api-error-messages.component.scss']
})
export class ApiErrorMessagesComponent implements OnInit {
  message!: string;
  header!: string;
  trailUsers:boolean=false;
  DemoOrganationstatus:boolean=false
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private MatDialogRefDelet: MatDialogRef<ApiErrorMessagesComponent>,
    private dialog: MatDialog,
    private messageService: MessageService,
    private creditcardService: CreditcardService,
  ) { 

    this.trailUsers=localStorage.getItem('isTrailVersion')=='true'?true:false
    this.DemoOrganationstatus=localStorage.getItem('DemoOrganation')=='true'?true:false
  }

  ngOnInit(): void {
    this.message = this.data.message
    this.header = this.data.header
  }


  clearpopup(){
    this.MatDialogRefDelet.close(true)
   }




   paymentCardPopup() {
    const gettokendetails=this.dialog.open(PaymentCardDetailsComponent, {
      width: '400px'
    })
    gettokendetails.afterClosed().subscribe((result: any) => {
      if (result) {
        console.log(result)
        this.creditcardService.CreateCardDetails({ 'token': result.id, 'cardId': result.card.id, 'isActive': true, }).subscribe((data:any) => {
          if (data['response'][0].message === 'Credit card created successfully') {
            this.messageService.showMessage(data['response'][0].message);
            this.dialog.closeAll();
          } else {
            this.messageService.showMessage("Credit card creation failed");
          }
        });
      }
    })
  }

}
