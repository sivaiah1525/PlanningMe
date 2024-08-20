import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatSelectFilterModule } from 'mat-select-filter';
import { ProspectsearchComponent } from '../prospectsearch.component';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { AppDateAdapter, APP_DATE_FORMATS } from 'src/app/core/services/date.adapter';
// import {AppDateAdapter, APP_DATE_FORMATS} from '../../services/date.adapter';



@NgModule({
  declarations: [
    ProspectsearchComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    MatSelectFilterModule
  ],
  exports: [
    ProspectsearchComponent
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: "en-GB" },
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS },
  ],
})
export class ProspectsearchModule { }
