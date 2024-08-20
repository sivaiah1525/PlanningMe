import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { RoadmapProposalModalComponent } from './roadmap-proposal-modal.component';

@NgModule({
  declarations: [
    RoadmapProposalModalComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule
  ],
  exports: [
    RoadmapProposalModalComponent
  ]
})
export class RoadmapProposalModalModule { }
