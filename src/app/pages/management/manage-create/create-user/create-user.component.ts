import {
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
  Inject,
} from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ManageUsersService } from 'src/app/core/services/manage-users.service';
import { MessageService } from 'src/app/core/services/message.service';
import { User } from 'src/app/core/models/user.model';
import { Router } from '@angular/router';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { ManageuserService } from '../../manage-users/manageuser.service';
import { GooglePlaceDirective } from 'ngx-google-places-autocomplete';
import { Address } from 'ngx-google-places-autocomplete/objects/address';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { ManageimportComponent } from '../../manageimport/manageimport.component';
import { ManageContactsService } from 'src/app/core/services/manage-contacts.service';
import { saveAs } from 'file-saver';
import { GoogleValidationAddressService } from 'src/app/core/services/google-validation-address.service';
import { AddtagCommonComponent } from 'src/app/pages/commonForAll/addtag-common/addtag-common.component';
import { DeleteCommomComponent } from 'src/app/pages/commonForAll/delete-commom/delete-commom.component';
import { FileService } from 'src/app/core/services/file.service';
import * as FileSaver from 'file-saver';
import { AddFileNotesComponent } from 'src/app/pages/files/components/add-file-notes/add-file-notes.component';
import { FilesAndNotesShareLinkComponent } from 'src/app/pages/files/components/files-and-notes-share-link/files-and-notes-share-link.component';
import { AddFileComponent } from 'src/app/pages/files/components/add-file/add-file.component';
import { AddNotesComponent } from 'src/app/pages/files/components/add-notes/add-notes.component';
import { ViewNotesComponent } from 'src/app/pages/files/components/view-notes/view-notes.component';
import { FileandnotesformanagementComponent } from 'src/app/pages/commonForAll/fileandnotesformanagement/fileandnotesformanagement.component';
import { TranslateService } from '@ngx-translate/core';
import { PopupErrorMessageComponent } from 'src/app/popup-error-message/popup-error-message.component';
import { ApiErrorMessagesComponent } from 'src/app/api-error-messages/api-error-messages.component';
import { ApiSuccessMessagesComponent } from 'src/app/api-success-messages/api-success-messages.component';
import { MessagePopupComponent } from 'src/app/pages/commonForAll/message-popup/message-popup.component';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
})
export class CreateUserComponent implements OnInit {
  userForm: FormGroup; 
  additionalFieldLines: any[] = [];
  lineCounter: number = 0;
  users$ = [];
  filteredusers = [];
  dropdown!: boolean;
  selectedradioval: any;

