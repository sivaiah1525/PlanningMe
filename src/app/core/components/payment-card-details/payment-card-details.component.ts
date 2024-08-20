import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
declare var Stripe: any;
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-payment-card-details',
  templateUrl: './payment-card-details.component.html',
  styleUrls: ['./payment-card-details.component.scss']
})
export class PaymentCardDetailsComponent implements OnInit  {

  @ViewChild('cardNumInfo')
  public cardNumInfo!: ElementRef;

  @ViewChild('cardNumError')
  public cardNumError!: ElementRef;
  cardNo: any;

  @ViewChild('cardExInfo')
  public cardExInfo!: ElementRef;
  @ViewChild('cardExError')
  public cardExError!: ElementRef;
  cardEx: any;

  @ViewChild('cardCvcInfo')
  public cardCvcInfo!: ElementRef;
  @ViewChild('cardNumError')
  public cardCvcError!: ElementRef; 
  cardCvc: any;


  stripe: any;
  elements: any;
  message: any
  constructor(
    private matDialogRef: MatDialogRef<PaymentCardDetailsComponent>,
  ) { }

  ngOnInit(): void {
    this.initiateCardElement();
  }
 

  initiateCardElement() {
    setTimeout(() => {
      this.stripe = Stripe(environment.stripe_key);
      this.elements = this.stripe.elements();
      let style = { base: { color: '#32325d' } };
      this.cardNo = this.elements.create('cardNumber', { style: style });
      this.cardNo.mount(this.cardNumInfo.nativeElement);
      this.cardNo.addEventListener('change', ({ error }:any) => {
        const displayErrorNo = this.cardNumError.nativeElement;
        if (error) {
          displayErrorNo.textContent = error.message;
        } else {
          displayErrorNo.textContent = '';
        }
      });
      this.cardEx = this.elements.create('cardExpiry', { style: style });
      this.cardEx.mount(this.cardExInfo.nativeElement);
      this.cardEx.addEventListener('change', ({ error }:any) => {
        const displayErrorEx = this.cardExError.nativeElement;
        if (error) {
          displayErrorEx.textContent = error.message;
        } else {
          displayErrorEx.textContent = '';
        }
      });
      this.cardCvc = this.elements.create('cardCvc', { style: style });
      this.cardCvc.mount(this.cardCvcInfo.nativeElement);
      this.cardCvc.addEventListener('change', ({ error }:any) => {
        const displayErrorCvc = this.cardCvcError.nativeElement;
        if (error) {
          displayErrorCvc.textContent = error.message;
        } else {
          displayErrorCvc.textContent = '';
        }
      });

    },100);
  }




  closedialogbox() {
    this.matDialogRef.close();
  }





  async getcardtokendetails() {
    const { token, error } =  await this.stripe.createToken(this.cardNo).then();
    if (error) {
      const displayError = this.cardNumError.nativeElement;
      displayError.textContent = error.message;
    } else {
      this.gettoken(token)
      let token_str:any, card_str:any;
      for (let [key, value] of Object.entries(token)) {
        if ('id' === key) {
          token_str = value;
        } else if ('card' === key) {
          // for (let [key, value1] of Object.entries(value)) {
          //   if ('id' === key) {
          //     card_str = value1;
          //   }
          // }
        }
      }
    }
  }


  gettoken(token:any){
    if(token){
   this.matDialogRef.close(token)
    }
  }


}
