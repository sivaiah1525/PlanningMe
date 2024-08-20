import { Component, Inject, NgZone, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CreateAddNoteService } from '../../../../core/services/create-add-note.service';
import { FileService } from '../../../../core/services/file.service';
import { ManageContactsService } from '../../../../core/services/manage-contacts.service';
import { ManageProductsService } from '../../../../core/services/manage-products.service';
import { ManageSitesService } from '../../../../core/services/manage-sites.service';
import { ManageUsersService } from '../../../../core/services/manage-users.service';
import { ManageTransactionsService } from '../../../../core/services/manage-transactions.service';
import { AddNotesComponent } from '../add-notes/add-notes.component';
import { CalendarService } from '../../../../core/services/calendar.service';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { TranslateService } from '@ngx-translate/core';
import { GoogleApiService } from 'src/app/core/services/SYNC/google-api.service';
import { FindfiletypeService } from '../../../../core/services/findfiletype.service';
import { Subject } from 'rxjs';
import { SynchronizationDataComponent } from 'src/app/core/components/synchronization-data/synchronization-data.component';
import { environment } from 'src/environments/environment';
import { saveAs } from 'file-saver';
declare var google: any;
declare var gapi: any;
declare var OneDrive: any; // Declare OneDrive variable

@Component({
  selector: 'app-add-file',
  templateUrl: './add-file.component.html',
  styleUrls: ['./add-file.component.scss'],
  providers: [CreateAddNoteService],
})
export class AddFileComponent implements OnInit {
  private selectedFileSubject = new Subject<any>();
  selectedFile$ = this.selectedFileSubject.asObservable();
  fileForm: FormGroup;
  selectid: any;
  showbutton: boolean = true;
  Updatebutton = false;
  addNewFileButton = false;
  // s--------------
  AttachmentLevel: any;
  SelectId: any;
  AttachmentSelect = true;
  ismanage = false;
  ismanageType = '';
  managementType = [
    'Users',
    'Contacts',
    'Sites',
    'Products',
    'Orders',
    'Events',
  ]; 
  filterforuserlist: any;
  filterforcontactlist: any;
  filterforsiteslist: any;
  filterforuserGrouplist: any;
  filterforcontactGrouplist: any;
  filterforsiteGrouplist: any;
  filterforProsuctlist: any;
  filterforProsucGrouptlist: any;
  filterfortransactionlist: any;
  filterfororderlist: any;
  filterforeventslist: any;
  // auto chip for keyword
  separatorKeysCodes: number[] = [ENTER, COMMA];
  keywordlist: string[] = [];
  addFileFormdata: any[] = [];
  imagePath: any;
  file :any= [];
  GetFile: any;
  SelactIds:any = [];
  FileName :any= [];
  googleouthAccessToken = null;
  SeletedMedia = 1;
  googledrivefilename = '';
  googledrivefileid = '';
  mediaindexid: any
  setDeveloperKey='AIzaSyD1azakHWpC9tK_HkDHz_LyMUx0Bpn0AQE'
  constructor(
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private matDialogRef: MatDialogRef<AddFileComponent>,
    private manageUsersService: ManageUsersService,
    private manageContactsService: ManageContactsService,
    private manageSitesService: ManageSitesService,
    private manageProductsService: ManageProductsService,
    private fileService: FileService,
    private dialog: MatDialog,
    private createNote: CreateAddNoteService,
    private ManageTransactionsService: ManageTransactionsService,
    private calendarService: CalendarService,
    private translate: TranslateService,
    private google: GoogleApiService,
    private findfiletype: FindfiletypeService,
    private ngZone: NgZone,
  ) {
    if (localStorage.getItem('lang')) {
      const lang:any=localStorage.getItem('lang')
      this.translate.use(lang);
    } else {
      this.translate.use('English');
    }
    this.fileForm = this.formBuilder.group({
      fileBody: this.formBuilder.array([this.createfileBody()]),
    });
    this.openPicker = this.openPicker.bind(this); // Bind openPicker method
    this.pickerCallback = this.pickerCallback.bind(this); // Bind pickerCallback method
  }

  getfileBody() {
    return this.fileForm.get('fileBody') as FormArray;
  }

  getConditionsFormArray(i: number) {
    return this.getfileBody().at(i).get('conditions') as FormArray;
  }

  getvaluoption(i:number, j:number) {
    return this.getConditionsFormArray(i).at(j).get('attachmentLevel')?.value;
  }

  addConditionalBody() {
    this.getfileBody().push(this.createfileBody());
    let details = this.getfileBody().value;
    this.addCondition(details.length - 1);
  }

