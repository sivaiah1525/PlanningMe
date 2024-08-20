import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateGroupComponent } from './create-group/create-group.component';
import { Routes, RouterModule } from '@angular/router';
import { ManageContactsComponent } from './manage-contacts.component';
import { ManageContactsService } from '../../../core/services/manage-contacts.service';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { GroupTargetModule } from 'src/app/core/components/group-target/group-target.module';
import { EditContactGroupComponent } from './edit-contact-group/edit-contact-group.component';
import { DynamicGroupComponent } from './dynamic-group/dynamic-group.component';
import { DynamicGroupComponentEditComponent } from './dynamic-group-component-edit/dynamic-group-component-edit.component';
import { ContactDetailsComponent } from './contact-details/contact-details.component';
import { FilePageComponent } from '../../files/file-page/file-page.component';
import { MatBadgeModule } from '@angular/material/badge';
import { GooglePlaceDirective } from 'ngx-google-places-autocomplete';
import { TranslateService } from '@ngx-translate/core';
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';
// AoT requires an exported function for factories
export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient);
}
const routes: Routes = [
  {
    path: '',
    component: ManageContactsComponent
  }
];

@NgModule({
  declarations: [
    CreateGroupComponent,
    ManageContactsComponent,
    ContactDetailsComponent,
    EditContactGroupComponent,
    DynamicGroupComponent,
    DynamicGroupComponentEditComponent,
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
    SharedModule,
    MatBadgeModule
  ],
  providers: [
    ManageContactsService,
    ContactDetailsComponent,
    FilePageComponent,
    GooglePlaceDirective
  ]
})
export class ManageContactsModule { }
