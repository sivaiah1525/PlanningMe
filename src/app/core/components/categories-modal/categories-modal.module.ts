import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { CategoriesModalComponent } from './categories-modal.component';
import { DialogOverviewExampleDialog2 } from './categories-modal.component';
import { DialogOverviewExampleDialog3 } from './categories-modal.component';
import { ColorPickerModule } from 'ngx-color-picker';
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';
// AoT requires an exported function for factories
export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient);
}
@NgModule({
  declarations: [CategoriesModalComponent,
    DialogOverviewExampleDialog2, DialogOverviewExampleDialog3],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    ColorPickerModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
  ],
  exports: [CategoriesModalComponent],
})
export class CategoriesModalModule { }
