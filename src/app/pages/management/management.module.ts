import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ManagementComponent } from './management.component';
import { GooglePlaceModule } from "ngx-google-places-autocomplete";
import { ManageimportComponent } from './manageimport/manageimport.component';
import { ManageimportModule } from 'src/app/pages/management/manageimport/manageimport/manageimport.module'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectFilterModule } from 'mat-select-filter';
import { AdvanceSearchInManagementSingleComponent } from './advanceSearch/advance-search-in-management-single/advance-search-in-management-single.component';
import { AdvanceSearchInManagementGroupComponent } from './advanceSearch/advance-search-in-management-group/advance-search-in-management-group.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { TranslateService } from '@ngx-translate/core';
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { CreateMilestoneComponent } from './manage-tasks/create-milestone/create-milestone.component';
import { ManageCreateComponent } from './manage-tasks/manage-create/manage-create.component';
import { ActivitLogComponent } from './activit-log/activit-log.component';


// AoT requires an exported function for factories
export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient);
}
export const routes: Routes = [
  {
    path: '',
    redirectTo: 'm/users',
    pathMatch: 'full'
  },
  {
    path: 'm',
    component: ManagementComponent,
    children: [
      {
        path: 'users',
        loadChildren: () => import('../management/manage-users/manage-users.module').then(m => m.ManageUsersModule)
      },
      {
        path: 'contacts',
        loadChildren: () => import('../management/manage-contacts/manage-contacts.module').then(m => m.ManageContactsModule)
      },
      {
        path: 'sites',
        loadChildren: () => import('../management/manage-sites/manage-sites.module').then(m => m.ManageSitesModule)
      },
      {
        path: 'tasks',
        loadChildren: () => import('../management/manage-tasks/manage-tasks/manage-tasks.module').then(m => m.ManageTasksModule)
      },
      {
        path: 'Initiatives',
        loadChildren: () => import('../management/management-initiatives/management-Initiatives.module').then(m => m.ManageInitiativesModule)
      },
      {
        path: 'products',
        loadChildren: () => import('../management/manage-products/manage-products.module').then(m => m.ManageProductsModule)
      },
      {
        path: 'transactions',
        loadChildren: () => import('../management/manage-transactions/manage-transactions.module').then(m => m.ManageTransactionsModule)
      },
      {
        path: 'files',
        loadChildren: () => import('../files/files.module').then(m => m.FilesModule)
      }
    ]
  }
]

@NgModule({

  declarations: [
    ManagementComponent,
     AdvanceSearchInManagementSingleComponent,
      AdvanceSearchInManagementGroupComponent,
      CreateMilestoneComponent,
      ManageCreateComponent,
      ActivitLogComponent,
      
      ],
  entryComponents: [
    ManageimportComponent,
    MatDialogModule
  ],
  imports: [
    CommonModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }), 
    RouterModule.forChild(routes),
    GooglePlaceModule,
    ManageimportModule,
    ReactiveFormsModule,
    MatSelectFilterModule,
    SharedModule,
    FormsModule,
    MatSnackBarModule
  ],

  exports: [
    GooglePlaceModule
  ],
})
export class ManagementModule { }
