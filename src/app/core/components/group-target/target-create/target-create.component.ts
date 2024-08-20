import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { TargetService } from '../../../services/target.service';
import { TargetContacts, TargetContactsGroup, TargetSites, TargetProducts, TargetSitesGroup, TargetProductsGroup, TargetUsers, TargetUsersGroup } from '../target-create/target.create';
// import * as _ from 'lodash';
import { MessageService } from 'src/app/core/services/message.service';
import { ManageContactsService } from 'src/app/core/services/manage-contacts.service';
import { el } from 'date-fns/locale';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { ManageProductsService } from 'src/app/core/services/manage-products.service';
import { ManageSitesService } from 'src/app/core/services/manage-sites.service';
import { ManageUsersService } from 'src/app/core/services/manage-users.service';
import { DatePipe } from '@angular/common';
import { event } from 'jquery';

@Component({
  selector: 'app-target-create',
  templateUrl: './target-create.component.html',
  styleUrls: ['./target-create.component.scss'],
})

export class TargetCreateComponent implements OnInit {
  targetCreateForm: FormGroup;
  selectedValue = 'Manual'
  monthName = [
    { id: 0, name: 'January', value: 'January' },
    { id: 1, name: 'February', value: 'February' },
    { id: 2, name: 'March', value: 'March' },
    { id: 3, name: 'April', value: 'April' },
    { id: 4, name: 'May', value: 'May' },
    { id: 4, name: 'June', value: 'June' },
    { id: 4, name: 'July', value: 'July' },
    { id: 4, name: 'August', value: 'August' },
    { id: 4, name: 'September', value: 'September' },
    { id: 4, name: 'October', value: 'October' },
    { id: 4, name: 'November', value: 'November' },
    { id: 4, name: 'December', value: 'December' }
  ];
  max: any;
  min: any;
  targetCreateId: any;
  EntitiyValues = ['Users', 'Products', 'Contacts', 'Sites']
  SelactValues = ['Single', 'Group']
  SelactonthlyareYearly = ['Yearly', 'Monthly']
  Users = true;
  Contacts = true;
  Sites = true;
  Products = true;
  UsersName = false;
  ContactsName = false;
  SitesName = false;
  ProductsName = false;
  Single = true;
  Group = true;
  SingleName = true;
  GroupName = true;
  selected = '';
  selectedcurrency = 1
  selectedGroup = '';
  UserId: string = '';
  availableYears: any[] = [];
  fromPage: string = '';
  AllList: any[] = [];
  filterList: any[] = [];
  AllGroup: any[] = [];
  filterGroup: any[] = [];
  selectedOption = '';
  selectedVal = '';
  monthsBool: boolean = false;
  selectedOptionId: any;
  monthlyViewModels: any[] = [];
  yearlyTarget: any;
  tapindex = 0
  ScreenType: any;
  selectedIndex = 0
  targetId: any;
  targetDetails:any;
  frequency='yearly';
  KeywordsFromOrder = []
  // auto chip for keyword
  separatorKeysCodes: number[] = [ENTER, COMMA];
  keywordlist: any[] = [];
  currentdate=new Date()
  constructor(
    @Inject(MAT_DIALOG_DATA) public target: any,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private targetService: TargetService,
    private matDialogRef: MatDialogRef<TargetCreateComponent>,
    private messageService: MessageService,
    private manageContactsService: ManageContactsService,
    private manageUsersService: ManageUsersService,
    private manageSitesService: ManageSitesService,
    private manageProductssService: ManageProductsService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private translate: TranslateService ,
    public datepipe: DatePipe
  ) {
    if(localStorage.getItem('lang')){
      const lang:any=localStorage.getItem('lang')
      this.translate.use(lang);
    }else{
      this.translate.use('English');
    }
    this.targetCreateForm = this.formBuilder.group({
      statusOfTransaction:[1], 
      id:[0], 
      targetFor: [this.selectedOption],
      targetType: [''],
      targetStatus: [''],
      currency: [1],
      StartDate:[this.currentdate],
      EndDate:[],
      isPublic: [false],
      isPrivate: [true],
      isDelegate: [false],
      targetAmt: [null],
      targetDuration: [null],
      targetCount: [null],
      selectdatetype:['Manual'],
      options: [''],
      Targetselaction:[1],
      Basedontargetselaction:['IsAmountTarget'],
      SelactSingleIdes: [null],
      SelactEntitiyValue: [''],
      SelactGroupIdes: [null],
      optionsGroup: [''],
      selectType: [this.selectedVal],
      addMonth: this.formBuilder.array([])
    });
  }

