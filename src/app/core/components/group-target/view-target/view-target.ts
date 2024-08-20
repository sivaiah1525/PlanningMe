import { Component, OnInit, Inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DeleteCommomComponent } from 'src/app/pages/commonForAll/delete-commom/delete-commom.component';
import { EditEventComponent } from 'src/app/core/components/event-lists/edit-event/edit-event.component';
import { FileDownloadShareComponent } from 'src/app/pages/files/components/file-download-share/file-download-share.component';
import { AddFileComponent } from 'src/app/pages/files/components/add-file/add-file.component';
import { AddNotesComponent } from 'src/app/pages/files/components/add-notes/add-notes.component';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CalendarService } from 'src/app/core/services/calendar.service';
import { MessageService } from 'src/app/core/services/message.service';
import { ManageUsersService } from 'src/app/core/services/manage-users.service';
import { HttpParams } from '@angular/common/http';
import { SiteDetailsComponent } from 'src/app/pages/management/manage-sites/site-details/site-details.component';
import { ContactDetailsComponent } from 'src/app/pages/management/manage-contacts/contact-details/contact-details.component';
import { UserDetailsComponent } from 'src/app/pages/management/manage-users/user-details/user-details.component';
import { ProfilePickFormatService } from 'src/app/core/services/profile-pick-format.service';

export interface DialogData {
  screentype: any;
  taskId: any;
}

@Component({
  selector: 'app-view-target',
  templateUrl: './view-target.html',
  styleUrls: ['./view-target.scss']
})
export class ViewTargetComponent implements OnInit {
  color = 'primary';
  mode = 'indeterminate';
  value = 50;
  loader: boolean = false; // Variable to control overlay visibility
  eventLinkedById: any;
  eventData:any;
  taskData:any;
  eventUsers:any;
  clients:any;
  eventUsersDto:any;
  eventContactsDtos:any;
  eventCreator:any;
  creator:any;
  showdata = false;
  showusers = false;
  showcontact = false;
  contactLinkedById: any;
  showfile = false;
  getNote: any;
  showNote = false;
  getfile: any;
  eventId: any;
  AdminStatus: any;
  otherpepuleplan = false;
  getuser: any;
  assignedTo: boolean=false;
  showsteps=false;
  showpredecessor=false;
  showsuccessor=false
  progressValue =60;
  customColor = 'purple';
   progress: number = 60;
   radius: number = 40; 
   predecessorlist=[]
   successorlist=[]
  target: any;
  constructor(
    public dialogRef: MatDialogRef<ViewTargetComponent>,
    private calendarService: CalendarService,
    private messageService: MessageService,
    public dialog: MatDialog,
    private userService: ManageUsersService, 
    private profilepickformat:ProfilePickFormatService,
    private manageUsersService: ManageUsersService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.AdminStatus = localStorage.getItem('isAdmin');
  }

  ngOnInit() {
    console.log("testttt", this.data);
    this.target = this.data.data
    // this.findEventLinked();
  }

   findstepsLinked(){
    this.showsteps=!this.showsteps
  }
  temformat(value:any) {
    const fractionalPart = Number(value) % 1;
    if (fractionalPart >= 0.5) {
      return Math.ceil(Number(value))+'%';
    } else if (value == 0) {
      return 0;
    } else {
      return Math.floor(Number(value))+'%';
    }
  }
  public circumference: number = 2 * Math.PI * this.radius;
  calculateDashoffset(progress:any) {
    const percent = progress > 100 ? 100 : progress < 0 ? 0 : progress;
    return this.circumference - (percent / 100) * this.circumference;
  }

  get50TenCharacters(value:any){
    if(value.length>30){
      let firstTenCharacters = value.slice(0, 30);
      var data=firstTenCharacters +'...'
      return this.toTitleCase(data);
    }else{
     return this.toTitleCase(value);
    }
  }
   toTitleCase(str:any) {
    return str.toLowerCase().split(' ').map((word:any)=> {
      return word.charAt(0).toUpperCase() + word.slice(1);
    }).join(' ');
  }

