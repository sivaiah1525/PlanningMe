import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { User } from 'src/app/core/models/user.model';
import { Contact } from 'src/app/core/models/contact.model';
import { Site } from 'src/app/core/models/site.model';
import { Category } from 'src/app/core/models/category.model';
import { ManageUsersService } from 'src/app/core/services/manage-users.service';
import { ManageContactsService } from 'src/app/core/services/manage-contacts.service';
import { ManageSitesService } from 'src/app/core/services/manage-sites.service';
import { CalendarService } from 'src/app/core/services/calendar.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
// import * as _ from 'lodash';
import { MessageService } from 'src/app/core/services/message.service';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { AddFileNotesComponent } from 'src/app/pages/files/components/add-file-notes/add-file-notes.component';
import { FileService } from 'src/app/core/services/file.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AddFileComponent } from 'src/app/pages/files/components/add-file/add-file.component';
import { AddNotesComponent } from 'src/app/pages/files/components/add-notes/add-notes.component';
import * as FileSaver from 'file-saver';
import { ViewNotesComponent } from 'src/app/pages/files/components/view-notes/view-notes.component';
import { FilesAndNotesShareLinkComponent } from 'src/app/pages/files/components/files-and-notes-share-link/files-and-notes-share-link.component';
import { DeleteCommomComponent } from 'src/app/pages/commonForAll/delete-commom/delete-commom.component';
import { DatePipe } from '@angular/common';
import { GoogleValidationAddressService } from 'src/app/core/services/google-validation-address.service';
import { FileandnotesformanagementComponent } from 'src/app/pages/commonForAll/fileandnotesformanagement/fileandnotesformanagement.component';
import { TranslateService } from '@ngx-translate/core';

export interface DialogData {
  eventId: string;
}

export interface UserLinks {
  firstName: string;
  id: string;
  lastName: string;
  profile: string;
  isChecked: boolean;
}

@Component({
  selector: 'app-edit-event',
  templateUrl: './edit-event.component.html',
  styleUrls: ['./edit-event.component.scss'],
})

export class EditEventComponent implements OnInit {
  // users$: Observable<User[]>;
  // users$: Observable<any>;
  contacts$!: Observable<Contact[]>;
  sites$!: Observable<Site[]>;
  // sites$;
  categories$!: Observable<Category[]>;
  CriticityId$!: Observable<any>;
  users: UserLinks[] = [];
  minDate: string;
  files:any;
  eventFiles:any;
  eventNotes:any;
  eventID: any;
  periodicity: any = [
    {
      id: '1',
      name: 'Daily',
    },
    {
      id: '2',
      name: 'Weekly',
    },
    {
      id: '3',
      name: 'Monthly',
    },
    {
      id: '4',
      name: 'Default',
    },
  ];
  editform: FormGroup;
  showForm: boolean = false;
  userArray:any;
  contactArray:any;
  siteArray:any;
  showPeriodDate: boolean = false;
  showFilterDay: boolean = false;
  selactUsersInevent: number[] = [];
  selectedContactInevent: number[]= [];


  filteredList1: any;
  filteredList4:any;
  filteredList5:any;
  userGroups$:any;
  contactGroups$:any;
  viewmodel :any= {};

  quickSearchValue!: string;
  categories: any;
  totalitems: any;
  category: boolean = false;
  showcreate = 0;
  color1: string = '#2889e9';
  contactGroupArray:any;
  userGroupArray:any;
  eventdata: any;
  editeventform :any= {};
  getUserId: any;
  // auto chip for keyword
  separatorKeysCodes: number[] = [ENTER, COMMA];
  keywordlist:any = [];