  getdateStatus(event:any){
    if(event==='monthly'){
console.log(this.getDateAfterMonths(1))
this.targetCreateForm.get('EndDate')?.setValue(this.datepipe.transform(this.getDateAfterMonths(1), 'yyyy-MM-dd'))
    }else if(event==='weekly'){
      console.log(this.getDateAfterWeeks(1))
this.targetCreateForm.get('EndDate')?.setValue(this.datepipe.transform(this.getDateAfterWeeks(1), 'yyyy-MM-dd'))
    }else if(event==='yearly'){
      console.log(this.getDateAfterYears(1))
this.targetCreateForm.get('EndDate')?.setValue(this.datepipe.transform(this.getDateAfterYears(1), 'yyyy-MM-dd'))
    }else if(event==='Daily'){
      this.targetCreateForm.get('EndDate')?.setValue(this.datepipe.transform(this.targetCreateForm.value.StartDate, 'yyyy-MM-dd'))

    }
  }
  getDateAfterYears(years:any) {
    const currentDate = new Date(this.targetCreateForm.value.StartDate);
    currentDate.setFullYear(currentDate.getFullYear() + years);
  
    const year = currentDate.getFullYear();
    const month = currentDate.toLocaleString('default', { month: 'long' });
    const day = currentDate.getDate();
  
    // Format the date as "Month Day, Year"
    const formattedDate = `${month} ${1-day}, ${year}`;
    
    return formattedDate;
  }
  getDateAfterMonths(months:any) {
    const currentDate = new Date(this.targetCreateForm.value.StartDate);
    currentDate.setMonth(currentDate.getMonth() + months);
    const year = currentDate.getFullYear();
    const month = currentDate.toLocaleString('default', { month: 'long' });
    const day = currentDate.getDate();
    // Format the date as "Month Day, Year"
    const formattedDate = `${month} ${1-day}, ${year}`;
    return formattedDate;
  }
  getDateAfterWeeks(weeks:any) {
    const currentDate = new Date(this.targetCreateForm.value.StartDate);
    const futureDate = new Date(currentDate.getTime() + weeks * 7 * 24 * 60 * 60 * 1000); // Add weeks in milliseconds
    const year = futureDate.getFullYear();
    const month = futureDate.toLocaleString('default', { month: 'long' });
    const day = futureDate.getDate();
    // Format the date as "Month Day, Year"
    const formattedDate = `${month} ${1-day}, ${year}`;
    
    return formattedDate;
  }

getBasedontargetselaction(){
  return this.targetCreateForm.value.Basedontargetselaction

}

  getTargetselaction(){
     return this.targetCreateForm.value.targetType
  }


  MonthsConditions(): FormArray {
    return this.targetCreateForm.get("addMonth") as FormArray
  }

  Addcondictuon() {
    this.MonthsConditions().push(this.addMonth());
  }

  Removecondictuon(i: number) {
    this.MonthsConditions().removeAt(i);
  }

  addMonth(): FormGroup {
    return this.formBuilder.group({
      month: [''],
      Amount: [''],
      Count: [''],
      Duration: [''],
    });
  }



