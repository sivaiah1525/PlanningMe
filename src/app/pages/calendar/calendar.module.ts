import { NgModule } from '@angular/core';
import { CommonModule, formatDate } from '@angular/common';
import { CalendarComponent } from './calendar.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { CreateEventComponent } from './create-event/create-event.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ManageUsersService } from 'src/app/core/services/manage-users.service';
import { ManageContactsService } from 'src/app/core/services/manage-contacts.service';
import { ManageSitesService } from 'src/app/core/services/manage-sites.service';
import { CalendarService } from 'src/app/core/services/calendar.service';
import { CalendarHeaderModule } from '../../core/components/calendar-header/calendar-header.module';
import { CalendarDateFormatter, CalendarModule, CalendarNativeDateFormatter, DateFormatterParams } from 'angular-calendar';
import { EventListsModule } from '../../core/components/event-lists/event-lists.module';
import { OpenDayEventsModalPageModule } from '../../core/components/open-day-events-modal/open-day-events-modal.module';
import { MatDialogRef, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelectFilterModule } from 'mat-select-filter';
import { CalendarPopUpDialog } from './calendar.component'
import { ColorPickerModule } from 'ngx-color-picker';
import { RichTextEditorAllModule } from '@syncfusion/ej2-angular-richtexteditor';
import { FilesModule } from '../files/files.module';
import { FilePageComponent } from '../files/file-page/file-page.component';
import { ManageUsersComponent } from '../management/manage-users/manage-users.component';
import { GooglePlaceDirective, GooglePlaceModule } from "ngx-google-places-autocomplete";
import { DatePipe } from '@angular/common';
import { PlanningSynchronisationComponent } from './planning-synchronisation/planning-synchronisation.component';
import {TranslateModule, TranslateLoader, TranslateService} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MatMenuModule } from '@angular/material/menu';
import { OtherPepoleComponent } from 'src/app/core/components/other-pepole/other-pepole.component';
// AoT requires an exported function for factories 
export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient);
}
const routes: Routes = [
  {
    path: '',
    component: CalendarComponent
  }
]


class CustomDateFormatter extends CalendarNativeDateFormatter {

  public weekViewHour({ date, locale }: DateFormatterParams): string {
    const formattedDate = formatDate(date, 'H:mm', 'en-US');
    return formattedDate
  }
  public dayViewHour({ date, locale }: DateFormatterParams): string {
    const formattedDate = formatDate(date, 'H:mm', 'en-US');
    return formattedDate
  }

}

@NgModule({
  declarations: [
    CalendarComponent,
    //CalendarOptionsComponent,
    CreateEventComponent,
    CalendarPopUpDialog,
    PlanningSynchronisationComponent,
    OtherPepoleComponent
  ],
  imports: [
    GooglePlaceModule,
    CommonModule,
    ReactiveFormsModule,
    ColorPickerModule,
    //FullCalendarModule,
    SharedModule,
    EventListsModule,
    CalendarHeaderModule,
    CalendarModule,
    MatSelectFilterModule,
    MatDialogModule,
    RichTextEditorAllModule,
    FormsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    RouterModule.forChild(routes)

  ],
  providers: [
    ManageUsersService,
    ManageContactsService,
    ManageSitesService,
    CalendarService,
    FilePageComponent,
    ManageUsersComponent,
    GooglePlaceDirective,
    { provide: CalendarDateFormatter, useClass: CustomDateFormatter },
    { provide: MatDialogRef, useValue: {} },
    { provide: MAT_DIALOG_DATA, useValue: [] },
  ]
})
export class CalendarPageModule { }