  selected:any = [];
  value: any;
  array1!: any[];
  AttachmentFileCount: any;
  AttachmentFileList: any;
  AttachmentNotesCount: any;
  AttachmentNotesList: any;
  ShowAttachmentFile = false
  ShowAttachmentNotes = false
  notesCount = 0;
  filesCount = 0;
  timeList = ['00:00', '00:15', '00:30', '00:45', '01:00', '01:15', '01:30', '01:45', '02:00', '02:15', '02:30', '02:45',
    '03:00', '03:15', '03:30', '03:45', '04:00', '04:15', '04:30', '04:45', '05:00', '05:15', '05:30', '05:45', '06:00', '06:15',
    '06:30', '06:45', '07:00', '07:15', '07:30', '07:45', '08:00', '08:15', '08:30', '08:45', '09:00', '09:15', '09:30', '09:45',
    '10:00', '10:15', '10:30', '10:45', '11:00', '11:15', '11:30', '11:45', '12:00', '12:15', '12:30', '12:45', '13:00', '13:15',
    '13:30', '13:45', '14:00', '14:15', '14:30', '14:45', '15:00', '15:15', '15:30', '14:45', '16:00', '16:15', '16:30', '16:45',
    '17:00', '17:15', '17:30', '17:45', '18:00', '18:15', '18:30', '18:45', '19:00', '19:15', '19:30', '19:45', '20:00', '20:15',
    '20:30', '20:45', '21:00', '21:15', '21:30', '21:45', '22:00', '22:15', '22:30', '22:45', '23:00', '23:15', '23:30', '23:45',];
  options = {
    types: ['geocode'],
    componentRestrictions: { country: 'FR' }
  }

  constructor(
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private matDialogRef: MatDialogRef<EditEventComponent>,
    private userService: ManageUsersService,
    private contactsService: ManageContactsService,
    private sitesService: ManageSitesService,
    private calendarService: CalendarService,
    public dialogRef: MatDialogRef<EditEventComponent>,
    private messageService: MessageService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private manageSitesService: ManageSitesService,
    private fileService: FileService,
    private snackBar: MatSnackBar,
    public datepipe: DatePipe,
    private googleAddress: GoogleValidationAddressService,
    private translate: TranslateService,
  ) {
    if(localStorage.getItem('lang')){
      const lang:any=localStorage.getItem('lang')
      this.translate.use(lang);
    }else{
      this.translate.use('English');
    }
        this.minDate = new Date().toISOString().slice(0, 16);
    this.editform = this.formBuilder.group({
      'Title': [''],
      'StartDate': ['', [Validators.required]],
      'StartTime': ['', [Validators.required]],
      'EndDate': ['', [Validators.required]],
      'EndTime': ['', [Validators.required]],
      'Address': [''],
      'ZipCode': [''],
      'City': [''],
      'Country': [''],
      'Description': [''],
      'keyword': [''],
      'CriticityId': [3],
      'PeriodicityId': [0],
      'isPeriodicity': [''],
      'IsTemplate': [false],
      'isPublic': [false],
      'isOnlineEvent': [false],
      'isSimulation': [''],
      'PeriodicityEndDate': ['0001-01-01 00:00:00.0000000'],
      'PeriodicityTime': ['0001-01-01 00:00:00.0000000'],
      'UserId': [[]],
      'UserGroupsId': [[]],
      'ContactId': [[]],
      'ContactGroupsId': [[]],
      'SiteId': [52],
      'CategoryId': [''],
      'Attachments': [''],
      'filterDays': [''],
      'CategoryViewModel': [null],
      'categoryname': [''],
      'tagViewModels': [[]],
      'NumberOfUsers': [0],
      'comments': [],
      'eventValidationId': [''],
      'namesOfDay': [[]]
    });
  }

  days = [
    { id: 1, label: 'Sunday', isChecked: true },
    { id: 2, label: 'Monday', isChecked: true },
    { id: 3, label: 'Tuesday', isChecked: true },
    { id: 4, label: 'Wednesday', isChecked: true },
    { id: 5, label: 'Thursday', isChecked: true },
    { id: 6, label: 'Friday', isChecked: true },
    { id: 7, label: 'Saturday', isChecked: true },
  ];