  ngOnInit(): void {
    this.FindKeywordsFromOrder()
    const currentYear = new Date().getFullYear()
    this.getYear();
    this.onTargetValChanged(this.data.type)
    this.ScreenType = this.data?.screenType
    this.GetGropDowenValues()
    this.targetCreateForm.get('SelactEntitiyValue')?.setValue(this.data.type)
    this.selectedOption = this.data?.type

    console.log(this.data)
    if (this.data?.screenType == 'Create') {
      if (this.data.state == 'Single') {
        this.selectedIndex = 0
        this.targetCreateForm.get('SelactSingleIdes')?.setValue(this.data?.data?.id)
      } else {
        this.targetCreateForm.get('SelactGroupIdes')?.setValue(this.data?.data?.id)
        this.selectedIndex = 1
      }
      this.targetCreateForm.get('targetStatus')?.setValue('Private')
      this.targetCreateForm.get('isPublic')?.setValue(false)
      this.targetCreateForm.get('isPrivate')?.setValue(true)
      this.targetCreateForm.get('isDelegate')?.setValue(false)
      } else if (this.data?.screenType == 'Edit') {
      this.targetDetails = this.data?.data;
      this.targetId = this.data?.data.targetId
      this.keywordlist=this.data?.data?.keywords
      this.targetCreateForm.get('id')?.setValue(this.data?.data.targetId)
      this.targetCreateForm.get('StartDate')?.setValue(this.data?.data.startDate)
      this.targetCreateForm.get('EndDate')?.setValue(this.data?.data.endDate)
      if (this.data.state == 'Single') {
        this.selectedIndex = 0
        this.targetCreateForm.get('SelactSingleIdes')?.setValue(Number(this.data?.data?.id))
      } else {
        this.selectedIndex = 1
        this.targetCreateForm.get('SelactGroupIdes')?.setValue(Number(this.data?.data?.id))
      }
      if(this.data?.data.isAmountTarget==true){
        this.targetCreateForm.get('Basedontargetselaction')?.setValue('IsAmountTarget')
        this.targetCreateForm.get('targetAmt')?.setValue(this.data?.data.targetValue)
        if(this.data?.data.statusOfTransaction=="Validated"){
          this.targetCreateForm.get('statusOfTransaction')?.setValue('1')
        }else if(this.data?.data.statusOfTransaction=="Pending"){
          this.targetCreateForm.get('statusOfTransaction')?.setValue('2')
        }
      }else if(this.data?.data.isCountTarget==true){
        this.targetCreateForm.get('Basedontargetselaction')?.setValue('IsCountTarget')
        this.targetCreateForm.get('targetCount')?.setValue(this.data?.data.targetValue)
      }else if(this.data?.data.isDurationTarget==true){
        this.targetCreateForm.get('Basedontargetselaction')?.setValue('IsDurationTarget')
        this.targetCreateForm.get('targetDuration')?.setValue(this.data?.data.targetDuration)
      }

      if (this.data?.data.isPublic == true) {
        this.targetCreateForm.get('targetStatus')?.setValue('Public')
      } else if (this.data?.data.isPrivate == true) {
        this.targetCreateForm.get('targetStatus')?.setValue('Private')
      } else if (this.data?.data.isDelegate == true) {
        this.targetCreateForm.get('targetStatus')?.setValue('Deligation')
      }
        this.frequency = 'yearly'
        this.targetCreateForm.get('targetType')?.setValue(this.data?.data?.targetType)
      this.targetCreateForm.get('targetAmt')?.setValue(Number(this.data?.data.targetValue))
      this.targetCreateForm.get('isPublic')?.setValue(this.data?.data.isPublic)
      this.targetCreateForm.get('isPrivate')?.setValue(this.data?.data.isPrivate)
      this.targetCreateForm.get('isDelegate')?.setValue(this.data?.data.isDelegate)
    }
  }

  seletectdtransationstatus(event:any){
    this.targetCreateForm.get('StatusOfTransaction')?.setValue(event.value)
    setTimeout(() => {
      this.FindKeywordsFromOrder()
    }, 10);
  }
  
