import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../../shared/shared.module';
import { EventListsModule } from '../event-lists/event-lists.module';
import { OpenDayEventsModalPage } from './open-day-events-modal.page';
const routes: Routes = [
  {
    path: '',
    component: OpenDayEventsModalPage
  }
];


@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    EventListsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [OpenDayEventsModalPage]
})
export class OpenDayEventsModalPageModule {}

