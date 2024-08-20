import { EventListsComponent } from './event-lists.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/shared.module';
import { MatDialog, MatDialogRef, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EditEventComponent } from './edit-event/edit-event.component'
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { EventPopUpDialog } from './event-lists.component'
import { EventProposalComponent } from './event-proposal-calender/event.proposal.component'

import { CalendarHeaderModule } from '../../../core/components/calendar-header/calendar-header.module';
import { CalendarModule } from 'angular-calendar';
import { EditProposalComponent } from './edit-proposal/edit-proposal.component';
import { ColorPickerModule } from 'ngx-color-picker';
import {TranslateModule, TranslateLoader, TranslatePipe, TranslateService} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';
// AoT requires an exported function for factories
export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient);
}

@NgModule({
  declarations: [
    EventListsComponent,
    EditEventComponent,
    EventPopUpDialog,
    EventProposalComponent,
    EditProposalComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    CalendarHeaderModule,
    CalendarModule,
    ColorPickerModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
  ],
  exports: [
    EventListsComponent
  ],
  providers: [
    { provide: MatDialogRef, useValue: {} },
    { provide: MAT_DIALOG_DATA, useValue: [] },
    TranslateService
  ]
})
export class EventListsModule { }
