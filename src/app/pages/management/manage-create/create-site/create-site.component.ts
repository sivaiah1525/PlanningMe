import { Component, OnInit, TemplateRef, Inject } from '@angular/core';
import { User } from 'src/app/core/models/user.model';
import { Contact } from 'src/app/core/models/contact.model';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
  FormArray,
} from '@angular/forms';
import { MessageService } from 'src/app/core/services/message.service';
import { Router } from '@angular/router';
import {
  MAT_DIALOG_DATA, 
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { ManageContactsService } from 'src/app/core/services/manage-contacts.service';
import { ManageUsersService } from 'src/app/core/services/manage-users.service';
import { ManageSitesService } from 'src/app/core/services/manage-sites.service';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { UserResponse } from '../../manage-users/create-group/create-group.component';
import { ManagesiteService } from 'src/app/pages/management/manage-sites/managesite.service';
import { ManageimportComponent } from '../../manageimport/manageimport.component';
import { saveAs } from 'file-saver'; 
import { GoogleValidationAddressService } from 'src/app/core/services/google-validation-address.service';
import { AddtagCommonComponent } from 'src/app/pages/commonForAll/addtag-common/addtag-common.component';
import { DeleteCommomComponent } from 'src/app/pages/commonForAll/delete-commom/delete-commom.component';
import { AddFileComponent } from 'src/app/pages/files/components/add-file/add-file.component';
import { AddNotesComponent } from 'src/app/pages/files/components/add-notes/add-notes.component';
import { FileService } from 'src/app/core/services/file.service';
import { AddFileNotesComponent } from 'src/app/pages/files/components/add-file-notes/add-file-notes.component';
import { FilesAndNotesShareLinkComponent } from 'src/app/pages/files/components/files-and-notes-share-link/files-and-notes-share-link.component';
import * as FileSaver from 'file-saver';
import { ViewNotesComponent } from 'src/app/pages/files/components/view-notes/view-notes.component';
import { FileandnotesformanagementComponent } from 'src/app/pages/commonForAll/fileandnotesformanagement/fileandnotesformanagement.component';
import { PopupErrorMessageComponent } from 'src/app/popup-error-message/popup-error-message.component';
import { TranslateService } from '@ngx-translate/core';
import { ApiErrorMessagesComponent } from 'src/app/api-error-messages/api-error-messages.component';

@Component({
  selector: 'app-create-site',
  templateUrl: './create-site.component.html',
})
export class CreateSiteComponent implements OnInit {
  userControl = new FormControl();
  siteForm: FormGroup; 
  additionalFieldLines: any[] = [];
  lineCounter!: number;
  allUsers: UserResponse[] = [];
  contacts$:any=[];
  filteredcontacts:any=[];
  lastFilter: string = '';
  fliteredUsers!: Observable<UserResponse[]>;
  dropdown!: boolean;
  selectedradioval: any;
  viewtagmodel :any= {};
  showcheckbox!: boolean;
  selectednumeralval: any;
  tagarray :any= [];
  Freefeild :any= {};
  viewnumeral :any= {};
  dropdownfeild :any= {};
  showfreefeild!: boolean;
  tagViewModels :any= [];
  tags: any;
  dropdownvalue :any= [];
  i = 1;
  value!: number;
  datadelete: any;
  datadeleteindex: any;

  selectedvalue: any;
  checked: any;
  selectedtagvalue: any;
  options = {
    types: ['geocode'],
    componentRestrictions: {},
  };
  siteiddata: any;
  screenType = '';
  AttachmentFileCount: any;
  AttachmentFileList: any;
  AttachmentNotesCount: any;
  AttachmentNotesList: any;
  ShowAttachmentFile = false;
  ShowAttachmentNotes = false;
  notesCount = 0;
  filesCount = 0;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private router: Router, 
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<CreateSiteComponent>, 
    private messageService: MessageService, 
    private manageContactsService: ManageContactsService,
    private manageUsersService: ManageUsersService,
    private manageSitesService: ManageSitesService,
    private managesiteservice: ManagesiteService,
    private dialog: MatDialog,
    private googleAddress: GoogleValidationAddressService,
    private fileService: FileService,
    private userService: ManageUsersService,
    private translate: TranslateService ,
    ) {
      if(localStorage.getItem('lang')){
        const lang:any=localStorage.getItem('lang')
        this.translate.use(lang);
      }else{
        this.translate.use('English');
      }
      this.siteForm = this.formBuilder.group({
      id: [''],
      CompanyName: ['', Validators.required],
      Address: ['', Validators.required],
      ZipCode: ['', Validators.required],
      City: ['', [Validators.required]],
      Country: ['', Validators.required],
      Latitude: [''],
      Longitude: [''],
      ContactPhone: [''],
      ActivityName: ['', Validators.required],
      UserId: [],
      ContactsId: [],
      isActive: [{ value: 'true', disabled: true }],
      Addtages: this.formBuilder.array([]),
    });
  }

  ngOnInit(): void {
    console.log(this.data);
    this.screenType = this.data.screenType;
    if (this.screenType == 'CreateSite') {
    } else {
      this.updatesiteDialog();
    }
    this.loadContacts();
    this.loadUsers();
    this.gettags();
  }

  // tag
  createtageBody(): FormGroup {
    return this.formBuilder.group({
      tagTableId: 0,
      fieldName: '',
      fieldType: '',
      fieldValue: '',
      dropdownValues: '',
      dropdownvaluetotal: '',
    });
  }
  gettageBody() {
    return this.siteForm.get('Addtages') as FormArray;
  }
  addtageBody() {
    this.gettageBody().push(this.createtageBody());
  }
  fieldname(i: number) {
    return this.gettageBody().at(i).get('fieldName')?.value;
  }
  dropdownvaluetotal(i: number) {
    return this.gettageBody().at(i).get('dropdownvaluetotal')?.value.split(',');
  }
  fieldType(i: number) {
    return this.gettageBody().at(i).get('fieldType')?.value;
  }
  tagTableId(i: number) {
    return this.gettageBody().at(i).get('tagTableId')?.value;
  }
  removeConditionalBody(i: number) {
    this.gettageBody().removeAt(i);
  }

  updatesiteDialog() {
    this.manageSitesService
      .fetchSiteByIdService(this.data.data.id)
      .subscribe((data: any) => {
        this.siteiddata = data;
        this.filesCount = data?.filesCount;
        this.notesCount = data?.notesCount;
        console.log(this.siteiddata);
        this.siteForm.get('CompanyName')?.setValue(this.siteiddata?.companyName);
        // this.siteForm.get('RegistrationNumber')?.setValue(this.siteiddata?.registrationNumber);
        this.siteForm.get('Address')?.setValue(this.siteiddata?.address);
        this.siteForm.get('ZipCode')?.setValue(this.siteiddata?.zipCode);
        this.siteForm.get('City')?.setValue(this.siteiddata?.city);
        this.siteForm.get('Country')?.setValue(this.siteiddata?.country);
        this.siteForm.get('Latitude')?.setValue(this.siteiddata?.Latitude ? this.siteiddata?.Latitude : 0);
        this.siteForm.get('Longitude')?.setValue(this.siteiddata?.Longitude ? this.siteiddata?.Longitude : 0);
        this.siteForm.get('ContactPhone')?.setValue(this.siteiddata?.contactPhone);
        this.siteForm.get('ActivityName')?.setValue(this.siteiddata?.activityName);
        this.siteForm.get('id')?.setValue(this.siteiddata?.id);
        this.siteForm.get('ContactsId')?.setValue(this.siteiddata?.contactIds);
      });
  }

  onSubmit() {
    if (this.screenType == 'CreateSite') {
      if (localStorage.getItem('DemoOrganation') === 'true') {
        this.popupforerrormessage(
          'This button allows you to add new Sites',
          'Create Site'
        );
      } else {
        this.createsite();
      }
    } else {
      if (localStorage.getItem('DemoOrganation') === 'true') {
        this.popupforerrormessage(
          'This button allows you to Update Sites',
          'Update Site'
        );
      } else {
        this.updatesite();
      }
    }
  }

  createsite() {
    const data :any= {
      companyName: this.siteForm.value.CompanyName,
      address: this.siteForm.value.Address,
      zipCode: this.siteForm.value.ZipCode,
      city: this.siteForm.value.City,
      country: this.siteForm.value.Country,
      contactPhone: this.siteForm.value.ContactPhone.toString(),
      activityName: this.siteForm.value.ActivityName,
      isActive: true,
      contactsId: this.siteForm.value.ContactsId,
      tagViewModels: [],
      latitude:this.siteForm.value.Latitude.toString(),
      longitude:this.siteForm.value.Longitude.toString()
    };
    this.siteForm.value.Addtages.forEach((element:any) => {
      if (element.fieldValue != null) {
        data.tagViewModels.push({
          fieldName: element.fieldName,
          dropdownValues: element.dropdownValues,
          fieldType: element.fieldType,
          fieldValue: element.fieldValue,
          tagTableId: element.tagTableId,
        });
      }
    });
    setTimeout(() => {
      this.manageSitesService.createSiteService(data).subscribe((data:any) => {
        this.dialogRef.close();
        this.tagViewModels = [];
        this.messageService.showMessage(data['response'][0].message);
        this.router.navigate(['/app/home/management/m/sites']);
        this.managesiteservice.managesite$.next(true);
      },error=>{
        console.log(error)
        if(error.status==429){
          this.APIerrormessage(error?.error,'Create Sites')
        }
      });
    }, 100);
  }

  updatesite() {
    console.log(this.siteForm.value);
    const data :any= {
      id: this.siteForm.value.id,
      companyName: this.siteForm.value.CompanyName,
      address: this.siteForm.value.Address,
      zipCode: this.siteForm.value.ZipCode,
      city: this.siteForm.value.City,
      country: this.siteForm.value.Country,
      contactPhone: this.siteForm.value.ContactPhone.toString(),
      activityName: this.siteForm.value.ActivityName,
      isActive: true,
      contactsId: this.siteForm.value.ContactsId,
      tagViewModels: [],
      latitude: this.siteForm.value.Latitude.toString(),
      longitude: this.siteForm.value.Longitude.toString()
    };
    this.siteForm.value.Addtages.forEach((element:any) => {
      if (element?.fieldValue != null) {
        data.tagViewModels.push({
          fieldName: element.fieldName,
          dropdownValues: element.dropdownValues,
          fieldType: element.fieldType,
          fieldValue: element.fieldValue,
          tagTableId: element.tagTableId,
        });
      }
      if (element?.fieldType == 'Dropdown') {
        data.tagViewModels.push({
          fieldName: element.fieldName,
          dropdownValues: element.dropdownValues.toString(),
          fieldType: element.fieldType,
          fieldValue: element?.fieldValue == null ? ' ' : element?.fieldValue,
          tagTableId: element.tagTableId,
        });
      }
    });
    setTimeout(() => {
      this.manageSitesService.updateSiteService(data).subscribe((data:any) => {
        this.dialogRef.close();
        this.tagViewModels = [];
        this.messageService.showMessage(data['response'][0].message);
        this.router.navigate(['/app/home/management/m/sites']);
        this.managesiteservice.managesite$.next(true);
      });
    }, 100);
  }

  loadUsers() {
    this.manageUsersService.findAllUsersDropdown().subscribe((data) => {
      this.allUsers = data;
      this.fliteredUsers = this.userControl.valueChanges.pipe(
        startWith<string | UserResponse[]>(''),
        map((value) => (typeof value === 'string' ? value : this.lastFilter)),
        map((filter) => this.filter(filter))
      );
    });
  }
  filter(filter: string): UserResponse[] {
    this.lastFilter = filter;
    if (filter) {
      return this.allUsers.filter((option) => {
        return (
          option.firstName.toLowerCase().indexOf(filter.toLowerCase()) >= 0 ||
          option.lastName.toLowerCase().indexOf(filter.toLowerCase()) >= 0
        );
      });
    } else {
      return this.allUsers.slice();
    }
  }

  filterOptions(value: string,type:string): void {
      this.filteredcontacts = this.contacts$.filter((option:any) =>
        option.firstName.toLowerCase().includes(value.toLowerCase())
      );

  
  }

  loadContacts() {
    this.manageContactsService.findAllContactsDropdown().subscribe((result)=>{
      if(result){
        this.contacts$=result
        this.filteredcontacts=result
      }
    });  }

  addAdditionalFieldLine() {
    this.value = this.i + 1;
    this.dropdownvalue.push(this.value);
    this.i = this.value;
    this.additionalFieldLines.push(this.lineCounter++);
  }

  deleteAdditionalFieldLine(index: number) {
    this.additionalFieldLines.splice(index, 1);
  }
  get f() {
    return this.siteForm.controls;
  }
  showdropdown() {
    if (localStorage.getItem('DemoOrganation') === 'true') {
      this.popupforerrormessage(
        'This button allows you to add more parameter',
        'Add Tag'
      );
    } else {
      const openAddEventDialog = this.dialog.open(AddtagCommonComponent, {
        width: '500px',
        autoFocus: false,
        disableClose: true,
        data: 'Sites',
      });
      openAddEventDialog.afterClosed().subscribe((result: any) => {
        if (result) {
          this.gettageBody().clear();
          this.gettags();
        }
      });
    }
  }
  deletetagDialog(i:any, type:any) {
    const data = {
      id: this.tagTableId(i),
      type: 'Sites',
    };
    const deleteorder = this.dialog.open(DeleteCommomComponent, {
      data: { data, type: type, entity: 'Sites' },
    });
    deleteorder.afterClosed().subscribe((result: any) => {
      if (result) {
        this.gettageBody().clear();
        this.gettags();
      }
    });
  }

  handleAddressChange(place: object) {
    const data = this.googleAddress.getFullAddress(place);
    this.siteForm.get('Latitude')?.setValue(data.latitude);
    this.siteForm.get('Longitude')?.setValue(data.longitude);

    if (
      data.Address != undefined &&
      data.Address != null &&
      data.Address != 'undefined' &&
      data.Address != 'null'
    ) {
      this.siteForm.get('Address')?.setValue(data.Address);
    } else {
      this.siteForm.get('Address')?.setValue('');
    }
    if (
      data.pincode != undefined &&
      data.pincode != null &&
      data.pincode != 'undefined' &&
      data.pincode != 'null'
    ) {
      this.siteForm.get('ZipCode')?.setValue(data.pincode);
    } else {
      this.siteForm.get('ZipCode')?.setValue('');
    }
    if (
      data.city != undefined &&
      data.city != null &&
      data.city != 'undefined' &&
      data.city != 'null'
    ) {
      this.siteForm.get('City')?.setValue(data.city);
    } else {
      this.siteForm.get('City')?.setValue('');
    }
    if (
      data.country != undefined &&
      data.country != null &&
      data.country != 'undefined' &&
      data.country != 'null'
    ) {
      this.siteForm.get('Country')?.setValue(data.country);
    } else {
      this.siteForm.get('Country')?.setValue('');
    }
  }

  gettags() {
    this.manageSitesService.gettag('Sites').subscribe((data: any) => {
      if (data) {
        data.forEach((element:any, index:any) => {
          this.addtageBody();
          this.gettageBody()
            .at(index)
            .get('tagTableId')
            ?.setValue(element?.tagTableId);
          this.gettageBody()
            .at(index)
            .get('fieldName')
            ?.setValue(element?.fieldName);
          this.gettageBody()
            .at(index)
            .get('fieldType')
            ?.setValue(element?.fieldType);
          this.gettageBody()
            .at(index)
            .get('fieldValue')
            ?.setValue(element?.fieldValue);
          this.gettageBody()
            .at(index)
            .get('dropdownvaluetotal')
            ?.setValue(element?.dropdownValues);
        });
      }
      this.tags = data;
    });
  }

  importdata() {
    const openAddEventDialog = this.dialog.open(ManageimportComponent, {
      width: '500px',
      autoFocus: false,
      disableClose: true,
      data: 'Sites',
    });
  }
  downloadTemplate() {
    const Name = 'Sites';
    this.manageContactsService
      .downloadTemplate(Name)
      .subscribe((result: Blob) => {
        const data: Blob = new Blob([result], {
          type: 'text/csv;charset=utf-8',
        });
        saveAs(data, 'Sites.csv');
      });
  }

  // AddFile
  AddFile() {
    const addfile = this.dialog.open(AddFileComponent, {
      disableClose: true,
      width: '500px',
      data: {
        data: this.siteiddata,
        attachmentLevel: 'Sites',
        ismanage: true,
        type: 'single',
      },
      panelClass: ['addFiles'],
    });
    addfile.afterClosed().subscribe((result) => {
      this.ShowAttachmentFile = true;
      this.ShowAttachmentNotes = true;
      this.updatesiteDialog();
      this.findnotesLinked();
      this.findfilesLinked();
    });
  }

  // AddNote
  AddNote() {
    const addnote = this.dialog.open(AddNotesComponent, {
      disableClose: true,
      data: {
        data: this.siteiddata,
        attachmentLevel: 'Sites',
        ismanage: true,
        type: 'single',
      },
      width: '600px',
      panelClass: ['addNotes'],
    });
    addnote.afterClosed().subscribe((result) => {
      this.ShowAttachmentFile = true;
      this.ShowAttachmentNotes = true;
      this.updatesiteDialog();
      this.findnotesLinked();
      this.findfilesLinked();
    });
  }
  addNewFileAndNote() {
    const addNewFileAndNote = this.dialog.open(
      FileandnotesformanagementComponent,
      {
        width: '500px',
      }
    );
    addNewFileAndNote.afterClosed().subscribe((result) => {
      if (result) {
        if (result == 'file') {
          this.AddFile();
        } else {
          this.AddNote();
        }
      }
    });
  }
  // findfilesLinked
  findfilesLinked() {
    this.userService.getfile(this.siteiddata.id, 'Sites').subscribe((res) => {
      this.AttachmentFileList = res;
      this.ShowAttachmentFile = !this.ShowAttachmentFile;
    });
  }
  // findnotesLinked
  findnotesLinked() {
    this.userService.getnotes(this.siteiddata.id, 'Sites').subscribe((res) => {
      this.AttachmentNotesList = res;
      console.log(this.AttachmentNotesList);
      this.ShowAttachmentNotes = !this.ShowAttachmentNotes;
    });
  }
  // ViewLink
  ViewLink(name:any, id:any) {
    if (name == 'File') {
      this.fileService.getFile(id).subscribe((res) => {
        console.log(res);
        if (res) {
          window.open(res.attachedFile, '_blank');
        }
      });
    } else {
      this.fileService.getNote(id,1,10).subscribe((res) => {
        console.log(res);
        if (res) {
          window.open(res.notes, '_blank');
        }
      });
    }
  }
  // sharefileAndNote
  sharefileAndNote(name:any, data:any) {
    if (localStorage.getItem('DemoOrganation') === 'true') {
      this.popupforerrormessage(
        'This button allows  to share File and Note',
        'share File and Note'
      );
    } else {
      const editFileDialog = this.dialog.open(FilesAndNotesShareLinkComponent, {
        width: '500px',
        data: data,
      });
      editFileDialog.afterClosed().subscribe((result) => {
        console.log(result);
      });
    }
  }
  // EditNote
  EditfileAndNote(name:any, id:any) {
    if (name == 'File') {
      if (localStorage.getItem('DemoOrganation') === 'true') {
        this.popupforerrormessage(
          'This button allows  to Edit File',
          'Edit File'
        );
      } else {
        this.fileService.getFile(id).subscribe((data) => {
          const editFileDialog = this.dialog.open(AddFileComponent, {
            width: '500px',
            data: {
              FileEdit: true,
              data: data,
            },
          });
          editFileDialog.afterClosed().subscribe((result) => {
            this.ShowAttachmentFile = true;
            this.ShowAttachmentNotes = true;
            this.updatesiteDialog();
            this.findnotesLinked();
            this.findfilesLinked();
          });
        });
      }
    } else {
      if (localStorage.getItem('DemoOrganation') === 'true') {
        this.popupforerrormessage(
          'This button allows  to Edit Note',
          'Edit Note'
        );
      } else {
        this.fileService.getNote(id,1,10).subscribe((data) => {
          const editFileDialog = this.dialog.open(AddNotesComponent, {
            width: '600px',
            data: {
              NoteEdit: true,
              data: data,
            },
          });
          editFileDialog.afterClosed().subscribe((result) => {
            this.ShowAttachmentFile = true;
            this.ShowAttachmentNotes = true;
            this.updatesiteDialog();
            this.findnotesLinked();
            this.findfilesLinked();
          });
        });
      }
    }
  }

  Downloadfile(data:any) {
    if (localStorage.getItem('DemoOrganation') === 'true') {
      this.popupforerrormessage(
        'This button allows  to Download File',
        'download File'
      );
    } else {
      this.fileService
        .downloadFile(data.id, data?.isPrivate == false ? true : false)
        .subscribe(
          (result) => {
            if (result) {
              const blob = new Blob([result], { type: result.type });
              FileSaver.saveAs(blob);
            }
          },
          (err) => {
            console.log(err);
          }
        );
    }
  }

  // DeleteFileAreNote
  deleteDialogConfirmation(data:any, type:any) {
    const deleteorder = this.dialog.open(DeleteCommomComponent, {
      data: { data, type: type },
    });
    deleteorder.afterClosed().subscribe((result: any) => {
      this.ShowAttachmentFile = true;
      this.ShowAttachmentNotes = true;
      this.updatesiteDialog();
      this.findnotesLinked();
      this.findfilesLinked();
    });
  }
  // ViewNote content
  ViewNoteContent(data:any) {
    if (localStorage.getItem('DemoOrganation') === 'true') {
      this.popupforerrormessage(
        'This button allows  to View Note',
        'View Note'
      );
    } else {
      this.fileService.getNote(data.id,1,10).subscribe((Result: any) => {
        console.log(Result);
        const viewNoteDialog = this.dialog.open(ViewNotesComponent, {
          width: '500px',
          autoFocus: false,
          disableClose: true,
          data: { type: 'view', data: Result },
        });
        viewNoteDialog.afterClosed().subscribe((result) => {
          if (result) {
            this.ShowAttachmentFile = true;
            this.ShowAttachmentNotes = true;
            this.updatesiteDialog();
            this.findnotesLinked();
            this.findfilesLinked();
          }
        });
      });
    }
  }

  popupforerrormessage(message:any, header:any) {
    this.dialog.open(PopupErrorMessageComponent, {
      width: '550px',
      data: { message: message, header: header },
      autoFocus: false,
      disableClose: true,
    });
  }

  APIerrormessage(message:any, header:any) {
    this.dialog.open(ApiErrorMessagesComponent, {
      width: '550px',
      data: { message: message, header: header },
      autoFocus: false,
      disableClose: true,
    });
  }
}
