
import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../shared/shared.module';
import { CommonModule } from '@angular/common';
import { PivotTableComponent } from './pivot-table.component';

@NgModule({
  declarations: [PivotTableComponent],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [PivotTableComponent]
})
export class PivotTableModule { }
