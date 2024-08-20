import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input'; 
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRippleModule, MatNativeDateModule } from '@angular/material/core';
import { MatRadioModule } from '@angular/material/radio';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from '../core/interceptors/token.interceptor';
import { I1 } from '../core/interceptors/interceptors';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatStepperModule } from '@angular/material/stepper';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SpinnerService } from '../core/services/spinner.service';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { MatSelectFilterModule } from 'mat-select-filter';
import { MatBadgeModule } from '@angular/material/badge';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { DragDropModule } from '@angular/cdk/drag-drop';
import {MatSliderModule} from '@angular/material/slider';

const MATERIAL_MODULES = [
  MatCardModule,
  MatInputModule,
  MatIconModule,
  MatCheckboxModule,
  MatButtonModule,
  MatTabsModule,
  MatToolbarModule,
  MatSidenavModule,
  MatListModule,
  MatTooltipModule,
  MatExpansionModule,
  MatTableModule,
  MatPaginatorModule,
  MatMenuModule,
  MatButtonToggleModule,
  MatDialogModule,
  MatSelectModule,
  MatChipsModule,
  MatSnackBarModule,
  MatProgressBarModule,
  MatRippleModule,
  MatRadioModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatStepperModule,
  MatProgressSpinnerModule,
  MatAutocompleteModule,
  MatSlideToggleModule,
  MatStepperModule
  // MatSliderModule,
]

@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    MATERIAL_MODULES,
    GooglePlaceModule
  ],
  exports: [
    MATERIAL_MODULES,
    HttpClientModule,
    GooglePlaceModule,
    MatSelectFilterModule,
    MatChipsModule,
    MatBadgeModule,
    MatTabsModule,
    DragDropModule,
    MatSliderModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },

    {
      provide: HTTP_INTERCEPTORS,
      useClass: I1,
      multi: true
    },
    SpinnerService
  ]
})
export class SharedModule { }
