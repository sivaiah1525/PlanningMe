import { CreateStrategyComponent } from './create-strategy.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/shared.module';
// import { ReactiveFormsModule } from '@angular/forms';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';
// AoT requires an exported function for factories
export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient);
}
//import { IonicModule } from '@ionic/angular';
//import { SegmentTabsModule } from '../../../dashboard/create-resources/components/segment-tabs/segment-tabs.module';

@NgModule({
  declarations: [CreateStrategyComponent],
  imports: [
  SharedModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatSlideToggleModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
  ],
  exports: [CreateStrategyComponent,ReactiveFormsModule,MatSlideToggleModule]
})
export class CreateStrategyModule { }
