import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'pm-roadmap-proposal-modal',
  templateUrl: './roadmap-proposal-modal.component.html',
  styleUrls: ['./roadmap-proposal-modal.component.scss'],
})
export class RoadmapProposalModalComponent implements OnInit {
  roadMapForm: FormGroup;
  constructor(
    private matDialogRef: MatDialogRef<RoadmapProposalModalComponent>, private formBuilder: FormBuilder
  ) { 
    this.roadMapForm = this.formBuilder.group({
      distanceBtw: ['', Validators.required],
      eventCriticalId: ['', Validators.required],
      eventRecurrence: ['', Validators.required]
    }) 
  }

  ngOnInit() { }

  roadmap() { }


  eventRecurrence(event: any) {

  }
}
