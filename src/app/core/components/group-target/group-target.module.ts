import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TargetComponent } from './target/target.component';
import { ViewTargetComponent } from './view-target/view-target';
import { AchievedAmountComponent } from './Achieved-Amount/achieved-amount.component';
import { TargetYearComponent } from './target-year/target-year.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { TargetCreateComponent } from './target-create/target-create.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AdvanceSearchInTargetComponent } from './advance-search-in-target/advance-search-in-target.component';
import {TranslateModule, TranslateLoader, TranslateService} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';
// AoT requires an exported function for factories
export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient);
}
@NgModule({
  declarations: [
    TargetComponent,
    AchievedAmountComponent,
    TargetYearComponent,
    TargetCreateComponent,
    AdvanceSearchInTargetComponent,
    ViewTargetComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
  ],
  providers: [
    TranslateService
  ],
})
export class GroupTargetModule { }
