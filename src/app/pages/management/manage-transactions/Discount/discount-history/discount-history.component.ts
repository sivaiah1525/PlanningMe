import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { ManageProductsService } from 'src/app/core/services/manage-products.service';

@Component({
  selector: 'app-discount-history',
  templateUrl: './discount-history.component.html',
  styleUrls: ['./discount-history.component.scss']
})
export class DiscountHistoryComponent implements OnInit {
  discontDetails:any;
  disconthistoryDetails:any;
  size: any;
  color = 'primary';
  mode = 'indeterminate';
  value = 50;
  DataLength!: number;
  Loadspinner: boolean = false
  screenType = ''
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private manageproductsService: ManageProductsService,
    private translate: TranslateService ,
  ) {
    if(localStorage.getItem('lang')){
      const lang:any=localStorage.getItem('lang')
      this.translate.use(lang);
    }else{
      this.translate.use('English');
    }
  }

  ngOnInit(): void {
    this.screenType = this.data.screenType
    console.log(this.data)
    this.discontDetails = this.data.data
    if (this.data.screenType == 'DiscountHistory') {
      this.getDiscountMatrix(this.data.data.id, 10, 1)
    } else if (this.data.screenType == 'DiscountMatrix') {
      this.getDiscountHistory(this.data.data.id, 10, 1)

    }
  }

  next(event:any) {

    if (this.data.screenType == 'DiscountHistory') {
      this.getDiscountMatrix(this.data.data.id, 10, event + 1)

    } else if (this.data.screenType == 'DiscountMatrix') {
      this.getDiscountHistory(this.data.data.id, 10, event + 1)

    }
  }

  getDiscountHistory(id:any, NumberOfRecord:any, PageNumber:any) {
    this.Loadspinner = true
    this.manageproductsService.GetDiscountHistory(id, NumberOfRecord, PageNumber).subscribe((result: any) => {
      if (result) {
        this.Loadspinner = false
        this.DataLength = result.totalItems
        this.disconthistoryDetails = result.data
      }
      console.log(result)
    })
  }
  getDiscountMatrix(id:any, NumberOfRecord:any, PageNumber:any) {
    this.Loadspinner = true
    this.manageproductsService.GetDiscountMatrix(id, NumberOfRecord, PageNumber).subscribe((result: any) => {
      if (result) {
        this.Loadspinner = false
        this.DataLength = result.totalItems
        this.disconthistoryDetails = result.data
      }
      console.log(result)
    })
  }

}
