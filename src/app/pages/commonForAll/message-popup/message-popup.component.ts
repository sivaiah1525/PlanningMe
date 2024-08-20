import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DriveService } from 'src/app/core/services/drive.service';

@Component({
  selector: 'app-message-popup',
  templateUrl: './message-popup.component.html',
  styleUrls: ['./message-popup.component.scss']
})
export class MessagePopupComponent implements OnInit {
  messange:any;
  screenType:any;
  applicationname = ''
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<MessagePopupComponent>,
    private DriveService: DriveService,

  ) { }

  ngOnInit(): void {
    console.log(this.data)
    this.messange = this.data.message
    this.screenType = this.data.screenType
  }


  clear() {
    this.dialogRef.close(true)
  }
  onSubmit() {
    this.DriveService.CreateNewApplication(this.applicationname).subscribe((result) => {
      if (result) {
        this.dialogRef.close(true)
      }
    })
  }

}