  assignCssClass1(progress: number): string {
    let cssClass = '';
    if (Number(progress) >= 0 && Number(progress) <= 20) {
      cssClass = 'color1-20';
    } else if (Number(progress) >= 21 && Number(progress) <= 50) {
      cssClass = 'color2-50';
    } else if (Number(progress) >= 51 && Number(progress) <= 80) {
      cssClass = 'color3-80';
    } else if (Number(progress) >= 81 && Number(progress) <= 90) {
      cssClass = 'color4-90';
    } else if (Number(progress) >= 100) {
      cssClass = 'color5-100';
    }
    return cssClass;
  }

  toggleTaskCompletion(taskData: any, Stage:any) {
    const formData = new HttpParams()
    .set('taskId', taskData.id)
    .set('Stage', Stage);
    this.manageUsersService.UpdateTaskStatus(formData).subscribe(
      (res: any) => {
        this.messageService.showMessage('UpdateTaskStatus successfully');
        this.ngOnInit();
      },
      error => {
        console.error('Error Complete The Task:', error);
      }
    );
}

// Updatestatus(taskData,status){
//   const formData = new HttpParams()
//   .set('taskId', taskData.id)
//   .set('Stage', status =='Assigned'?'1' : status =='in progress'?'3':status =='Completed'?'4':status =='Canceled'?'5':'6');
//   this.manageUsersService.UpdateTaskStatus(formData).subscribe(
//     (res: any) => {
//       this.messageService.showMessage('Task status Update successfully');
//       this.ngOnInit();
//     },
//     error => {
//       console.error('Error status Update ', error);
//     }
//   );
// }

Updatestepstatus(id:any){
  this.manageUsersService.UpdateTaskStepStatus(id).subscribe((res: any) => {
      this.messageService.showMessage('Task Step status Update successfully');
      this.ngOnInit();
    },
    error => {
      console.error('Error status Update ', error);
    }
  );
}

  findassignedToUserLinked(){
    this.assignedTo=!this.assignedTo

  }

  findUserLinked(count:any) {
    if (count > 0) {
      this.userService
      .FindTaskById(this.data)
      .subscribe((res: any) => {
        console.log("ressss",res)
        this.taskData = res;
        this.showusers = !this.showusers;
      });
    }
  }

  findContactLinked(count:any) {
    if (count > 0) {
      this.userService
      .FindTaskById(this.data)
      .subscribe((res: any) => {
        console.log("ressss",res)
        this.taskData = res;
        this.showcontact = !this.showcontact;
      });
    }
  }

  getlinkedpredecessor(data:any){
    this.showpredecessor=!this.showpredecessor
    this.loader=true
    if(data.predecessorTaskcount!=0){
      this.userService.GetLinkedTasks(data.id,false,true).subscribe((result)=>{
        if(result){
          this.loader=false
          console.log(result)
          this.predecessorlist=result
        }
      },error=>{
        this.loader=false
      })
    }
  }
  getlinkedsuccessor(data:any){
    this.showsuccessor=!this.showsuccessor
    this.loader=true
    if(data.predecessorTaskcount!=0){
      this.userService.GetLinkedTasks(data.id,true,false).subscribe((result)=>{
        if(result){
          console.log(result)
          this.loader=false
          this.successorlist=result
        }
      },error=>{
        this.loader=false

      })
    }
  }

  opentaskDialog(id:any) {
    this.dialog.open(ViewTargetComponent, {
      width: '550px',
      position: { top: '125px', left: '700px' },
      autoFocus: false,
      disableClose: true,
      data: id
    });
  }

  // openUserDialog
  openUserDialog(row:any, type: string) {
    this.dialog.open(UserDetailsComponent, {
      width: '500px',
      position: { top: '125px', left: '700px' },
      autoFocus: false,
      disableClose: true,
      data: { data: row, type: type },
    });
  }
  deleteDialogConfirmation(data:any, type:any) {
    const deleteorder = this.dialog.open(DeleteCommomComponent, {
      data: { data, type: type },
    });
    deleteorder.afterClosed().subscribe((result: any) => {
      this.dialogRef.close(true);
    });
  }