  ngOnInit(): void {
    this.contacts$ = this.contactsService.fetchContactsService(100, 1);
    this.sites$ = this.sitesService.fetchSitesService(100, 1);
    this.CriticityId$ = this.calendarService.findCriticity();
    this.calendarService.FindEventById(this.data.eventId).subscribe((res:any) => {
      this.eventID = res.id
      this.filesCount = res.filesCount
      this.notesCount = res.notesCount
      this.eventdata = res;
      this.keywordlist = res.keywords
      this.AttachmentFileCount = res.attachments
      this.AttachmentNotesCount = res.notes
      this.eventFiles = res.attachments.toString()
      this.eventNotes = res.notes.toString()
      const startDate = res.startDate.split('T')[0]
      const endDate = res.endDate.split('T')[0]
      const startTime = res.startDate.split('T')[1].substring(0, 5)
      const endTime = res.endDate.split('T')[1].substring(0, 5)
      this.editform.get('Title')?.setValue(res.title);
      this.editform.get('StartDate')?.setValue(startDate);
      this.editform.get('StartTime')?.setValue(startTime);
      this.editform.get('EndDate')?.setValue(endDate);
      this.editform.get('EndTime')?.setValue(endTime);
      this.editform.get('Address')?.setValue(res.address);
      this.editform.get('ZipCode')?.setValue(res.zipCode);
      this.editform.get('City')?.setValue(res.city);
      this.editform.get('Country')?.setValue(res.country);
      this.editform.get('Description')?.setValue(res.description);
      this.editform.get('isPublic')?.setValue(res.isPublic);
      this.editform.get('isOnlineEvent')?.setValue(res.isOnlineEvent);
      this.editform.get('isSimulation')?.setValue(res.isSimulation);
      this.editform.get('CategoryId')?.setValue(res.categoryId);
      this.editform.get('CriticityId')?.setValue(res.criticityId);
      this.editform.get('NumberOfUsers')?.setValue(res.usersCount);
      this.editform.get('comments')?.setValue(res.comments);
      this.editform.get('isPeriodicity')?.setValue(res.isPeriodicity);
      this.editform.get('SiteId')?.setValue(res.siteId);
      this.updateAddress(res.siteId)
      this.calendarService.FindEventLinked(this.data.eventId).subscribe((res:any) => {
        console.log(res)
        if (res) {
          // --------- 
          res.linkedEventUserTableDtos.forEach((val:any) => {
            console.log(val.id)
            this.selactUsersInevent.push(val.id);
          });
          res.groupOfContactsDtos.forEach((val:any) => {
            console.log(val.id)
            this.selectedContactInevent.push(val.id);
          });
          this.editform.get('UserId')?.setValue(this.selactUsersInevent);
          this.editform.get('ContactId')?.setValue(this.selectedContactInevent);
        }
      });
      this.showForm = true;
    });

    this.onChanges();
    this.getContactGroup();
    this.getcategory();

  }
  // findfilesLinked 
  findfilesLinked() {
    this.userService.getfile(this.eventID, 'Events').subscribe((res:any) => {
      this.AttachmentFileList = res;
      this.ShowAttachmentFile = !this.ShowAttachmentFile
    });
  }
  // findnotesLinked
  findnotesLinked() {
    this.userService.getnotes(this.eventID, 'Events').subscribe((res:any) => {
      this.AttachmentNotesList = res;
      this.ShowAttachmentNotes = !this.ShowAttachmentNotes
    });
  }
  // ViewLink 
  ViewLink(name:any, id:number) {
    if (name == 'File') {
      this.fileService.getFile(id).subscribe((res:any) => {
        console.log(res)
        if (res) {
          window.open(res.attachedFile, '_blank');
        }
      })
    } else {
      this.fileService.getNote(id,1,10).subscribe((res:any) => {
        console.log(res)
        if (res) {
          window.open(res.notes, '_blank');
        }
      })
    }
  }
  // ViewNote content 
  ViewNoteContent(data:any) {
    this.fileService.getNote(data.id,1,10).subscribe((Result: any) => {
      console.log(Result);
      const viewNoteDialog = this.dialog.open(ViewNotesComponent, {
        width: '500px',
        autoFocus: false,
        disableClose: true,
        data: { type: 'view', data: Result },
      });
      viewNoteDialog.afterClosed().subscribe(result => {
        if (result) {
          this.ShowAttachmentFile = true
          this.ShowAttachmentNotes = true
          this.ngOnInit()
          this.findnotesLinked()
          this.findnotesLinked()
        }
      });
    });
  }

