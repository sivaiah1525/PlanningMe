import { Component, Inject, OnInit } from '@angular/core';
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
import { ManageimportComponent } from 'src/app/pages/management/manageimport/manageimport.component';
import { CalendarService } from '../../../../core/services/calendar.service';
import { FormControl } from '@angular/forms';
import { getAllDayWeekEvents } from 'src/app/core/models/calendar-event.model';
import { FilePageComponent } from '../../file-page/file-page.component';
import { Router } from '@angular/router';
import { th } from 'date-fns/locale';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { CKEditorModule } from 'ckeditor4-angular';
import { TranslateService } from '@ngx-translate/core';
import { NoteSubnoteFormatService } from '../../../../core/services/note-subnote-format.service';
import { PopupErrorMessageComponent } from 'src/app/popup-error-message/popup-error-message.component';
import { SynchronizationDataComponent } from 'src/app/core/components/synchronization-data/synchronization-data.component';
import { GoogleApiService } from 'src/app/core/services/SYNC/google-api.service';HtmlToFileService
import { HtmlToFileService } from 'src/app/core/services/fileAndNote/html-to-file.service';
import { CheckScreenWidthPercentageService } from 'src/app/core/services/check-screen-width-percentage.service';
import { ShowListOfGmailsComponent } from 'src/app/core/components/show-list-of-gmails/show-list-of-gmails.component';


@Component({
  selector: 'app-add-notes',
  templateUrl: './add-notes.component.html',
  styleUrls: ['./add-notes.component.scss'],
  providers: [
    CreateAddNoteService,
    CKEditorModule,
  ],
})
export class AddNotesComponent implements OnInit {
  [x: string]: any;
  myControl = new FormControl('');

