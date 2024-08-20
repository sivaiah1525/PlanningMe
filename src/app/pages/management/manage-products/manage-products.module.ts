import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManageProductsComponent } from './manage-products.component';
import { CreateGroupComponent } from './create-group/create-group.component';
import { Routes, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { ManageProductsService } from 'src/app/core/services/manage-products.service';
import { EditProductGroupComponent } from './edit-product-group/edit-product-group.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { ExportDataManageAllComponent } from '../manage-products/export-data-manage-all/export-data-manage-all.component';
import { FilePageComponent } from '../../files/file-page/file-page.component';
import { GooglePlaceDirective } from 'ngx-google-places-autocomplete';
import { BaseUnitPriceHistoryComponent } from './base-unit-price-history/base-unit-price-history.component';
import { TranslateService } from '@ngx-translate/core';
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';
import { PriceMatrixComponent } from './price-matrix/price-matrix.component';
import { CreatePriceMatrixComponent } from './create-price-matrix/create-price-matrix.component';
// AoT requires an exported function for factories
export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient);
}

const routes: Routes = [
  {
    path: '',
    component: ManageProductsComponent
  }
];

@NgModule({
  declarations: [
    ManageProductsComponent,
    CreateGroupComponent,
    EditProductGroupComponent,
    ProductDetailsComponent,
    ExportDataManageAllComponent,
    BaseUnitPriceHistoryComponent,
    PriceMatrixComponent,
    CreatePriceMatrixComponent
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
    SharedModule
  ],
  providers: [
    ManageProductsService,
    FilePageComponent,
    GooglePlaceDirective
  ]
})
export class ManageProductsModule { }
