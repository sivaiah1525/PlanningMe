import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { AuthService } from 'src/app/core/services/auth.service';
import { CreateUserComponent } from '../management/manage-create/create-user/create-user.component';
import { CreateContactComponent } from '../management/manage-create/create-contact/create-contact.component';
import { CreateSiteComponent } from '../management/manage-create/create-site/create-site.component';
import { CreateProductComponent } from '../management/manage-create/create-product/create-product.component';
import { CreateTransactionComponent } from '../management/manage-create/create-transaction/create-transaction.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ManageUsersService } from 'src/app/core/services/manage-users.service';
import { MessageService } from 'src/app/core/services/message.service';
import { ManageSitesService } from 'src/app/core/services/manage-sites.service';
import { ManageContactsService } from 'src/app/core/services/manage-contacts.service';
import { ManageProductsService } from 'src/app/core/services/manage-products.service';
import { ManageTransactionsService } from 'src/app/core/services/manage-transactions.service';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { GooglePlaceDirective } from 'ngx-google-places-autocomplete';
import {MatMenuModule} from '@angular/material/menu';
import { LoginComponent } from '../auth/login/login.component';
import { SignupComponent } from '../auth/signup/signup.component';
import {TranslateModule, TranslateLoader, TranslateService} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';
import { NavbarFooterModule } from '../navbar-footer/navbar-footer.module';
import { TopNavbarModule } from '../top-navbar/top-navbar.module';
// AoT requires an exported function for factories
export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient);
}
const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  }, 
  {
    path: 'home',
    component: DashboardComponent,
    children: [
      {
        path: 'management',
        loadChildren: () => import('../management/management.module').then(m => m.ManagementModule)
      },
      {
        path: 'calendar',
        loadChildren: () => import('../calendar/calendar.module').then(m => m.CalendarPageModule)
      },
      {
        path: 'carte',
        loadChildren: () => import('../map/map.module').then(m => m.MapPageModule),
        // canActivate: [AuthGuard]
      },
      {
        path: 'graph',
        loadChildren: () => import('../graph/page-graph/graph.module').then(m => m.GraphPageModule),
        // canActivate: [AuthGuard]
      },
      {
        path: 'settings',
        loadChildren: () => import('../settings/settings.module').then(m => m.SettingsModule)
      },
      {
        path: 'files',
        loadChildren: () => import('../files/files.module').then(m => m.FilesModule)
      }
    ]
  },
  { path: 'login', component: LoginComponent},
  { path: 'singup',component: SignupComponent},

]

@NgModule({
  declarations: [
    DashboardComponent,
    CreateUserComponent,
    CreateContactComponent,
    CreateSiteComponent,
    CreateProductComponent,
    CreateTransactionComponent,
    SignupComponent,
    LoginComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    MatSlideToggleModule,
    MatMenuModule,
    TopNavbarModule,
    NavbarFooterModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    RouterModule.forChild(routes),
  ],
  providers: [
    AuthService,
    MessageService,
    ManageUsersService,
    ManageContactsService,
    ManageSitesService,
    ManageProductsService,
    ManageTransactionsService,
    GooglePlaceDirective,
    TranslateService,
    ManageUsersService
  ],
})
export class DashboardModule { }