  handleAddressChange(place: object) {
    console.log(place)
    const data = this.googleAddress.getFullAddress(place)
    if (data.Address != undefined && data.Address != null && data.Address != 'undefined' && data.Address != 'null') {
      this.editform.get('Address')?.setValue(data.Address);
    } else {
      this.editform.get('address')?.setValue('');
    }
    if (data.pincode != undefined && data.pincode != null && data.pincode != 'undefined' && data.pincode != 'null') {
      this.editform.get('ZipCode')?.setValue(data.pincode);
    } else {
      this.editform.get('ZipCode')?.setValue('');
    }
    if (data.city != undefined && data.city != null && data.city != 'undefined' && data.city != 'null') {
      this.editform.get('City')?.setValue(data.city);
    } else {
      this.editform.get('City')?.setValue('');
    }
    if (data.country != undefined && data.country != null && data.country != 'undefined' && data.country != 'null') {
      this.editform.get('Country')?.setValue(data.country);
    } else {
      this.editform.get('Country')?.setValue('');
    }
  }


  Downloadfile(data:any) {
    console.log(data)
    this.fileService.downloadFile(data.id, data?.isPrivate == false ? true : false).subscribe((result) => {
      if (result) {
        const blob = new Blob([result], { type: result.type });
        FileSaver.saveAs(blob);
      }
    }, err => {
      console.log(err)
    })
  }

  // DeleteFileAreNote 
  deleteDialogConfirmation(data:any, type:any) {
    const deleteorder = this.dialog.open(DeleteCommomComponent, { data: { data, type: type } });
    deleteorder.afterClosed().subscribe((result: any) => {
      this.ShowAttachmentFile = true
      this.ShowAttachmentNotes = true
      this.ngOnInit()
      this.findnotesLinked()
      this.findnotesLinked()
    })
  }


  // EditNote 
  EditfileAndNote(name:any, id:any) {
    if (name == 'File') {
      this.fileService.getFile(id).subscribe(data => {
        const editFileDialog = this.dialog.open(AddFileComponent, {
          width: '500px',
          data: {
            FileEdit: true,
            data: data
          }
        });
        editFileDialog.afterClosed().subscribe(result => {
          this.ShowAttachmentFile = true
          this.ShowAttachmentNotes = true
          this.ngOnInit()
          this.findnotesLinked()
          this.findnotesLinked()
        });
      });
    } else {
      this.fileService.getNote(id,1,10).subscribe(data => {
        const editFileDialog = this.dialog.open(AddNotesComponent, {
          width: '600px',
          data: {
            NoteEdit: true,
            data: data
          }
        });
        editFileDialog.afterClosed().subscribe(result => {
          this.ShowAttachmentFile = true
          this.ShowAttachmentNotes = true
          this.ngOnInit()
          this.findnotesLinked()
          this.findnotesLinked()
        });
      });
    }
  }

  // sharefileAndNote 
  sharefileAndNote(name:any, data:any) {
    const editFileDialog = this.dialog.open(FilesAndNotesShareLinkComponent, {
      width: '500px',
      data: data
    });
    editFileDialog.afterClosed().subscribe(result => {
      console.log(result);
      this.ngOnInit();
    });
  }


  // getcategory 
  getcategory() {
    this.calendarService.fetchCategoryService(100, 1).subscribe((res:any) => {
      this.categories = res;
      this.totalitems = res.length;
    });
  }

