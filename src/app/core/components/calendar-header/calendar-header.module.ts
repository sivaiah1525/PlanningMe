import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CalendarDateFormatter, CalendarEventTitleFormatter, CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { CustomDateFormatter } from '../../services/custom-date-formatter';
import { CustomEventTitleFormatter } from '../../services/custom-event-title-formatter';
import { CalendarMoreModule } from './../calendar-more/calendar-more.module';
import { CalendarHeaderComponent } from './calendar-header.component';
import { SharedModule } from '../../../shared/shared.module';
import { TranslateService } from '@ngx-translate/core';
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';
// AoT requires an exported function for factories
export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient);
}
@NgModule({
  declarations: [
    CalendarHeaderComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    CalendarMoreModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }), 
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    }),
  ],
  exports: [
    CalendarHeaderComponent
  ],
  providers: [
    { provide: CalendarDateFormatter, useClass: CustomDateFormatter },
   //{ provide: CalendarEventTitleFormatter, useClass: CustomEventTitleFormatter },
   TranslateService
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ]
})
export class CalendarHeaderModule { }
