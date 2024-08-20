import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MatomoService } from 'src/app/core/services/matomo-service.service';

@Component({
  selector: 'app-select-price',
  templateUrl: './select-price.component.html',
  styleUrls: ['./select-price.component.css'],
})
export class SelectPriceComponent implements OnInit {
  Monthlyplan: boolean = true;
  languagefr:any;
  popup1 = true;
  popup2 = true;
  sliderValue: number = 1;
  minRange: number = 1;
  maxRange: number = 50;
  // amount: number = 330;
  // amount1: number = 300;
  amount: number =this.sliderValue* 65;
  amount1: number = this.sliderValue*50;

  constructor(
    private matoService: MatomoService,
    private router: Router,
    private translate: TranslateService
  ) {
    if(localStorage.getItem('lang')){
      const lang:any=localStorage.getItem('lang')
      this.translate.use(lang);
    }else{
      this.translate.use('English');
    } 
    this.matoService.trackPageView('Pricing-page');
  }
  ngOnInit(): void {}

  calculateAmount(value: number) {
    console.log(value)
    if(this.Monthlyplan == true){
      this.amount = 65 + ((value - 1) * 65); 
      console.log("amountttt", this.amount)
    }else{
      this.amount1 = 50 + ((value - 1) * 50); 
    }
  }


  getUserscount(value:any){
    if(value==1||value==0){
      return 'Per'
    }else{
      return value
    }
  }
  updateValue(value:any) {
    console.log(value)
    if(this.Monthlyplan==true){
      this.amount = value * 65
    }else{
      this.amount1 = value * 50
    }
  }

  // updateValue(value) {
  //   console.log(value)
  //   if(this.Monthlyplan==true){
  //     this.amount = ((value * 65) + ((value - 1) * 65)); 
  //   }else{
  //     this.amount1 = ((value * 50) + ((value - 1) * 50)); 
  //   }
  // }
  gotosingup() {
    this.router.navigate(['/app/singup']);
  }

  selectplan() {
    this.Monthlyplan = !this.Monthlyplan;
  }

  closepopup(value:any) {
    if (value === '1') {
      this.popup1 = false;
    } else if (value === '2') {
      this.popup2 = false;
    }
  }

  whitebookopen() {
    window.open('../../../../../assets/Doc/WhiteBook.pdf', '_blank');
  }
}
