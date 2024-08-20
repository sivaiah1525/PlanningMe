import { Component, Input, OnInit, Inject, TemplateRef } from '@angular/core';
import { EditEventComponent } from './edit-event/edit-event.component';
import { EventProposalComponent } from './event-proposal-calender/event.proposal.component';
import { CalendarService } from 'src/app/core/services/calendar.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { EditProposalComponent } from './edit-proposal/edit-proposal.component';
import { MessageService } from '../../services/message.service';
import { UserDetailsComponent } from 'src/app/pages/management/manage-users/user-details/user-details.component';
import { ContactDetailsComponent } from 'src/app/pages/management/manage-contacts/contact-details/contact-details.component';
import { SiteDetailsComponent } from 'src/app/pages/management/manage-sites/site-details/site-details.component';
import { ManageUsersService } from '../../services/manage-users.service';
import { CalendarPopUpDialog } from 'src/app/pages/calendar/calendar.component';
import { CalendarEvent } from 'angular-calendar';
import { FileDownloadShareComponent } from 'src/app/pages/files/components/file-download-share/file-download-share.component';
import { DeleteCommomComponent } from 'src/app/pages/commonForAll/delete-commom/delete-commom.component';
import { AddFileComponent } from 'src/app/pages/files/components/add-file/add-file.component';
import { AddNotesComponent } from 'src/app/pages/files/components/add-notes/add-notes.component';
import { TranslateService } from '@ngx-translate/core';

export interface DialogData {
  screentype: any;
  eventId: any;
}

@Component({
  selector: 'pm-event-lists',
  templateUrl: './event-lists.component.html',
  styleUrls: ['./event-lists.component.scss'],
})
export class EventListsComponent implements OnInit {
  @Input() event: any;
  @Input() OtherpeplePlanningStatus!: boolean;

  events: CalendarEvent[] = [];
  durationInSeconds = 5;
  thumbsup!: number;
  groupdata: any;
  otheruserplanning :any= 'false';

  constructor(
    private calendarService: CalendarService,
    private messageService: MessageService,
    public matDialogRef: MatDialogRef<EventListsComponent>,
    public dialog: MatDialog,
    private router: Router,
    private snackBar: MatSnackBar,
    private translate: TranslateService
  ) {
    if(localStorage.getItem('lang')){
      const lang:any=localStorage.getItem('lang')
      this.translate.use(lang);
    }else{
      this.translate.use('English');
    }
    this.otheruserplanning = localStorage.getItem('otheruserplanning');
  }

  ngOnInit() {
    console.log(this.event);
  }
  deleteDialogConfirmation(data:any, type:any) {
    const deleteorder = this.dialog.open(DeleteCommomComponent, {
      data: { data, type: type },
    });
    deleteorder.afterClosed().subscribe((result: any) => {
      if (result) {
      }
    });
  }

  closedialogbox() {
    this.dialog.closeAll();
  }
  openEditdEventDialog(id:any) {
    const openAddEventDialog = this.dialog.open(EditEventComponent, {
      width: '500px',
      data: { eventId: id },
    });
    openAddEventDialog.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }

  openEditProposalDialog(id:any) {
    const openEditProposalDialog = this.dialog.open(EditProposalComponent, {
      width: '500px',
      data: { eventId: id },
    });
    openEditProposalDialog.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }

  invitedEventUpdate(id:any, evId:any) {
    console.log(id);
    this.thumbsup = evId;
    this.calendarService.invitedUserUpdateEvents(id, evId).subscribe((res) => {
      console.log(res);
      this.router.navigate(['/app/home/calendar']);
    });
    // this._snackBar.openFromComponent(PizzaPartyComponent, {
    //   duration: this.durationInSeconds * 1000,
    // });
  }

  eventProposal(id:any) {
    console.log(id);

    // delete id.color;
    sessionStorage.setItem('startdate', id.start);
    sessionStorage.setItem('eventInfo', JSON.stringify(id));
    const dialogRef = this.dialog.open(EventProposalComponent, {
      width: '900px',
      disableClose: true,
      data: { eventId: id.id },
    });
  }
  // eventdetailsShow
  // -----------------
  onClick(id:any, event:any) {
    const dialogRef = this.dialog.open(EventPopUpDialog, {
      width: '550px',
      autoFocus: false,
      disableClose: true,
      data: {
        eventId: id,
        dataevent: event,
      },
    });
  }
}

// ----------------
@Component({
  selector: 'event-popup-dialog',
  templateUrl: 'event-popup-dialog.html',
  styleUrls: ['./event-popup-dialog.scss'],
})
export class EventPopUpDialog implements OnInit {
  eventLinkedById: any;
  eventData:any;
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
  constructor(
    public dialogRef: MatDialogRef<EventPopUpDialog>,
    private calendarService: CalendarService,
    private messageService: MessageService,
    public dialog: MatDialog,
    private manageUsersService: ManageUsersService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this.AdminStatus = localStorage.getItem('isAdmin');
  }

  ngOnInit() {
    console.log(this.data);
    if (this.data?.screentype == 'otherUserPlanning') {
      this.otherpepuleplan = true;
    }else{
      this.otherpepuleplan = false;
    }
    this.eventCreator = this.data;
    this.calendarService
      .FindEventById(this.data.eventId)
      .subscribe((res: any) => {
        this.eventData = res;
        this.showdata = true;
        this.eventUsers = res.eventUsers;
        this.eventUsersDto = res.eventUsersDto;
        this.eventContactsDtos = res.eventContactsDtos;
        this.clients = res.eventContacts;
      });
    // this.findEventLinked();
  }
  // findEventLinked
  findEventLinked() {
    this.calendarService.FindEventLinked(this.data.eventId).subscribe((res) => {
      this.eventLinkedById = res;
      this.showusers = !this.showusers;
    });
  }
  // findcontactLinked
  findcontactLinked() {
    this.calendarService.FindEventLinked(this.data.eventId).subscribe((res) => {
      this.contactLinkedById = res;
      this.showcontact = !this.showcontact;
    });
  }

  // openUserDialog
  openUserDialog(details:any, type: string): void {
    const dialogRef = this.dialog.open(UserDetailsComponent, {
      width: '500px',
      autoFocus: false,
      disableClose: true,
      data: { data: details, type: type },
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
    });
  }
  // openSiteDialog
  openSiteDialog(id: number, type: string): void {
    this.dialog.open(SiteDetailsComponent, {
      data: { id: id, type: type },
      width: '500px',
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
}
