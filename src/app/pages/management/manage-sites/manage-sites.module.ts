import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManageSitesComponent } from './manage-sites.component';
import { CreateGroupComponent } from './create-group/create-group.component';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { ManageSitesService } from 'src/app/core/services/manage-sites.service';
import { GroupTargetModule } from 'src/app/core/components/group-target/group-target.module';
import { EditSiteGroupComponent } from './edit-site-group/edit-site-group.component';
import { SiteDetailsComponent } from './site-details/site-details.component';
import { FilePageComponent } from '../../files/file-page/file-page.component';
import { GooglePlaceDirective } from 'ngx-google-places-autocomplete';
import { SingleToGroupConvertComponent } from './single-to-group-convert/single-to-group-convert.component';
import { TranslateService } from '@ngx-translate/core';
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';
import { ManageUsersModule } from '../manage-users/manage-users.module';
import { ManageUsersComponent } from '../manage-users/manage-users.component';
// AoT requires an exported function for factories
export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient);
}
const routes: Routes = [
  {
    path: '',
    component: ManageSitesComponent
  }
];

@NgModule({
  declarations: [
    ManageSitesComponent,
    CreateGroupComponent,
    EditSiteGroupComponent,
    SiteDetailsComponent,
    SingleToGroupConvertComponent,
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
    GroupTargetModule,
    SharedModule
  ],
  providers: [
    ManageSitesService,
    FilePageComponent,
    GooglePlaceDirective,
    ManageUsersComponent
  ]
})
export class ManageSitesModule { }
