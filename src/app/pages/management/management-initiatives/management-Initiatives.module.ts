import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatBadgeModule } from '@angular/material/badge';
import { SharedModule } from 'src/app/shared/shared.module';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ManagementInitiativesComponent } from '../management-initiatives/management-initiatives.component';
import { GanttChartComponent } from '../manage-tasks/gantt-chart/gantt-chart.component';
import { KanbanViewComponent } from '../manage-tasks/kanban-Initiative/kanban-view/kanban-view.component';
import { KanbanCardComponent } from '../manage-tasks/kanban-Initiative/kanban-card/kanban-card.component';
import { CreateInitiativesComponent } from './create-initiatives/create-initiatives.component';
import { ViewInitiativesComponent } from './view-initiatives/view-initiatives.component';
import { ManageUsersComponent } from '../manage-users/manage-users.component';
// import { NgxGanttModule } from '@tchvu3/angular-gantt';
import { NgGanttEditorModule } from 'ng-gantt'
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ChooseTaskOptionComponent } from './create-initiatives/choose-task-option/choose-task-option.component';
import { ConformationComponent } from './conformation/conformation.component';
import { InitiativesStepperComponent } from './initiatives-stepper/initiatives-stepper.component';
import { UpdateInitiativesKanbanComponent } from './update-initiatives-kanban/update-initiatives-kanban.component';



// AoT requires an exported function for factories
export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient);
}
const routes: Routes = [
  {
    path: '',
    component: ManagementInitiativesComponent
  }
]

@NgModule({
  declarations: [
    ManagementInitiativesComponent,
    KanbanViewComponent,
    KanbanCardComponent,
    GanttChartComponent,
    CreateInitiativesComponent,
    ViewInitiativesComponent,
    ChooseTaskOptionComponent,
    ConformationComponent,
    InitiativesStepperComponent,
    UpdateInitiativesKanbanComponent
  ],
  imports: [
    CommonModule,
    // NgxGanttModule,
    NgGanttEditorModule,
    NgxChartsModule,
    HttpClientModule,
    FormsModule,
    SharedModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    MatBadgeModule,
    MatSlideToggleModule,
    DragDropModule, 
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
  ],
  exports: [
  ],
  providers: [
    ManageUsersComponent,
  ]
})
export class ManageInitiativesModule { }
