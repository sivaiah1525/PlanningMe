import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { FileService } from 'src/app/core/services/file.service';
import { ManageUsersService } from 'src/app/core/services/manage-users.service';
import { ProfilePickFormatService } from 'src/app/core/services/profile-pick-format.service';
import { SpinnerService } from 'src/app/core/services/spinner.service';

@Component({
  selector: 'app-activit-log',
  templateUrl: './activit-log.component.html',
  styleUrls: ['./activit-log.component.scss']
})
export class ActivitLogComponent implements OnInit {
  ActivitLogdata:any=[]
  PageNo=1;
  PageCount=20
  Entity='';
  UserIds=[]
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private manageUsersService: ManageUsersService,
    private dialog: MatDialog,
    private router: Router,
    private snackBar: MatSnackBar,
    public spinner: SpinnerService,
    private fileService: FileService,
    private matDialogRef: MatDialogRef<ActivitLogComponent>,
    private translate: TranslateService ,
    private profilepickformat:ProfilePickFormatService,
    
  ) { }

  ngOnInit(): void {
    console.log(this.data)
    this.Entity=this.data.type
    this.manageUsersService.GetActivityLog(this.PageNo,this.PageCount,this.Entity,this.data.data.id.toString()).subscribe((result:any)=>{
      if(result){
        this.ActivitLogdata=result.dto
      }
    })
  }

  getColor(index:number) {
    return this.profilepickformat.getColor(index)
  }
  getuserFLnames(value:any){
    return this.profilepickformat.getuserFLnames(value)
  }

}
