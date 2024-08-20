import { Component, OnInit, TemplateRef, Inject } from '@angular/core';
import { MessageService } from 'src/app/core/services/message.service';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { ManageContactsService } from 'src/app/core/services/manage-contacts.service';
import { ManageUsersService } from 'src/app/core/services/manage-users.service';
import { User } from 'src/app/core/models/user.model';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ManagecontactService } from 'src/app/pages/management/manage-contacts/managecontact.service';
import { GoogleMapsAPIWrapper, MapsAPILoader } from '@agm/core';
import { ManageimportComponent } from '../../manageimport/manageimport.component';
import { saveAs } from "file-saver";
import { ManageSitesService } from 'src/app/core/services/manage-sites.service';
import { GoogleValidationAddressService } from 'src/app/core/services/google-validation-address.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AddtagCommonComponent } from 'src/app/pages/commonForAll/addtag-common/addtag-common.component';
import { DeleteCommomComponent } from 'src/app/pages/commonForAll/delete-commom/delete-commom.component';
import * as FileSaver from 'file-saver';
import { AddFileNotesComponent } from 'src/app/pages/files/components/add-file-notes/add-file-notes.component';
import { FilesAndNotesShareLinkComponent } from 'src/app/pages/files/components/files-and-notes-share-link/files-and-notes-share-link.component';
import { AddFileComponent } from 'src/app/pages/files/components/add-file/add-file.component';
import { AddNotesComponent } from 'src/app/pages/files/components/add-notes/add-notes.component';
import { FileService } from 'src/app/core/services/file.service';
import { ViewNotesComponent } from 'src/app/pages/files/components/view-notes/view-notes.component';
import { FileandnotesformanagementComponent } from 'src/app/pages/commonForAll/fileandnotesformanagement/fileandnotesformanagement.component';
import { PopupErrorMessageComponent } from 'src/app/popup-error-message/popup-error-message.component';
import { TranslateService } from '@ngx-translate/core';
import { ApiErrorMessagesComponent } from 'src/app/api-error-messages/api-error-messages.component';

export interface tagLinks {
  fieldName: any;
  fieldType: any;
  tagTableId: any;
  fieldValue: any;
  dropdownValues: any;
  isChecked: any;

}

@Component({
  selector: 'app-create-contact',
  templateUrl: './create-contact.component.html'
})



export class CreateContactComponent implements OnInit {
  contactForm: FormGroup;
  users$!: Observable<User[]>;