  // -------------
  AttachmentLevel: any;
  SelectId: any;
  AttachmentSelect = true;
  titleAndkeywordLevel = true;
  ismanage = false;
  ismanageType = '';
  typeSelact = true;
  Applybutton = true;
  Updatebutton = false;
  AddSubNoteButton = false;
  Richtexteditor = true;
  // ---------
  addNotesForm: FormGroup;
  managementType = [
    'Users',
    'Contacts',
    'Sites',
    'Products',
    'Orders',
    'Events', 
  ];
  LinkMediaType = [
    { name: 'Outlook', url: '../../../../assets/notecreateicons/Outlook.svg', },
    { name: 'Gmail', url: '../../../../assets/notecreateicons/Gmail.svg' },
    // {name:'Whatsapp',url:'../../../../assets/notecreateicons/Whatsapp.svg'},
    // {name:'Twitter',url:'../../../../assets/notecreateicons/Twitter.svg'},
    // {name:'google-meet',url:'../../../../assets/notecreateicons/google-meet.svg'},
    // {name:'Microsoft',url:'../../../../assets/notecreateicons/Microsoft.svg'},
    // {name:'Instagaram',url:'../../../../assets/notecreateicons/instagram.svg'},
    // {name:'Slack',url:'../../../../assets/notecreateicons/slack.svg'},
    // {name:'Facebook',url:'../../../../assets/notecreateicons/Facebook.svg'},
    // {name:'linkedin',url:'../../../../assets/notecreateicons/linkedin.svg'},
    // {name:'Snapchat',url:'../../../../assets/notecreateicons/Snapchat.svg'},
    // {name:'Reddit',url:'../../../../assets/notecreateicons/Reddit.svg'},
  ];
  placeholder: string = 'Write a Note';
  selectName: any;
  date: any;
  action: any;
  rule: any;
  showButton: boolean = true;
  isNote: boolean = false;
privices_Created_Note:any;
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
  editType: any;
  name: any;
  profilepic:any;
  isPrivate!: boolean;
  SubNoteContent: any;
  SelactIds :any= [];
  public editorContent: string = '';
  WithMediastatus=false;
  notedata:any;
  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog,
    private fileService: FileService,
    private _snackBar: MatSnackBar,
    private matDialogRef: MatDialogRef<AddNotesComponent>,
    private manageUsersService: ManageUsersService,
    private manageContactsService: ManageContactsService,
    private manageSitesService: ManageSitesService,
    private manageProductsService: ManageProductsService,
    private createNote: CreateAddNoteService,
    private ManageTransactionsService: ManageTransactionsService,
    private calendarService: CalendarService,
    private FilePageComponent: FilePageComponent,
    private translate: TranslateService,
    public notformat: NoteSubnoteFormatService,
    private google: GoogleApiService,
    private findScreenpresentage:CheckScreenWidthPercentageService,
    private htmlToFile:HtmlToFileService
  ) {
    if (localStorage.getItem('lang')) {
      const lang:any=localStorage.getItem('lang')
      this.translate.use(lang);
    } else {
      this.translate.use('English');
    }
    this.addNotesForm = this.formBuilder.group({
      fileBody: this.formBuilder.array([this.createfileBody()]),
    });
  }

  eventChange(event:any){
    if(event?.value==1||event?.value=='1'){
       this.WithMediastatus=false
    }else if(event?.value==2||event?.value=='2'){
       this.WithMediastatus=true
    }
  }


  getimageformat(value: string) {
    return '../../../../assets/notecreateicons/' + value + '.svg'
  }
  // fileBody 
  getfileBody() {
    return this.addNotesForm.get('fileBody') as FormArray;
  }

  getConditionsFormArray(i: number) {
    return this.getfileBody().at(i).get('conditions') as FormArray;
  }


  getvaluoption(i:number, j:number) {
    return this.getConditionsFormArray(i).at(j).get('attachmentLevel')?.value;
  }

  getLinkMediastatus(i: number) {
    return this.getfileBody().at(i).get('LinkMediastatus')?.value
  }


  getLinkMedianame(i: number, g:number) {
    return this.getmediaConditionsFormArray(i).at(g).get('mediaName')?.value;
  }
  getLinkMediasyncstatus(i: number, g:number) {
    return this.getmediaConditionsFormArray(i).at(g).get('syncstatus')?.value;
  }
  addConditionalBody() {
    this.getfileBody().push(this.createfileBody());
    let details = this.getfileBody()?.value;
    this.addCondition(details.length - 1);
    this.addmediaCondition(details.length - 1);
  }

  createfileBody(): FormGroup {
    return this.formBuilder.group({
      id: [''],
      title: ['', Validators.required],
      isPrivate: [false, Validators.required],
      addNote: ['', Validators.required],
      keyword: [''],
      LinkMediastatus: ['1'],
      SelectedNoteIds: [''],
      LinkMediatype: [],
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


  checkgoogleouthAccessToken(index:number, ActionName:any) {
    const viewDialog = this.dialog.open(SynchronizationDataComponent, {
      width: '100%',
      data: { ScreenType: 'FilesAndNotesPage', ActionName: ActionName },
      autoFocus: false,
      disableClose: true,
    });
    viewDialog.afterClosed().subscribe((result) => {
      if (result) {
        console.log(result) 
        if (ActionName == 'Outlook') {
          this.ShowListOfGmailsComponent(result.accessToken,ActionName)
        } else if (ActionName == 'Gmail') {
          this.ShowListOfGmailsComponent(result.accessToken,ActionName)
        }

      }
    });
  }
  

  ShowListOfGmailsComponent(accessToken:any,ActionName:any) {
    const viewDialog = this.dialog.open(ShowListOfGmailsComponent, {
      width: '500px',
      data: {accessToken: accessToken,ActionName:ActionName },
      autoFocus: false,
      disableClose: true,
    });
    viewDialog.afterClosed().subscribe((result) => {
      if (result) {
        console.log(result)
        result.ActionName=ActionName
      this.CreateSubNoteFromEmail(result,accessToken)
      }
    });
  }





  ngOnInit(): void {
    this.notedata=this.data
    console.log(this.data);
    this.getdatafordroupdown();
    this.admin = localStorage.getItem('userName');
    this.userId = localStorage.getItem('id');
    if (this.data?.attachmentLevel == true) {
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
      this.Richtexteditor = true;
      this.Updatebutton = false;
      this.AddSubNoteButton = false;
      this.Applybutton = true;
      this.ismanageType = this.data?.type;
      this.AttachmentLevel = this.data.attachmentLevel;
      this.SelectId = this.data.data.id;
      this.AttachmentSelect = false;
      this.ismanage = true;
    } else if (this.data?.NoteEdit == true) {
      this.Richtexteditor = false;
      this.Updatebutton = true;
      this.AddSubNoteButton = false;
      this.Applybutton = false;
      this.keywordlist = this.data.data.keywords;
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
    } else if ( this.data?.AddSubNote == true || this.data?.EditSubNote == true ) {
      this.AttachmentSelect = false;
      this.titleAndkeywordLevel = false;
      this.AddSubNoteButton = true;
      this.Richtexteditor = true;
      this.Applybutton = false;
      this.Updatebutton = false;
      // s----------------
      // subNoteEditText
      if (this.data?.data.data.type == 'view') {
        const editText = this.data.data.EditTex;
        this.getfileBody().at(0).get('addNote')?.setValue(editText);
        this.getfileBody().at(0).get('id')?.setValue(this.data.data.data.data.id);
        this.getfileBody().at(0).get('isPrivate')?.setValue(this.data.data.data.data.isPrivate);
      }
    }
  }

  // s------------------
  // AddSubNote
  AddSubNote() {
    this.getfileBody().at(0).get('keyword')?.setValue(this.keywordlist);
    this.matDialogRef.close(this.addNotesForm?.value.fileBody);
  }

  // s-------------
  // UpdateSubNote
  UpdateSubNote() {
    this.matDialogRef.close(this.addNotesForm?.value.fileBody);
  }

  // s-------------
  // CreateNote
  CreateNote() {
    this.getfileBody().at(0).get('keyword')?.setValue(this.keywordlist);
    if (this.ismanage == true) {
      this.createNoteForMangement();
    } else {
      this.matDialogRef.close(this.addNotesForm?.value.fileBody);
    }
  }





  
  getdatafordroupdown() {
    // Get All priveces create note data 
    this.manageUsersService.FindAllNotes().subscribe((res: any) => {
      console.log(res);
      const data = res;
      this.privices_Created_Note = data;
    });
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
      console.log(res);
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
  add(event: MatChipInputEvent) {
    const value = (event?.value || '').trim();
    if (value) {
      this.keywordlist.push(value);
    }
    // Clear the input value
    // event.input?.value = '';
    this.getfileBody().at(0).get('keyword')?.setValue(null);
  }
  remove(value: string) {
    const index = this.keywordlist.indexOf(value);
    if (index >= 0) {
      this.keywordlist.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent) {
    this.keywordlist.push(event.option.viewValue);
    this.getfileBody().at(0).get('keyword')?.setValue(null);
  }

  // UpdateNote for without Content
  UpdateNote() {
    this.getfileBody().at(0).get('keyword')?.setValue(this.keywordlist);
    const todayDate = new Date();
    const formNoteData = new FormData();
    formNoteData.append('id', this.addNotesForm?.value.fileBody[0].id);
    formNoteData.append('Title', this.addNotesForm?.value.fileBody[0].title);
    formNoteData.append('IsPrivate',this.addNotesForm?.value.fileBody[0].isPrivate);
    formNoteData.append('Keywords',this.addNotesForm?.value.fileBody[0].keyword);
    formNoteData.append('Created', todayDate.toISOString());
    this.addNotesForm?.value.fileBody[0].conditions.forEach((res:any, index:number) => {
      if (res.selectid.length >= 1) {
        formNoteData.append('Entities[' + index + '].AttachmentLevel',res.attachmentLevel);
        formNoteData.append('Entities[' + index + '].SelectIds', res.selectid);
        formNoteData.append('Entities[' + index + '].IsGroup', 'false');
      }
      if (res.selectGroup.length >= 1) {
        formNoteData.append('Entities[' + index + '].AttachmentLevel',res.attachmentLevel);
        formNoteData.append('Entities[' + index + '].SelectIds',res.selectGroup);
        formNoteData.append('Entities[' + index + '].IsGroup', 'true');
      }
    });
    this.fileService.updateNote(formNoteData).subscribe((data) => {
      if (data) {
        this._snackBar.open(data.response[0].message, '', { duration: 2000 });
        this.matDialogRef.close(true);
      }
    });
  }






  // Create Note For Manageny Screens

  createNoteForMangement() {
    var today = new Date();
    var month = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = today.getMonth(); //January is 0!
    var yyyy = today.getFullYear();
    this.date = dd + ' ' + month[mm] + ' ' + yyyy;
    const formNoteData = new FormData();
    let subnoteid = 'subnotes' + '-' + Math.random().toFixed(4);
    const ceatedate = this.datepipe.transform(new Date(), 'MM d, y, h:mm:ss a');
    this.addNotesForm?.value.fileBody.forEach((res:any, index:number) => {
      const data = {
        isPrivate: res.isPrivate,
        LinkMediastatus: res?.LinkMediastatus,
        subnoteid: subnoteid,
        userId: this.userId,
        date: this.date,
        addNote: res.addNote,
        ceatedate: ceatedate
      }
      const file=this.htmlToFile.htmlContentToFileConvert(res.addNote)
      formNoteData.append('file', file);
      formNoteData.append('Title', res.title);
      formNoteData.append('IsPrivate', res.isPrivate);
      formNoteData.append('Keywords', res.keyword);
      formNoteData.append('Created', today.toISOString());
      if (this.ismanageType == 'single') {
        formNoteData.append('Entities[' + index + '].AttachmentLevel',this.AttachmentLevel);
        formNoteData.append('Entities[' + index + '].SelectIds', this.SelectId);
        formNoteData.append('Entities[' + index + '].IsGroup', 'false');
      } else if (this.ismanageType == 'group') {
        formNoteData.append('Entities[' + index + '].AttachmentLevel',this.AttachmentLevel);
        formNoteData.append('Entities[' + index + '].SelectIds', this.SelectId);
        formNoteData.append('Entities[' + index + '].IsGroup', 'true');
      } else if (this.AttachmentLevel == 'Events') {
        formNoteData.append('Entities[' + index + '].AttachmentLevel',this.AttachmentLevel);
        formNoteData.append('Entities[' + index + '].SelectIds',this.data.data);
        formNoteData.append('Entities[' + index + '].IsGroup', 'false');
      }
    });
    this.fileService.createNote(formNoteData).subscribe((data) => { 
      if (data) {
        this._snackBar.open(data[0], '', { duration: 2000 });
        this.matDialogRef.close(true);
      }
    });
  }









  CreateSubNoteFromEmail(data:any,accessToken:any){
    console.log(this.addNotesForm?.value.fileBody[0].SelectedNoteIds)
    const bodydata ={
      "mediaType": data.mediaType=='Gmail'?0:1,
      "subject": data.subject,
      "contactEmail": data.contactEmail,
      "isContact": data.isContact,
      "dateTime": data.date,
      "noteIds": this.addNotesForm?.value.fileBody[0].SelectedNoteIds,
      "accessToken": accessToken
    }
      this.fileService.CreateSubNoteFromEmail(bodydata).subscribe(result=>{
        if(result){
          console.log(result)
          this._snackBar.open(result, '', { duration: 2000 });
          this.matDialogRef.close(true);

        }
      },error=>{
        if(error.status==200){
          console.log(error)
          this._snackBar.open(error.error.text, '', { duration: 2000 });
          this.matDialogRef.close(true);
        }
      })
  }



}
