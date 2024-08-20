import { ComboChartModule } from './../components/combo-chart/combo-chart.module';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PivotTableModule } from '../components/pivot-table/pivot-table.module';
import { GraphFilterComponent } from './../components/graph-filter/graph-filter.component';
import { GraphFilterModule } from './../components/graph-filter/graph-filter.module';
import { GraphMoreModule } from './../components/graph-more/graph-more.module';
import { GraphPage } from './graph.page';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { SharedModule } from 'src/app/shared/shared.module';
import { GraphService } from 'src/app/core/services/graph.service';
import {  FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectFilterModule } from 'mat-select-filter';
import {MatBadgeModule} from '@angular/material/badge';
import {TranslateModule, TranslateLoader, TranslateService} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';
import { MatMenuModule } from '@angular/material/menu';
// AoT requires an exported function for factories
export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient);
}
const routes: Routes = [
  {
    path: '',
    component: GraphPage
  }
];

@NgModule({
  imports: [
    PivotTableModule,
    GraphMoreModule,
    GraphFilterModule,
    NgxChartsModule,
    MatSelectFilterModule,
    ComboChartModule,
    SharedModule,
    ReactiveFormsModule,
    MatBadgeModule,
    FormsModule,
    RouterModule.forChild(routes),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
  ],
  entryComponents: [
    GraphFilterComponent
  ],
  providers: [GraphService],
  declarations: [GraphPage]
})
export class GraphPageModule { }
