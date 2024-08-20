import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { PaymentCardDetailsComponent } from '../payment-card-details/payment-card-details.component';
import { MessageService } from '../../services/message.service';
import { CreditcardService } from '../../services/creditcard.service';

@Component({
  selector: 'app-show-banner-limit',
  templateUrl: './show-banner-limit.component.html',
  styleUrls: ['./show-banner-limit.component.scss']
})
export class ShowBannerLimitComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private MatDialogRefDelet: MatDialogRef<ShowBannerLimitComponent>,
    private dialog: MatDialog,
    private messageService: MessageService,
    private creditcardService: CreditcardService,
  ) { }

  ngOnInit(): void {
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
