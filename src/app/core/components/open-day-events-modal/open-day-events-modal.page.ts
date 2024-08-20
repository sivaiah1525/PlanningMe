import { Component, Input, OnInit } from '@angular/core';
import { CalendarEvent } from 'calendar-utils';
import { MatDialogRef } from '@angular/material/dialog';
@Component({
  selector: 'pm-open-day-events-modal',
  templateUrl: './open-day-events-modal.page.html',
  styleUrls: ['./open-day-events-modal.page.scss'],
})
export class OpenDayEventsModalPage implements OnInit {

  @Input() events!: CalendarEvent[];

  constructor( private dialogRef: MatDialogRef<OpenDayEventsModalPage>,
    //private readonly navParams: NavParams
  ) { }

  ngOnInit() {
   // this.events = this.navParams.get('events');

  }

  // dismiss() {
  //   this.modalCtrl.dismiss();
  // }

}