  createfileBody(): FormGroup {
    return this.formBuilder.group({
      id: [''],
      title: ['', Validators.required],
      isPrivate: [false, Validators.required],
      uploadfile: ['', Validators.required],
      keyword: [''],
      SelectMediaType: [1],
      conditions: this.formBuilder.array([]),
    });
  }
  removeConditionalBody(i: number) {
    this.getfileBody().removeAt(i);
  }
  removeConditiona(i: number, j: number) {
    this.getConditionsFormArray(i).removeAt(j);
  }

  // Conditions
  addCondition(i: number) {
    this.getConditionsFormArray(i).push(this.createCondition());
  }

  createCondition() {
    return this.formBuilder.group({
      attachmentLevel: ['', Validators.required],
      selectid: ['', Validators.required],
      selectGroup: ['', Validators.required],
    });
  }

  ngOnInit() {
    console.log(this.data);
    this.getdatafordroupdown();
    if (this.data) {
      if (this.data?.attachmentLevel == true) {
        this.addNewFileButton = true;
        this.addCondition(0);
      } else if (this.data?.ismanage == true) {
        this.addCondition(0);
        if (this.data?.attachmentLevel == 'Events') {
          this.getfileBody()
            .at(0)
            .get('isPrivate')
            ?.setValue(this.data.data?.isPublic == true ? false : true);
          this.getConditionsFormArray(0)
            .at(0)
            .get('selectid')
            ?.setValue(this.data.data?.id);
          this.getConditionsFormArray(0)
            .at(0)
            .get('attachmentLevel')
            ?.setValue(this.data?.attachmentLevel);
        } else {
          if (this.data?.type == 'single') {
            this.getConditionsFormArray(0)
              .at(0)
              .get('selectGroup')
              ?.setValue(this.data.data?.id);
            this.getConditionsFormArray(0)
              .at(0)
              .get('attachmentLevel')
              ?.setValue(this.data?.attachmentLevel);
          } else {
            this.getConditionsFormArray(0)
              .at(0)
              .get('selectid')
              ?.setValue(this.data.data?.id);
            this.getConditionsFormArray(0)
              .at(0)
              .get('attachmentLevel')
              ?.setValue(this.data?.attachmentLevel);
          }
        }
        this.ismanageType = this.data?.type;
        this.AttachmentLevel = this.data?.attachmentLevel;
        this.SelectId = this.data?.data?.id;
        this.AttachmentSelect = false;
        this.ismanage = true;
      } else if (this.data?.FileEdit == true) {
        this.Updatebutton = true;
        this.keywordlist = this.data.data.keywords;
        this.FileName = this.data.data.fileName;
        this.getfileBody().at(0).get('title')?.setValue(this.data.data.title);
        this.getfileBody()
          .at(0)
          .get('isPrivate')
          ?.setValue(this.data.data.isPrivate);
        this.getfileBody().at(0).get('id')?.setValue(this.data.data.id);
        this.data.data.attachementDtos.forEach((res:any, index:number) => {
          this.SelactIds.length = 0;
          this.addCondition(0);
          this.getConditionsFormArray(0)
            .at(index)
            .get('attachmentLevel')
            ?.setValue(res.attachmentLevel);
          if (res.attachmentLevel == 'Users') {
            const selectedIds = res.selectedIds.split(',');
            if (res.isGroup == true) {
              this.getConditionsFormArray(0)
                .at(index)
                .get('selectGroup')
                ?.setValue(selectedIds);
            } else if (res.isGroup == false) {
              this.getConditionsFormArray(0)
                .at(index)
                .get('selectid')
                ?.setValue(selectedIds);
            }
          } else {
            const selectedIds = res.selectedIds.split(',');
            selectedIds.forEach((e:any) => {
              this.SelactIds.push(Number(e));
            });
            if (res.isGroup == true) {
              this.getConditionsFormArray(0)
                .at(index)
                .get('selectGroup')
                ?.setValue(this.SelactIds);
            } else if (res.isGroup == false) {
              this.getConditionsFormArray(0)
                .at(index)
                .get('selectid')
                ?.setValue(this.SelactIds);
            }
          }
        });
      }
    }
  }

  // s-------------
  // CreateFile
  CreateFile() {
    this.getfileBody().at(0).get('keyword')?.setValue(this.keywordlist);
    if (this.ismanage == true) {
      this.createFileForMangement();
    } else {
      this.matDialogRef.close(this.fileForm.value.fileBody);
    }
  }

  onSelect(event:any, ind: number) {
    const reader = new FileReader();
    if (event.target.files.length > 0) {
      this.imagePath = '';
      const file = event.target.files[0];
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (event) => { };
      this.file[ind] = file;
      this.FileName[ind] = file.name;
      this.getfileBody().at(ind).get('uploadfile')?.setValue(file, { emitModelToViewChange: false });
    }
  }