  selectedTarget(event:any) {
    console.log(this.targetCreateForm.get('Targetselaction')?.value)
    this.FindKeywordsFromOrder()
  }
  FindKeywordsFromOrder(){
    if(this.targetCreateForm.get('Targetselaction')?.value == 1) {
      this.targetService.FindKeywordsFromOrder(this.targetCreateForm.value.statusOfTransaction).subscribe((result:any)=>{
        if(result){
          this.KeywordsFromOrder=result
        }
      })
    }
    else if (this.targetCreateForm.get('Targetselaction')?.value == 2) {
      this.targetService.FindKeywordsFromEvent().subscribe((result:any)=>{
        if(result){
          this.KeywordsFromOrder=result
        }
      })
    }
    else if (this.targetCreateForm.get('Targetselaction')?.value == 3) {
      this.targetService.FindKeywordsFromTask().subscribe((result:any)=>{
        if(result){
          this.KeywordsFromOrder=result
        }
      })
    }

    else if (this.targetCreateForm.get('Targetselaction')?.value == 4) {
      this.targetService.FindKeywordsFromInitiatives().subscribe((result:any)=>{
        if(result){
          this.KeywordsFromOrder=result
        }
      })
    }
  } 



  getYear() {
    this.max = new Date().getFullYear();
    this.min = this.max + 0;
    this.max = this.max + 57;
    this.availableYears = [];
    for (let i = this.min; i <= this.max; i++) {
      this.availableYears.push({
        id: i
      });
    }
  }

  gettargetStatus(value:any) {
    if (value == 'Private') {
      this.targetCreateForm.get('isPublic')?.setValue(false)
      this.targetCreateForm.get('isPrivate')?.setValue(true)
      this.targetCreateForm.get('isDelegate')?.setValue(false)
    } else if (value == 'Public') {
      this.targetCreateForm.get('isPublic')?.setValue(true)
      this.targetCreateForm.get('isPrivate')?.setValue(false)
      this.targetCreateForm.get('isDelegate')?.setValue(false)
    } else if (value == 'Deligation') {
      this.targetCreateForm.get('isPublic')?.setValue(false)
      this.targetCreateForm.get('isPrivate')?.setValue(false)
      this.targetCreateForm.get('isDelegate')?.setValue(true)
    }

  }



  GetGropDowenValues() {
    if (this.data.type == 'Users') {
      if (this.data.state == 'Single') {
        this.selectedIndex = 0
        this.getUserList()
      } else {
        this.selectedIndex = 1
        this.getMultipleUser()
      }
    }
    if (this.data.type == 'Contacts') {
      if (this.data.state == 'Single') {
        this.selectedIndex = 0
        this.getContactsList()
      } else {
        this.selectedIndex = 1
        this.getMultipleContactsList()
      }
    }
    if (this.data.type == 'Sites') {
      if (this.data.state == 'Single') {
        this.selectedIndex = 0
        this.getSiteList()
      } else {
        this.selectedIndex = 1
        this.getSiteGroup()
      }
    }
    if (this.data.type == 'Products') {
      if (this.data.state == 'Single') {
        this.selectedIndex = 0
        this.getProductList()
      } else {
        this.selectedIndex = 1
        this.getProductGroup()
      }
    }
  }



  onTargetTypeChanged(event:any) {
    this.targetCreateForm.get('targetAmt')?.setValue(0)
    if(this.targetCreateForm.value.addMonth.length!=0){
      this.targetCreateForm.value.addMonth.forEach((element:any,index:number) => {
        this.Removecondictuon(index)
      });
    }
    this.targetCreateForm.get('addMonth')?.patchValue([0])
    console.log(event)
    this.frequency = event;
    if (event == 'Monthly') {
      this.monthsBool = true;
      this.Addcondictuon()
    } else {
      this.monthsBool = false;
      this.getYear();
    }
  }

  closedialogbox() {
    this.dialog.closeAll();
  }



