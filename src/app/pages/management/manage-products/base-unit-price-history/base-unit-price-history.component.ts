import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { ManageProductsService } from 'src/app/core/services/manage-products.service';

@Component({
  selector: 'app-base-unit-price-history',
  templateUrl: './base-unit-price-history.component.html',
  styleUrls: ['./base-unit-price-history.component.scss']
})
export class BaseUnitPriceHistoryComponent implements OnInit {
  size: any;
  color = 'primary';
  mode = 'indeterminate';
  value = 50;
  productDetails:any;
  productPriceDetails:any;
  DataLength!: number;
  Loadspinner: boolean = false
  priceType:any;
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
    this.productDetails = this.data.data
    this.priceType = this.data.type
    if (this.data.type == 'sellingPrice') {
      this.getProductPriceHistory(this.data.data.id, true, 10, 1)
    } else {
      this.getProductPriceHistory(this.data.data.id, false, 10, 1)
    }
  }

  priceFormat(value:any) {
    let ammount = value.toLocaleString("en-US", { style: "currency", currency: "USD", });
    let ammount1 = ammount.replace(/,/g, ' ')
    return ammount1.replace('$', ' ')
  }
  next(event:any) {
    if (this.data.type == 'sellingPrice') {
      this.getProductPriceHistory(this.data.data.id, true, 10, event + 1)
    } else {
      this.getProductPriceHistory(this.data.data.id, false, 10, event + 1)
    }
  }


  getProductPriceHistory(id:number, IsSellingPrice:any, NumberOfRecord:any, PageNumber:any) {
    this.Loadspinner = true
    this.manageproductsService.GetProductPriceHistory(id, IsSellingPrice, NumberOfRecord, PageNumber).subscribe((result: any) => {
      if (result) {
        this.Loadspinner = false
        this.DataLength = result.totalItems
        this.productPriceDetails = result.data
      }
      console.log(result)
    })
  }

}