  getdatafordroupdown() {
    // get all users
    this.manageUsersService.findAllUsersDropdown().subscribe((res: any) => {
      console.log(res);
      const data = res;
      this.filterforuserlist = data;
    });
    // get all contacts
    this.manageContactsService.findAllContactsDropdown().subscribe((res) => {
      console.log(res);
      const data = res;
      this.filterforcontactlist = data;
    });
    //get all sites
    this.manageSitesService.findAllSitesDropdown().subscribe((res) => {
      const data = res;
      this.filterforsiteslist = data;
    });
    // get all product
    this.manageProductsService.findAllProductsDropdown().subscribe((res) => {
      console.log(res);
      const data = res;
      this.filterforProsuctlist = data;
    });
    // get all transaction
    this.ManageTransactionsService.fetchTransactionsServices(
      1000,
      1,
      ''
    ).subscribe((res: any) => {
      console.log(res);
      const data = res.data;
      this.filterfortransactionlist = data;
    });

    // get all orders
    this.ManageTransactionsService.FindOrderDropdown().subscribe((res: any) => {
      console.log(res);
      this.filterfororderlist = res;
    });
    // get all events
    this.calendarService.getAllEvents().subscribe((res: any) => {
      console.log(res);
      const data = res;
      this.filterforeventslist = data;
    });
    // get all User Group
    this.manageUsersService.findAllUsersGroupDropdown().subscribe((res) => {
      console.log(res);
      const data = res;
      this.filterforuserGrouplist = data;
    });
    // get all contact Group
    this.manageContactsService
      .findAllContactsGroupDropdown()
      .subscribe((res) => {
        console.log(res);
        const data = res;
        this.filterforcontactGrouplist = data;
      });
    // get all siteGroup
    this.manageSitesService.findAllSitesGroupDropdown().subscribe((res) => {
      console.log(res);
      const data = res;
      this.filterforsiteGrouplist = data;
    });
    // get all product group
    this.manageProductsService
      .findAllProductsGroupDropdown()
      .subscribe((res) => {
        console.log(res);
        const data = res;
        this.filterforProsucGrouptlist = data;
      });
  }