  onTargetValChanged(eve:any) {
    console.log(eve);
    this.selectedOption = eve;
    if (eve == "Users") {
      this.getUserList();
      this.getMultipleUser();
    } else if (eve == "Contacts") {
      this.getContactsList();
      this.getMultipleContactsList();
    } else if (eve == "Sites") {
      this.getSiteList();
      this.getSiteGroup();
    } else if (eve == "Products") {
      this.getProductList();
      this.getProductGroup();

    }
  }
  tabChanged(event:any) {
    this.tapindex = event.index
  }
  filterOptions(value: string,type:string): void {
    console.log(type)
    // single 
    if(type==='users'){
      this.filterList = this.AllList.filter(option =>
        option.firstName.toLowerCase().includes(value.toLowerCase())
      );
    }else if(type==='Sites'){
      this.filterList = this.AllList.filter(option =>
        option.companyName.toLowerCase().includes(value.toLowerCase())
      );
    }else if(type==='Contacts'){
      this.filterList = this.AllList.filter(option =>
        option.firstName.toLowerCase().includes(value.toLowerCase())
      );
    }else if(type==='Products'){
      this.filterList = this.AllList.filter(option =>
        option.productName.toLowerCase().includes(value.toLowerCase())
      );
    } 
    // groups 
    else if(type==='UserGroups'){
      this.filterGroup = this.AllGroup.filter(option =>
        option.groupName.toLowerCase().includes(value.toLowerCase())
      );
    }else if(type==='SitesGroups'){
      this.filterGroup = this.AllGroup.filter(option =>
        option.siteGroupName.toLowerCase().includes(value.toLowerCase())
      );
    }else if(type==='ContactGroups'){
      this.filterGroup = this.AllGroup.filter(option =>
        option.groupName.toLowerCase().includes(value.toLowerCase())
      );
    }else if(type==='ProductesGroups'){
      this.filterGroup = this.AllGroup.filter(option =>
        option.productGroupName.toLowerCase().includes(value.toLowerCase())
      );
    }
  
  }





  // getUserList
  getUserList() {
    this.manageUsersService.findAllUsersDropdown().subscribe((result)=>{
      if(result){
        this.AllList=result
        this.filterList=result
      }
    }); 
  }

  getMultipleUser() {
    this.manageUsersService.findAllUsersGroupDropdown().subscribe((result) => {
      if (result) {
        this.AllGroup = result;
        this.filterGroup = result;
      }
    });
  } 
  // getContactsList
  getContactsList() {
    this.manageContactsService.findAllContactsDropdown().subscribe((result)=>{
      if(result){
        this.AllList=result
        this.filterList=result
      } 
    });
  }
  getMultipleContactsList() {
    this.manageContactsService.findAllContactsGroupDropdown().subscribe((result) => {
      if (result) {
        this.AllGroup = result;
        this.filterGroup = result;
      }
    });
  }
  // getSiteList
  getSiteList() {
    this.manageSitesService.findAllSitesDropdown().subscribe((result)=>{
      if(result){
        this.AllList=result
        this.filterList=result
      }
    });
  }
  getSiteGroup() {
    this.targetService.fetchSiteGroup().subscribe((result: any) => {
      if(result){
        console.log(result);
        this.AllGroup = result.data;
        this.filterGroup = result.data;
      }
     
    });
  }
  // getProductList
  getProductList() {
    this.manageProductssService.findAllProductsDropdown().subscribe((result)=>{
      if(result){
        this.AllList=result
        this.filterList=result
      }
    });
  }
  getProductGroup() {
    this.targetService.fetchProductsGroup().subscribe((result: any) => {
      if(result){
        console.log(result);
        this.AllGroup = result.data;
        this.filterGroup = result.data;
      }
     
    });
  }

