import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ManageUsersService } from 'src/app/core/services/manage-users.service';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { DatePipe } from '@angular/common';
import { MatSelectChange } from '@angular/material/select';
import { CalendarService } from 'src/app/core/services/calendar.service';
import { Observable } from 'rxjs';
import { Category } from 'src/app/core/models/category.model';
import { ManageContactsService } from 'src/app/core/services/manage-contacts.service';
import { ManageSitesService } from 'src/app/core/services/manage-sites.service';
import { GoogleValidationAddressService } from 'src/app/core/services/google-validation-address.service';
import { TranslateService } from '@ngx-translate/core';
import { ChooseTaskOptionComponent } from './choose-task-option/choose-task-option.component';
import { CreateTaskComponent } from '../../manage-tasks/create-task/create-task.component';
import { ViewTaskComponent } from '../../manage-tasks/view-task/view-task.component';
import { ConformationComponent } from '../conformation/conformation.component';
import { ApiErrorResponseComponent } from 'src/app/api-error-response/api-error-response.component';
import { Console } from 'console';
import { MessageService } from 'src/app/core/services/message.service';
import { PopupErrorMessageComponent } from 'src/app/popup-error-message/popup-error-message.component';
import { AddtagCommonComponent } from 'src/app/pages/commonForAll/addtag-common/addtag-common.component';
import { CreateMilestoneComponent } from '../../manage-tasks/create-milestone/create-milestone.component';
import { FilterCommonComponent } from 'src/app/pages/commonForAll/filter-common/filter-common.component';

@Component({
  selector: 'app-create-initiatives',
  templateUrl: './create-initiatives.component.html',
  styleUrls: ['./create-initiatives.component.scss']
})
export class CreateInitiativesComponent implements OnInit {
  color = 'primary';
  mode = 'indeterminate';
  value = 50;
  spinner=false
  Initiative: FormGroup;
  screentype = ''
  filteredusers = [];
  separatorKeysCodes: number[] = [ENTER, COMMA];
  separatorKeysCodes1: number[] = [ENTER, COMMA];
  keywordlist :any= [];
  roleNamesArray:any=['Creator','User']
  users$ = [];
  listofPipelines:any;
  listofPipelines$:any = []
  listofTasks:any
  listofSteps = []
  newstepcount = 0
  todaydate = new Date();
  categories$!: Observable<Category[]>;
  CriticityId$!: Observable<any>;
  categories: any;
  contacts$ = [];
  filteredcontacts = [];
  sites$ = [];
  filteredsites = [];
  usersgroup$ = [];
  filteredusersgroup = [];
  contactsgroup$ = [];
  filteredcontactsgroup = [];
  sitesgroup$ = [];
  filteredsitesgroup = [];
  userGroupArray:any;
  contactArray:any;
  filterforuserlist: any;
  filterforcontactlist: any;
  filterforsiteslist: any;
  filterforuserGrouplist: any;
  filterforcontactGrouplist: any;
  filterforsiteGrouplist: any;
  startTime:any;
  endTime:any;
  valuedata = '';
  timeZone = 'Europe/Paris';
  intiativeData: any;
  userData:any;
  User = 1;
  StepTaskData:any;
  tags: any;
  successorlist: any;
  predecessorlist: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private router: Router,
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<CreateInitiativesComponent>,
    private userService: ManageUsersService,
    public datepipe: DatePipe,
    private calendarService: CalendarService,
    private contactsService: ManageContactsService,
    private manageSitesService: ManageSitesService,
    private manageUserService: ManageUsersService,
    private googleAddress: GoogleValidationAddressService,
    private translate: TranslateService,
    private dialog: MatDialog,
    private messageService: MessageService,
    private manageUsersService: ManageUsersService,
    private manageContactsService: ManageContactsService,
  ) {

    this.Initiative = this.formBuilder.group({
      id: [''],
      title: ['', Validators.required],
      description: [],
      StartDate: ['', Validators.required],
      EndDate: ['', Validators.required],
      budget: ['',Validators.required],
      isPublic:[true], 
      PermittedUserIds:[],
      CurrencyId: [1],
      roleNames: [''],
      PipeLinetype: ['2'],
      isDraft: [false], 
      isTemplate: [false],
      pipelineID: [null],
      Steps: [null],
      addsteps: [true],
      Pipelinename: [null],
      isSavePipeline: [true],
      UsersConditions: this.formBuilder.array([]),
      taskmodule: this.formBuilder.array([]), 
      Allsteps: this.formBuilder.array([]),
      team: this.formBuilder.array([]),
      Addtages: this.formBuilder.array([]),
    });
  }

  getIsPublicstatus(){
    return this.Initiative.get('isPublic')?.value
  }

  ngOnInit(): void {
    console.log(this.data)
    this.screentype = this.data.type
    if (this.screentype == 'Update') {
      this.spinner=true
      this.manageUserService.FindInitiativeById(this.data.data.id).subscribe((res: any) => {
        console.log("ressss", res)
        this.intiativeData = res
        this.getOneInitiative();
        this.spinner=false
       
      })
      this.manageUserService.FindUsersByInitiative(this.data.data.id, this.User).subscribe(res => {
        console.log("ressuserrrr", res)
        this.userData = res
        this.getUserbyInitiative();
      })
    }else{
      this.Addcondictuon();
      this.Userslist().at(0).get('userId')?.setValue(localStorage.getItem('id'))
      this.Userslist().at(0).get('roleName')?.setValue('Creator')

      this.Addteam()
      this.AddteamUser(0)

      this.getmainteamUser(0).at(0).get('userId')?.setValue(localStorage.getItem('id'))
      this.getmainteamUser(0).at(0).get('roleName')?.setValue('Creator')
    }
    this.gettags();
    this.getdatafordroupdown()

  }

  // allsteps 
  getAllsteps(): FormArray {
    return this.Initiative.get("Allsteps") as FormArray
  }
  getAllteam(): FormArray {
    return this.Initiative.get("team") as FormArray
  }
  newsteps(): FormGroup {
    return this.formBuilder.group({
      name: [''], 
      id: [''],
      taskmodule: this.formBuilder.array([]),
    })
  }

  newteamuser():FormGroup{
    return this.formBuilder.group({
      userId: [''],
      roleName: [''],
    })
  }
  newteam(): FormGroup {
    return this.formBuilder.group({
      Teamname: [''], 
      isTeamHead: true,
      teamUsers:this.formBuilder.array([]),
      subTeam: this.formBuilder.array([]),
    })
  }
  Addsteps() {
    this.getAllsteps().push(this.newsteps());
    console.log('Steps added:', this.getAllsteps()?.value);
  }
  Addteam() {
    this.getAllteam().push(this.newteam());
    console.log('Steps added:', this.getAllteam()?.value);
  }
  AddteamUser(i:number) {
    this.getmainteamUser(i).push(this.newteamuser());
    console.log('Steps added:', this.getmainteamUser(i)?.value);
  }

  selectUserType(index:number, index2:number,type:string){
    console.log(index)
    console.log(index2)
    const filter=this.dialog.open(FilterCommonComponent, {
      width: '400px',
      autoFocus: false,
      disableClose: true,
      data:{type:'selectUserType'}
    })
    filter.afterClosed().subscribe((result: any) => {
      console.log(result)
         if(result.selectTypeSingle){
          if(result.Selactedusers.length!=0){
            result.Selactedusers.forEach((element:any) => {
              if(type=='subteamuser'){
                this.AddsubteamUser(index,index2)
                this.getsubteamUsers(index,index2).at(this.getsubteamUsers(index,index2)?.value.length-1).get('userId')?.setValue(element)
                this.getsubteamUsers(index,index2).at(this.getsubteamUsers(index,index2)?.value.length-1).get('roleName')?.setValue('User')
              }else{
                this.AddteamUser(index)
                this.getmainteamUser(index).at(this.getmainteamUser(index)?.value.length-1).get('userId')?.setValue(element)
                this.getmainteamUser(index).at(this.getmainteamUser(index)?.value.length-1).get('roleName')?.setValue('User')
              }
            });
          }
         }
          if(result.selectTypeGroup){
            if(result.SelactedGroups.length!=0){
              result.SelactedGroups.forEach((element:any) => {
          this.GetUserList(element,index,index2,type)
              });
            }
         }
    })
  }


  GetUserList(group:any,index:number,index2:number,type:string) {
    console.log(group)
    if (group.dynamicGroupId == null) {
      const GroupId = group.id;
      this.manageUserService.getGroupUserService(GroupId).subscribe((data) => {
        if (data) {
          if(data.length!=0){
            data.forEach((element:any) => {
              if(type=='subteamuser'){
                this.AddsubteamUser(index,index2)
                this.getsubteamUsers(index,index2).at(this.getsubteamUsers(index,index2)?.value.length-1).get('userId')?.setValue(element.id)
                this.getsubteamUsers(index,index2).at(this.getsubteamUsers(index,index2)?.value.length-1).get('roleName')?.setValue('User')
              }else{
                this.AddteamUser(index)
                this.getmainteamUser(index).at(this.getmainteamUser(index)?.value.length-1).get('userId')?.setValue(element.id)
                this.getmainteamUser(index).at(this.getmainteamUser(index)?.value.length-1).get('roleName')?.setValue('User')
              }
            });
          }
        }
      });
    } else {
      const GroupId = group.dynamicGroupId;
      this.manageUserService .getDynamicGroupUserService('Users', GroupId) .subscribe((data) => {
          if (data) {
            if(data.length!=0){
              data.forEach((element:any) => {
                if(type=='subteamuser'){
                  this.AddsubteamUser(index,index2)
                  this.getsubteamUsers(index,index2).at(this.getsubteamUsers(index,index2)?.value.length-1).get('userId')?.setValue(element.id)
                  this.getsubteamUsers(index,index2).at(this.getsubteamUsers(index,index2)?.value.length-1).get('roleName')?.setValue('User')
                }else{
                  this.AddteamUser(index)
                  this.getmainteamUser(index).at(this.getmainteamUser(index)?.value.length-1).get('userId')?.setValue(element.id)
                  this.getmainteamUser(index).at(this.getmainteamUser(index)?.value.length-1).get('roleName')?.setValue('User')
                }
                });
            }
          }
        });
    }
  }

  AddsubteamUser(i:number,k:number) {
    this.getsubteamUsers(i,k).push(this.newteamuser());
    console.log('Steps added:', this.getsubteamUsers(i,k)?.value);
  }

  Removesteps(i: number) {
    this.getAllsteps().removeAt(i);
  }

  Removeteam(i: number) {
    this.getAllteam().removeAt(i);
  }
  RemoveSubteam(i:number,k:number){
    this.getsubTeam(i).removeAt(k)
  }

  // Addsubteam 
  Addsubteam(i:number){
    this.getsubTeam(i).push(this.newteam())
  }
  

  // addtask for inside step 

  getsteptaskmodule(i:any) {
    return this.getAllsteps().at(i).get("taskmodule") as FormArray
  }

  getsubTeam(i:number) {
    return this.getAllteam().at(i).get("subTeam") as FormArray
  }
  getmainteamUser(i:number) {
    return this.getAllteam().at(i).get("teamUsers") as FormArray
  }

  removemainteamuser(i:number,m:number){
    this.getmainteamUser(i).removeAt(m)
  }

  getsubteamUsers(i:number,k:number) {
    return this.getsubTeam(i).at(k).get("teamUsers") as FormArray
  }

  removemainsubteamUser(i:number,k:number,m:number) {
    this.getsubteamUsers(i,k).removeAt(m)
  }

  addtaskforstep(i:number) {
    this.getsteptaskmodule(i).push(this.newtask())
  }

  getaddstepsstatus() {
    return this.Initiative.value.addsteps

  }

  getstepinsidetaskname(i:number, m:number) {
    return this.getsteptaskmodule(i).at(m).get('Title')?.value
  }
  getstepinsidetaskIsMileStone(i:number, m:number) {
    console.log(this.getsteptaskmodule(i).at(m).get('IsMileStone')?.value)
    return this.getsteptaskmodule(i).at(m).get('IsMileStone')?.value
  }
  getstepinsidetaskid(i:number, m:number) {
    return this.getsteptaskmodule(i).at(m).get('id')?.value
  }
  removestepinsidetas(i:number, m:number) {
    this.getsteptaskmodule(i).removeAt(m)
  }

  addtaskforstepinstubtask(i:number,k:number){
   this.getsteptaskmoduleForsubtask(i,k).push(this.newtask())
  }
    // addtask for inside step task and subtask 
    getsteptaskmoduleForsubtask(i:Number,k:number){
      return this.getsteptaskmodule(i).at(k).get("SubTaskViewModels") as FormArray
    }
    getstepinsidesubtaskname(i:number, m:number,k:number) {
      return this.getsteptaskmoduleForsubtask(i,m).at(k).get('Title')?.value
    }
    getstepinsidesubtaskIsMileStone(i:number, m:number,k:number) {
      return this.getsteptaskmoduleForsubtask(i,m).at(k).get('IsMileStone')?.value
    }
    removestepinsidesubtask(i:number, m:number,j:number) {
      this.getsteptaskmoduleForsubtask(i,m).removeAt(j)
    }
    


  showtaskdetails(i:number, m:number) {
    if (this.Initiative.value.addsteps == true) {
      var data:any = this.getsteptaskmodule(i).at(m)
      if(data.value.id){
        this.opentaskViewDialog(data.value.id)
      }else{
        this.edittask(i,m,'View-task-initiatives') 
      }
      }else{
        var data:any = this.gettasks().at(i)
        if(data.value.id){
          this.opentaskViewDialog(data.value.id)
        }else{
          this.edittask(i,m,'View-task-initiatives')
        }
      }
  }

  onSelectionChange(event: MatSelectChange) {
    this.userService.FindExistPipelineStepsId(event.value).subscribe((result) => {
      if (result) {
        this.listofSteps = result
        this.listofSteps.forEach((element:any, index:number) => {
          this.Addsteps()
          this.getAllsteps().at(index).get('name')?.setValue(element.stepName)
          this.getAllsteps().at(index).get('id')?.setValue(element.step)
        });
      }
    })
  }



  // 0000000000 
  // Userslist 
  Userslist(): FormArray {
    return this.Initiative.get("UsersConditions") as FormArray
  }

  newFile(): FormGroup {
    return this.formBuilder.group({
      userId: [],
      roleName: '',
    })
  }

  Addcondictuon() {
    this.Userslist().push(this.newFile());
  }
  Removecondictuon(i: number) {
    this.Userslist().removeAt(i);
  }



  // 111111111111 task
  gettasks() {
    return this.Initiative.get("taskmodule") as FormArray
  }
  Addtask() {
    this.gettasks().push(this.newtask());
  }

  gettaskname(i:number) { 
    return this.gettasks().at(i).get('Title')?.value
  }
  gettaskIsMileStone(i:number) { 
    return this.gettasks().at(i).get('IsMileStone')?.value
  }
  gettaskid(i:number) {
    return this.gettasks().at(i).get('id')?.value
  }
  removetask(i:number) {
    this.gettasks().removeAt(i)
  }

  // getsubtask

