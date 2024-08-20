import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { ExportPlanningModalComponent } from '../export-planning-modal/export-planning-modal.component';
import { ExportPlanningModalModule } from '../export-planning-modal/export-planning-modal.module';
import { FilterModalModule } from '../filter-modal/filter-modal.module';
import { GroupPlanningModalComponent } from '../group-planning-modal/group-planning-modal.component';
import { ProspectsearchComponent } from '../prospectsearch/prospectsearch.component';
import { RoadmapProposalModalComponent } from '../roadmap-proposal-modal/roadmap-proposal-modal.component';
import { CategoriesModalComponent } from './../categories-modal/categories-modal.component';
import { CategoriesModalModule } from './../categories-modal/categories-modal.module';
import { FilterModalComponent } from './../filter-modal/filter-modal.component';
import { GroupPlanningModalModule } from './../group-planning-modal/group-planning-modal.module';
import { RoadmapProposalModalModule } from './../roadmap-proposal-modal/roadmap-proposal-modal.module';
import { CalendarMoreComponent } from './calendar-more.component';
import { ProspectsearchModule } from './../prospectsearch/prospectsearch/prospectsearch.module';
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';
// AoT requires an exported function for factories
export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient);
}

@NgModule({
  declarations: [
    CalendarMoreComponent
  ],
  entryComponents: [
    ExportPlanningModalComponent,
    GroupPlanningModalComponent,
    FilterModalComponent,
    CategoriesModalComponent,
    RoadmapProposalModalComponent,
    ProspectsearchComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    ExportPlanningModalModule,
    GroupPlanningModalModule,
    FilterModalModule,
    CategoriesModalModule,
    RoadmapProposalModalModule,
    ProspectsearchModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
  ],
  exports: [
    CalendarMoreComponent
  ]
})
export class CalendarMoreModule { }
