
import { NgModule } from '@angular/core';
import { GraphMoreComponent } from './graph-more.component';
import { SharedModule } from '../../../../shared/shared.module';
import { CommonModule } from '@angular/common';
import {TranslateModule, TranslateLoader, TranslateService} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';
import { MatMenuModule } from '@angular/material/menu';
// AoT requires an exported function for factories
export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient);
}
@NgModule({
  declarations: [GraphMoreComponent],
  imports: [
    CommonModule,
    SharedModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
  ],
  exports: [GraphMoreComponent]
})
export class GraphMoreModule { }
