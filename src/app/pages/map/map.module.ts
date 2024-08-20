import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgmCoreModule, GoogleMapsAPIWrapper } from '@agm/core';
import { MatGoogleMapsAutocompleteModule } from '@angular-material-extensions/google-maps-autocomplete';
import { AgmJsMarkerClustererModule, ClusterManager } from '@agm/js-marker-clusterer';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { CalendarHeaderModule } from '../../core/components/calendar-header/calendar-header.module';
import { EventListsModule } from '../../core/components/event-lists/event-lists.module';
import { environment } from './../../../environments/environment';
import { EventListPopUpDialog, MapPageComponent } from './map.page';
import { HttpClientModule } from '@angular/common/http';
import { GooglePlaceModule } from "ngx-google-places-autocomplete";
import { ManageUsersComponent } from '../management/manage-users/manage-users.component';
import { MatChip, MatChipsModule } from '@angular/material/chips';
import { ClusterTableComponent } from './cluster-table/cluster-table.component';
const routes: Routes = [
  {
    path: '',
    component: MapPageComponent
  }
];

@NgModule({
  imports: [
    // LayoutModule,
    CommonModule,
    SharedModule,
    EventListsModule,
    CalendarHeaderModule,
    HttpClientModule,
    MatChipsModule,
    AgmCoreModule.forRoot({
      apiKey: environment.google_api_Key
    }),
    MatGoogleMapsAutocompleteModule,
    AgmJsMarkerClustererModule,
    GooglePlaceModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    MapPageComponent,
    EventListPopUpDialog,
    ClusterTableComponent,

  ],
  providers: [ClusterManager, GoogleMapsAPIWrapper, ManageUsersComponent, MatChip]

})
export class MapPageModule { }