  onChange(event:any) {
    console.log(event.target.files);
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      console.log(file);
      this.editform.get('Attachments')?.setValue(file);
    }
  }
  // AddFile
  AddFile() {
    const addfile = this.dialog.open(AddFileComponent, {
      disableClose: true,
      width: '500px',
      data: {
        data: this.eventdata,
        attachmentLevel: 'Events',
        ismanage: true,
        type: 'single'
      },
      panelClass: ['addFiles']
    });
    addfile.afterClosed().subscribe(result => {
      this.ShowAttachmentFile = true
      this.ShowAttachmentNotes = true
      this.ngOnInit();
      this.findnotesLinked();
      this.findfilesLinked();
    });
  }

  // AddNote
  AddNote() {
    const addnote = this.dialog.open(AddNotesComponent, {
      disableClose: true,
      data: {
        data: this.eventdata,
        attachmentLevel: 'Events',
        ismanage: true,
        type: 'single'
      },
      width: '600px',
      panelClass: ['addNotes']
    });
    addnote.afterClosed().subscribe(result => {
      this.ShowAttachmentFile = true
      this.ShowAttachmentNotes = true
      this.ngOnInit();
      this.findnotesLinked();
      this.findfilesLinked();
    });
  }

  addNewFileAndNote() {
    const addNewFileAndNote = this.dialog.open(FileandnotesformanagementComponent, {
      width: '500px',
    })
    addNewFileAndNote.afterClosed().subscribe(result => {
      if (result) {
        if (result == 'file') {
          this.AddFile()
        } else {
          this.AddNote()
        }
      }
    });
  }
  onSubmit() {
    this.editeventform['id'] = this.eventdata.id;
    this.editeventform['title'] = this.editform.get('Title')?.value;
    const startDate: any = this.datepipe.transform(this.editform?.value.StartDate, 'yyyy-MM-dd') + 'T' + this.editform?.value.StartTime;
    const endDate: any = this.datepipe.transform(this.editform?.value.EndDate, 'yyyy-MM-dd') + 'T' + this.editform?.value.EndTime;
    this.editeventform['startDate'] = startDate;
    this.editeventform['endDate'] = endDate;
    this.editeventform['address'] = this.editform.get('Address')?.value;
    this.editeventform['zipCode'] = this.editform.get('ZipCode')?.value;
    this.editeventform['keyword'] = this.keywordlist.toString()
    this.editeventform['city'] = this.editform.get('City')?.value;
    this.editeventform['isPublic'] = this.editform.get('isPublic')?.value;
    this.editeventform['isOnlineEvent'] = this.editform.get('isOnlineEvent')?.value;
    this.editeventform['country'] = this.editform.get('Country')?.value;
    this.editeventform['description'] = this.editform.get('Description')?.value;
    this.editeventform['criticityId'] = this.editform.get('CriticityId')?.value;
    this.editeventform['isSimulation'] = this.editform.get('isSimulation')?.value;
    this.editeventform['numberOfUsers'] = this.editform.get('NumberOfUsers')?.value;
    this.editeventform['comments'] = '';
    this.editeventform['isTemplate'] = false;
    this.editeventform['isPeriodicity'] = false;
    this.editeventform['namesOfDay']= [];
    if (this?.value < 4) {
      this.editeventform['isPeriodicity'] = true;
      this.editeventform['periodicityId'] = this.editform.get('PeriodicityId')?.value;
      const PeriodicityEndDate = this.datepipe.transform(this.editform?.value.PeriodicityEndDate, 'yyyy-MM-dd') + 'T' + this.editform?.value.PeriodicityTime;
      this.editeventform['periodicityEndDate'] = PeriodicityEndDate
    }
    if (this?.value == 1) {
      this.editeventform['namesOfDay'] = this.array1;
    }
    this.editeventform['tagViewModels'] = this.editform.get('tagViewModels')?.value;
    this.editeventform['userId'] = this.editform.get('UserId')?.value;
    this.editeventform['contactId'] = this.editform.get('ContactId')?.value;
    this.editeventform['siteId'] = this.editform.get('SiteId')?.value;
    this.editeventform['userGroupsId'] = this.editform.get('UserGroupsId')?.value || [];
    this.editeventform['contactGroupsId'] = this.editform.get('ContactGroupsId')?.value || [];
    this.editeventform['categoryId'] = this.editform.get('CategoryId')?.value;
    this.editeventform['categoryViewModel'] = this.viewmodel;
    this.calendarService.updateEvent(JSON.stringify(this.editeventform)).subscribe((res:any) => {
      this.messageService.showMessage(res['response'][0].message);
      this.matDialogRef.close();
      this.calendarService.createevent$.next(true);
      this.matDialogRef.close();
    }, (error) => {
      window.alert(error.err.message[0])
    });

  }

  updateAddress(eve:any) {
    this.manageSitesService.fetchSiteByIdService(eve).subscribe((res:any) => {
      if (res) {
        this.editform.get('Address')?.setValue(res.address);
        this.editform.get('ZipCode')?.setValue(res.zipCode);
        this.editform.get('City')?.setValue(res.city);
        this.editform.get('Country')?.setValue(res.country);
      }
    })
  }

  radioChange(value:any) {
    if (value.name == 'Daily') {
      this.showFilterDay = true
    } else if (value.name == 'Weekly') {
      this.showPeriodDate = true
      this.showFilterDay = false
    } else if (value.name == 'Monthly') {
      this.showPeriodDate = true
      this.showFilterDay = false
    } else if (value.name == 'Default') {
      this.showPeriodDate = true
      this.showFilterDay = false
    }

  }

  onChanges(): void {
    this.editform.get('EndDate')?.valueChanges.subscribe(() => {
      this.calendarService.findAvailableUsers(this.editform.get('StartDate')?.value,
        this.editform.get('EndDate')?.value, true).subscribe((res:any) => {
          this.users= [];
          res.forEach((element:any) => {
            this.users.push({
              id: element.id,
              firstName: element.firstName,
              lastName: element.lastName,
              profile: element.profile,
              isChecked: false
            });
          });
          this.findUserLinked();
          console.log(this.users);
        });
      this.calendarService.findAvailableUsersGroup(this.editform.get('StartDate')?.value,
        this.editform.get('EndDate')?.value, true).subscribe((res:any) => {
          this.userGroups$ = res;
          this.userGroups$.sort(function (a:any, b:any) {
            var textA = a.name.toUpperCase();
            var textB = b.name.toUpperCase();
            return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
          });
          this.filteredList4 = this.userGroups$.slice();
          console.log(this.filteredList4);
        });
    });

  }


  getContactGroup() {
    this.contactsService.fetchContactGroupsService(100, 1, '').subscribe((res:any) => {
      this.contactGroups$ = res;
      this.contactGroups$.sort(function (a:any, b:any) {
        var textA = a.contactGroupName.toUpperCase();
        var textB = b.contactGroupName.toUpperCase();
        return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
      });
      this.filteredList5 = this.contactGroups$.slice();
    });
  }

  createcategory() {
    this.category = true;
    this.showcreate = 1;
  }

  closecategory() {
    this.category = false;
    this.showcreate = 0;
    this.editeventform['categoryViewModel'] = null;
  }


  public onEventLog(event: string, data: any): void {
    console.log(event, data, this.editform.get('categoryname')?.value);
    this.viewmodel['id'] = 0;
    this.viewmodel['color'] = data;
    this.viewmodel['categoryName'] = this.editform.get('categoryname')?.value;
    this.viewmodel['creatorId'] = "";
  }


  // ---------------- 
  // auto chip for keyword 
  // ----------- 
  add(event: MatChipInputEvent) {
    console.log(event?.value)
    const value = (event?.value || '').trim();
    if (value) { this.keywordlist.push(event?.value); }
    // Clear the input value
    // event.input?.value = ''
    this.editform.get('keyword')?.setValue(null);

  }
  remove(value: string) {
    const index = this.keywordlist.indexOf(value);
    if (index >= 0) {
      this.keywordlist.splice(index, 1);
    }
  }


  findUserLinked() {
    this.calendarService.FindUsersByEventId(this.data.eventId).subscribe((res:any) => {
      this.getUserId = res;

      this.getUserId.forEach((element:any) => {
        console.log(element);
        let index = this.users.findIndex(s => s.id === element.id);
        this.users[index].isChecked = true;
      });

      this.selected = this.users.filter(element => element.isChecked == true).map((e) => {
        return e.firstName;
      });
      console.log(this.selected);
    });
  }

  getdays(value:any, i:number, event:any) {
    if (event === false) {
      console.log(this.users);
      this.days.forEach((x) => {
        if (x.label === value) {
          x.isChecked = false;
        }
      });
    }

    else {
      this.days.forEach((x) => {
        if (x.label === value) {
          x.isChecked = true;
        }
      });
    }
    let b;
    this.array1 = [];
    b = this.days.filter((item:any) => {
      if (item.isChecked == true) {
        this.array1.push(item.label);
        return item;
      }
    });
    this.editeventform['namesOfDay'] = this.array1;
  }

  getTimeFormat(timeFeild: any) {
    let data = ''
    const time = timeFeild;
    const getLastDigit: any = time.toString().slice(-2);;
    if (getLastDigit == 'am' && parseInt(time.split(':')[0]) <= 9) {
      data = '0' + time.split(':')[0] + ':' + time.split(':')[1];
    } else if (getLastDigit == '') {
      data = (parseInt(time.split(':')[0]) + 12).toString() + ':' + time.split(':')[1];
    } else {
      data = time.split(':')[0].toString() + ':' + time.split(':')[1];
    }
    return data.slice(0, -2)
  }

}
