import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FiltershareService } from 'src/app/core/components/filtershare.service';
import { CalendarService } from 'src/app/core/services/calendar.service';
import { ManageUsersService } from 'src/app/core/services/manage-users.service';
import { MessageService } from 'src/app/core/services/message.service';

@Component({
  selector: 'app-time-zone',
  templateUrl: './time-zone.component.html',
  styleUrls: ['./time-zone.component.scss']
})
export class TimeZoneComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private matDialogRef: MatDialogRef<TimeZoneComponent>,
    private manageUserService: ManageUsersService,
    private messageService: MessageService,
    private CalendarService: CalendarService,
    public fileshareservice: FiltershareService,

  ) { }

  ngOnInit(): void {
    console.log(this.data)
  }



  cancel() {
    this.matDialogRef.close()
  }
  onSubmit() {
    this.manageUserService.UpdateUserTimeZone(this?.data?.TimeZone,this.data?.flagUrl2).subscribe((result:any) => {
      if (result) {
        this.messageService.showMessage(result['response'][0].message);
        this.matDialogRef.close(true)
        this.fileshareservice.createevent$.next(true);

      }
    })
  }
}