getsubtask(i:number){
    return this.gettasks().at(i).get("SubTaskViewModels") as FormArray
}



getsubtaskname(i:number,k:number) { 
  return this.getsubtask(i).at(k).get('Title')?.value
}
getsubtaskIsMileStone(i:number,k:number) { 
  console.log(this.getsubtask(i).at(k).get('IsMileStone')?.value)
  return this.getsubtask(i).at(k).get('IsMileStone')?.value
}
Addsubtask(i:number){
    this.getsubtask(i).push(this.newtask())
}

removesubtask(i:any,k:any) {
  this.getsubtask(i).removeAt(k)
}

  opentaskViewDialog(id:number) {
    this.dialog.open(ViewTaskComponent, {
      width: '500px',
      autoFocus: false,
      disableClose: true,
      data: id
    });
  }

  newtask(): FormGroup {
    return this.formBuilder.group({
      Title: ['', [Validators.required]],
      IsPublic:[true],
      StartDate: [''],
      EndDate: [''],
      CriticityId: [3],
      id: [0],
      UserId: [],
      PermittedUserIds:[],
      CategoryId: [131],
      Isparent: [true],
      Period: [0],
      Hours: [],
      Minutes: [],
      Address: [''],
      Zipcode: [],
      City: [''],
      Country: [''],
      latitude: [''],
      longitude: [''],
      Description: [''],
      keyword: [''],
      IsTemplate: false,
      UserGroupsId: ['' || []],
      ContactId: [],
      SelactCountry: ['France'],
      ContactGroupsId: ['' || []],
      SiteId: [],
      Addtages:[''],
      HasStep:[true],
      PipeLinetype:['2'],
      StepsViewModel: [[]],
      SubTaskViewModels:[[]],
      pipelineID:[],
      Pipelinename:[],
      IsSavePipeline:[false],
      Stage:[2],
      initiatives:[''], 
      ListofSuccessor:[''],
      ListofPredecessor:[''],
      IsMileStone:[false]
    })
  }


  gettageBody() {
    return this.Initiative.get('Addtages') as FormArray;
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
  createtageBody(): FormGroup {
    return this.formBuilder.group({
      tagTableId: 0,
      creatorId:[null],
      fieldName: '',
      fieldType: '',
      fieldValue: '',
      dropdownValues: '',
      dropdownvaluetotal: '',
    });
  }
  fieldType(i: number) {
    return this.gettageBody().at(i).get('fieldType')?.value;
  }
  tagTableId(i: number) {
    return this.gettageBody().at(i).get('tagTableId')?.value;
  }
  tagcreatorId(i: number) {
    return this.gettageBody().at(i).get('creatorId')?.value;
  }
  deletetagDialog(i:any){
    const loginuserId=localStorage.getItem("id");
    if(this.tagcreatorId(i)==null){
    this.gettageBody().removeAt(i)
    }else if(this.tagcreatorId(i)==loginuserId){
      const tagid=this.tagTableId(i)
      this.ChooseTaskOption1(tagid,i)
    }else{
      this.gettageBody().removeAt(i)
    }
  }

  ChooseTaskOption1(id:number,i:number){
    const ChooseTaskOption = this.dialog.open(ConformationComponent, {
      width: '400px',
      autoFocus: false,
      data: { type:'tagdeleteconformation'},
      disableClose: true
    });
    ChooseTaskOption.afterClosed().subscribe((result: any) => {
      console.log(result)
      if(result){
        if (result=='2') {
          this.gettageBody().removeAt(i)
        this.manageContactsService.deletetag(id).subscribe((result) => {
      }), ((error:any) => {
      })
        }else if (result=='1'){
          this.gettageBody().removeAt(i)
        }
      }
    })
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
        data: 'Initiatives',
      });
      openAddEventDialog.afterClosed().subscribe((result: any) => {
        if (result) {
          this.gettageBody().clear();
          this.gettags();
        }
      });
    }
  }
  gettags() {
    this.manageUsersService.gettag('Initiatives').subscribe((data: any) => {
      if (data) {
        data.forEach((element:any, index:number) => {
          this.addtageBody();
          this.gettageBody().at(index).get('tagTableId')?.setValue(element?.tagTableId);
          this.gettageBody().at(index).get('creatorId')?.setValue(element?.creatorId);
          this.gettageBody().at(index).get('fieldName')?.setValue(element?.fieldName);
          this.gettageBody().at(index).get('fieldType')?.setValue(element?.fieldType);
          this.gettageBody().at(index).get('fieldValue')?.setValue(element?.fieldValue);
          this.gettageBody().at(index).get('dropdownvaluetotal')?.setValue(element?.dropdownValues);
        });
      }
      this.tags = data;
    });
  }

  getrollnames() {
    const value = this.Initiative.value.roleNames.split(',')
    return value
  }

  getPipeLinetype() {
    const value = this.Initiative.value.PipeLinetype
    return value
  }

  getpipelineID() {
    const value = this.Initiative.value.pipelineID
    return value
  }

  getstatus() {
    if (this.getPipeLinetype() == '1') {
      return true
    } else if (this.getPipeLinetype() == '2' && this.getpipelineID() != null) {
      return true
    } else {
      return false
    }
  }


  onRadioChange(event: any) {
    this.Initiative.get('pipelineID')?.setValue(null)
    this.Initiative.get('Pipelinename')?.setValue('')
    this.getalltaskslist()

  } 

  filterOptions(value: string, type: string): void {
    console.log(type);
    this.filteredusers = this.users$.filter((option:any) =>
      option.firstName.toLowerCase().includes(value.toLowerCase())
    );
  }

  filterOptions1(value: string, type: string): void {
    console.log(type);
    this.listofPipelines = this.listofPipelines$.filter((option:any) =>
      option.name.toLowerCase().includes(value.toLowerCase())
    );
  }

  filterOptionsforExistingPipeline(value: string): void {
    this.listofPipelines = this.listofPipelines$.filter((option:any) =>
      option.name.toLowerCase().includes(value.toLowerCase())
    );
  }

  getdatafordroupdown() {
    // get all users
    this.userService.findAllUsersDropdown().subscribe((result) => {
      if (result) {
        this.filteredusers = result;
        this.users$ = result;
      }
    });
    // get all contacts
    this.contactsService.findAllContactsDropdown().subscribe((result) => {
      if (result) {
        this.contacts$ = result;
        this.filteredcontacts = result;
      }
    });
    //get all sites
    this.manageSitesService.findAllSitesDropdown().subscribe((result) => {
      if (result) {
        this.sites$ = result;
        this.filteredsites = result;
      }
    });
    // get all User Group
    this.userService.findAllUsersGroupDropdown().subscribe((result) => {
      if (result) {
        this.usersgroup$ = result;
        this.filteredusersgroup = result;
      }
    });
    // get all contact Group
    this.contactsService.findAllContactsGroupDropdown().subscribe((result) => {
      if (result) {
        this.contactsgroup$ = result;
        this.filteredcontactsgroup = result;
      }
    });
    this.userService.FindPipelines().subscribe((result) => {
      if (result) {
        this.listofPipelines = result;
        this.listofPipelines$ = result;
      }
    });
    this.userService.findAllUsersDropdown().subscribe((result) => {
      if (result) {
        this.users$ = result;
        this.filteredusers = result;
      }
    });
    // fetchCategoryService
    this.calendarService.fetchCategoryService(100, 1).subscribe((res) => {
      this.categories = res;
    });
    this.CriticityId$ = this.calendarService.findCriticity();
  }


  onSubmit() {
    console.log(this.Initiative.value)
    var data :any= {
      "title": this.Initiative.value.title,
      "description": this.Initiative.value.description,
      "startDate": this.datepipe.transform(this.Initiative.value.StartDate, 'yyyy-MM-dd'),
      "endDate": this.datepipe.transform(this.Initiative.value.EndDate, 'yyyy-MM-dd'),
      "keywords": this.keywordlist.toString(),
      "budget": this.Initiative.value.budget,
      "isDraft": this.Initiative.value.isDraft,
      "isTemplate": this.Initiative.value.isTemplate,
      "roleNames": this.roleNamesArray.toString(),
      "isPrivate":!this.Initiative.value.isPublic,
      'PermittedUserIds':this.Initiative.value.PermittedUserIds,
      "users": this.Initiative.value.UsersConditions,
      "steps": [],
      "taskLink":[],
      'team':[],
      "isSavePipeline": this.Initiative.value.pipelineID == null?true:false,
      "pipelineId": this.Initiative.value.pipelineID,
      "pipelineName": this.Initiative.value.Pipelinename == null ? '' : this.Initiative.value.Pipelinename,
      "tagViewModels": []

    }
// tages 
if(this.Initiative.value.team.length!=0){
  data.team=this.Initiative.value.team
}
if (this.Initiative.value.Addtages.length != 0) {
  console.log(this.Initiative.value.Addtages)
  let Addtages:any=[]
  this.Initiative.value.Addtages.forEach((e:any,index:any) => {
    if((e.dropdownValues!=''&&e.dropdownValues!=null)||(e.fieldValue!=''&&e.fieldValue!=null)){
      if (e.fieldType == 'Dropdown') {
        Addtages.push({
          fieldName:e.fieldName,
          fieldType:e.fieldType ,
          dropdownValues:e.dropdownValues.toString()
         })
      } else {
        Addtages.push({
          fieldName:e.fieldName,
          fieldType:e.fieldType ,
          fieldValue:e.fieldValue.toString()
        })
      }
    }
  }); 
  data.tagViewModels=Addtages
}

    if (this.Initiative.value.addsteps == true) {
      if (this.Initiative.get('PipeLinetype')?.value == '1') {
        // Set isSavePipeline to true
        this.Initiative.patchValue({
          isSavePipeline: true
        });
      } else {
        // Set isSavePipeline to fasle
        this.Initiative.patchValue({
          isSavePipeline: false
        });
      } 

      if (this.Initiative.value.Allsteps.length != 0) {
        this.Initiative.value.Allsteps.forEach((element:any, index1:any) => {
          console.log(element)
          if (this.Initiative.value.pipelineID == null) {
            data.steps.push(
              {
                "step": index1 + 1,
                "name": element.name,
                "taskLink": []
              }
            )
          } else {
            // listofSteps 
            if (element.id == null) {
              this.newstepcount = this.newstepcount + 1
              data.steps.push(
                {
                  "step": this.listofSteps.length + this.newstepcount + 1,
                  "name": element.name,
                  "taskLink": []
                }
              )
            } else {
              data.steps.push(
                {
                  "step": element.id,
                  "name": element.name,
                  "taskLink": []
                }
              )
            }
          }

          if (element.taskmodule.length != 0) {
            element.taskmodule.forEach((elementA:any, index2:number) => {
              elementA.ListofPredecessor=elementA.ListofPredecessor?.toString()
              elementA.ListofSuccessor=elementA.ListofSuccessor?.toString()
              if (elementA.id) {
                if (elementA.UserId != 0) {
                  elementA.Stage = 1
                } else {
                  elementA.Stage = 2
                }
                data.steps[index1].taskLink.push(
                  {
                    "orderNumber": index2 + 1,
                    "taskId": elementA.id,
                  }
                )
              } else {
                if(this.screentype == 'Create'||elementA.id==0){
                  delete elementA.id;
                 }
                elementA.SubTaskViewModels.forEach((elementm:any) => {
                  if(this.screentype == 'Create'||elementm.id==0){
                    delete elementm.id;
                   }
                });
                console.log(elementA)
                data.steps[index1].taskLink.push(
                  {
                    "orderNumber": index2 + 1,
                    "taskModel": elementA
                  }
                )
              }
            });
          }
        });
      }
    } else {
      if(this.Initiative.value.taskmodule.length!=0){
        this.Initiative.value.taskmodule.forEach((elementA:any, index2:number) => {
          elementA.ListofPredecessor=elementA.ListofPredecessor.toString()
              elementA.ListofSuccessor=elementA.ListofSuccessor.toString()
          if (elementA.id) {
            if (elementA.UserId != 0) {
              elementA.Stage = 1
            } else {
              elementA.Stage = 2
            }
            data.taskLink.push(
              {
                "orderNumber": index2 + 1,
                "taskId": elementA.id,
              }
            )
          } else {
             if(this.screentype == 'Create'||elementA.id==0){
              delete elementA.id;
             }
            elementA.SubTaskViewModels.forEach((elementm:any) => {
              if(this.screentype == 'Create'||elementm.id==0){
                delete elementm.id;
               }
            });
            data.taskLink.push(
              {
                "orderNumber":  index2 + 1,
                "taskModel": elementA
              }
            )
          }
        });
      }
    }

    if (this.Initiative.get('id')?.value) {
      data["id"] = this.Initiative.value.id;
        this.manageUserService.updateInitiative(data).subscribe((res: any) => {
          if (res.response[0].code =='200'||res.response[0].code ==200) {
            this.messageService.showMessage(res.response[0].message);
            this.dialogRef.close(true)
          } else {
            this.messageService.showMessage(res.response[0].message);
          }
        }, error => {
          console.log(error)
          this.APIerrormessage(error.error['response'][0].message,'Update Initiatives')
        })
    } else {
      this.userService.createInitiative(data).subscribe(result => {
        if (result) {
          this.messageService.showMessage(result?.response[0].message);
          this.dialogRef.close(true)
        }
      },error=>{
        if(error){
          console.log(error)
          this.APIerrormessage(error.error['response'][0].message,'initiatives Creation Failed')
        }
  
      })
    }
  }



  APIerrormessage(message:any, header:any) {
    this.dialog.open(ApiErrorResponseComponent, {
      width: '550px',
      data: { message: message, header: header },
      autoFocus: false,
      disableClose: true,
    });
  }

  openconformationDialog() {
    const openconformation = this.dialog.open(ConformationComponent, {
      width: '500px',
      autoFocus: false,
      disableClose: true,
    });
    openconformation.afterClosed().subscribe((result: any) => {
      if (result) {
        console.log(result)
        if(result=='yes'){

          // this.dialogRef.close(true)
        }else if(result=='no'){
        }
      }
    })
  }


  getalltaskslist() {
    const formNoteData = new FormData();
    this.Initiative.value.UsersConditions.forEach((element:any, index:number) => {
      formNoteData.append('UserIds[' + index + ']', element.userId);
    });
    this.userService.TasksofUsers(formNoteData).subscribe((result) => {
      if (result) {
        console.log(result)
        this.listofTasks = result
      }
    })
  }


  // ---------------- 
  // auto chip for keyword 
  // ----------- 
  add(event: MatChipInputEvent) {
    if (event.value) { this.keywordlist.push(event.value); }
    // Clear the input value
    event.input.value = ''

  }
  remove(value: string) {
    const index = this.keywordlist.indexOf(value);
    if (index >= 0) {
      this.keywordlist.splice(index, 1);
    }
  }

    // ---------------- 
  // auto chip for keyword 
  // ----------- 
  addRoll(event: MatChipInputEvent) {
    if (event.value) { this.roleNamesArray.push(event.value); }
    // Clear the input value
    event.input.value = ''

  }
  removeRoll(value: string) {
    const index = this.roleNamesArray.indexOf(value);
    if (index >= 0) {
      this.roleNamesArray.splice(index, 1);
    }
  }


  Applyinitiative() {
    console.log(this.Initiative.value)
    if (localStorage.getItem('DemoOrganation') === 'true') {
      this.popupforerrormessage(
        'This button allows you to add new initiative',
        'Create initiative'
      );
    } else {
        if(this.Initiative.valid){
          if(this.Initiative.value.addsteps==true){
            if(this.Initiative.value.Allsteps.length<2){
              this.messageService.showMessage('Could you kindly provide the necessary steps?');
            }else{
              this.onSubmit();
            }
          }else{
            this.onSubmit();
          }
        }else{
          this.messageService.showMessage('Please complete the required fields.');
        }
    }
  }

 
  ChooseTaskOption(i:number) {
    if (this.Initiative.value.addsteps == true) {
      if (this.Initiative.value.UsersConditions.length != 0) {
        const formNoteData = new FormData();
        this.Initiative.value.UsersConditions.forEach((element:any, index:number) => {
          formNoteData.append('UserIds[' + index + ']', element.userId);
        });
        this.userService.TasksofUsers(formNoteData).subscribe((result: any) => {
          if (result?.length != 0) {
            console.log(result)
            this.listofTasks = result
            const ChooseTaskOption = this.dialog.open(ChooseTaskOptionComponent, {
              width: '400px',
              autoFocus: false,
              data: { data: result,initiative:this.Initiative.value, type:'add-sub-task' },
              disableClose: true
            });
            ChooseTaskOption.afterClosed().subscribe((result: any) => {
              if (result) {
                console.log(result)
                this.getOneTask(i, result)
              }
            })
          } else {
            this.createNewTask(i, 'Create-task-initiatives')
          }
        })
      } else {
        this.createNewTask(i, 'Create-task-initiatives')
      }
    } else {
      if (this.Initiative.value.UsersConditions.length != 0) {
        const formNoteData = new FormData();
        this.Initiative.value.UsersConditions.forEach((element:any, index:number) => {
          formNoteData.append('UserIds[' + index + ']', element.userId);
        });
        this.userService.TasksofUsers(formNoteData).subscribe((result: any) => {
          if (result?.length != 0) {
            console.log(result)
            this.listofTasks = result
            const ChooseTaskOption = this.dialog.open(ChooseTaskOptionComponent, {
              width: '400px',
              autoFocus: false,
              data: { data: result,initiative:this.Initiative.value, },
              disableClose: true
            });
            ChooseTaskOption.afterClosed().subscribe((result: any) => {
              if (result) {
                console.log(result)
                this.getOneTask(i, result)
              }
            })
          } else {
            this.createNewTask(i, 'Create-task-initiatives')
          }
        })
      } else {
        this.createNewTask(i, 'Create-task-initiatives')
      }
    }

  }




  getOneTask(i:number, data:any) {
    console.log(data)
    if (data[0].taskId) {
      data.forEach((element:any, index:number) => {
        if (this.Initiative.value.addsteps == true) {
          this.addtaskforstep(i)
          this.getsteptaskmodule(i).at(this.getsteptaskmodule(i)?.value.length - 1).get('Title')?.setValue(element.title)
          this.getsteptaskmodule(i).at(this.getsteptaskmodule(i)?.value.length - 1).get('id')?.setValue(element.taskId)
          this.getsteptaskmodule(i).at(this.getsteptaskmodule(i)?.value.length - 1).get('IsMileStone')?.setValue(element.IsMileStone)
        }
        else {
          this.Addtask()
          this.gettasks().at(this.gettasks()?.value.length - 1).get('Title')?.setValue(element.title)
          this.gettasks().at(this.gettasks()?.value.length - 1).get('id')?.setValue(element.taskId)
          this.gettasks().at(this.gettasks()?.value.length - 1).get('IsMileStone')?.setValue(element.IsMileStone)
        }
      });
    } else {
      if (this.Initiative.value.addsteps == true) {
        this.addtaskforstep(i)
        this.datasetintask1(i, data[0])
      }
      else {
        this.Addtask()
        this.datasetintask(data[0])
      }
    }

  }
  opentaskDialog(i:number) {
    // const id = this.gettaskid(i)
    this.dialog.open(ViewTaskComponent, {
      width: '500px',
      autoFocus: false,
      disableClose: true,
      // data: id
    });
  }

  createNewTask(i:number, type:any) {
    const dialogRef = this.dialog.open(CreateTaskComponent, {
      disableClose: true,
      data: { data: '',initiative:this.Initiative.value, type: type },
      width: '500px'
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        console.log(result)
        if (this.Initiative.value.addsteps == true) {
          this.addtaskforstep(i)
          this.datasetintask1(i, result)
        }
        else {
          this.Addtask()
          this.datasetintask(result)
        }

      }
    })
  }


  // editsubtask 
