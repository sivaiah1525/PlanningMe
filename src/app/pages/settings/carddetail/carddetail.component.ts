import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { CreditcardService } from 'src/app/core/services/creditcard.service';
import { AfterViewInit, ChangeDetectorRef, ElementRef, Inject, OnDestroy, ViewChild } from '@angular/core';
import { environment } from 'src/environments/environment';
import { MessageService } from 'src/app/core/services/message.service';
declare var Stripe: any;
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { ThemePalette } from '@angular/material/core';
import { PaymentCardDetailsComponent } from 'src/app/core/components/payment-card-details/payment-card-details.component';
@Component({
  selector: 'app-carddetail',
  templateUrl: './carddetail.component.html',
  styleUrls: ['./carddetail.component.scss']
})
export class CarddetailComponent implements OnInit {
  creditDetails: any;
  userFormGroup: FormGroup| undefined;
  stripe: any;
  elements: any;
  message: any
  amount: number| undefined;
  credits: number| undefined;
  planId: number| undefined;
  paymentMode: number| undefined;
  clientSecret: any;
  datadelete: any;
  datadeleteindex: any;

  // color: ThemePalette = 'accent';
  checked = false;
  disabled = false;
  showcredit = 0;
  showBankinfo: number| undefined;

  BankAccount!: FormGroup;
  showRoutingNo: boolean = false;
  accountToken: any;
  bankToken: string| undefined;
  accountHolderName: string| undefined;
  accountHolderType: string| undefined;
  bankName: string| undefined;
  bankCountry: string| undefined;
  currency: string| undefined;
  last4: string| undefined;
  routingNumber: string | undefined;

  constructor(
    private creditcardService: CreditcardService,
    private dialog: MatDialog,
    private messageService: MessageService,
    private readonly fb: FormBuilder,
    private cd: ChangeDetectorRef
  ) { }



  ngOnInit(): void {
    this.getallcards();

    this.BankAccount = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      holderName: ['', Validators.required],
      accountNo: ['', Validators.required],
      routingNo: [''],
      accountType: ['', Validators.required],
      country: ['', Validators.required],
      currency: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  getallcards() {
    this.creditcardService.getallcards().subscribe((res) => {
      this.creditDetails = res;
    });
  }


  deletecard(templateRef: TemplateRef<any>, r:any, i:any) {
    console.log(r, 'r');
    this.dialog.open(templateRef, r);
    this.datadelete = r.id;
    this.datadeleteindex = i;
  }

  deletecarddetail() {
    this.creditcardService.deletecard(this.datadelete).subscribe((res:any) => {
      this.dialog.closeAll();
      this.messageService.showMessage(res['response'][0].message);
      this.creditDetails.splice(this.datadeleteindex, 1);
      this.getallcards();
    });
  }

  closedialogbox() {
    this.dialog.closeAll();
  }


  toggleChange($event: MatSlideToggleChange, id: any) {
    this.creditcardService.updateActiveCard(id, $event).subscribe((data:any) => {
      this.messageService.showMessage(data['response'][0].message);
      if (data) {
        this.getallcards();
      }
    })
  }


  createpayment() {
    this.paymentCardPopup()
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
          this.getallcards()
          this.messageService.showMessage(data['response'][0].message);
          this.dialog.closeAll();
        } else {
          this.messageService.showMessage("Credit card creation failed");
        }
      });
      }
    })
  } 




  showCreditCard() {
    this.showcredit = 0
  }

  showBank() {
    this.showcredit = 1
  }


  //secondcard begin here
  createBankAccount(templateRef: TemplateRef<any>) {
    this.dialog.open(templateRef);
  }


  onChanges(): void {
    this.BankAccount.get('country')?.valueChanges.subscribe((val:any) => {
      if (val == "US") {
        this.showRoutingNo = true;
      } else {
        this.showRoutingNo = false;
      }
    });
  }


  createbankAccount() {
    this.stripe = Stripe(environment.stripe_key);
    this.stripe.createToken('account', {
      individual: {
        first_name: this.BankAccount.get('firstName')?.value,
        last_name: this.BankAccount.get('lastName')?.value,
      },
      tos_shown_and_accepted: true,
    })
      .then((result1:any) => {
        this.accountToken = result1.token.id;
      });
    this.stripe.createToken('bank_account', {
      country: this.BankAccount.get('country')?.value,
      currency: this.BankAccount.get('currency')?.value,
      account_number: (this.BankAccount.get('accountNo')?.value).toString(),
      account_holder_name: this.BankAccount.get('holderName')?.value,
      account_holder_type: this.BankAccount.get('accountType')?.value,
    })
      .then((result:any) => {
        if (result.error) { }
        this.bankToken = result.token.id;
        this.accountHolderName = result.token.bank_account.account_holder_name;
        this.accountHolderType = result.token.bank_account.account_holder_type;
        this.bankName = result.token.bank_account.bank_name;
        this.bankCountry = result.token.bank_account.country;
        this.currency = result.token.bank_account.currency;
        this.last4 = result.token.bank_account.last4;
        this.routingNumber = result.token.bank_account.routing_number
        let reqdata = {
          accountToken: this.accountToken,
          bankToken: this.bankToken,
          accountHolderName: this.accountHolderName,
          accountHolderType: this.accountHolderType,
          bankName: this.bankName,
          bankCountry: this.bankCountry,
          currency: this.currency,
          last4: this.last4,
        };
        this.creditcardService.createBankAccount(reqdata).subscribe((data) => {
          console.log(data)
        })
      });
  }

}
