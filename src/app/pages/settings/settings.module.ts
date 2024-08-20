import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { SettingsComponent } from './settings.component';
import { Routes, RouterModule } from '@angular/router';
import { GeneralComponent } from './general/general.component';
import { InvoiceComponent } from './invoice/invoice.component';
import { DelegationComponent } from './delegation/delegation.component';
import { StrategyComponent } from './strategy/strategy.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InvoiceDetailModule } from '../../core/components/invoice-detail/invoice-detail.module';
import { DelegationUsersModule } from '../../core/components/delegation-users/delegation-users.module';
import { CreateStrategyModule } from '../../core/components/create-strategy/create-strategy.module';
import { PermissionComponent } from './permission/permission/permission.component';
import { CarddetailComponent } from './carddetail/carddetail.component';
// import { CarddetailComponent } from './card-detail/carddetail/carddetail.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MappingComponent } from './mapping/mapping.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ColorPickerModule } from 'ngx-color-picker';
import { AccountDetailsComponent } from '../settings/Account/account-details/account-details.component';
import { PaymentModeAddComponent } from '../settings/Account/payment-mode-add/payment-mode-add.component';
import { AccountDetailsEditComponent } from '../settings/Account/account-details-edit/account-details-edit.component';
import { MappingconfigurationformComponent } from './mappingconfigurationform/mappingconfigurationform.component';
import { CreateConfigurationformComponent } from './create-configurationform/create-configurationform.component';
import { PermissionApplyEditComponent } from './permission/permission-apply-edit/permission-apply-edit.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { LogspaceComponent } from './logspace/logspace.component';
import { CKEditorModule } from 'ckeditor4-angular';
import { ExportLogsComponent } from './logspace/export-logs/export-logs.component';
import {TranslateModule, TranslateLoader, TranslateService} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import { NitificationsRightsComponent } from './nitifications-rights/nitifications-rights.component';
import { LeadAutomationComponent } from './lead-automation/lead-automation.component';
import { AutomationActionsListComponent } from './lead-automation/components/automation-actions-list/automation-actions-list.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
// AoT requires an exported function for factories
export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient);
}
const routes: Routes = [
  {
    path: '',
    redirectTo: 's/general',
    pathMatch: 'full'
  },
  {
    path: 's',
    component: SettingsComponent,
    children: [
      {
        path: 'general',
        component: GeneralComponent,
        data: { animation: 'pnmAnimate' }
      },
      {
        path: 'invoice',
        component: InvoiceComponent,
        data: { animation: 'pnmAnimate' }
      },
      {
        path: 'delegation',
        component: DelegationComponent,
        data: { animation: 'pnmAnimate' }
      },
      {
        path: 'strategy',
        component: StrategyComponent
      },
      {
        path: 'permission',
        component: PermissionComponent
      },
      {
        path: 'card',
        component: CarddetailComponent
      },
    ]
  },
  {
    path: 's/mapping',
    component: MappingComponent
  },
  {
    path: 's/Auditlog',
    component: LogspaceComponent
  },

]

@NgModule({
  declarations: [
    SettingsComponent,
    GeneralComponent,
    InvoiceComponent,
    DelegationComponent,
    StrategyComponent,
    PermissionComponent,
    CarddetailComponent,
    MappingComponent,
    AccountDetailsComponent,
    PaymentModeAddComponent,
    AccountDetailsEditComponent,
    MappingconfigurationformComponent,
    CreateConfigurationformComponent,
    PermissionApplyEditComponent,
    LogspaceComponent,
    ExportLogsComponent,
    NitificationsRightsComponent,
    LeadAutomationComponent,
    AutomationActionsListComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    SharedModule,
    InvoiceDetailModule,
    DelegationUsersModule,
    CreateStrategyModule, 
    FormsModule,
    MatSlideToggleModule,
    NgxChartsModule,
    ColorPickerModule,
    HttpClientModule,
    CKEditorModule,
    DragDropModule,

  ],
  providers: [DatePipe,],
})
export class SettingsModule { }