  // CreatTargetAll
  CreatTargetAll() {
    console.log(this.tapindex)
    console.log(this.targetCreateForm.value)
    let data:any ={
      "id": this.targetCreateForm.value.id,
      "startDate": this.datepipe.transform(this.targetCreateForm.value.StartDate, 'yyyy-MM-dd'),
      "endDate": this.datepipe.transform(this.targetCreateForm.value.EndDate, 'yyyy-MM-dd'),
      "targetAssignee": this.gettargetAssignee(),
      "isGroup": this.tapindex==0?false:true,
      "userId": this.tapindex==0?this.gettargetAssignee()==1?this.targetCreateForm.value.SelactSingleIdes:null:null,
      "productId": this.tapindex==0?this.gettargetAssignee()==3?this.targetCreateForm.value.SelactSingleIdes:null:null,
      "contactId": this.tapindex==0?this.gettargetAssignee()==2?this.targetCreateForm.value.SelactSingleIdes:null:null,
      "siteId": this.tapindex==0?this.gettargetAssignee()==4?this.targetCreateForm.value.SelactSingleIdes:null:null,
      "userGroupId": this.tapindex==1?this.gettargetAssignee()==1?this.targetCreateForm.value.SelactGroupIdes:null:null,
      "productGroupId": this.tapindex==1?this.gettargetAssignee()==3?this.targetCreateForm.value.SelactGroupIdes:null:null,
      "contactGroupId": this.tapindex==1?this.gettargetAssignee()==2?this.targetCreateForm.value.SelactGroupIdes:null:null,
      "siteGroupId": this.tapindex==1?this.gettargetAssignee()==4?this.targetCreateForm.value.SelactGroupIdes:null:null,
      "targetType": this.targetCreateForm.value.targetType,
      "isDurationTarget": this.getBasedontargetselaction()=='IsDurationTarget'?true:false,
      "isCountTarget": this.getBasedontargetselaction()=='IsCountTarget'?true:false,
      "isAmountTarget": this.getBasedontargetselaction()=='IsAmountTarget'?true:false,
      "targetValue": this.targetCreateForm.value.Basedontargetselaction=='IsAmountTarget'?this.targetCreateForm.value.targetAmt:this.targetCreateForm.value.Basedontargetselaction=='IsCountTarget'?this.targetCreateForm.value.targetCount:0,
      "targetDuration": this.targetCreateForm.value.Basedontargetselaction=='IsDurationTarget'?this.targetCreateForm.value.targetDuration:'00:00:00',
      "currencyId": this.targetCreateForm.value.currency,
      "isMonthly": false,
      "isPublic": this.targetCreateForm.value.targetStatus=='Public'?true:false,
      "isPrivate": this.targetCreateForm.value.targetStatus=='Private'?true:false,
      "isDelegate": this.targetCreateForm.value.targetStatus=='Deligation'?true:false,
      "statusOfTransaction": Number(this.targetCreateForm.value.statusOfTransaction),
      "created": new Date(),
      "keyword": this.keywordlist?.toString(),
    }
    if (this.data?.screenType == 'Create') {
    this.targetService.createTarget(data).subscribe((result:any)=>{
      if(result){
        console.log(result)
        this.snackBar.open('Target Create Done', 'Undo', { duration: 3000 });
          this.matDialogRef.close(true)
      }
    }) 
  }else{
    data.targetIdentity=this.data?.data?.targetIdentity,
    this.targetService.updateTarget(data).subscribe((result:any)=>{
      if(result){
        console.log(result)
        this.snackBar.open('Target Uodate Done', 'Undo', { duration: 3000 });
          this.matDialogRef.close(true)
      }
    }) 
  }
  }



  gettargetAssignee(){
    return this.targetCreateForm.value.SelactEntitiyValue=='Users'?1:this.targetCreateForm.value.SelactEntitiyValue=='Products'?3:this.targetCreateForm.value.SelactEntitiyValue=='Contacts'?2:this.targetCreateForm.value.SelactEntitiyValue=='Sites'?4:0
  }



 
  remove(value: string) {
    const index = this.keywordlist.indexOf(value);
    if (index >= 0) {
      this.keywordlist.splice(index, 1);
    }
  }

  Selectedkeywprd(value:any) {
    this.keywordlist.push(value)
  }

}
