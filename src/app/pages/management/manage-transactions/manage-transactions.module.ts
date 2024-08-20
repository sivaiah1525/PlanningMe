import { NgModule } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { ManageTransactionsComponent } from './manage-transactions.component';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { ManageTransactionsService } from 'src/app/core/services/manage-transactions.service';
import { TransactionDetailsComponent } from './transaction-details/transaction-details.component';
import { ViewdetailsComponent } from './orderQuotes/viewdetails/viewdetails.component';
import { AddOrderComponent } from './orderQuotes/add-order/add-order.component';
import { PdfViewComponent } from './orderQuotes/pdf-view/pdf-view.component';
import { FilePageComponent } from '../../files/file-page/file-page.component';
import { CreateDiscountComponent } from './Discount/create-discount/create-discount.component';
import { SelectDiscountComponent } from './Discount/select-discount/select-discount.component';
import { ViewDiscountDetailsComponent } from './Discount/view-discount-details/view-discount-details.component';
import { TransationEditComponent } from './transation-edit/transation-edit.component';
import { GooglePlaceDirective } from 'ngx-google-places-autocomplete';
import { DiscountHistoryComponent } from './Discount/discount-history/discount-history.component';
import { TranslateService } from '@ngx-translate/core';
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';
// AoT requires an exported function for factories
export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient);
}
const routes: Routes = [
  {
    path: '',
    component: ManageTransactionsComponent
  }
];

@NgModule({
  declarations: [
    ManageTransactionsComponent,
    TransactionDetailsComponent,
    ViewdetailsComponent,
    AddOrderComponent,
    PdfViewComponent,
    CreateDiscountComponent,
    SelectDiscountComponent,
    ViewDiscountDetailsComponent,
    TransationEditComponent,
    DiscountHistoryComponent,

  ],
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    RouterModule.forChild(routes),
    SharedModule,
  ],
  providers: [
    ManageTransactionsService, DecimalPipe, FilePageComponent, GooglePlaceDirective
  ]
})
export class ManageTransactionsModule { }
