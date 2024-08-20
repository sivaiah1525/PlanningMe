import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ManageUsersComponent } from './manage-users.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { HttpClientModule } from '@angular/common/http';
import { ManageUsersService } from 'src/app/core/services/manage-users.service';
import { CreateGroupComponent } from './create-group/create-group.component';
import { EditUserGroupComponent } from './edit-user-group/edit-user-group.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { UserDetailsComponent } from './user-details/user-details.component';
import { SnackbarModule } from 'src/app/core/components/snackbar/snackbar.module';
import { GooglePlaceDirective, GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { ShowgroupComponent } from './showgroup/showgroup.component';
import { FilePageComponent } from '../../files/file-page/file-page.component';
import { MatBadgeModule } from '@angular/material/badge';
import { GroupSharingComponent } from './group-sharing/group-sharing.component';
import { TranslateService } from '@ngx-translate/core';
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';
import { ManageSitesModule } from '../manage-sites/manage-sites.module';
// AoT requires an exported function for factories
export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient);
}

const routes: Routes = [
  {
    path: '',
    component: ManageUsersComponent
  }
]

@NgModule({
  declarations: [
    ManageUsersComponent,
    CreateGroupComponent,
    UserDetailsComponent,
    EditUserGroupComponent,
    ShowgroupComponent,
    GroupSharingComponent,
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    RouterModule.forChild(routes),
    SharedModule,
    SnackbarModule,
    GooglePlaceModule,
    MatBadgeModule
  ],
  exports: [
    GooglePlaceModule
  ],
  providers: [
    ManageUsersService,
    ManageUsersComponent,
    FilePageComponent,
    GooglePlaceDirective
  ]
})
export class ManageUsersModule { }