editsubtask(i:number,m:any,g?:any,type?:any){
  if (this.Initiative.value.addsteps == true) {
    var data:any = this.getsteptaskmoduleForsubtask(i,m).at(g)
    }else{
      var data:any = this.getsubtask(i).at(m)
    }
    console.log(data)
    const dialogRef = this.dialog.open(CreateTaskComponent, {
      disableClose: true,
      data: { data: data.value,initiative:this.Initiative.value, type:type?type:'edit-task-initiatives' },
      width: '500px'
    }); 

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        console.log(result)
        if (this.Initiative.value.addsteps == true) {
          this.getsteptaskmoduleForsubtask(i,m).at(g).get('Title')?.setValue(result?.Title)
          this.getsteptaskmoduleForsubtask(i,m).at(g).get('IsPublic')?.setValue(result?.IsPublic)
          this.getsteptaskmoduleForsubtask(i,m).at(g).get('StartDate')?.setValue(result?.StartDate)
          this.getsteptaskmoduleForsubtask(i,m).at(g).get('EndDate')?.setValue(result?.EndDate)
          this.getsteptaskmoduleForsubtask(i,m).at(g).get('CriticityId')?.setValue(result?.CriticityId)
          this.getsteptaskmoduleForsubtask(i,m).at(g).get('id')?.setValue(result?.id)
          this.getsteptaskmoduleForsubtask(i,m).at(g).get('UserId')?.setValue(result?.UserId)
          this.getsteptaskmoduleForsubtask(i,m).at(g).get('CategoryId')?.setValue(result?.CategoryId)
          this.getsteptaskmoduleForsubtask(i,m).at(g).get('Isparent')?.setValue(result?.Isparent)
          this.getsteptaskmoduleForsubtask(i,m).at(g).get('Period')?.setValue(result?.Period)
          this.getsteptaskmoduleForsubtask(i,m).at(g).get('Hours')?.setValue(result?.Hours)
          this.getsteptaskmoduleForsubtask(i,m).at(g).get('Minutes')?.setValue(result?.Minutes)
          this.getsteptaskmoduleForsubtask(i,m).at(g).get('Address')?.setValue(result?.Address)
          this.getsteptaskmoduleForsubtask(i,m).at(g).get('Zipcode')?.setValue(result?.ZipCode)
          this.getsteptaskmoduleForsubtask(i,m).at(g).get('City')?.setValue(result?.City)
          this.getsteptaskmoduleForsubtask(i,m).at(g).get('Country')?.setValue(result?.Country)
          this.getsteptaskmoduleForsubtask(i,m).at(g).get('latitude')?.setValue(result?.latitude)
          this.getsteptaskmoduleForsubtask(i,m).at(g).get('longitude')?.setValue(result?.longitude)
          this.getsteptaskmoduleForsubtask(i,m).at(g).get('Description')?.setValue(result?.Description)
          this.getsteptaskmoduleForsubtask(i,m).at(g).get('PermittedUserIds')?.setValue(result?.PermittedUserIds)
          this.getsteptaskmoduleForsubtask(i,m).at(g).get('keyword')?.setValue(result?.keyword.toString())
          this.getsteptaskmoduleForsubtask(i,m).at(g).get('IsTemplate')?.setValue(result?.IsTemplate)
          this.getsteptaskmoduleForsubtask(i,m).at(g).get('UserGroupsId')?.setValue(result?.UserGroupsId)
          this.getsteptaskmoduleForsubtask(i,m).at(g).get('ContactId')?.setValue(result?.ContactId)
          this.getsteptaskmoduleForsubtask(i,m).at(g).get('SelactCountry')?.setValue(result?.SelactCountry)
          this.getsteptaskmoduleForsubtask(i,m).at(g).get('ContactGroupsId')?.setValue(result?.ContactGroupsId)
          this.getsteptaskmoduleForsubtask(i,m).at(g).get('HasStep')?.setValue(result?.HasStep)
          this.getsteptaskmoduleForsubtask(i,m).at(g).get('PipeLinetype')?.setValue(result?.PipeLinetype)
          this.getsteptaskmoduleForsubtask(i,m).at(g).get('StepsViewModel')?.setValue(result?.AddSteps)
          this.getsteptaskmoduleForsubtask(i,m).at(g).get('pipelineID')?.setValue(result?.pipelineID)
          this.getsteptaskmoduleForsubtask(i,m).at(g).get('Pipelinename')?.setValue(result?.Pipelinename)
          this.getsteptaskmoduleForsubtask(i,m).at(g).get('Stage')?.setValue(result?.Stage)
          this.getsteptaskmoduleForsubtask(i,m).at(g).get('initiatives')?.setValue(result?.initiatives)
          this.getsteptaskmoduleForsubtask(i,m).at(g).get('ListofSuccessor')?.setValue(result?.ListofSuccessor)
          this.getsteptaskmoduleForsubtask(i,m).at(g).get('ListofPredecessor')?.setValue(result?.ListofPredecessor)
          this.getsteptaskmoduleForsubtask(i,m).at(g).get('IsMileStone')?.setValue(result?.IsMileStone)
          this.getsteptaskmoduleForsubtask(i,m).at(g).get('Addtages')?.setValue(result?.Addtages)
          if(result?.HasStep==true){
            if(result?.PipeLinetype=='1'){
             this.getsteptaskmoduleForsubtask(i,m).at(g).get('IsSavePipeline')?.setValue(true)
            }else{
             this.getsteptaskmoduleForsubtask(i,m).at(g).get('IsSavePipeline')?.setValue(false)
            }
          }else{
           this.getsteptaskmoduleForsubtask(i,m).at(g).get('IsSavePipeline')?.setValue(false)
          }
        }
        else {
          this.getsubtask(i).at(m).get('Title')?.setValue(result?.Title)
          this.getsubtask(i).at(m).get('IsPublic')?.setValue(result?.IsPublic)
          this.getsubtask(i).at(m).get('StartDate')?.setValue(result?.StartDate)
          this.getsubtask(i).at(m).get('EndDate')?.setValue(result?.EndDate)
          this.getsubtask(i).at(m).get('CriticityId')?.setValue(result?.CriticityId)
          this.getsubtask(i).at(m).get('id')?.setValue(result?.id)
          this.getsubtask(i).at(m).get('UserId')?.setValue(result?.UserId)
          this.getsubtask(i).at(m).get('CategoryId')?.setValue(result?.CategoryId)
          this.getsubtask(i).at(m).get('Isparent')?.setValue(result?.Isparent)
          this.getsubtask(i).at(m).get('Period')?.setValue(result?.Period)
          this.getsubtask(i).at(m).get('Hours')?.setValue(result?.Hours)
          this.getsubtask(i).at(m).get('Minutes')?.setValue(result?.Minutes)
          this.getsubtask(i).at(m).get('Address')?.setValue(result?.Address)
          this.getsubtask(i).at(m).get('Zipcode')?.setValue(result?.ZipCode)
          this.getsubtask(i).at(m).get('City')?.setValue(result?.City)
          this.getsubtask(i).at(m).get('Country')?.setValue(result?.Country)
          this.getsubtask(i).at(m).get('latitude')?.setValue(result?.latitude)
          this.getsubtask(i).at(m).get('longitude')?.setValue(result?.longitude)
          this.getsubtask(i).at(m).get('Description')?.setValue(result?.Description)
          this.getsubtask(i).at(m).get('PermittedUserIds')?.setValue(result?.PermittedUserIds)
          this.getsubtask(i).at(m).get('keyword')?.setValue(result?.keyword.toString())
          this.getsubtask(i).at(m).get('IsTemplate')?.setValue(result?.IsTemplate)
          this.getsubtask(i).at(m).get('UserGroupsId')?.setValue(result?.UserGroupsId)
          this.getsubtask(i).at(m).get('ContactId')?.setValue(result?.ContactId)
          this.getsubtask(i).at(m).get('SelactCountry')?.setValue(result?.SelactCountry)
          this.getsubtask(i).at(m).get('ContactGroupsId')?.setValue(result?.ContactGroupsId)
          this.getsubtask(i).at(m).get('SiteId')?.setValue(result?.SiteId)
          this.getsubtask(i).at(m).get('HasStep')?.setValue(result?.HasStep)
          this.getsubtask(i).at(m).get('PipeLinetype')?.setValue(result?.PipeLinetype)
          this.getsubtask(i).at(m).get('StepsViewModel')?.setValue(result?.AddSteps)
          this.getsubtask(i).at(m).get('pipelineID')?.setValue(result?.pipelineID)
          this.getsubtask(i).at(m).get('Pipelinename')?.setValue(result?.Pipelinename)
          this.getsubtask(i).at(m).get('Stage')?.setValue(result?.Stage)
          this.getsubtask(i).at(m).get('initiatives')?.setValue(result?.initiatives)
          this.getsubtask(i).at(m).get('ListofSuccessor')?.setValue(result?.ListofSuccessor)
          this.getsubtask(i).at(m).get('ListofPredecessor')?.setValue(result?.ListofPredecessor)
          this.getsubtask(i).at(m).get('IsMileStone')?.setValue(result?.IsMileStone)
          this.getsubtask(i).at(m).get('Addtages')?.setValue(result?.Addtages)
          if(result?.HasStep==true){
            if(result?.PipeLinetype=='1'){
             this.getsubtask(i).at(m).get('IsSavePipeline')?.setValue(true)
            }else{
             this.getsubtask(i).at(m).get('IsSavePipeline')?.setValue(false)
            }
          }else{
           this.getsubtask(i).at(m).get('IsSavePipeline')?.setValue(false)
          }
        }

      }
    })
}
// edittask 
  edittask(i:number, m:any,type?:any) {
    if (this.Initiative.value.addsteps == true) {
    var data:any = this.getsteptaskmodule(i).at(m)
    }else{
      var data:any = this.gettasks().at(i)
    }
    console.log(data)
    if(this.getstepinsidetaskIsMileStone(i,m) == true) {
      const dialogRef = this.dialog.open(CreateMilestoneComponent, {
        disableClose: true,
        data: { data: data.value,initiative:this.Initiative.value, type: type ? type:'edit-task-initiatives' },
        width: '500px'
      });
      dialogRef.afterClosed().subscribe((result: any) => {
        if (result) {
          console.log(result)
          if (this.Initiative.value.addsteps == true) {
            this.getsteptaskmodule(i).at(m).get('Title')?.setValue(result?.Title)
            this.getsteptaskmodule(i).at(m).get('IsPublic')?.setValue(result?.IsPublic)
            this.getsteptaskmodule(i).at(m).get('StartDate')?.setValue(result?.StartDate)
            this.getsteptaskmodule(i).at(m).get('EndDate')?.setValue(result?.EndDate)
            this.getsteptaskmodule(i).at(m).get('CriticityId')?.setValue(result?.CriticityId)
            this.getsteptaskmodule(i).at(m).get('id')?.setValue(result?.id)
            this.getsteptaskmodule(i).at(m).get('UserId')?.setValue(result?.UserId)
            this.getsteptaskmodule(i).at(m).get('CategoryId')?.setValue(result?.CategoryId)
            this.getsteptaskmodule(i).at(m).get('Isparent')?.setValue(result?.Isparent)
            this.getsteptaskmodule(i).at(m).get('Period')?.setValue(result?.Period)
            this.getsteptaskmodule(i).at(m).get('Hours')?.setValue(result?.Hours)
            this.getsteptaskmodule(i).at(m).get('Minutes')?.setValue(result?.Minutes)
            this.getsteptaskmodule(i).at(m).get('Address')?.setValue(result?.Address)
            this.getsteptaskmodule(i).at(m).get('Zipcode')?.setValue(result?.ZipCode)
            this.getsteptaskmodule(i).at(m).get('City')?.setValue(result?.City)
            this.getsteptaskmodule(i).at(m).get('Country')?.setValue(result?.Country)
            this.getsteptaskmodule(i).at(m).get('latitude')?.setValue(result?.latitude)
            this.getsteptaskmodule(i).at(m).get('longitude')?.setValue(result?.longitude)
            this.getsteptaskmodule(i).at(m).get('PermittedUserIds')?.setValue(result?.PermittedUserIds)
            this.getsteptaskmodule(i).at(m).get('Description')?.setValue(result?.Description)
            this.getsteptaskmodule(i).at(m).get('keyword')?.setValue(result?.keyword.toString())
            this.getsteptaskmodule(i).at(m).get('IsTemplate')?.setValue(result?.IsTemplate)
            this.getsteptaskmodule(i).at(m).get('UserGroupsId')?.setValue(result?.UserGroupsId)
            this.getsteptaskmodule(i).at(m).get('ContactId')?.setValue(result?.ContactId)
            this.getsteptaskmodule(i).at(m).get('SelactCountry')?.setValue(result?.SelactCountry)
            this.getsteptaskmodule(i).at(m).get('ContactGroupsId')?.setValue(result?.ContactGroupsId)
            this.getsteptaskmodule(i).at(m).get('HasStep')?.setValue(result?.HasStep)
            this.getsteptaskmodule(i).at(m).get('PipeLinetype')?.setValue(result?.PipeLinetype)
            this.getsteptaskmodule(i).at(m).get('StepsViewModel')?.setValue(result?.AddSteps)
            this.getsteptaskmodule(i).at(m).get('pipelineID')?.setValue(result?.pipelineID)
            this.getsteptaskmodule(i).at(m).get('Pipelinename')?.setValue(result?.Pipelinename)
            this.getsteptaskmodule(i).at(m).get('Stage')?.setValue(result?.Stage)
            this.getsteptaskmodule(i).at(m).get('initiatives')?.setValue(result?.initiatives)
            this.getsteptaskmodule(i).at(m).get('ListofSuccessor')?.setValue(result?.ListofSuccessor)
            this.getsteptaskmodule(i).at(m).get('ListofPredecessor')?.setValue(result?.ListofPredecessor)
            this.getsteptaskmodule(i).at(m).get('IsMileStone')?.setValue(result?.IsMileStone)
            this.getsteptaskmodule(i).at(m).get('Addtages')?.setValue(result?.Addtages)
            if(result?.HasStep==true){
              if(result?.PipeLinetype=='1'){
               this.getsteptaskmodule(i).at(m).get('IsSavePipeline')?.setValue(true)
              }else{
               this.getsteptaskmodule(i).at(m).get('IsSavePipeline')?.setValue(false)
              }
            }else{
             this.getsteptaskmodule(i).at(m).get('IsSavePipeline')?.setValue(false)
            }
          }
          else {
            this.gettasks().at(i).get('Title')?.setValue(result?.Title)
            this.gettasks().at(i).get('IsPublic')?.setValue(result?.IsPublic)
            this.gettasks().at(i).get('StartDate')?.setValue(result?.StartDate)
            this.gettasks().at(i).get('EndDate')?.setValue(result?.EndDate)
            this.gettasks().at(i).get('CriticityId')?.setValue(result?.CriticityId)
            this.gettasks().at(i).get('id')?.setValue(result?.id)
            this.gettasks().at(i).get('UserId')?.setValue(result?.UserId)
            this.gettasks().at(i).get('CategoryId')?.setValue(result?.CategoryId)
            this.gettasks().at(i).get('Isparent')?.setValue(result?.Isparent)
            this.gettasks().at(i).get('Period')?.setValue(result?.Period)
            this.gettasks().at(i).get('Hours')?.setValue(result?.Hours)
            this.gettasks().at(i).get('Minutes')?.setValue(result?.Minutes)
            this.gettasks().at(i).get('Address')?.setValue(result?.Address)
            this.gettasks().at(i).get('Zipcode')?.setValue(result?.ZipCode)
            this.gettasks().at(i).get('City')?.setValue(result?.City)
            this.gettasks().at(i).get('Country')?.setValue(result?.Country)
            this.gettasks().at(i).get('latitude')?.setValue(result?.latitude)
            this.gettasks().at(i).get('longitude')?.setValue(result?.longitude)
            this.gettasks().at(i).get('PermittedUserIds')?.setValue(result?.PermittedUserIds)
            this.gettasks().at(i).get('Description')?.setValue(result?.Description)
            this.gettasks().at(i).get('keyword')?.setValue(result?.keyword.toString())
            this.gettasks().at(i).get('IsTemplate')?.setValue(result?.IsTemplate)
            this.gettasks().at(i).get('UserGroupsId')?.setValue(result?.UserGroupsId)
            this.gettasks().at(i).get('ContactId')?.setValue(result?.ContactId)
            this.gettasks().at(i).get('SelactCountry')?.setValue(result?.SelactCountry)
            this.gettasks().at(i).get('ContactGroupsId')?.setValue(result?.ContactGroupsId)
            this.gettasks().at(i).get('SiteId')?.setValue(result?.SiteId)
            this.gettasks().at(i).get('HasStep')?.setValue(result?.HasStep)
            this.gettasks().at(i).get('PipeLinetype')?.setValue(result?.PipeLinetype)
            this.gettasks().at(i).get('StepsViewModel')?.setValue(result?.AddSteps)
            this.gettasks().at(i).get('pipelineID')?.setValue(result?.pipelineID)
            this.gettasks().at(i).get('Pipelinename')?.setValue(result?.Pipelinename)
            this.gettasks().at(i).get('Stage')?.setValue(result?.Stage)
            this.gettasks().at(i).get('initiatives')?.setValue(result?.initiatives)
            this.gettasks().at(i).get('ListofSuccessor')?.setValue(result?.ListofSuccessor)
            this.gettasks().at(i).get('ListofPredecessor')?.setValue(result?.ListofPredecessor)
            this.gettasks().at(i).get('IsMileStone')?.setValue(result?.IsMileStone)
            this.gettasks().at(i).get('Addtages')?.setValue(result?.Addtages)
            if(result?.HasStep==true){
              if(result?.PipeLinetype=='1'){
               this.gettasks().at(i).get('IsSavePipeline')?.setValue(true)
              }else{
               this.gettasks().at(i).get('IsSavePipeline')?.setValue(false)
              }
            }else{
             this.gettasks().at(i).get('IsSavePipeline')?.setValue(false)
            }
          }
  
        }
      })
    } else {
      const dialogRef = this.dialog.open(CreateTaskComponent, {
        disableClose: true,
        data: { data: data.value,initiative:this.Initiative.value, type: type ? type:'edit-task-initiatives' },
        width: '500px'
      });
  
      dialogRef.afterClosed().subscribe((result: any) => {
        if (result) {
          console.log(result)
          if (this.Initiative.value.addsteps == true) {
            this.getsteptaskmodule(i).at(m).get('Title')?.setValue(result?.Title)
            this.getsteptaskmodule(i).at(m).get('IsPublic')?.setValue(result?.IsPublic)
            this.getsteptaskmodule(i).at(m).get('StartDate')?.setValue(result?.StartDate)
            this.getsteptaskmodule(i).at(m).get('EndDate')?.setValue(result?.EndDate)
            this.getsteptaskmodule(i).at(m).get('CriticityId')?.setValue(result?.CriticityId)
            this.getsteptaskmodule(i).at(m).get('id')?.setValue(result?.id)
            this.getsteptaskmodule(i).at(m).get('UserId')?.setValue(result?.UserId)
            this.getsteptaskmodule(i).at(m).get('CategoryId')?.setValue(result?.CategoryId)
            this.getsteptaskmodule(i).at(m).get('Isparent')?.setValue(result?.Isparent)
            this.getsteptaskmodule(i).at(m).get('Period')?.setValue(result?.Period)
            this.getsteptaskmodule(i).at(m).get('Hours')?.setValue(result?.Hours)
            this.getsteptaskmodule(i).at(m).get('Minutes')?.setValue(result?.Minutes)
            this.getsteptaskmodule(i).at(m).get('Address')?.setValue(result?.Address)
            this.getsteptaskmodule(i).at(m).get('Zipcode')?.setValue(result?.ZipCode)
            this.getsteptaskmodule(i).at(m).get('City')?.setValue(result?.City)
            this.getsteptaskmodule(i).at(m).get('Country')?.setValue(result?.Country)
            this.getsteptaskmodule(i).at(m).get('latitude')?.setValue(result?.latitude)
            this.getsteptaskmodule(i).at(m).get('longitude')?.setValue(result?.longitude)
            this.getsteptaskmodule(i).at(m).get('PermittedUserIds')?.setValue(result?.PermittedUserIds)
            this.getsteptaskmodule(i).at(m).get('Description')?.setValue(result?.Description)
            this.getsteptaskmodule(i).at(m).get('keyword')?.setValue(result?.keyword.toString())
            this.getsteptaskmodule(i).at(m).get('IsTemplate')?.setValue(result?.IsTemplate)
            this.getsteptaskmodule(i).at(m).get('UserGroupsId')?.setValue(result?.UserGroupsId)
            this.getsteptaskmodule(i).at(m).get('ContactId')?.setValue(result?.ContactId)
            this.getsteptaskmodule(i).at(m).get('SelactCountry')?.setValue(result?.SelactCountry)
            this.getsteptaskmodule(i).at(m).get('ContactGroupsId')?.setValue(result?.ContactGroupsId)
            this.getsteptaskmodule(i).at(m).get('HasStep')?.setValue(result?.HasStep)
            this.getsteptaskmodule(i).at(m).get('PipeLinetype')?.setValue(result?.PipeLinetype)
            this.getsteptaskmodule(i).at(m).get('StepsViewModel')?.setValue(result?.AddSteps)
            this.getsteptaskmodule(i).at(m).get('pipelineID')?.setValue(result?.pipelineID)
            this.getsteptaskmodule(i).at(m).get('Pipelinename')?.setValue(result?.Pipelinename)
            this.getsteptaskmodule(i).at(m).get('Stage')?.setValue(result?.Stage)
            this.getsteptaskmodule(i).at(m).get('initiatives')?.setValue(result?.initiatives)
            this.getsteptaskmodule(i).at(m).get('ListofSuccessor')?.setValue(result?.ListofSuccessor)
            this.getsteptaskmodule(i).at(m).get('ListofPredecessor')?.setValue(result?.ListofPredecessor)
            this.getsteptaskmodule(i).at(m).get('IsMileStone')?.setValue(result?.IsMileStone)
            this.getsteptaskmodule(i).at(m).get('Addtages')?.setValue(result?.Addtages)
            if(result?.HasStep==true){
              if(result?.PipeLinetype=='1'){
               this.getsteptaskmodule(i).at(m).get('IsSavePipeline')?.setValue(true)
              }else{
               this.getsteptaskmodule(i).at(m).get('IsSavePipeline')?.setValue(false)
              }
            }else{
             this.getsteptaskmodule(i).at(m).get('IsSavePipeline')?.setValue(false)
            }
          }
          else {
            this.gettasks().at(i).get('Title')?.setValue(result?.Title)
            this.gettasks().at(i).get('IsPublic')?.setValue(result?.IsPublic)
            this.gettasks().at(i).get('StartDate')?.setValue(result?.StartDate)
            this.gettasks().at(i).get('EndDate')?.setValue(result?.EndDate)
            this.gettasks().at(i).get('CriticityId')?.setValue(result?.CriticityId)
            this.gettasks().at(i).get('id')?.setValue(result?.id)
            this.gettasks().at(i).get('UserId')?.setValue(result?.UserId)
            this.gettasks().at(i).get('CategoryId')?.setValue(result?.CategoryId)
            this.gettasks().at(i).get('Isparent')?.setValue(result?.Isparent)
            this.gettasks().at(i).get('Period')?.setValue(result?.Period)
            this.gettasks().at(i).get('Hours')?.setValue(result?.Hours)
            this.gettasks().at(i).get('Minutes')?.setValue(result?.Minutes)
            this.gettasks().at(i).get('Address')?.setValue(result?.Address)
            this.gettasks().at(i).get('Zipcode')?.setValue(result?.ZipCode)
            this.gettasks().at(i).get('City')?.setValue(result?.City)
            this.gettasks().at(i).get('Country')?.setValue(result?.Country)
            this.gettasks().at(i).get('latitude')?.setValue(result?.latitude)
            this.gettasks().at(i).get('longitude')?.setValue(result?.longitude)
            this.gettasks().at(i).get('PermittedUserIds')?.setValue(result?.PermittedUserIds)
            this.gettasks().at(i).get('Description')?.setValue(result?.Description)
            this.gettasks().at(i).get('keyword')?.setValue(result?.keyword.toString())
            this.gettasks().at(i).get('IsTemplate')?.setValue(result?.IsTemplate)
            this.gettasks().at(i).get('UserGroupsId')?.setValue(result?.UserGroupsId)
            this.gettasks().at(i).get('ContactId')?.setValue(result?.ContactId)
            this.gettasks().at(i).get('SelactCountry')?.setValue(result?.SelactCountry)
            this.gettasks().at(i).get('ContactGroupsId')?.setValue(result?.ContactGroupsId)
            this.gettasks().at(i).get('SiteId')?.setValue(result?.SiteId)
            this.gettasks().at(i).get('HasStep')?.setValue(result?.HasStep)
            this.gettasks().at(i).get('PipeLinetype')?.setValue(result?.PipeLinetype)
            this.gettasks().at(i).get('StepsViewModel')?.setValue(result?.AddSteps)
            this.gettasks().at(i).get('pipelineID')?.setValue(result?.pipelineID)
            this.gettasks().at(i).get('Pipelinename')?.setValue(result?.Pipelinename)
            this.gettasks().at(i).get('Stage')?.setValue(result?.Stage)
            this.gettasks().at(i).get('initiatives')?.setValue(result?.initiatives)
            this.gettasks().at(i).get('ListofSuccessor')?.setValue(result?.ListofSuccessor)
            this.gettasks().at(i).get('ListofPredecessor')?.setValue(result?.ListofPredecessor)
            this.gettasks().at(i).get('IsMileStone')?.setValue(result?.IsMileStone)
            this.gettasks().at(i).get('Addtages')?.setValue(result?.Addtages)
            if(result?.HasStep==true){
              if(result?.PipeLinetype=='1'){
               this.gettasks().at(i).get('IsSavePipeline')?.setValue(true)
              }else{
               this.gettasks().at(i).get('IsSavePipeline')?.setValue(false)
              }
            }else{
             this.gettasks().at(i).get('IsSavePipeline')?.setValue(false)
            }
          }
  
        }
      })
    }
   
  }




  addsubtask(i:number, m?:any) {
    if (this.Initiative.value.addsteps == true) {
    var data:any = this.getsteptaskmodule(i).at(m)
    }else{
      var data:any = this.gettasks().at(i)

    }
    console.log(data)
    const dialogRef = this.dialog.open(CreateTaskComponent, {
      disableClose: true,
      data: { data: data.value,initiative:this.Initiative.value, type:'addsubtask' },
      width: '500px'
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        console.log(result)
        if (this.Initiative.value.addsteps == true) {
          this.addtaskforstepinstubtask(i,m)
          this.getsteptaskmoduleForsubtask(i,m).at(this.getsteptaskmoduleForsubtask(i,m)?.value.length-1).get('Title')?.setValue(result?.Title)
          this.getsteptaskmoduleForsubtask(i,m).at(this.getsteptaskmoduleForsubtask(i,m)?.value.length-1).get('IsPublic')?.setValue(result?.IsPublic)
          this.getsteptaskmoduleForsubtask(i,m).at(this.getsteptaskmoduleForsubtask(i,m)?.value.length-1).get('StartDate')?.setValue(result?.StartDate)
          this.getsteptaskmoduleForsubtask(i,m).at(this.getsteptaskmoduleForsubtask(i,m)?.value.length-1).get('EndDate')?.setValue(result?.EndDate)
          this.getsteptaskmoduleForsubtask(i,m).at(this.getsteptaskmoduleForsubtask(i,m)?.value.length-1).get('CriticityId')?.setValue(result?.CriticityId)
          this.getsteptaskmoduleForsubtask(i,m).at(this.getsteptaskmoduleForsubtask(i,m)?.value.length-1).get('id')?.setValue(result?.id)
          this.getsteptaskmoduleForsubtask(i,m).at(this.getsteptaskmoduleForsubtask(i,m)?.value.length-1).get('UserId')?.setValue(result?.UserId)
          this.getsteptaskmoduleForsubtask(i,m).at(this.getsteptaskmoduleForsubtask(i,m)?.value.length-1).get('CategoryId')?.setValue(result?.CategoryId)
          this.getsteptaskmoduleForsubtask(i,m).at(this.getsteptaskmoduleForsubtask(i,m)?.value.length-1).get('Isparent')?.setValue(result?.Isparent)
          this.getsteptaskmoduleForsubtask(i,m).at(this.getsteptaskmoduleForsubtask(i,m)?.value.length-1).get('Period')?.setValue(result?.Period)
          this.getsteptaskmoduleForsubtask(i,m).at(this.getsteptaskmoduleForsubtask(i,m)?.value.length-1).get('Hours')?.setValue(result?.Hours)
          this.getsteptaskmoduleForsubtask(i,m).at(this.getsteptaskmoduleForsubtask(i,m)?.value.length-1).get('Minutes')?.setValue(result?.Minutes)
          this.getsteptaskmoduleForsubtask(i,m).at(this.getsteptaskmoduleForsubtask(i,m)?.value.length-1).get('Address')?.setValue(result?.Address)
          this.getsteptaskmoduleForsubtask(i,m).at(this.getsteptaskmoduleForsubtask(i,m)?.value.length-1).get('Zipcode')?.setValue(result?.ZipCode)
          this.getsteptaskmoduleForsubtask(i,m).at(this.getsteptaskmoduleForsubtask(i,m)?.value.length-1).get('City')?.setValue(result?.City)
          this.getsteptaskmoduleForsubtask(i,m).at(this.getsteptaskmoduleForsubtask(i,m)?.value.length-1).get('Country')?.setValue(result?.Country)
          this.getsteptaskmoduleForsubtask(i,m).at(this.getsteptaskmoduleForsubtask(i,m)?.value.length-1).get('latitude')?.setValue(result?.latitude)
          this.getsteptaskmoduleForsubtask(i,m).at(this.getsteptaskmoduleForsubtask(i,m)?.value.length-1).get('longitude')?.setValue(result?.longitude)
          this.getsteptaskmoduleForsubtask(i,m).at(this.getsteptaskmoduleForsubtask(i,m)?.value.length-1).get('Description')?.setValue(result?.Description)
          this.getsteptaskmoduleForsubtask(i,m).at(this.getsteptaskmoduleForsubtask(i,m)?.value.length-1).get('PermittedUserIds')?.setValue(result?.PermittedUserIds)
          this.getsteptaskmoduleForsubtask(i,m).at(this.getsteptaskmoduleForsubtask(i,m)?.value.length-1).get('keyword')?.setValue(result?.keyword.toString())
          this.getsteptaskmoduleForsubtask(i,m).at(this.getsteptaskmoduleForsubtask(i,m)?.value.length-1).get('IsTemplate')?.setValue(result?.IsTemplate)
          this.getsteptaskmoduleForsubtask(i,m).at(this.getsteptaskmoduleForsubtask(i,m)?.value.length-1).get('UserGroupsId')?.setValue(result?.UserGroupsId)
          this.getsteptaskmoduleForsubtask(i,m).at(this.getsteptaskmoduleForsubtask(i,m)?.value.length-1).get('ContactId')?.setValue(result?.ContactId)
          this.getsteptaskmoduleForsubtask(i,m).at(this.getsteptaskmoduleForsubtask(i,m)?.value.length-1).get('SelactCountry')?.setValue(result?.SelactCountry)
          this.getsteptaskmoduleForsubtask(i,m).at(this.getsteptaskmoduleForsubtask(i,m)?.value.length-1).get('ContactGroupsId')?.setValue(result?.ContactGroupsId)
          this.getsteptaskmoduleForsubtask(i,m).at(this.getsteptaskmoduleForsubtask(i,m)?.value.length-1).get('HasStep')?.setValue(result?.HasStep)
          this.getsteptaskmoduleForsubtask(i,m).at(this.getsteptaskmoduleForsubtask(i,m)?.value.length-1).get('PipeLinetype')?.setValue(result?.PipeLinetype)
          this.getsteptaskmoduleForsubtask(i,m).at(this.getsteptaskmoduleForsubtask(i,m)?.value.length-1).get('StepsViewModel')?.setValue(result?.AddSteps)
          this.getsteptaskmoduleForsubtask(i,m).at(this.getsteptaskmoduleForsubtask(i,m)?.value.length-1).get('pipelineID')?.setValue(result?.pipelineID)
          this.getsteptaskmoduleForsubtask(i,m).at(this.getsteptaskmoduleForsubtask(i,m)?.value.length-1).get('Pipelinename')?.setValue(result?.Pipelinename)
          this.getsteptaskmoduleForsubtask(i,m).at(this.getsteptaskmoduleForsubtask(i,m)?.value.length-1).get('Stage')?.setValue(result?.Stage)
          this.getsteptaskmoduleForsubtask(i,m).at(this.getsteptaskmoduleForsubtask(i,m)?.value.length-1).get('initiatives')?.setValue(result?.initiatives)
          this.getsteptaskmoduleForsubtask(i,m).at(this.getsteptaskmoduleForsubtask(i,m)?.value.length-1).get('ListofSuccessor')?.setValue(result?.ListofSuccessor)
          this.getsteptaskmoduleForsubtask(i,m).at(this.getsteptaskmoduleForsubtask(i,m)?.value.length-1).get('ListofPredecessor')?.setValue(result?.ListofPredecessor)
          this.getsteptaskmoduleForsubtask(i,m).at(this.getsteptaskmoduleForsubtask(i,m)?.value.length-1).get('IsMileStone')?.setValue(result?.IsMileStone)
          this.getsteptaskmoduleForsubtask(i,m).at(this.getsteptaskmoduleForsubtask(i,m)?.value.length-1).get('Addtages')?.setValue(result?.Addtages)
          if(result?.HasStep==true){
            if(result?.PipeLinetype=='1'){
             this.getsteptaskmoduleForsubtask(i,m).at(this.getsteptaskmoduleForsubtask(i,m)?.value.length-1).get('IsSavePipeline')?.setValue(true)
            }else{
             this.getsteptaskmoduleForsubtask(i,m).at(this.getsteptaskmoduleForsubtask(i,m)?.value.length-1).get('IsSavePipeline')?.setValue(false)
            }
          }else{
           this.getsteptaskmoduleForsubtask(i,m).at(this.getsteptaskmoduleForsubtask(i,m)?.value.length-1).get('IsSavePipeline')?.setValue(false)
          }
        }
        else {
          this.Addsubtask(i)
          this.getsubtask(i).at(this.getsubtask(i)?.value.length - 1).get('Title')?.setValue(result?.Title)
          this.getsubtask(i).at(this.getsubtask(i)?.value.length - 1).get('IsPublic')?.setValue(result?.IsPublic)
          this.getsubtask(i).at(this.getsubtask(i)?.value.length - 1).get('StartDate')?.setValue(result?.StartDate)
          this.getsubtask(i).at(this.getsubtask(i)?.value.length - 1).get('EndDate')?.setValue(result?.EndDate)
          this.getsubtask(i).at(this.getsubtask(i)?.value.length - 1).get('CriticityId')?.setValue(result?.CriticityId)
          this.getsubtask(i).at(this.getsubtask(i)?.value.length - 1).get('id')?.setValue(result?.id)
          this.getsubtask(i).at(this.getsubtask(i)?.value.length - 1).get('UserId')?.setValue(result?.UserId)
          this.getsubtask(i).at(this.getsubtask(i)?.value.length - 1).get('CategoryId')?.setValue(result?.CategoryId)
          this.getsubtask(i).at(this.getsubtask(i)?.value.length - 1).get('Isparent')?.setValue(result?.Isparent)
          this.getsubtask(i).at(this.getsubtask(i)?.value.length - 1).get('Period')?.setValue(result?.Period)
          this.getsubtask(i).at(this.getsubtask(i)?.value.length - 1).get('Hours')?.setValue(result?.Hours)
          this.getsubtask(i).at(this.getsubtask(i)?.value.length - 1).get('Minutes')?.setValue(result?.Minutes)
          this.getsubtask(i).at(this.getsubtask(i)?.value.length - 1).get('Address')?.setValue(result?.Address)
          this.getsubtask(i).at(this.getsubtask(i)?.value.length - 1).get('Zipcode')?.setValue(result?.ZipCode)
          this.getsubtask(i).at(this.getsubtask(i)?.value.length - 1).get('City')?.setValue(result?.City)
          this.getsubtask(i).at(this.getsubtask(i)?.value.length - 1).get('Country')?.setValue(result?.Country)
          this.getsubtask(i).at(this.getsubtask(i)?.value.length - 1).get('latitude')?.setValue(result?.latitude)
          this.getsubtask(i).at(this.getsubtask(i)?.value.length - 1).get('longitude')?.setValue(result?.longitude)
          this.getsubtask(i).at(this.getsubtask(i)?.value.length - 1).get('Description')?.setValue(result?.Description)
          this.getsubtask(i).at(this.getsubtask(i)?.value.length - 1).get('PermittedUserIds')?.setValue(result?.PermittedUserIds)
          this.getsubtask(i).at(this.getsubtask(i)?.value.length - 1).get('keyword')?.setValue(result?.keyword)
          this.getsubtask(i).at(this.getsubtask(i)?.value.length - 1).get('IsTemplate')?.setValue(result?.IsTemplate)
          this.getsubtask(i).at(this.getsubtask(i)?.value.length - 1).get('UserGroupsId')?.setValue(result?.UserGroupsId)
          this.getsubtask(i).at(this.getsubtask(i)?.value.length - 1).get('ContactId')?.setValue(result?.ContactId)
          this.getsubtask(i).at(this.getsubtask(i)?.value.length - 1).get('SelactCountry')?.setValue(result?.SelactCountry)
          this.getsubtask(i).at(this.getsubtask(i)?.value.length - 1).get('ContactGroupsId')?.setValue(result?.ContactGroupsId)
          this.getsubtask(i).at(this.getsubtask(i)?.value.length - 1).get('SiteId')?.setValue(result?.SiteId)
          this.getsubtask(i).at(this.getsubtask(i)?.value.length - 1).get('HasStep')?.setValue(result?.HasStep)
          this.getsubtask(i).at(this.getsubtask(i)?.value.length - 1).get('PipeLinetype')?.setValue(result?.PipeLinetype)
          this.getsubtask(i).at(this.getsubtask(i)?.value.length - 1).get('StepsViewModel')?.setValue(result?.AddSteps)
          this.getsubtask(i).at(this.getsubtask(i)?.value.length - 1).get('pipelineID')?.setValue(result?.pipelineID)
          this.getsubtask(i).at(this.getsubtask(i)?.value.length - 1).get('Pipelinename')?.setValue(result?.Pipelinename)
          this.getsubtask(i).at(this.getsubtask(i)?.value.length - 1).get('Stage')?.setValue(result?.Stage)
          this.getsubtask(i).at(this.getsubtask(i)?.value.length - 1).get('initiatives')?.setValue(result?.initiatives)
          this.getsubtask(i).at(this.getsubtask(i)?.value.length - 1).get('ListofSuccessor')?.setValue(result?.ListofSuccessor)
          this.getsubtask(i).at(this.getsubtask(i)?.value.length - 1).get('ListofPredecessor')?.setValue(result?.ListofPredecessor)
          this.getsubtask(i).at(this.getsubtask(i)?.value.length - 1).get('IsMileStone')?.setValue(result?.IsMileStone)
          this.getsubtask(i).at(this.getsubtask(i)?.value.length - 1).get('Addtages')?.setValue(result?.Addtages)
          if(result?.HasStep==true){
            if(result?.PipeLinetype=='1'){
             this.getsubtask(i).at(this.getsubtask(i)?.value.length - 1).get('IsSavePipeline')?.setValue(true)
            }else{
             this.getsubtask(i).at(this.getsubtask(i)?.value.length - 1).get('IsSavePipeline')?.setValue(false)
            }
          }else{
           this.getsubtask(i).at(this.getsubtask(i)?.value.length - 1).get('IsSavePipeline')?.setValue(false)
          }
        }

      }
    })
  }








  datasetintask(result:any) {
    console.log(result)
    this.gettasks().at(this.gettasks()?.value.length - 1).get('Title')?.setValue(result?.Title)
    this.gettasks().at(this.gettasks()?.value.length - 1).get('IsPublic')?.setValue(result?.IsPublic)
    this.gettasks().at(this.gettasks()?.value.length - 1).get('StartDate')?.setValue(result?.StartDate)
    this.gettasks().at(this.gettasks()?.value.length - 1).get('EndDate')?.setValue(result?.EndDate)
    this.gettasks().at(this.gettasks()?.value.length - 1).get('CriticityId')?.setValue(result?.CriticityId)
    this.gettasks().at(this.gettasks()?.value.length - 1).get('id')?.setValue(result?.id)
    this.gettasks().at(this.gettasks()?.value.length - 1).get('UserId')?.setValue(result?.UserId)
    this.gettasks().at(this.gettasks()?.value.length - 1).get('CategoryId')?.setValue(result?.CategoryId)
    this.gettasks().at(this.gettasks()?.value.length - 1).get('Isparent')?.setValue(result?.Isparent)
    this.gettasks().at(this.gettasks()?.value.length - 1).get('Period')?.setValue(result?.Period)
    this.gettasks().at(this.gettasks()?.value.length - 1).get('Hours')?.setValue(result?.Hours)
    this.gettasks().at(this.gettasks()?.value.length - 1).get('Minutes')?.setValue(result?.Minutes)
    this.gettasks().at(this.gettasks()?.value.length - 1).get('Address')?.setValue(result?.Address)
    this.gettasks().at(this.gettasks()?.value.length - 1).get('Zipcode')?.setValue(result?.ZipCode)
    this.gettasks().at(this.gettasks()?.value.length - 1).get('City')?.setValue(result?.City)
    this.gettasks().at(this.gettasks()?.value.length - 1).get('Country')?.setValue(result?.Country)
    this.gettasks().at(this.gettasks()?.value.length - 1).get('latitude')?.setValue(result?.latitude)
    this.gettasks().at(this.gettasks()?.value.length - 1).get('longitude')?.setValue(result?.longitude)
    this.gettasks().at(this.gettasks()?.value.length - 1).get('Description')?.setValue(result?.Description)
    this.gettasks().at(this.gettasks()?.value.length - 1).get('PermittedUserIds')?.setValue(result?.PermittedUserIds)
    this.gettasks().at(this.gettasks()?.value.length - 1).get('keyword')?.setValue(result?.keyword.toString())
    this.gettasks().at(this.gettasks()?.value.length - 1).get('IsTemplate')?.setValue(result?.IsTemplate)
    this.gettasks().at(this.gettasks()?.value.length - 1).get('UserGroupsId')?.setValue(result?.UserGroupsId)
    this.gettasks().at(this.gettasks()?.value.length - 1).get('ContactId')?.setValue(result?.ContactId)
    this.gettasks().at(this.gettasks()?.value.length - 1).get('SelactCountry')?.setValue(result?.SelactCountry)
    this.gettasks().at(this.gettasks()?.value.length - 1).get('ContactGroupsId')?.setValue(result?.ContactGroupsId)
    this.gettasks().at(this.gettasks()?.value.length - 1).get('SiteId')?.setValue(result?.SiteId)
    this.gettasks().at(this.gettasks()?.value.length - 1).get('HasStep')?.setValue(result?.HasStep)
    this.gettasks().at(this.gettasks()?.value.length - 1).get('PipeLinetype')?.setValue(result?.PipeLinetype)
    this.gettasks().at(this.gettasks()?.value.length - 1).get('StepsViewModel')?.setValue(result?.AddSteps)
    this.gettasks().at(this.gettasks()?.value.length - 1).get('pipelineID')?.setValue(result?.pipelineID)
    this.gettasks().at(this.gettasks()?.value.length - 1).get('Pipelinename')?.setValue(result?.Pipelinename)
    this.gettasks().at(this.gettasks()?.value.length - 1).get('Stage')?.setValue(result?.Stage)
    this.gettasks().at(this.gettasks()?.value.length - 1).get('initiatives')?.setValue(result?.initiatives)
    this.gettasks().at(this.gettasks()?.value.length - 1).get('ListofSuccessor')?.setValue(result?.ListofSuccessor)
    this.gettasks().at(this.gettasks()?.value.length - 1).get('ListofPredecessor')?.setValue(result?.ListofPredecessor)
    this.gettasks().at(this.gettasks()?.value.length - 1).get('IsMileStone')?.setValue(result?.IsMileStone)
    this.gettasks().at(this.gettasks()?.value.length - 1).get('Addtages')?.setValue(result?.Addtages)
    if(result?.HasStep==true){
      if(result?.PipeLinetype=='1'){
        this.gettasks().at(this.gettasks()?.value.length - 1).get('IsSavePipeline')?.setValue(true)
      }else{
        this.gettasks().at(this.gettasks()?.value.length - 1).get('IsSavePipeline')?.setValue(false)
      }
    }else{
      this.gettasks().at(this.gettasks()?.value.length - 1).get('IsSavePipeline')?.setValue(false)
    }
  }
  datasetintask1(i:number, result:any) {
    console.log(result)
    this.getsteptaskmodule(i).at(this.getsteptaskmodule(i)?.value.length - 1).get('Title')?.setValue(result?.Title)
    this.getsteptaskmodule(i).at(this.getsteptaskmodule(i)?.value.length - 1).get('IsPublic')?.setValue(result?.IsPublic)
    this.getsteptaskmodule(i).at(this.getsteptaskmodule(i)?.value.length - 1).get('StartDate')?.setValue(result?.StartDate)
    this.getsteptaskmodule(i).at(this.getsteptaskmodule(i)?.value.length - 1).get('EndDate')?.setValue(result?.EndDate)
    this.getsteptaskmodule(i).at(this.getsteptaskmodule(i)?.value.length - 1).get('CriticityId')?.setValue(result?.CriticityId)
    this.getsteptaskmodule(i).at(this.getsteptaskmodule(i)?.value.length - 1).get('id')?.setValue(result?.id)
    this.getsteptaskmodule(i).at(this.getsteptaskmodule(i)?.value.length - 1).get('UserId')?.setValue(result?.UserId)
    this.getsteptaskmodule(i).at(this.getsteptaskmodule(i)?.value.length - 1).get('CategoryId')?.setValue(result?.CategoryId)
    this.getsteptaskmodule(i).at(this.getsteptaskmodule(i)?.value.length - 1).get('Isparent')?.setValue(result?.Isparent)
    this.getsteptaskmodule(i).at(this.getsteptaskmodule(i)?.value.length - 1).get('Period')?.setValue(result?.Period)
    this.getsteptaskmodule(i).at(this.getsteptaskmodule(i)?.value.length - 1).get('Hours')?.setValue(result?.Hours)
    this.getsteptaskmodule(i).at(this.getsteptaskmodule(i)?.value.length - 1).get('Minutes')?.setValue(result?.Minutes)
    this.getsteptaskmodule(i).at(this.getsteptaskmodule(i)?.value.length - 1).get('Address')?.setValue(result?.Address)
    this.getsteptaskmodule(i).at(this.getsteptaskmodule(i)?.value.length - 1).get('Zipcode')?.setValue(result?.ZipCode)
    this.getsteptaskmodule(i).at(this.getsteptaskmodule(i)?.value.length - 1).get('City')?.setValue(result?.City)
    this.getsteptaskmodule(i).at(this.getsteptaskmodule(i)?.value.length - 1).get('Country')?.setValue(result?.Country)
    this.getsteptaskmodule(i).at(this.getsteptaskmodule(i)?.value.length - 1).get('latitude')?.setValue(result?.latitude)
    this.getsteptaskmodule(i).at(this.getsteptaskmodule(i)?.value.length - 1).get('longitude')?.setValue(result?.longitude)
    this.getsteptaskmodule(i).at(this.getsteptaskmodule(i)?.value.length - 1).get('Description')?.setValue(result?.Description)
    this.getsteptaskmodule(i).at(this.getsteptaskmodule(i)?.value.length - 1).get('PermittedUserIds')?.setValue(result?.PermittedUserIds)
    this.getsteptaskmodule(i).at(this.getsteptaskmodule(i)?.value.length - 1).get('keyword')?.setValue(result?.keyword.toString())
    this.getsteptaskmodule(i).at(this.getsteptaskmodule(i)?.value.length - 1).get('IsTemplate')?.setValue(result?.IsTemplate)
    this.getsteptaskmodule(i).at(this.getsteptaskmodule(i)?.value.length - 1).get('UserGroupsId')?.setValue(result?.UserGroupsId)
    this.getsteptaskmodule(i).at(this.getsteptaskmodule(i)?.value.length - 1).get('ContactId')?.setValue(result?.ContactId)
    this.getsteptaskmodule(i).at(this.getsteptaskmodule(i)?.value.length - 1).get('SelactCountry')?.setValue(result?.SelactCountry)
    this.getsteptaskmodule(i).at(this.getsteptaskmodule(i)?.value.length - 1).get('ContactGroupsId')?.setValue(result?.ContactGroupsId)
    this.getsteptaskmodule(i).at(this.getsteptaskmodule(i)?.value.length - 1).get('SiteId')?.setValue(result?.SiteId)
    this.getsteptaskmodule(i).at(this.getsteptaskmodule(i)?.value.length - 1).get('HasStep')?.setValue(result?.HasStep)
    this.getsteptaskmodule(i).at(this.getsteptaskmodule(i)?.value.length - 1).get('PipeLinetype')?.setValue(result?.PipeLinetype)
    this.getsteptaskmodule(i).at(this.getsteptaskmodule(i)?.value.length - 1).get('StepsViewModel')?.setValue(result?.AddSteps)
    this.getsteptaskmodule(i).at(this.getsteptaskmodule(i)?.value.length - 1).get('pipelineID')?.setValue(result?.pipelineID)
    this.getsteptaskmodule(i).at(this.getsteptaskmodule(i)?.value.length - 1).get('Pipelinename')?.setValue(result?.Pipelinename)
    this.getsteptaskmodule(i).at(this.getsteptaskmodule(i)?.value.length - 1).get('Stage')?.setValue(result?.Stage)
    this.getsteptaskmodule(i).at(this.getsteptaskmodule(i)?.value.length - 1).get('initiatives')?.setValue(result?.initiatives)
    this.getsteptaskmodule(i).at(this.getsteptaskmodule(i)?.value.length - 1).get('ListofSuccessor')?.setValue(result?.ListofSuccessor)
    this.getsteptaskmodule(i).at(this.getsteptaskmodule(i)?.value.length - 1).get('ListofPredecessor')?.setValue(result?.ListofPredecessor)
    this.getsteptaskmodule(i).at(this.getsteptaskmodule(i)?.value.length - 1).get('IsMileStone')?.setValue(result?.IsMileStone)
    this.getsteptaskmodule(i).at(this.getsteptaskmodule(i)?.value.length - 1).get('Addtages')?.setValue(result?.Addtages)
    if(result?.HasStep==true){
      if(result?.PipeLinetype=='1'){
        this.getsteptaskmodule(i).at(this.getsteptaskmodule(i)?.value.length - 1).get('IsSavePipeline')?.setValue(true)
      }else{
        this.getsteptaskmodule(i).at(this.getsteptaskmodule(i)?.value.length - 1).get('IsSavePipeline')?.setValue(false)
      }
    }else{
      this.getsteptaskmodule(i).at(this.getsteptaskmodule(i)?.value.length - 1).get('IsSavePipeline')?.setValue(false)
    }
  }

    getUserbyInitiative() {
      this.userData.forEach((element:any, index:number) => {
        this.Addcondictuon();
        this.Userslist().at(index).get('userId')?.setValue(element.id)
        this.Userslist().at(index).get('roleName')?.setValue(element.roleName)
      });
    }

    getOneInitiative() {
    this.Initiative.get('id')?.setValue(this.intiativeData?.id)
    this.Initiative.get('title')?.setValue(this.intiativeData?.title)
    this.Initiative.get('description')?.setValue(this.intiativeData?.description)
    this.Initiative.get('StartDate')?.setValue(this.intiativeData?.startDate)
    this.Initiative.get('EndDate')?.setValue(this.intiativeData?.endDate)
    this.Initiative.get('isPublic')?.setValue(!this.intiativeData?.isPrivate)
    this.Initiative.get('budget')?.setValue(this.intiativeData?.budget)
    this.Initiative.get('isDraft')?.setValue(this.intiativeData?.isDraft)
    this.Initiative.get('isTemplate')?.setValue(this.intiativeData?.isTemplate)
    this.Initiative.get('addsteps')?.setValue(this.intiativeData?.hasStep)
    if(this.intiativeData?.isPrivate==true){
      let data:any=[]
      this.intiativeData?.permittedUsers.forEach((element:any) => {
        data.push(element.id)
      });
    this.Initiative.get('PermittedUserIds')?.setValue(data)
    }

     if(this.intiativeData?.getRoleNames){
      this.roleNamesArray=[]
      this.intiativeData?.getRoleNames.forEach((element:any) => {
        this. roleNamesArray.push(element)
      });
     }
    if (this.intiativeData?.getKeywords && this.intiativeData?.getKeywords.length > 0) {
      this.keywordlist = [];
      this.intiativeData?.getKeywords.forEach((keyword:any) => {
        this.keywordlist.push(keyword);
      });
    }
    if(this.intiativeData?.tagViewModels.length!=0){
      this.intiativeData?.tagViewModels.forEach((element:any, index:number) => {
        this.addtageBody();
        this.gettageBody().at(index).get('tagTableId')?.setValue(element?.tagTableId);
        this.gettageBody().at(index).get('creatorId')?.setValue(element?.creatorId);
        this.gettageBody().at(index).get('fieldName')?.setValue(element?.fieldName);
        this.gettageBody().at(index).get('fieldType')?.setValue(element?.fieldType);
        this.gettageBody().at(index).get('fieldValue')?.setValue(element?.fieldValue);
        this.gettageBody().at(index).get('dropdownvaluetotal')?.setValue(element?.dropdownValues);
      });
    }
  // steps available 
    if (this.intiativeData?.hasStep === true) {
      this.Initiative.get('Pipelinename')?.setValue(this.intiativeData?.pipelineName)
      this.Initiative.get('pipelineID')?.setValue(this.intiativeData?.pipelineId)
      this.intiativeData?.stepProgressDtos.forEach((element:any , index:number) => {
        this.Addsteps()
        this.getAllsteps().at(index).get('name')?.setValue(element.name?element.name:element.stepName)
        this.getAllsteps().at(index).get('id')?.setValue(element.step)
          element.taskProgressDtos.forEach((x:any, i:any) => {
            this.addtaskforstep(index)
            this.userService.FindTaskById(x.taskId).subscribe((result: any) => {
              this.getsteptaskmodule(index).at(i).get('Title')?.setValue(result?.title)
              this.getsteptaskmodule(index).at(i).get('id')?.setValue(result?.taskId)
              this.getsteptaskmodule(index).at(i).get('Description')?.setValue(result?.description)
              this.getsteptaskmodule(index).at(i).get('PermittedUserIds')?.setValue(result?.PermittedUserIds)
              this.getsteptaskmodule(index).at(i).get('StartDate')?.setValue(result?.startDate)
              this.getsteptaskmodule(index).at(i).get('EndDate')?.setValue(result?.endDate) 
              this.getsteptaskmodule(index).at(i).get('Hours')?.setValue(result?.hours)
              this.getsteptaskmodule(index).at(i).get('Minutes')?.setValue(result?.minutes.toString())
              this.getsteptaskmodule(index).at(i).get('CriticityId')?.setValue(result?.criticityId)
              this.getsteptaskmodule(index).at(i).get('SiteId')?.setValue(result?.sitedetaildto?.id)
              this.getsteptaskmodule(index).at(i).get('Isparent')?.setValue(result?.isParent)
              this.getsteptaskmodule(index).at(i).get('Address')?.setValue(result?.address)
              const zipCodeValue = result?.zipCode ? result?.zipCode.toString() : null;
              this.getsteptaskmodule(index).at(i).get('Zipcode')?.setValue(zipCodeValue)
              this.getsteptaskmodule(index).at(i).get('City')?.setValue(result?.city)
              this.getsteptaskmodule(index).at(i).get('Country')?.setValue(result?.country)
              this.getsteptaskmodule(index).at(i).get('HasStep')?.setValue(result?.hasStep)
              this.getsteptaskmodule(index).at(i).get('IsMileStone')?.setValue(result?.IsMileStone?result?.IsMileStone:result?.isMileStone)
              this.getsteptaskmodule(index).at(i).get('initiatives')?.setValue(result?.initiativeId)
              this.getsteptaskmodule(index).at(i).get('Addtages')?.setValue(result?.tagViewModels)
              if(result?.isPublic==false){
                this.getsteptaskmodule(index).at(i).get('IsPublic')?.setValue(result?.isPublic)
                let data: any[]=[]
                result?.permittedUsers.forEach((element:any) => {
                  data.push(element.id)
                });
                this.getsteptaskmodule(index).at(i).get('PermittedUserIds')?.setValue(data)
              }
              if(result?.successorTaskcount!=0){ this.getlinkedsuccessor(result?.id)}
              if(result?.predecessorTaskcount!=0){this.getlinkedpredecessor(result?.id)}

              if (result?.assignedTo && result?.assignedTo.length > 0) {
                const userIds = result?.assignedTo.map((item:any) => item.id);
                this.getsteptaskmodule(index).at(i).get('UserId')?.setValue(userIds)
                this.getsteptaskmodule(index).at(i).get('Stage')?.setValue(1)
              }else{
                this.getsteptaskmodule(index).at(i).get('Stage')?.setValue(2)
              }
              if (result?.contactdtls && result?.contactdtls.length > 0) {
                const contactIds = result?.contactdtls.map((item:any) => item.id);
                this.getsteptaskmodule(index).at(i).get('ContactId')?.setValue(contactIds)
              }
              if (result?.keywords && result?.keywords.length > 0) {
                this.keywordlist = [];
                result?.keywords.forEach((keyword:any) => {
                  this.keywordlist.push(keyword);
                });
              }
              //  steps true 
              if(result?.HasStep==true){
                this.getsteptaskmodule(index).at(i).get('pipelineID')?.setValue(result?.pipelineId)
                this.getsteptaskmodule(index).at(i).get('Pipelinename')?.setValue(result?.pipelineName)
                if(result?.pipelineId!=0&&result?.pipelineId!=null){
                  this.getsteptaskmodule(i).at(this.getsteptaskmodule(i)?.value.length - 1).get('IsSavePipeline')?.setValue(false)
                }else if(result?.pipelineName!=null){
                  this.getsteptaskmodule(i).at(this.getsteptaskmodule(i)?.value.length - 1).get('IsSavePipeline')?.setValue(false)
                }
              }else{
                this.getsteptaskmodule(i).at(this.getsteptaskmodule(i)?.value.length - 1).get('IsSavePipeline')?.setValue(false)
              }
              // 00000000 
              this.getsteptaskmodule(index).at(i).get('ListofSuccessor')?.setValue(this.predecessorlist)
              this.getsteptaskmodule(index).at(i).get('ListofPredecessor')?.setValue(this.successorlist)
            });
          })
      });
    }else{

    }
  }


  getlinkedpredecessor(id:number){
      this.userService.GetLinkedTasks(id,false,true).subscribe((result)=>{
        if(result){
          this.predecessorlist=result.map((ele:any)=>{
            return ele.id
          })
        }
      })
  }


  getlinkedsuccessor(id:number){
      this.userService.GetLinkedTasks(id,true,false).subscribe((result)=>{
        if(result){
          this.successorlist=result.map((ele:any)=>{
            return ele.id
          })
        }
      })
    }

  
  popupforerrormessage(message:any, header:any) {
    this.dialog.open(PopupErrorMessageComponent, {
      width: '550px',
      data: { message: message, header: header },
      autoFocus: false,
      disableClose: true,
    });
  }

}