  // ----------------
  // auto chip for keyword
  // -----------
  add(event: MatChipInputEvent, index:number) {
    const value = (event.value || '').trim();
    if (value) {
      this.keywordlist.push(value);
    }
    event.input.value = '';
  }
  remove(value: string) {
    const index = this.keywordlist.indexOf(value);
    if (index >= 0) {
      this.keywordlist.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent) {
    this.keywordlist.push(event.option.viewValue);
  }

  // UpdateFile
  UpdateFile() {
    this.getfileBody().at(0).get('keyword')?.setValue(this.keywordlist);
    const todayDate = new Date();
    const formData = new FormData();
    this.fileForm.value.fileBody.forEach((res:any, index:number) => {
      formData.append('file', res.uploadfile);
      formData.append('id', res.id);
      formData.append('Title', res.title);
      formData.append('IsPrivate', res.isPrivate);
      formData.append('Keywords', res.keyword);
      formData.append('Created', todayDate.toISOString());
      res.conditions.forEach((res:any, index:number) => {
        if (res.selectid.length >= 1) {
          formData.append(
            'Entities[' + index + '].AttachmentLevel',
            res.attachmentLevel
          );
          formData.append('Entities[' + index + '].SelectIds', res.selectid);
          formData.append('Entities[' + index + '].IsGroup', 'false');
        }
        if (res.selectGroup.length >= 1) {
          formData.append(
            'Entities[' + index + '].AttachmentLevel',
            res.attachmentLevel
          );
          formData.append('Entities[' + index + '].SelectIds', res.selectGroup);
          formData.append('Entities[' + index + '].IsGroup', 'true');
        }
      });
    });

    this.fileService.UpdateFile(formData).subscribe((data) => {
      if (data) {
        this.snackBar.open(data[0], '', { duration: 2000 });
        this.matDialogRef.close(true);
      }
    });
  }

  // Create File For Managenamt Screen
  createFileForMangement() {
    const todayDate = new Date();
    const formData = new FormData();
    this.fileForm.value.fileBody.forEach((res:any, index:number) => {
      formData.append('model[' + index + '].file', res.uploadfile);
      formData.append('model[' + index + '].Title', res.title);
      formData.append('model[' + index + '].IsPrivate', res.isPrivate);
      formData.append(
        'model[' + index + '].Keywords',
        this.keywordlist.toString()
      );
      formData.append('model[' + index + '].Created', todayDate.toISOString());
      if (this.ismanageType == 'single') {
        formData.append(
          'model[' + index + '].Entities[' + index + '].AttachmentLevel',
          this.AttachmentLevel
        );
        formData.append(
          'model[' + index + '].Entities[' + index + '].SelectIds',
          this.SelectId
        );
        formData.append(
          'model[' + index + '].Entities[' + index + '].IsGroup',
          'false'
        );
      } else if (this.ismanageType == 'group') {
        formData.append(
          'model[' + index + '].Entities[' + index + '].AttachmentLevel',
          this.AttachmentLevel
        );
        formData.append(
          'model[' + index + '].Entities[' + index + '].SelectIds',
          this.SelectId
        );
        formData.append(
          'model[' + index + '].Entities[' + index + '].IsGroup',
          'true'
        );
      } else if (this.AttachmentLevel == 'Events') {
        formData.append(
          'model[' + index + '].Entities[' + index + '].AttachmentLevel',
          this.AttachmentLevel
        );
        formData.append(
          'model[' + index + '].Entities[' + index + '].SelectIds',
          this.data.data
        );
        formData.append(
          'model[' + index + '].Entities[' + index + '].IsGroup',
          'false'
        );
      }
    });

    this.fileService.createFile(formData).subscribe((data) => {
      if (data) {
        this.snackBar.open(data[0], '', { duration: 2000 });
        this.matDialogRef.close(true);
      }
    });
  }


  checkgoogleouthAccessToken(index:any,ActionName:any){
    this.mediaindexid=index
    const viewDialog=this.dialog.open(SynchronizationDataComponent, {
      width: '100%',
      data: { ScreenType:'FilesAndNotesPage',ActionName:ActionName},
      autoFocus: false,
      disableClose: true,
    });
    viewDialog.afterClosed().subscribe((result) => {
      if (result) {
        console.log(result)
        if(ActionName=='GoogleDrive'){
          this.openPicker(index,result.accessToken);
          localStorage.setItem('outhAccessToken',result.accessToken)
        }else if(ActionName=='Onedrive'){
          this.openOneDrivePickeroptions(result.accessToken)
          localStorage.setItem('outhAccessToken',result.accessToken)

        }
      }
    });
  }






// 111111111111111 
// onedive picker 
  openOneDrivePickeroptions(accessToken:any) {
    const options = {
      clientId: environment.mircosoftclintId,
      action: 'queryldownload',
      advanced: {
        redirectUri: environment.MicrosoftredirectUri,
        queryParameters: 'select=id,name,size,file,folder',
        accessToken: accessToken
      },
      success: (files: any) => {
        console.log(files['value'][0]);
        if (files) {
          const selectedFile = files['value'][0];
         const fileId = selectedFile.id;
         const fileName = selectedFile.name;
         this.FileName[this.mediaindexid] = fileName;
         const fileSize = selectedFile.size;
         const mimeType = selectedFile.file.mimeType;
         this.handlePickedItemsonedrive(fileId,fileName)
        }
      }
      
    };
    OneDrive.open(options);
  }

  handlePickedItemsonedrive(fileId:any,fileName:any) {
    const outhAccessToken:any = localStorage.getItem('outhAccessToken')
    this.google.GetFileFromDrive(outhAccessToken, fileId, fileName,true).subscribe((result:Blob) => {
      if (result) {
        console.log(result)
        const file = new File([result], fileName, { type: result.type, lastModified: Date.now() });
        this.file[this.mediaindexid] = file;
        this.FileName[this.mediaindexid] = fileName;
        this.getfileBody().at(this.mediaindexid).get('uploadfile')
        ?.setValue(file, { emitModelToViewChange: false });
      }
    })
    console.log(this.getfileBody())
  }









// 000000000000 
// google Drive 
  openPicker(index:number,AccessToken:any) {
    this.mediaindexid = index
    gapi.load('picker', () => {
      const picker = new google.picker.PickerBuilder()
        .addView(google.picker.ViewId.DOCS)
        .setOAuthToken(AccessToken)
        .setDeveloperKey(this.setDeveloperKey)
        .setCallback(this.pickerCallback)
        .build();
      picker.setVisible(true);
    });
  }
  pickerCallback(data: any) {
    if (data.action === google.picker.Action.PICKED) {
      this.googledrivefilename = data.docs[0].name;
      this.googledrivefileid = data.docs[0].id;
      this.FileName[this.mediaindexid] = data.docs[0].name;
      this.handlePickedItemsgoogle(data.docs);
    }
  }

  handlePickedItemsgoogle(docs: any[]) {
    const outhAccessToken:any= localStorage.getItem('outhAccessToken')
    this.google.GetFileFromDrive(outhAccessToken, docs[0].id, docs[0].name,false).subscribe((result:Blob) => {
      if (result) {
        console.log(result)
        const file = new File([result], docs[0].name, { type: result.type, lastModified: Date.now() });
        this.file[this.mediaindexid] = file;
        this.FileName[this.mediaindexid] = docs[0].name;
        this.getfileBody().at(this.mediaindexid).get('uploadfile')
        ?.setValue(file, { emitModelToViewChange: false });
      }
    })
    console.log(this.getfileBody())
  }
}