  // selectedFile: ImageSnippet;
  viewtagmodel = {};
  showcheckbox!: boolean;
  selectednumeralval: any;
  tagarray = [];
  Freefeild = {};
  viewnumeral = {};
  showfreefeild!: boolean;
  value!: number;
  dropdownvalue = [];
  i = 1;
  tagViewModels = [];
  tags: any;
  dropdownfeild = {};
  datadelete: any;
  datadeleteindex: any;
  checked: any;
  selectedvalue: any;
  selectedtagvalue: any;
  profilePick: any;
  profilePickid: any;
  useriddata: any;
  location = 'BARNES LE MARAIS125, Rue Vieille-du-Temple,Paris 3ème,France';
  @ViewChild('placesRef') placesRef!: GooglePlaceDirective;
  options = {
    types: ['geocode'],
    componentRestrictions: {},
  };
  screenType = '';
  AttachmentFileCount: any;
  AttachmentFileList: any;
  AttachmentNotesCount: any;
  AttachmentNotesList: any;
  ShowAttachmentFile = false;
  ShowAttachmentNotes = false;
  notesCount = 0;
  filesCount = 0;
  matDialogRefin:any
  profileName: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private router: Router,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<CreateUserComponent>,
    private matDialogRef: MatDialogRef<CreateUserComponent>,
    private manageUsersService: ManageUsersService,
    private manageuserrservice: ManageuserService,
    private manageContactsService: ManageContactsService,
    private messageService: MessageService,
    private googleAddress: GoogleValidationAddressService,
    private fileService: FileService,
    private userService: ManageUsersService,
    private translate: TranslateService
  ) {
    if (localStorage.getItem('lang')) {
      const lang:any=localStorage.getItem('lang')
      this.translate.use(lang);
    } else {
      this.translate.use('English');
    }
    this.userForm = this.formBuilder.group({
      id: [''],
      created: [''],
      FirstName: ['', [Validators.required]],
      LastName: ['', [Validators.required]],
      Gender: ['', Validators.required],
      Position: ['', Validators.required],
      Email: ['', [Validators.required, Validators.email]],
      Address: ['', Validators.required],
      ZipCode: ['', [Validators.required]],
      City: ['', Validators.required],
      Country: ['', Validators.required],
      ManagerId: [''],
      ManageUsers: [[]],
      PhoneNumber: [null],
      Profile: [''],
      profileName: [null],
      isActive: [{ value: 'true', disabled: true }],
      Latitude: [0],
      Longitude: [0],
      Addtages: this.formBuilder.array([]), 
    });
  }

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
    return this.userForm.get('Addtages') as FormArray;
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

  ngOnInit(): void {
    console.log(this.data);
    this.screenType = this.data.screenType;
    if (this.screenType == 'UpdateUser') {
      this.updateuserDialog();
    }
    this.loadUsers();
    this.gettags();
    this.getLocation(this.location);
  }

  loadUsers() {
    this.manageUsersService.findAllUsersDropdown().subscribe((result) => {
      if (result) {
        this.users$ = result;
        this.filteredusers = result;
      }
    });
  }

  filterOptions(value: string, type: string): void {
    console.log(type);
    this.filteredusers = this.users$.filter((option:any) =>
      option.firstName.toLowerCase().includes(value.toLowerCase())
    );
  }

  updateuserDialog() {
    this.manageUsersService
      .fetchUserByIdService(this.data.data.id)
      .subscribe((data: any) => {
        console.log(data);
        this.useriddata = data;
        this.filesCount = data?.filesCount;
        this.notesCount = data?.notesCount;
        this.profilePick = this.useriddata.profilePicture;
        this.profilePickid = this.useriddata.id;
        this.userForm.get('id')?.setValue(this.useriddata.id);
        this.userForm.get('created')?.setValue(this.useriddata.created);
        this.userForm.get('FirstName')?.setValue(this.useriddata.firstName);
        this.userForm.get('LastName')?.setValue(this.useriddata.lastName);
        this.userForm.get('Gender')?.setValue(this.useriddata.gender);
        this.userForm.get('Position')?.setValue(this.useriddata.position);
        this.userForm.get('Email')?.setValue(this.useriddata.email);
        this.userForm.get('Address')?.setValue(this.useriddata.address);
        this.userForm.get('ZipCode')?.setValue(this.useriddata.zipCode);
        this.userForm.get('City')?.setValue(this.useriddata.city);
        this.userForm.get('Country')?.setValue(this.useriddata.country);
        this.profileName = this.useriddata.profileName;
        this.userForm
          .get('Latitude')
          ?.setValue(this.useriddata?.Latitude ? this.useriddata?.Latitude : 0);
        this.userForm
          .get('Longitude')
          ?.setValue(
            this.useriddata?.Longitude ? this.useriddata?.Longitude : 0
          );
        this.userForm.get('PhoneNumber')?.setValue(this.useriddata.phoneNumber);
        this.userForm.get('ManagerId')?.setValue(this.useriddata.managerId);
      });
  }

  onFileChange(e:any) {
    if (this.screenType == 'CreateUser') {
      var file = e.target.files[0];
      this.profileName = file.name;
      var formData = new FormData();
      formData.append('file', file);
      this.userForm
        .get('Profile')
        ?.setValue(file, { emitModelToViewChange: false });

      if (e.target.files) {
        var reader = new FileReader();
        reader.readAsDataURL(e.target.files[0]);
        reader.onload = (event: any) => {
          this.profilePick = event.target.result;
        };
      }
    } else {
      var file = e.target.files[0];
      this.profileName = file.name;
      const id = this.profilePickid;
      var formData = new FormData();
      formData.append('file', file);
      this.manageUsersService
        .updateprofileUserId(id, formData)
        .subscribe((res) => {
          console.log(res);
        });
      if (e.target.files) {
        var reader = new FileReader();
        reader.readAsDataURL(e.target.files[0]);
        reader.onload = (event: any) => {
          this.profilePick = event.target.result;
        };
      }
    }
  }
  onFileSelect(event:any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.userForm.get('Profile')?.setValue(file);
    }
  }

  getLocation(location: string) {
    console.log(location);
    let geocoder = new google.maps.Geocoder();
    geocoder.geocode(
      {
        address: location,
      },
      (results, status) => {
        console.log(results, status);
        if (status == google.maps.GeocoderStatus.OK) {
        } else {
          console.log('Error: ', results, ' & Status: ', status);
        }
      }
    );
  }

  handleAddressChange(place: object) {
    const data = this.googleAddress.getFullAddress(place);
    this.userForm.get('Latitude')?.setValue(data.latitude);
    this.userForm.get('Longitude')?.setValue(data.longitude);

    if (
      data.Address != undefined &&
      data.Address != null &&
      data.Address != 'undefined' &&
      data.Address != 'null'
    ) {
      this.userForm.get('Address')?.setValue(data.Address);
    } else {
      this.userForm.get('Address')?.setValue('');
    }
    if (
      data.pincode != undefined &&
      data.pincode != null &&
      data.pincode != 'undefined' &&
      data.pincode != 'null'
    ) {
      this.userForm.get('ZipCode')?.setValue(data.pincode);
    } else {
      this.userForm.get('ZipCode')?.setValue('');
    }
    if (
      data.city != undefined &&
      data.city != null &&
      data.city != 'undefined' &&
      data.city != 'null'
    ) {
      this.userForm.get('City')?.setValue(data.city);
    } else {
      this.userForm.get('City')?.setValue('');
    }
    if (
      data.country != undefined &&
      data.country != null &&
      data.country != 'undefined' &&
      data.country != 'null'
    ) {
      this.userForm.get('Country')?.setValue(data.country);
    } else {
      this.userForm.get('Country')?.setValue('');
    }
  }

  onSubmit() {
    const formData = new FormData();
     if (this.screenType == 'CreateUser') {
      formData.append('Profile', this.userForm.get('Profile')?.value);
    } else {
      formData.append('id', this.userForm.get('id')?.value);
      formData.append('profileName', this.profileName);
    }
    formData.append('FirstName', this.userForm.get('FirstName')?.value);
    formData.append('LastName', this.userForm.get('LastName')?.value);
    formData.append('Gender', this.userForm.get('Gender')?.value);
    formData.append('Position', this.userForm.get('Position')?.value);
    formData.append('Email', this.userForm.get('Email')?.value);
    formData.append('Address', this.userForm.get('Address')?.value);
    formData.append('ZipCode', this.userForm.get('ZipCode')?.value);
    formData.append('City', this.userForm.get('City')?.value);
    formData.append('Country', this.userForm.get('Country')?.value);
    formData.append('ManagerId', this.userForm.get('ManagerId')?.value);
    let userid = this.userForm.get('ManageUsers')?.value;
    for (var x = 0; x < userid.length; x++) {
      formData.append('ManageUsers[' + x + ']', userid[x]);
    }
    formData.append(
      'PhoneNumber',
      this.userForm.get('PhoneNumber')?.value == null
        ? '0'
        : this.userForm.get('PhoneNumber')?.value
    );
    formData.append('ProfileName', this.userForm.get('profileName')?.value);
    formData.append('isActive', this.userForm.get('isActive')?.value);
    formData.append(
      'Latitude',
      this.userForm.get('Latitude')?.value == null || undefined
        ? 0
        : this.userForm.get('Latitude')?.value
    );
    formData.append(
      'Longitude',
      this.userForm.get('Longitude')?.value == null || undefined
        ? 0
        : this.userForm.get('Longitude')?.value
    );
    this.userForm.value.Addtages.forEach((element:any, index:any) => {
      if (element?.fieldValue != null) {
        formData.append(
          'TagViewModels[' + index + '].fieldName',
          element.fieldName
        );
        formData.append(
          'TagViewModels[' + index + '].fieldType',
          element.fieldType
        );
        formData.append('TagViewModels[' + index + '].tagTableId', '');
        formData.append(
          'TagViewModels[' + index + '].dropdownValues',
          element.dropdownValues
        );
        formData.append(
          'TagViewModels[' + index + '].fieldValue',
          element?.fieldValue == null ? ' ' : element?.fieldValue
        );
      }
      if (element?.fieldType == 'Dropdown') {
        formData.append(
          'TagViewModels[' + index + '].fieldName',
          element.fieldName
        );
        formData.append(
          'TagViewModels[' + index + '].fieldType',
          element.fieldType
        );
        formData.append('TagViewModels[' + index + '].tagTableId', '');
        formData.append(
          'TagViewModels[' + index + '].dropdownValues',
          element.dropdownValues.toString()
        );
        formData.append(
          'TagViewModels[' + index + '].fieldValue',
          element?.fieldValue == null ? ' ' : element?.fieldValue
        );
      }
    });

    if (this.screenType == 'CreateUser') {
      if (localStorage.getItem('DemoOrganation') === 'true') {
        this.popupforerrormessage(
          'This button allows you to add new Users',
          'Create User'
        );
      } else {
        this.manageUsersService.createUserService(formData).subscribe(
          (data: any) => {
            this.dialogRef.close();
            this.router.navigate(['/mail/VerificationEmailSent']);
            this.manageuserrservice.manageuser$.next(true);
          },
          (error) => {
            console.log(error);
            if (error.status == 429) {
              this.ShowerrorMessagePopup(error?.error);
            } else if (error.status == 409) {
              this.ShowerrorMessagePopup(error?.error.response[0].message);
            }
          }
        );
      }
    } else {
      if (localStorage.getItem('DemoOrganation') === 'true') {
        this.popupforerrormessage(
          'This button allows you to Update Users',
          'Update User'
        );
      } else {
        this.manageUsersService.updateUserService(formData).subscribe(
          (data: any) => {
            this.dialogRef.close();
            this.messageService.showMessage(data['response'][0].message); 
            this.router.navigate(['/app/home/management/m/users']);
            this.manageuserrservice.manageuser$.next(true);
          },
          (error) => {
            console.log(error);
          }
        );
      }
    }
  }

  get f() {
    return this.userForm.controls;
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
        data: 'Users',
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
      type: 'Users',
    };
    const deleteorder = this.dialog.open(DeleteCommomComponent, {
      data: { data, type: type, entity: 'Users' },
    });
    deleteorder.afterClosed().subscribe((result: any) => {
      if (result) {
        this.gettageBody().clear();
        this.gettags();
      }
    });
  }

  gettags() {
    this.manageUsersService.gettag('Users').subscribe((data: any) => {
      if (data) {
        data.forEach((element:any, index:number) => {
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
      data: 'Users',
    });
  }

  downloadTemplate() {
    const Name = 'Users';
    this.manageContactsService
      .downloadTemplate(Name)
      .subscribe((result: Blob) => {
        const data: Blob = new Blob([result], {
          type: 'text/csv;charset=utf-8',
        });
        saveAs(data, 'Users.csv');
      });
  }

  // AddFile
  AddFile() {
    const addfile = this.dialog.open(AddFileComponent, {
      disableClose: true,
      width: '500px',
      data: {
        data: this.useriddata,
        attachmentLevel: 'Users',
        ismanage: true,
        type: 'single',
      },
      panelClass: ['addFiles'],
    });
    addfile.afterClosed().subscribe((result) => {
      this.ShowAttachmentFile = true;
      this.ShowAttachmentNotes = true;
      this.updateuserDialog();
      this.findnotesLinked();
      this.findfilesLinked();
    });
  }

  // AddNote
  AddNote() {
    const addnote = this.dialog.open(AddNotesComponent, {
      disableClose: true,
      data: {
        data: this.useriddata,
        attachmentLevel: 'Users',
        ismanage: true,
        type: 'single',
      },
      width: '600px',
      panelClass: ['addNotes'],
    });
    addnote.afterClosed().subscribe((result) => {
      this.ShowAttachmentFile = true;
      this.ShowAttachmentNotes = true;
      this.updateuserDialog();
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
    this.userService.getfile(this.useriddata.id, 'Users').subscribe((res) => {
      this.AttachmentFileList = res;
      this.ShowAttachmentFile = !this.ShowAttachmentFile;
    });
  }
  // findnotesLinked
  findnotesLinked() {
    this.userService.getnotes(this.useriddata.id, 'Users').subscribe((res) => {
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
            this.updateuserDialog();
            this.findnotesLinked();
            this.findfilesLinked();
          });
        });
      }
    } else {
      if (localStorage.getItem('DemoOrganation') === 'true') {
        this.popupforerrormessage(
          'This button allows  to Edit File',
          'Edit File'
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
            this.updateuserDialog();
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
      console.log(data);
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
      this.updateuserDialog();
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
            this.updateuserDialog();
            this.findnotesLinked();
            this.findfilesLinked();
          }
        });
      });
    }
  }

  APIerrormessage(message:any, header:any) {
    this.dialog.open(ApiErrorMessagesComponent, {
      width: '550px',
      data: { message: message, header: header },
      autoFocus: false,
      disableClose: true,
    });
  }

  popupforerrormessage(message:any, header:any) {
    this.dialog.open(PopupErrorMessageComponent, {
      width: '550px',
      data: { message: message, header: header },
      autoFocus: false,
      disableClose: true,
    });
  }

  ShowerrorMessagePopup(message:any) {
    this.dialog.open(MessagePopupComponent, {
      data: { message: message, screenType: 'loginpage' },
      width: '400px',
    });
  }
  ApiSuccessMessages(message:any, header:any) {
    const ApiSuccessMessages = this.dialog.open(ApiSuccessMessagesComponent, {
      width: '500px',
      data: { message: message, header: header },
      autoFocus: false,
      disableClose: true,
    });
    ApiSuccessMessages.afterClosed().subscribe((result: any) => {
      if (result) {
      }
    });
  }
}