  sites$=[];
  filteredsites=[];
  additionalFieldLines: any[] = [];
  lineCounter!: number;
  isProspect: boolean = false;
  imageArray: any;
  dropdown!: boolean;
  selectedradioval: any;
  // selectedFile: ImageSnippet;
  viewtagmodel :any= {};
  showcheckbox!: boolean;
  selectednumeralval: any;
  tagarray :any= [];
  Freefeild :any= {};
  viewnumeral :any= {};
  showfreefeild!: boolean;
  value!: any;
  dropdownvalue:any = [];
  i = 1;
  tagViewModels :any= [];
  tags: tagLinks[] = []; tagfreefeild: any;
  ;
  dropdownfeild :any= {};
  tagvalues :any= {};
  tag: any;
  datadelete: any;
  datadeleteindex: any;
  checked: any;
  selectedvalue: any;
  selectedtagvalue: any;
  tagboolean :any= [];
  email: any;
  profilePick: any;
  profilePickid: any
  options = {
    types: ['geocode'],
    componentRestrictions: { country: 'FR' }
  }
  screenType = ''
  AttachmentFileCount: any;
  AttachmentFileList: any;
  AttachmentNotesCount: any;
  AttachmentNotesList: any;
  ShowAttachmentFile = false
  ShowAttachmentNotes = false
  ContactsDetails: any
  notesCount = 0;
  filesCount = 0;
  profileName:any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private router: Router,
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<CreateContactComponent>,
    private messageService: MessageService,
    private manageSitesService: ManageSitesService,
    private manageContactsService: ManageContactsService,
    private managecontactsService: ManagecontactService,
    private manageUsersService: ManageUsersService,
    private googleAddress: GoogleValidationAddressService,
    private snackBar: MatSnackBar,
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
          this.contactForm = this.formBuilder.group({
      id: [''],
      FirstName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      LastName: ['', [Validators.minLength(3), Validators.maxLength(20)]],
      Gender: [''],
      Position: [''],
      profileName:[null],
      Email: ['', [Validators.email]],
      Address: ['', Validators.required],
      ZipCode: ['', Validators.required],
      City: ['', Validators.required],
      Country: ['', Validators.required],
      Latitude: [0],
      Longitude: [0],
      ContactType: ['', Validators.required],
      UserId: [[]],
      SiteId: [[]],
      PhoneNumber: [null],
      Profile: [null],
      isActive: [{ value: 'true', disabled: true }],
      isProspect: [this.isProspect],
      tagViewModels: [[]],
      Addtages: this.formBuilder.array([])
    });
  }


  // tag 
  createtageBody(): FormGroup {
    return this.formBuilder.group({
      tagTableId: 0,
      fieldName: '',
      fieldType: '',
      fieldValue: '',
      dropdownValues: '',
      dropdownvaluetotal: ''

    })
  }
  gettageBody() {
    return this.contactForm.get('Addtages') as FormArray;
  }
  addtageBody() {
    this.gettageBody().push(this.createtageBody())
  }
  fieldname(i: number) {
    return this.gettageBody().at(i).get('fieldName')?.value
  }
  dropdownvaluetotal(i: number) {
    return this.gettageBody().at(i).get('dropdownvaluetotal')?.value.split(',')
  }
  fieldType(i: number) {
    return this.gettageBody().at(i).get('fieldType')?.value
  }
  tagTableId(i: number) {
    return this.gettageBody().at(i).get('tagTableId')?.value
  }
  removeConditionalBody(i: number) {
    this.gettageBody().removeAt(i);
  }



  ngOnInit(): void {
    this.screenType = this.data.screenType
    if (this.data.screenType == 'CreateContact') {
    } else {
      this.updateContactDialog()
    }
    this.sites$ = [];
    this.loadUsers();
    this.loadSites();
    this.gettags();
  }

  updateContactDialog() {
    this.manageContactsService.fetchContactByIdService(this.data.data.id).subscribe((data: any) => {
      console.log(data)
      this.ContactsDetails = data
      this.filesCount = data?.filesCount
      this.notesCount = data?.notesCount
      this.profilePickid = data.id
      this.profilePick = data.profilePicture
      this.contactForm.get('isProspect')?.setValue(data.isProspect);
      this.contactForm.get('id')?.setValue(data.id);
      this.contactForm.get('FirstName')?.setValue(data.firstName);
      this.contactForm.get('LastName')?.setValue(data.lastName);
      this.contactForm.get('Email')?.setValue(data.email);
      this.contactForm.get('Gender')?.setValue(data?.Gender ? data?.Gender : 'Male');
      this.contactForm.get('PhoneNumber')?.setValue(data.phoneNumber);
      this.contactForm.get('Position')?.setValue(data.position);
      this.contactForm.get('Address')?.setValue(data.address);
      this.contactForm.get('ZipCode')?.setValue(data.zipCode);
      this.contactForm.get('City')?.setValue(data.city);
      this.contactForm.get('Country')?.setValue(data.country);
      this.contactForm.get('Latitude')?.setValue(data?.latitude ? data?.latitude : 0);
      this.contactForm.get('Longitude')?.setValue(data?.longitude ? data?.longitude : 0);
      this.contactForm.get('SiteId')?.setValue(data.siteId);
      this.contactForm.get('ContactType')?.setValue(data.contactTypeName);
      this.profileName=data.profileName
      if (data.tagViewModels && data.tagViewModels.length > 0) {
        data.tagViewModels.forEach((tagViewModel: any) => {
          // Check if tagViewModel with the same identifier exists in Addtages FormArray
          let existingIndex = this.gettageBody().controls.findIndex(control =>
            control.get('tagTableId')?.value === tagViewModel.tagTableId
          );
  
          if (existingIndex !== -1) {
            // Update existing FormGroup at existingIndex
            this.gettageBody().at(existingIndex).patchValue(tagViewModel);
          } else {
            // Create new FormGroup and add to Addtages FormArray
            let tagFormGroup = this.createtageBody(); // Create a new FormGroup for each tag
            tagFormGroup.patchValue(tagViewModel); // Patch values from tagViewModel into the FormGroup
            this.gettageBody().push(tagFormGroup); // Push the FormGroup into the Addtages FormArray
          }
        });
      }
    });


  }


  createContactService(data:any): FormGroup {
    return this.formBuilder.group(data);
  }

  // Help to get all photos controls as form array.
  get UserId(): FormArray {
    return this.contactForm.get('UserId') as FormArray;
  }


  onFileSelect(event:any) {
    if (this.data.screenType == 'CreateContact') {
      if (event.target.files.length > 0) {
        const file = event.target.files[0];
        this.profileName=file.name
        this.contactForm.get('Profile')?.setValue(file);
        if (event.target.files) {
          var reader = new FileReader();
          reader.readAsDataURL(event.target.files[0]);
          reader.onload = (event: any) => {
            this.profilePick = event.target.result
          }
        }
      }
    } else {
      var file = event.target.files[0];
      this.profileName=file.name
      this.contactForm.get('Profile')?.setValue(file);
      console.log(file)
      if (event.target.files) {
        var reader = new FileReader();
        reader.readAsDataURL(event.target.files[0]);
        reader.onload = (event: any) => {
          this.profilePick = event.target.result
        }
      }
      const id = this.profilePickid
      var formData = new FormData();
      formData.append('Profile', file);
      this.manageContactsService.updateprofileContactId(id, formData).subscribe((res) => {
        console.log(res)
      })

      if (event.target.files) {
        var reader = new FileReader();
        reader.readAsDataURL(event.target.files[0]);
        reader.onload = (event: any) => {
          this.profilePick = event.target.result
        }
      }
      this.snackBar.open('successfully Update Profile', 'Undo', { duration: 4000 });
    }


  }


  onSubmit() {
    console.log(this.contactForm?.value)
    const formData = new FormData();
    if (this.data.screenType == 'CreateContact') {
      formData.append('Profile', this.contactForm.get('Profile')?.value);
    } else {
      formData.append('id', this.contactForm.get('id')?.value);
      formData.append('profileName', this.profileName);
    }
    formData.append('FirstName', this.contactForm.get('FirstName')?.value);
    formData.append('LastName', this.contactForm.get('LastName')?.value);
    formData.append('Position', this.contactForm.get('Position')?.value);
    formData.append('Email', this.contactForm.get('Email')?.value);
    formData.append('Address', this.contactForm.get('Address')?.value);
    formData.append('ZipCode', this.contactForm.get('ZipCode')?.value);
    formData.append('City', this.contactForm.get('City')?.value);
    formData.append('Country', this.contactForm.get('Country')?.value);
    formData.append('Latitude', this.contactForm.get('Latitude')?.value == null || undefined ? 0 : this.contactForm.get('Latitude')?.value);
    formData.append('Longitude', this.contactForm.get('Longitude')?.value == null || undefined ? 0 : this.contactForm.get('Longitude')?.value);
    formData.append('ContactType', this.contactForm.get('ContactType')?.value);
    let userid = this.contactForm.get('UserId')?.value;
    for (var x = 0; x < userid.length; x++) {
      formData.append('UserId', userid[x]);
    }
    if(this.contactForm.get('SiteId')?.value?.length !=0){
      this.contactForm.get('SiteId')?.value?.forEach((element:any,index:number) => {
        formData.append('SiteIds[' + index + ']', element);
      });
    }
    formData.append('PhoneNumber', this.contactForm.get('PhoneNumber')?.value==null?0:this.contactForm.get('PhoneNumber')?.value);
    formData.append('isActive', this.contactForm.get('isActive')?.value);
    formData.append('isProspect', this.contactForm.get('isProspect')?.value);

    this.contactForm?.value.Addtages.forEach((element:any,index:number) => {
      if (element?.fieldValue != null) {
        formData.append('TagViewModels[' + index + '].fieldName', element.fieldName);
        formData.append('TagViewModels[' + index + '].fieldType', element.fieldType);
        formData.append('TagViewModels[' + index + '].tagTableId', '');
        formData.append('TagViewModels[' + index + '].dropdownValues', element.dropdownValues);
        formData.append('TagViewModels[' + index + '].fieldValue', element?.fieldValue == null ? ' ' : element?.fieldValue);
      }
      if (element?.fieldType == 'Dropdown') {
        formData.append('TagViewModels[' + index + '].fieldName', element.fieldName);
        formData.append('TagViewModels[' + index + '].fieldType', element.fieldType);
        formData.append('TagViewModels[' + index + '].tagTableId', '');
        formData.append('TagViewModels[' + index + '].dropdownValues', element.dropdownValues.toString());
        formData.append('TagViewModels[' + index + '].fieldValue', element?.fieldValue == null ? ' ' : element?.fieldValue);
      }
    })

    if (this.data.screenType == 'CreateContact') {
      if (localStorage.getItem('DemoOrganation') === 'true') {
        this.popupforerrormessage(
          'This button allows you to add new Contact',
          'Create Contact'
        );
      } else {
      this.manageContactsService.createContactService(formData).subscribe((data:any) => {
        this.dialogRef.close();
        this.messageService.showMessage(data['response'][0].message);
        this.router.navigate(['/home/dash/management/m/contacts']);
        this.managecontactsService.managecontact$.next(true);
      },error=>{
        console.log(error)
        if(error.status==429){
          this.APIerrormessage(error?.error,'Create Contacts')
        }
      });
    }
    } else {
      if (localStorage.getItem('DemoOrganation') === 'true') {
        this.popupforerrormessage(
          'This button allows you to add new Contact',
          'Create Contact'
        );
      } else {
      this.manageContactsService.updateContactService(formData).subscribe((data:any) => {
        this.dialogRef.close();
        this.messageService.showMessage(data['response'][0].message);
        this.router.navigate(['/home/dash/management/m/contacts']);
        this.managecontactsService.managecontact$.next(true);
      });
    }
    }

  }






  filterOptions(value: string,type:string): void {
      this.filteredsites = this.sites$.filter((option:any) =>
        option.companyName.toLowerCase().includes(value.toLowerCase())
      );
  }

 




  isProspectChecked(value: boolean) {
    this.isProspect = value;
  }

  loadUsers() {
    this.users$ = this.manageUsersService.findAllUsersDropdown();
  }

  loadSites() {
    this.manageContactsService.fetchSite().subscribe((result:any) => {
      if(result){
        this.sites$=result
        this.filteredsites=result

      }
    });
  }

  addAdditionalFieldLine() {
    this.value = this.i + 1;
    this.dropdownvalue.push(this?.value);
    this.i = this?.value;
  }

  deleteAdditionalFieldLine(index: number) {
    this.additionalFieldLines.splice(index, 1);
  }
  get f() {
    return this.contactForm.controls;
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
      data: 'Contacts',
    });
    openAddEventDialog.afterClosed().subscribe((result: any) => {
      if (result) {
        this.gettageBody().clear()
        this.gettags();
      }
    })
  }
  }

  deletetagDialog(i:any, type:any,) {
    const data = {
      id: this.tagTableId(i),
      type: 'Contacts'
    }
    const deleteorder = this.dialog.open(DeleteCommomComponent, { data: { data, type: type, entity: 'Contacts' } });
    deleteorder.afterClosed().subscribe((result: any) => {
      if (result) {
        this.gettageBody().clear()
        this.gettags();
      }
    })
  }

  gettags() {
    this.manageContactsService.gettag('Contacts').subscribe((data: any) => {
      console.log(data)
      if (data) {
        data.forEach((element:any, index:any) => {
          this.addtageBody()
          this.gettageBody().at(index).get('tagTableId')?.setValue(element?.tagTableId)
          this.gettageBody().at(index).get('fieldName')?.setValue(element?.fieldName)
          this.gettageBody().at(index).get('fieldType')?.setValue(element?.fieldType)
          this.gettageBody().at(index).get('fieldValue')?.setValue(element?.fieldValue)
          this.gettageBody().at(index).get('dropdownvaluetotal')?.setValue(element?.dropdownValues)
        });
      }
      this.tags = data;
    });
  }

  updateAddress(eve:any) {
    this.manageSitesService.fetchSiteByIdService(eve?.value).subscribe((res) => {
      if (res) {
        console.log(res)
        this.contactForm.get('Address')?.setValue(res.address);
        this.contactForm.get('City')?.setValue(res.city);
        this.contactForm.get('Country')?.setValue(res.country);
        this.contactForm.get('ZipCode')?.setValue(res.zipCode);
      }
    })
  }


  handleAddressChange(place: object) {
    const data = this.googleAddress.getFullAddress(place)
    this.contactForm.get('Latitude')?.setValue(data.latitude);
    this.contactForm.get('Longitude')?.setValue(data.longitude);

    console.log(data)
    if (data.Address != undefined && data.Address != null && data.Address != 'undefined' && data.Address != 'null') {
      this.contactForm.get('Address')?.setValue(data.Address);
    } else {
      this.contactForm.get('Address')?.setValue('');
    }
    if (data.pincode != undefined && data.pincode != null && data.pincode != 'undefined' && data.pincode != 'null') {
      this.contactForm.get('ZipCode')?.setValue(data.pincode);
    } else {
      this.contactForm.get('ZipCode')?.setValue('');
    }
    if (data.city != undefined && data.city != null && data.city != 'undefined' && data.city != 'null') {
      this.contactForm.get('City')?.setValue(data.city);
    } else {
      this.contactForm.get('City')?.setValue('');
    }
    if (data.country != undefined && data.country != null && data.country != 'undefined' && data.country != 'null') {
      this.contactForm.get('Country')?.setValue(data.country);
    } else {
      this.contactForm.get('Country')?.setValue('');
    }
  }


  closedialogbox() {
    this.dialog.closeAll();
  }


  importdata() {
    const openAddEventDialog = this.dialog.open(ManageimportComponent, {
      width: '500px',
      autoFocus: false,
      disableClose: true,
      data: 'Contacts',
    });
  }

  downloadTemplate() {
    const Name = 'Contacts'
    this.manageContactsService.downloadTemplate(Name).subscribe((result: Blob) => {
      const data: Blob = new Blob([result], {
        type: "text/csv;charset=utf-8"
      });
      saveAs(data, "Contacts.csv");
    })
  }

  // AddFile
  AddFile() {
    const addfile = this.dialog.open(AddFileComponent, {
      disableClose: true,
      width: '500px',
      data: {
        data: this.ContactsDetails,
        attachmentLevel: 'Contacts',
        ismanage: true,
        type: 'single'
      },
      panelClass: ['addFiles']
    });
    addfile.afterClosed().subscribe(result => {
      console.log(result);
      this.ShowAttachmentFile = true
      this.ShowAttachmentNotes = true
      this.updateContactDialog();
      this.findnotesLinked();
      this.findfilesLinked();

    });
  }

  // AddNote
  AddNote() {
    const addnote = this.dialog.open(AddNotesComponent, {
      disableClose: true,
      data: {
        data: this.ContactsDetails,
        attachmentLevel: 'Contacts',
        ismanage: true,
        type: 'single'
      },
      width: '600px',
      panelClass: ['addNotes']
    });
    addnote.afterClosed().subscribe(result => {
      console.log(result);
      this.ShowAttachmentFile = true
      this.ShowAttachmentNotes = true
      this.updateContactDialog();
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
  // findfilesLinked 
  findfilesLinked() {
    this.userService.getfile(this.ContactsDetails.id, 'Contacts').subscribe((res) => {
      this.AttachmentFileList = res;
      this.ShowAttachmentFile = !this.ShowAttachmentFile
    });
  }
  // findnotesLinked
  findnotesLinked() {
    this.userService.getnotes(this.ContactsDetails.id, 'Contacts').subscribe((res) => {
      this.AttachmentNotesList = res;
      console.log(this.AttachmentNotesList)
      this.ShowAttachmentNotes = !this.ShowAttachmentNotes
    });
  }
  // ViewLink 
  ViewLink(name:any, id:any) {
    if (name == 'File') {
      this.fileService.getFile(id).subscribe((res) => {
        console.log(res)
        if (res) {
          window.open(res.attachedFile, '_blank');
        }
      })
    } else {
      this.fileService.getNote(id,1,10).subscribe((res) => {
        console.log(res)
        if (res) {
          window.open(res.notes, '_blank');
        }
      })
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
      data: data
    });
    editFileDialog.afterClosed().subscribe(result => {
      this.ShowAttachmentFile = true
      this.ShowAttachmentNotes = true
      this.updateContactDialog();
      this.findnotesLinked();
      this.findfilesLinked();
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
          this.updateContactDialog();
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
          this.updateContactDialog();
          this.findnotesLinked();
          this.findfilesLinked();
        });
      });
    }
    }
  }


  Downloadfile(data:any) {
    console.log(data)
    if (localStorage.getItem('DemoOrganation') === 'true') {
      this.popupforerrormessage(
        'This button allows  to Download File',
        'download File'
      );
    } else {
    this.fileService.downloadFile(data.id, data?.isPrivate == false ? true : false).subscribe((result) => {
      if (result) {
        const blob = new Blob([result], { type: result.type });
        FileSaver.saveAs(blob);
      }
    }, err => {
      console.log(err)
    })
  }
  }

  // DeleteFileAreNote 
  deleteDialogConfirmation(data:any, type:any) {
    const deleteorder = this.dialog.open(DeleteCommomComponent, { data: { data, type: type } });
    deleteorder.afterClosed().subscribe((result: any) => {
      this.ShowAttachmentFile = true
      this.ShowAttachmentNotes = true
      this.updateContactDialog();
      this.findnotesLinked();
      this.findfilesLinked();
    })
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
      viewNoteDialog.afterClosed().subscribe(result => {
        if (result) {
          this.ShowAttachmentFile = true
          this.ShowAttachmentNotes = true
          this.updateContactDialog();
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
