import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import {ReactiveFormsModule,ɵInternalFormsSharedModule,} from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { AuthService } from 'src/app/core/services/auth.service';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { LoginComponent } from '../login/login.component';
import { TimeZoneComponent } from '../time-zone/time-zone.component';
import { PnmDashboardComponent } from '../../PnmDashboard/pnm-dashboard/pnm-dashboard.component';
import { SettingsComponent } from '../../PnmDashboard/components/settings/settings.component';
import { ReportingComponent } from '../../PnmDashboard/components/reporting/reporting.component';
import { PlanningComponent } from '../../PnmDashboard/components/planning/planning.component';
import { MapComponent } from '../../PnmDashboard/components/map/map.component';
import { ManagementComponent } from '../../PnmDashboard/components/management/management.component';
import { FichiersNotesComponent } from '../../PnmDashboard/components/fichiers-notes/fichiers-notes.component';
import { SelectPriceComponent } from '../../PnmDashboard/components/select-price/select-price.component';
import {TranslateModule,TranslateLoader,TranslateService,} from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { DemoLoginComponent } from '../demo-login/demo-login.component';
import { MatMenuModule } from '@angular/material/menu';
import { TopNavbarModule } from '../../top-navbar/top-navbar.module';
import { NavbarFooterModule } from '../../navbar-footer/navbar-footer.module';
import { MatIconModule } from '@angular/material/icon';
import { UserGuideComponent } from '../../PnmDashboard/components/user-guide/user-guide.component';
import { SwaggerDocComponent } from '../../PnmDashboard/components/swagger-doc/swagger-doc.component';
import { WhitebookDocComponent } from '../../PnmDashboard/components/whitebook-doc/whitebook-doc.component';
import { WelcomePageComponent } from '../../PnmDashboard/components/welcome-page/welcome-page.component';

// AoT requires an exported function for factories
export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient);
}

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dash/Welcome-Page',
    pathMatch: 'full',
  },
  {
    path: 'dash',
    component: PnmDashboardComponent,
    children: [
      { path: 'Welcome-Page', component: WelcomePageComponent},
      { path: 'Settings', component: SettingsComponent},
      { path: 'Pricing', component: SelectPriceComponent },
      { path: 'Reporting', component: ReportingComponent},
      { path: 'Planning', component: PlanningComponent},
      { path: 'Map', component: MapComponent},
      { path: 'Management', component: ManagementComponent},
      { path: 'FichiersNotes', component: FichiersNotesComponent},
      { path: 'login', component: DemoLoginComponent},
      { path: 'UserGuide', component: UserGuideComponent},
      { path: 'Swagger', component: SwaggerDocComponent},
      { path: 'Whitebook', component: WhitebookDocComponent},
    ],
  },
];

@NgModule({
  declarations: [
    PnmDashboardComponent,
    SettingsComponent,
    ReportingComponent,
    PlanningComponent,
    MapComponent,
    ManagementComponent,
    FichiersNotesComponent,
    SelectPriceComponent,
    DemoLoginComponent,
    UserGuideComponent,
    SwaggerDocComponent,
    WhitebookDocComponent,
    WelcomePageComponent,
  ],
  imports: [
    CommonModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    HttpClientModule,
    ɵInternalFormsSharedModule,
    SharedModule,
    FormsModule,
    MatMenuModule,
    TopNavbarModule,
    NavbarFooterModule,
    MatIconModule,
  ],
  providers: [AuthService, TranslateService],
})
export class SingupModule {}
