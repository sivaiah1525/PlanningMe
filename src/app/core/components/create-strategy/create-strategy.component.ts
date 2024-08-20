//import { ModalController } from '@ionic/angular';
import { Component, OnInit, ViewChild, Input, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { MatTabGroup, MatTabHeader, MatTab } from '@angular/material/tabs';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { StrategyService } from 'src/app/core/services/strategy.service';
import { MessageService } from '../../services/message.service';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { TranslateService } from '@ngx-translate/core';
import { ManageUsersService } from '../../services/manage-users.service';

@Component({
  selector: 'pm-create-strategy',
  templateUrl: './create-strategy.component.html',
  styleUrls: ['./create-strategy.component.scss'],
  providers: [MatSlideToggleModule]
})
export class CreateStrategyComponent implements OnInit {
  firstFormGroup!: FormGroup;
  secondFormGroup!: FormGroup;
  thirdFormGroup!: FormGroup;
  @ViewChild('tabs') tabs!: MatTabGroup;
  @Input() selectedIndex = 0;
  @Input() disabled!: boolean;
  selactValues4 = ["Events", "Users",  "Contacts",  "Sites", ];
  selactValues5 = ["Transactions", "Users",  "Contacts", "Sites","Products" ];
  ContactsValue: any[] = []
  ProductsValue: any[] = [] 
  SitesValue: any[] = [] 
  UsersValue: any[] = []
  EventsValue: any[] = []
  TransationValue: any[] = []
  stringoptions = [{ v1: '=', v2: 'equal' }, { v1: '!=', v2: 'not equal' }];
  numberoptions = [{ v1: '=', v2: 'equal' }, { v1: '!=', v2: 'not equal' }, { v1: '>', v2: 'greater than' }, { v1: '=>', v2: 'greater than or equal' }, { v1: '<', v2: 'less than ' }]
  textoptions = [{ v1: '=', v2: 'equal' }, { v1: '!=', v2: 'not equal' }]
  booleanoptions = [{ v1: '=', v2: 'equal' }]
  AllOption = [{ v1: '=', v2: 'equal' }, { v1: '!=', v2: 'not equal' }, { v1: '>', v2: 'greater than' },
  { v1: '<', v2: 'less than ' }, { v1: '=>', v2: 'greater than or equal' }, { v1: '<=', v2: 'less than or equal' }];
  values2 = [];
  selected = -1;
  selected1 = -1;
  selected2 = -1;
  events = [];
  type = [];
  radiovalue!: number;
  zipcode!: number;
  managementType = [
    'Users',
    'Contacts',
    'Sites',
    'Products',
    'Transactions',
    'Events',
  ];
  additionalFieldLines: any[] = [];
  lineCounter: number = 0;
  strategyarray: any[] = [];
  events1 = [];
  newvalue: any;
  keywords: string[] = [];
  ScreenType = ''

  constructor(
    private matDialogRef: MatDialogRef<CreateStrategyComponent>,
    private formBuilder: FormBuilder,
    private strategyservice: StrategyService,
    private router: Router,
    private messageService: MessageService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private translate: TranslateService ,
    private manageUserService: ManageUsersService,
  ) {
    if(localStorage.getItem('lang')){
      const lang:any=localStorage.getItem('lang')
      this.translate.use(lang);
    }else{
      this.translate.use('English');
    }
    this.firstFormGroup = this.formBuilder.group({
      Notification: ['' || false],
      Mail: ['' || false],
      strategyTypeName:['Users'],
      keyword: [''],
      isCreateAlert: [false],
      isUpdateAlert: [false],
      isDeleteAlert: [false],
      Activate: [true],
      nameOfStrategy: ['', Validators.required],
      description: ['', Validators.required],
      strategyConditions: this.formBuilder.array([
      ])
    }); 
    this.Addcondictuon()

  }

  getentityvalue() {
    return this.firstFormGroup.get('strategyTypeName')?.value
  }
  ngOnInit(): void {
    console.log(this.data)
    if (this.data.screenType == 'CreateStrategy') {
      this.ScreenType = this.data.screenType
    } else if (this.data.screenType == 'editstratergy') {
      this.ScreenType = this.data.screenType
      this.firstFormGroup.get('strategyTypeName')?.setValue(this.data.data.strategyTypeName)
      this.firstFormGroup.get('description')?.setValue(this.data.data.description)
      this.firstFormGroup.get('nameOfStrategy')?.setValue(this.data.data.name)
    }

    this.selectedIndex = 0;
    this.isSelected(this.selectedIndex);
    this.FindImportColumnsContacts()
    this.FindImportColumnsProducts()
    this.FindImportColumnsSites()
    this.FindImportColumnsUsers()
    this.FindImportColumnsEvents()
    this.FindImportColumnsTransactions()
  }
  isSelected(index: number): boolean {
    if (this.selectedIndex === index) {
      return false;
    } else {
      return true;
    }
  }
  onNext(e: Event, index:any): void {
    console.log(this.tabs._tabs);
    this.selectedIndex = index;
    this.isSelected(index);
  }

  dismiss(): void {
    this.matDialogRef.close();
  }





  getcheckdetails() {
    this.Addcondictuon()
  }

  CreateStrategy() {
    this.firstFormGroup.value.strategyConditions.map((element:any)=>{
      return element.conditionParameter.replace(" ", "")
    })
    this.firstFormGroup.value.strategyConditions.map((element:any)=>{
      return element.conditionDropDownList==null?this.firstFormGroup.value.strategyTypeName:element.conditionDropDownList
    })
    const data = {
      "strategy": {
        "strategyType": this.firstFormGroup.value.strategyTypeName,
        "name": this.firstFormGroup.value.nameOfStrategy,
        "keyword": this.firstFormGroup.value.keyword,
        "description": this.firstFormGroup.value.description,
        "isCreateAlert": this.firstFormGroup.value.isCreateAlert, 
        "isUpdateAlert": this.firstFormGroup.value.isUpdateAlert,
        "isDeleteAlert": this.firstFormGroup.value.isDeleteAlert,
        "notification": this.firstFormGroup.value.Notification,
        "sendAnEmail": this.firstFormGroup.value.Mail,
      },
      "strategyConditions": this.firstFormGroup.value.strategyConditions,
    }
    console.log(data);
    this.strategyservice.createstrategy(data).subscribe((res:any) => {
      console.log(res, 'res');
      this.matDialogRef.close();
      this.messageService.showMessage(res['response'][0].message);
    });
  }


  selactdatatype(event:any,index:number) {
    this.strategyConditions().at(index).get('dataType')?.setValue(event.dataType)
    this.strategyConditions().at(index).get('isTag')?.setValue(event.isTag)
  }
  getdataType(index:any){
    const value =this.strategyConditions().at(index).get('dataType')?.value
    return value
  }
  strategyConditions(): FormArray {
    return this.firstFormGroup.get("strategyConditions") as FormArray
  }

  getconditionDropDownListvalue(index:any){
    return this.strategyConditions().at(index).get('conditionDropDownList')?.value
  }
  newFile(): FormGroup {
    return this.formBuilder.group({
      conditionDropDownList: [null],
      conditionParameter: [""],
      conditionComparison: [""],
      value: [''],
      isTag: [''],
      dataType:'',
    })
  }

  Addcondictuon() {
    this.strategyConditions().push(this.newFile());
  }
  Removecondictuon(i: number) {
    this.strategyConditions().removeAt(i);
  }


  FindImportColumnsUsers() {
    let name = 'Users'
    this.manageUserService.FindParameters(name,false).subscribe((res: any) => {
      res.forEach((e: any) => {
        this.UsersValue.push(e)
      })
    })
  }

  FindImportColumnsContacts() {
    let name = 'Contacts'
    this.manageUserService.FindParameters(name,false).subscribe((res: any) => {
      res.forEach((e: any) => {
        this.ContactsValue.push(e)
      })
    })
  }
  FindImportColumnsSites() {
    let name = 'Sites'
    this.manageUserService.FindParameters(name,false).subscribe((res: any) => {
      res.forEach((e: any) => {
        this.SitesValue.push(e)
      })
    })
  }
  FindImportColumnsProducts() {
    let name = 'Products'
    this.manageUserService.FindParameters(name,false).subscribe((res: any) => {
      res.forEach((e: any) => {
        this.ProductsValue.push(e)
      })
    })
  }

  FindImportColumnsTransactions() {
    let name = 'Transactions'
    this.manageUserService.FindParameters(name,false).subscribe((res: any) => {
      res.forEach((e: any) => {
        this.TransationValue.push(e)
      })
    })
  }
  FindImportColumnsEvents() {
    let name = 'Events'
    this.manageUserService.FindParameters(name,false).subscribe((res: any) => {
      res.forEach((e: any) => {
        this.EventsValue.push(e)
      })
    })
  }
 

}