  // openEditdEventDialog
  openEditdEventDialog(id:any) {
    const openAddEventDialog = this.dialog.open(EditEventComponent, {
      width: '500px',
      data: { eventId: id },
    });
    openAddEventDialog.afterClosed().subscribe((result) => {
      if (result) {
        this.ngOnInit();
      }
    });
  }

  // openContactDialog
  openContactDialog(row:any, type: string): void {
    this.dialog.open(ContactDetailsComponent, {
      data: { data: row, type: type },
      width: '500px',
      position: { top: '125px', left: '700px' },
    });
  }
  // openSiteDialog
  openSiteDialog(data:any, type: string): void {
    this.dialog.open(SiteDetailsComponent, {
      data: { data: data, type: type },
      width: '500px',
      position: { top: '125px', left: '700px' },
    });
  }
  // findfilesLinked
  findfilesLinked(count:any) {
    if (count > 0) {
      this.manageUsersService
        .getfile(this.eventData.id, 'Events')
        .subscribe((res) => {
          this.getfile = res;
          this.showfile = !this.showfile;
        });
    }
  }
  // findnotesLinked
  findnotesLinked(count:any) {
    if (count > 0) {
      this.manageUsersService
        .getnotes(this.eventData.id, 'Events')
        .subscribe((res) => {
          this.getNote = res;
          this.showNote = !this.showNote;
        });
    }
  }
  // gotofiles
  gotofiles(row:any) {
    this.dialog.open(FileDownloadShareComponent, {
      width: '500px',
      data: row,
      position: { top: '125px', left: '700px' },
      autoFocus: false,
      disableClose: true,
    });
  }

  // AddFile
  AddFile(row:any) {
    const addfile = this.dialog.open(AddFileComponent, {
      disableClose: true,
      data: {
        data: row,
        attachmentLevel: 'Events',
        ismanage: true,
      },
      width: '500px',
      position: { top: '125px', left: '700px' },
      panelClass: ['addFiles'],
    });
    addfile.afterClosed().subscribe((result) => {
      if (result) {
        this.ngOnInit();
      }
    });
  }
  //  AddNote
  AddNote(row:any) {
    const addNote = this.dialog.open(AddNotesComponent, {
      disableClose: true,
      data: {
        data: row,
        attachmentLevel: 'Events',
        ismanage: true,
      },
      position: { top: '125px', left: '700px' },
      width: '500px',
      panelClass: ['addNotes'],
    });
    addNote.afterClosed().subscribe((result) => {
      if (result) {
        this.ngOnInit();
      }
    });
  }


  getstatus(value:any){
    if(value){
      return value.replace('_',' ')
    }else{
      return ''
    }
  }

  getStatusColorClass(status: string) {
    let value:any=''
    if (status == 'Pending') {
      value= 'Assign-color';
    }  else if (status == 'Validated') {
      value= 'completed-color';
    } 
    else if (status == 'Cancelled') {
      value= 'cancelled-color';
    } 
    return value
  }

  transform(value: any, ...args: any[]) {
    let ammount = value.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
    let ammount1 = ammount.replace(/,/g, ' ')
    return ammount1.replace('$', ' ')
  }

  assignCssClass(progress: number): string {
    let cssClass = '';
    if (Number(progress) >= 0 && Number(progress) <= 20) {
      cssClass = 'color-20';
    } else if (Number(progress) >= 21 && Number(progress) <= 50) {
      cssClass = 'color-50';
    } else if (Number(progress) >= 51 && Number(progress) <= 80) {
      cssClass = 'color-80';
    } else if (Number(progress) >= 81 && Number(progress) <= 90) {
      cssClass = 'color-90';
    } else if (Number(progress) >= 100) {
      cssClass = 'color-100';
    }
    return cssClass;
  }

  getuserFLnames(value:any){
    return this.profilepickformat.getuserFLnames(value)
  }
  
  getColor(index:number) {
    return this.profilepickformat.getColor(index)
  }

}
