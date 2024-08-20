import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ManageTasksComponent } from '../manage-tasks/manage-tasks.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatBadgeModule } from '@angular/material/badge';
import { SharedModule } from 'src/app/shared/shared.module';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CreateTaskComponent } from '../create-task/create-task.component';
import { ViewTaskComponent } from '../view-task/view-task.component';
import { ManageUsersComponent } from '../../manage-users/manage-users.component';
import { TaskInToEventComponent } from '../task-in-to-event/task-in-to-event.component';
import { CalendarModule } from 'angular-calendar';
import { CalendarHeaderModule } from 'src/app/core/components/calendar-header/calendar-header.module';
import { ColorPickerModule } from 'ngx-color-picker';
import { KanbanTaskViewComponent } from '../kanban-Task/kanban-task-view/kanban-task-view.component';
import { KanbanTaskCardComponent } from '../kanban-Task/kanban-task-card/kanban-task-card.component';
import { TaskDependenciesComponent } from './task-dependencies/task-dependencies.component';
import { UpdateTaskKanbanComponent } from './update-task-kanban/update-task-kanban.component';


// AoT requires an exported function for factories
export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient);
}
const routes: Routes = [
  {
    path: '',
    component: ManageTasksComponent
  }
]

@NgModule({
  declarations: [
    ManageTasksComponent,
    CreateTaskComponent,
    ViewTaskComponent,
    TaskInToEventComponent,
    KanbanTaskViewComponent,
    KanbanTaskCardComponent,
    TaskDependenciesComponent,
    UpdateTaskKanbanComponent,
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    SharedModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    MatBadgeModule,
    MatSlideToggleModule,
    DragDropModule,
    CalendarHeaderModule,
    CalendarModule,
    ColorPickerModule,
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
    ManageUsersComponent
  ]
})
export class ManageTasksModule { }
