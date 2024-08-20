
import { NgModule } from '@angular/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { SharedModule } from '../../../../shared/shared.module';
import { ComboChartComponent } from './combo-chart.component';
import { ComboSeriesVerticalComponent } from './combo-series-vertical.component';
import { CommonModule } from '@angular/common';
@NgModule({
  declarations: [
    ComboChartComponent,
    ComboSeriesVerticalComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    NgxChartsModule
  ],
  exports: [
    ComboChartComponent,
    ComboSeriesVerticalComponent
  ]
})
export class ComboChartModule { }
