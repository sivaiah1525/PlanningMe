// import { RadioGroupChangeEventDetail, SelectChangeEventDetail } from '@ionic/core';
import { ChartType } from './../../modal/charts.enum';
import { Component, Inject, OnInit, Input, ViewChild } from '@angular/core';
// import { ModalController } from '@ionic/angular';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ManageContact, ManageProduct, ManageSites, ManageTransaction, ManageUser } from './../../modal/graph-filter.enum';
import { Product } from 'src/app/core/models/product.model';
import { MatDialog } from '@angular/material/dialog';
import { ManageUsersService } from 'src/app/core/services/manage-users.service';
import { ManageContactsService } from 'src/app/core/services/manage-contacts.service';
import { ManageSitesService } from 'src/app/core/services/manage-sites.service';
import { ManageProductsService } from 'src/app/core/services/manage-products.service'
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatTabGroup } from '@angular/material/tabs';
import { ThrowStmt } from '@angular/compiler';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { TranslateService } from '@ngx-translate/core';
import { TargetService } from 'src/app/core/services/target.service';


@Component({
  selector: 'pm-graph-filter',
  templateUrl: './graph-filter.component.html',
  styleUrls: ['./graph-filter.component.scss']
})
export class GraphFilterComponent implements OnInit {
  graphFilterForm!: FormGroup;
  CustomDateForm!: FormGroup;
  manageUsers = ManageUser;
  manageContacts = ManageContact;
  manageSites = ManageSites;
  manageProducts = ManageProduct;
  manageTransactions = ManageTransaction;
  selectedIndex = 0;

  isBuy!: boolean;
  issale!: boolean;
  iswithMargin!: boolean;
  iswithVat!: boolean;
  isSeperate: boolean = false;
  value1: boolean = true;
  selected = 'Euros';

  EditforCreate = false
  defaultforcreate = true
  typevalue: any;
  chartTypes = ['Bar Chart', 'Line Chart', 'Area Chart', 'Pie Chart', 'Pivot Table', 'Pie Doughnut Chart']
  TransationType = ['Bar Chart', 'Line Chart', 'Area Chart', 'Pie Chart', 'Pivot Table', 'Pie Doughnut Chart']

  selectedChart = ChartType.PieChart;
  isLegend!: string;
  isnoOfTransaction: boolean = false;
  ActivityContent: boolean = true
  ActivityDetail: boolean = true

  managementType!: Array<{ id: number, name: string, value: string }>;
  eventSearchType!: Array<{ name: string }>
  operators!: Array<{ id: number, name: string, value: string }>;
  distance!: Array<{ id: number, name: string, value: string }>;
  duration!: Array<{ id: number, name: string, value: string }>;
  graphPeriod!: Array<{ id: number, name: string, value: string, checked?: boolean }>;

  selectedMgmt!: string;
  selectedEventSearch!: string;
  selectedOper!: string;
  selectedType!: string;
  selectedDuration!: string;
  selectedPeriod!: string;
  isDisplayType!: string;
  // products$: Observable<Product[]>;

  users$:any;
  contacts$:any;
  sites$:any;
  products$:any;
  userGroups$:any;
  contactGroups$:any;
  siteGroups$:any;
  productGroups$:any;
  filteredList1:any;
  filteredList2:any;
  filteredList3:any;
  filteredList4:any;
  filteredList5:any;
  filteredList6:any;
  filteredList7:any; 
  filteredList8:any;

  isEvent: boolean = true;
  isTransaction!: boolean;
  selectedChartvalue: any;
  isTransactionAmount: any;
  rankingTab: any;
  Yvalue: any;
  Xvalue: any;
  // auto chip for keyword
  separatorKeysCodes: number[] = [ENTER, COMMA];
  keywordlist: string[] = [];
  eventTypeFilter = [
    { id: 1, name: 'Transaction', value: 2 },
    { id: 2, name: 'Events', value: 1 }];
  transYDisplayTypeFilter = [
    { id: 0, name: 'Transaction Amount', value: 0 },
    { id: 1, name: 'Number of Transactions', value: 1 }
  ];
  eventYDisplayTypeFilter = [
    { id: 1, name: 'Number of Events', value: 1 },
    { id: 2, name: 'Event Duration', value: 0 }
  ];
  copyMgmtType: any;
  selactidsvaluelength = 0
  toggleStatusForActivityContent: boolean = false
  toggleStatusForActivityDetail: boolean = false
  GroupInsideIds = []
  eventorTransactionvalue = '1'
  KeywordsFromOrder = []
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private matDialogRef: MatDialogRef<GraphFilterComponent>,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private manageUsersService: ManageUsersService,
    private manageContactsService: ManageContactsService,
    private manageSitesService: ManageSitesService,
    private manageProductsService: ManageProductsService,
    private translate: TranslateService,
    private targetService: TargetService,
    ){
      if(localStorage.getItem('lang')){
        const lang:any=localStorage.getItem('lang')
        this.translate.use(lang);
      }else{
        this.translate.use('English');
      }
    this.graphFilterForm = this.formBuilder.group({
      IsChart: [true],
      isseperate: [false],
      IsCustomDate:[false],
      eventorTransaction: ['1'],
      StatusOfTransaction: [2],
      CustomDate:['0'],
      Entity: [''],
      chartTypeId: ['', Validators.required],
      graphTitle: ['', Validators.required],
      managementTypeId: ['', Validators.required],
      eventGraph: [''],  // activity detail
      eventGraphId: [''], // selctmgmt user 
      eventGraphGroupId: [''], // slectmgmt usergroup
      detaileventGraphId: [], // selctsearch user
      detaileventGraphGroupId: [], // selctsearch user group
      ProductsId: [''],
      productGroupId: [''],
      eventsTitle: [''],
      eventsCriticLevel: [''],
      eventsOperatorsId: ['', Validators.required],
      eventsDuration: [''],
      eventsDurationId: ['', Validators.required],
      planningDate: [''],
      groupe: [''],
      site: [''],
      siteResponsible: [''],
      visit: [''],
      companyName: [''],
      name: [''],
      sites: [''],
      firstName: [''],
      lastName: [''],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      XDisplayType: ['', Validators.required],
      YDisplayType: [0, Validators.required],
      eventDisplayType: [0, Validators.required],
      description: [''],
      keyword: [''],
      Currency: ['Euros'],
      withMargin: [false],
      withVat: [false],
      isBuy: [false],
      isSale: [true],
      IsLowToHigh: [false],
      isPieChartOrbarChart: [false]
    });
    this.GetAllDropdown()
    this.FindKeywordsFromOrder()
  }

  ngOnInit(): void {
    this.isEvent = false;
    this.isTransaction = true;
    this.managementType = [
      { id: 1, name: 'Users', value: 'Users' },
      { id: 2, name: 'Sites', value: 'Sites' },
      { id: 3, name: 'Contacts', value: 'Contacts' },
      { id: 4, name: 'Products', value: 'Products' }
    ];

    // management screens 
    if (this?.data?.management == true) {
      console.log(this.data)
      this.onChanged(this.data.Name, 'load');
      this.graphFilterForm.get("managementTypeId")?.setValue(this.data.Name)
      if (this.data.single == true) {
        console.log(this.data.data.id)
        if (this.data.Name == "Users") {
          let userValue = this.data.data.id.split(',');
          console.log(userValue)
          setTimeout(() => {
            this.graphFilterForm.get('eventGraphId')?.setValue(userValue);
          });
        }
        else if (this.data.Name == "Sites") {
          setTimeout(() => {
            this.graphFilterForm.get('eventGraphId')?.setValue([this.data.data.id]);
          });
        }
        else if (this.data.Name == "Contacts") {
          setTimeout(() => {
            this.graphFilterForm.get('eventGraphId')?.setValue([this.data.data.id]);
          });
        }
        else if (this.data.Name == "Products") {
          setTimeout(() => {
            this.graphFilterForm.get('eventGraphId')?.setValue([this.data.data.id]);
          });
        }
      }
      else {
        setTimeout(() => {
          this.graphFilterForm.get('eventGraphGroupId')?.setValue([this.data.data.id]);
        });
      }

    }

 // for edir report 
    if (this?.data?.edit == true) {
      console.log(this.data)
      if (this.data?.data?.keyword != null) { this.keywordlist = this.data?.data?.keyword.split(',') }
      this.defaultforcreate = false
      this.EditforCreate = true
      this.typevalue = 'edit'
      this.selectedChartvalue = this.data.data.isChart
      this.onDisplayTypeChanged(this.data.data.yDisplayType, this.typevalue)
      this.graphFilterForm.get("graphTitle")?.setValue(this.data.data.reportTitle)
      this.graphFilterForm.get("startDate")?.setValue(this.data.data.startDate)
      this.graphFilterForm.get("endDate")?.setValue(this.data.data.endDate)
      this.graphFilterForm.get("description")?.setValue(this.data.data.description)
      this.graphFilterForm.get("IsChart")?.setValue(this.data.data.isChart)
      this.graphFilterForm.get("managementTypeId")?.setValue(this.data.data.advancedSearch)
      this.graphFilterForm.get("isPieChartOrbarChart")?.setValue(this.data.data.isPieOrBarChart)
      if (this.data.data.chartType == 'Vertical bar chart' || this.data.data.chartType == 'ranking table') {
        this.chartTypes.push('Vertical bar chart');
        this.chartTypes.push('ranking table');
        this.graphFilterForm.get("chartTypeId")?.setValue(this.data.data.chartType)
      } else {
        this.graphFilterForm.get("chartTypeId")?.setValue(this.data.data.chartType)
      }
      if (this.data.data!.optionalAdvancedSearch) {
        this.graphFilterForm.get("eventGraph")?.setValue(this.data.data.optionalAdvancedSearch)
      }
      if (this.data.data.isChart == false) {
        this.selectedIndex = 1
      }
      if (this.data.data.isEvent == false) {
        this.graphFilterForm.get("eventorTransaction")?.setValue('1')
      } else {
        this.graphFilterForm.get("eventorTransaction")?.setValue('0')
      }
      if (this.data.data.yDisplayType == 0) {
        this.graphFilterForm.get("YDisplayType")?.setValue('0')
      } else {
        this.graphFilterForm.get("YDisplayType")?.setValue('1')
      }
      if (this.data.data.xDisplayType == 0) {
        this.graphFilterForm.get("XDisplayType")?.setValue('0')
      }
      else if (this.data.data.xDisplayType == 1) {
        this.graphFilterForm.get("XDisplayType")?.setValue('1')
      }
      else if (this.data.data.xDisplayType == 2) {
        this.graphFilterForm.get("XDisplayType")?.setValue('2')
      }
      else {
        this.graphFilterForm.get("XDisplayType")?.setValue('3')
      }
      setTimeout(() => {
        this.onChanged(this.data.data.advancedSearch, 'load');
        this.eventChange(this.data.data.isEvent === false ? 1 : 2, 'load');
        this.onEventChanged(this.data.data.optionalAdvancedSearch, 'load');
        if (this.data.data.isEvent) {
          this.eventType(this.data.data.yDisplayType, 'load');
        } else {
          this.onDisplayTypeChanged(this.data.data.yDisplayType, 'load');
        }
        if (this.data.data.advancedSearch === 'Users') {
          if (this.data.data.usersId) {
            let userValue = this.data.data.usersId && this.data.data.usersId.split(',');
            this.selectMgmtChange(userValue, 'User', 'load');
          }
          if (this.data.data.groupsId) {
            let userGroup = this.data.data.groupsId && this.data.data.groupsId.split(',');
            const userGroupIds = userGroup.map((str:any) => { return Number(str); });
            this.selectMgmtGroupChange(userGroupIds, 'User', 'load');
          }
        } else if (this.data.data.advancedSearch === 'Sites') {
          if (this.data.data.sitesId) {
            let sitesValue = this.data.data.sitesId && this.data.data.sitesId.split(',');
            let siteIds = sitesValue.map((str:any) => { return Number(str); });
            this.selectMgmtChange(siteIds, 'Sites', 'load');
          }
          if (this.data.data.groupsId) {
            let sitesGroup = this.data.data.groupsId && this.data.data.groupsId.split(',');
            const sitesGroupIds = sitesGroup.map((str:any) => { return Number(str); });
            this.selectMgmtGroupChange(sitesGroupIds, 'Sites', 'load');
          }

        } else if (this.data.data.advancedSearch === 'Contacts') {
          if (this.data.data.contactsId) {
            let contacts = this.data.data.contactsId && this.data.data.contactsId.split(',');
            let contactIds = contacts.map((str:any) => {
              return Number(str);
            });
            this.selectMgmtChange(contactIds, 'Contacts', 'load');
          }
          if (this.data.data.groupsId) {
            let contactsGroup = this.data.data.groupsId && this.data.data.groupsId.split(',');
            const contactsGroupIds = contactsGroup.map((str:any) => {
              return Number(str);
            });
            this.selectMgmtGroupChange(contactsGroupIds, 'Contacts', 'load');
          }
        } else if (this.data.data.advancedSearch === 'Products') {
          console.log('1')
          if (this.data.data.productsId) {
            console.log('2')
            let products = this.data.data.productsId && this.data.data.productsId.split(',');
            let productIds = products.map((str:any) => { return Number(str); });
            this.selectMgmtChange(productIds, 'products', 'load');
          }
          if (this.data.data.groupsId) {
            console.log('3')
            let productsGroup = this.data.data.groupsId && this.data.data.groupsId.split(',');
            const productsGroupIds = productsGroup.map((str:any) => { return Number(str); });
            this.selectMgmtGroupChange(productsGroupIds, 'Products', 'load');
          }
        }
      }, 2000);

      setTimeout(() => {
        if (this.data.data.optionalAdvancedSearch === 'Users') {
          if (this.data.data.optionalId) {
            let optUserValue = this.data.data.optionalId && this.data.data.optionalId.split(',');
            this.optionalSearch(optUserValue, 'user', 'load');
          }
          if (this.data.data.optionalGroupId) {
            let optUserGroup = this.data.data.optionalGroupId && this.data.data.optionalGroupId.split(',');
            const optUserGroupIds = optUserGroup.map((str:any) => {
              return Number(str);
            });
            this.optionalGroupSearch(optUserGroupIds, 'User', 'load');
          }
        } else if (this.data.data.optionalAdvancedSearch === 'Sites') {
          if (this.data.data.optionalId) {
            let optSiteValue = this.data.data.optionalId && this.data.data.optionalId.split(',');
            const optSiteIds = optSiteValue.map((str:any) => {
              return Number(str);
            });
            this.optionalSearch(optSiteIds, 'Site', 'load');
          }
          if (this.data.data.optionalGroupId) {
            let optSiteGroup = this.data.data.optionalGroupId && this.data.data.optionalGroupId.split(',');
            const optSiteGroupIds = optSiteGroup.map((str:any) => {
              return Number(str);
            });

            this.optionalGroupSearch(optSiteGroupIds, 'Site', 'load');
          }
        } else if (this.data.data.optionalAdvancedSearch === 'Contacts') {
          if (this.data.data.optionalId) {
            let optContactValue = this.data.data.optionalId && this.data.data.optionalId.split(',');
            const optContactIds = optContactValue.map((str:any) => {
              return Number(str);
            });
            this.optionalSearch(optContactIds, 'Contact', 'load');
          }
          if (this.data.data.optionalGroupId) {
            let optContactGroup = this.data.data.optionalGroupId && this.data.data.optionalGroupId.split(',');
            const optContactGroupIds = optContactGroup.map((str:any) => {
              return Number(str);
            });
            this.optionalGroupSearch(optContactGroupIds, 'Contact', 'load');
          }
        } else {
          if (this.data.data.optionalId) {
            let optProductValue = this.data.data.optionalId && this.data.data.optionalId.split(',');
            const optProductIds = optProductValue.map((str:any) => {
              return Number(str);
            });
            this.optionalSearch(optProductIds, 'product', 'load');
          }
          if (this.data.data.optionalGroupId) {
            let optProductsGroup = this.data.data.optionalGroupId && this.data.data.optionalGroupId.split(',');
            const optProductGroupIds = optProductsGroup.map((str:any) => {
              return Number(str);
            });
            this.optionalGroupSearch(optProductGroupIds, 'product', 'load');
          }
        }
      }, 1000);
    }
  }

  seletectdtransationstatus(event:any){
    this.graphFilterForm.get('StatusOfTransaction')?.setValue(event.value)
    setTimeout(() => {
      this.FindKeywordsFromOrder()
    }, 10);
  }

  FindKeywordsFromOrder(){
    this.targetService.FindKeywordsFromOrder(this.graphFilterForm.value.StatusOfTransaction).subscribe((result:any)=>{
      if(result){
        this.KeywordsFromOrder=result
      }
    })
  } 


  selectMgmtChange(event: any, type: string, load?: string) {
    if (event && load === 'load') {
      this.graphFilterForm.get('eventGraphId')?.setValue(event);
    } else {
      let value = this.graphFilterForm.get('chartTypeId')?.value;
      let userLength = event.value;
      if (value === 'Bar Chart' && userLength.length > 1) {
        this.graphPeriod.length = 0
      } else {
        this.graphPeriod = [
          { id: 0, name: 'Daily', value: 'Daily', checked: true },
          { id: 1, name: 'Monthly', value: 'Monthly', checked: false },
          { id: 2, name: 'Yearly', value: 'Yearly', checked: false },
        ];
      }
    }
    this.selactidsvaluelength = this.graphFilterForm.get('eventGraphId')?.value.length

  }
  // selectEventSearch user
  optionalSearch(event:any, type: string, load?: string) {
    console.log(event, 'event group');
    if (event && load === 'load') {
      setTimeout(() => {
        this.graphFilterForm.get('detaileventGraphId')?.setValue(event);
      });
    }
  }
  optionalGroupSearch(event:any, type: string, load?: string) {
    console.log(event, 'event group');
    if (event && load === 'load') {
      setTimeout(() => {
        this.graphFilterForm.get('detaileventGraphGroupId')?.setValue(event);
      });
    }
  }
  compareFn(c1: any, c2: any): boolean {
    return c1 && c2 ? c1.id === c2.id : c1 === c2;
  }
  // selectmgmt user
  selectMgmtGroupChange(event: any, type: string, load?: string) {
    console.log(event, 'event group');
    if (event && load === 'load') {
      setTimeout(() => {
        this.graphFilterForm.get('eventGraphGroupId')?.setValue(event);
      });
    }
  }


  onSubmit() {
    this.graphFilterForm.get('keyword')?.setValue(this.keywordlist.toString())
    this.matDialogRef.close(this.graphFilterForm.value);
  }



  onChartChanged(event: any, type?: string) {
    this.selectedChartvalue = type !== 'load' ? event.value : event;
    console.log(this.selectedChartvalue);
    if (this.selectedChartvalue === 'Vertical bar chart' || this.selectedChartvalue === 'ranking table') {
      this.rankingTab = this.rankingTab.toString();
    }
    this.graphFilterForm.get('chartTypeId')?.setValue(this.selectedChartvalue);
    console.log(this.rankingTab, this.selectedChartvalue)
    if (this.rankingTab == '1' && (this.selectedChartvalue == 'Vertical bar chart' || this.selectedChartvalue === 'ranking table')) {
      this.graphFilterForm.get('IsLowToHigh')?.setValue(false);
    }
    switch (this.selectedChartvalue) {
      case 'Pie Doughnut Chart':
        this.graphPeriod.length = 0;
        this.graphFilterForm.get('isPieChartOrbarChart')?.setValue(true);
        break;
      case 'Pie Chart':
        this.graphPeriod.length = 0;
        this.graphFilterForm.get('isPieChartOrbarChart')?.setValue(true);
        break;
      case 'Vertical bar chart':
        let userValue = this.graphFilterForm.get('eventGraphId')?.value;
        this.graphFilterForm.get("isPieChartOrbarChart")?.setValue(true)

        if (userValue.lenght > 1) {
          this.graphPeriod.length = 0;
        } else {
          this.graphPeriod = [
            { id: 0, name: 'Daily', value: 'Daily', checked: true },
            { id: 1, name: 'Monthly', value: 'Monthly', checked: false },
            { id: 2, name: 'Yearly', value: 'Yearly', checked: false },
          ];
        }
        break;
      case 'Bar Chart':
        this.graphFilterForm.get('isPieChartOrbarChart')?.setValue(true);

        let userValue1 = this.graphFilterForm.get('eventGraphId')?.value;
        if (userValue1.lenght > 1) {
          this.graphPeriod.length = 0;
        } else {
          this.graphPeriod = [
            { id: 0, name: 'Daily', value: 'Daily', checked: true },
            { id: 1, name: 'Monthly', value: 'Monthly', checked: false },
            { id: 2, name: 'Yearly', value: 'Yearly', checked: false },
          ];
        }
        break;
      case 'ranking table':
        this.graphPeriod.length = 0;
        break;

      case 'Line Chart':
        this.graphFilterForm.get("isPieChartOrbarChart")?.setValue(false)
        this.graphPeriod = [
          { id: 0, name: 'Daily', value: 'Daily', checked: true },
          { id: 1, name: 'Monthly', value: 'Monthly', checked: false },
          { id: 2, name: 'Yearly', value: 'Yearly', checked: false },
        ];
        break;

      default:
        this.graphFilterForm.get("isPieChartOrbarChart")?.setValue(false)
        this.graphPeriod = [
          { id: 0, name: 'Daily', value: 'Daily', checked: true },
          { id: 1, name: 'Monthly', value: 'Monthly', checked: false },
          { id: 2, name: 'Yearly', value: 'Yearly', checked: false },
        ];
        break;
    }


  }
  buyOptions(event: MatCheckboxChange): void {
    if (event.checked) {
      this.graphFilterForm.controls.isBuy?.setValue(true)
      this.graphFilterForm.controls.withMargin?.setValue(false);
    }
    else {
      this.graphFilterForm.controls.isBuy?.setValue(false)
    }
  }

  showOptions(event: MatCheckboxChange): void {
    if (event.checked) {
      this.graphFilterForm.controls.withMargin?.setValue(true);
      this.graphFilterForm.controls.isSale?.setValue(true);
      this.graphFilterForm.controls.isBuy?.setValue(false)
    } else {
      this.graphFilterForm.controls.withMargin?.setValue(false);
      this.graphFilterForm.controls.isSale?.setValue(false);
    }
  }
  marginOptions(event: MatCheckboxChange): void {
    if (event.checked) {
      this.graphFilterForm.controls.isBuy?.setValue(false)
      this.graphFilterForm.controls.withMargin?.setValue(true);
    }
    else {
      this.graphFilterForm.controls.withMargin?.setValue(false)
    }
  }


  eventChange(event:any, type?: string) {
    let value = type !== 'load' ? event.value : event;
    if (value === 2 || value === '2') {
      this.eventorTransactionvalue = '2'
      this.graphFilterForm.get("eventorTransaction")?.setValue('2')
      this.isEvent = true;
      this.isTransaction = false;
      this.managementType = [
        { id: 1, name: 'Users', value: 'Users' },
        { id: 2, name: 'Sites', value: 'Sites' },
        { id: 3, name: 'Contacts', value: 'Contacts' },
      ];
    }
    else {
      if (value === 1 || value === '1') {
        this.eventorTransactionvalue = '1'
        this.graphFilterForm.get("eventorTransaction")?.setValue('1')
        this.isTransaction = true;
        this.isEvent = false;
        this.managementType = [
          { id: 1, name: 'Users', value: 'Users' },
          { id: 2, name: 'Sites', value: 'Sites' },
          { id: 3, name: 'Contacts', value: 'Contacts' },
          { id: 4, name: 'Products', value: 'Products' }
        ];
      }
    }
  }

  isSeperateCall(e:any) {
    if (e.checked) {
      let isBuy = this.graphFilterForm.get('isBuy')?.value;
      let isSale = this.graphFilterForm.get('isSale')?.value
      if (isBuy === true && isSale === true) {
        this.graphFilterForm.controls.isseperate?.setValue(e.checked)
      } else {
        this.graphFilterForm.controls.isseperate?.setValue(false)
      }
    }
  }

  radioChange(index:any) {
    this.selectedIndex = index
    if (index == 0) {
      this.graphFilterForm.get("IsChart")?.setValue(true)
      this.graphFilterForm.get("CustomDate")?.setValue('0')
    } else if (index == 1) {
      this.graphFilterForm.get("IsChart")?.setValue(false)
      this.graphFilterForm.get("CustomDate")?.setValue('4')
    }else if(index == 2){
      this.graphFilterForm.get("IsCustomDate")?.setValue(true)
      this.graphFilterForm.get("CustomDate")?.setValue('1')

    }
    this.rankingTab = index
    if (index === 0) {
      this.graphFilterForm.reset(this.graphFilterForm.value);
      this.chartTypes.length = 0;
      this.chartTypes = ['Pivot Table', 'Bar Chart', 'Line Chart', 'Area Chart', 'Pie Doughnut Chart', 'Pie Chart'];
      this.graphPeriod = [
        { id: 0, name: 'Daily', value: 'Daily', checked: true },
        { id: 1, name: 'Monthly', value: 'Monthly', checked: false },
        { id: 2, name: 'Yearly', value: 'Yearly', checked: false },
      ];
    }
    else if (index ===1) {
      this.graphFilterForm.reset(this.graphFilterForm.value);
      if (index === 1) {
        this.chartTypes.length = 0;
        this.chartTypes = [ 'ranking table','Vertical bar chart'];
        this.graphPeriod.length = 0;
      }
    }else if (index === 2) {
      this.graphFilterForm.reset(this.graphFilterForm.value);
      this.chartTypes.length = 0;
      this.chartTypes = [ 'Bar Chart', 'Line Chart', 'Area Chart',  'Pie Chart','Vertical bar chart'];
      this.graphPeriod.length = 0;

    }
  }

  onDisplayTypeChanged(event: any, type?: string) {
    let value = type !== 'load' ? event.value : event
    if (value == "1" || value === 1) {
      this.isnoOfTransaction = true;
      this.isBuy = true;
      this.issale = true;
      this.iswithMargin = false;
      this.iswithVat = false;
      this.isSeperate = true;
      this.graphFilterForm.controls.withMargin?.setValue(false);
      this.graphFilterForm.controls.withVat?.setValue(false);
      this.graphFilterForm.controls.isBuy?.setValue(this.isBuy);
      this.graphFilterForm.controls.isSale?.setValue(this.issale);
    } else if (value == "0" || value === 0) {
      this.isnoOfTransaction = false;
      this.isBuy = true;
      this.issale = true;
      this.iswithMargin = true;
      this.iswithVat = true;
      this.isTransactionAmount = this.graphFilterForm.get('YDisplayType')?.value
      if (this.isTransaction == true && (this.isTransactionAmount == '0' || this.isTransactionAmount === 0)) {
        if (this.selectedChartvalue == 'Pie Doughnut Chart' || this.selectedChartvalue == 'Pie Chart') {
          this.isBuy = false;
          this.issale = false;
          this.iswithMargin = false;
          this.iswithVat = false;
          this.isSeperate = false;
          this.graphFilterForm.get('isBuy')?.setValue(false)
          this.graphFilterForm.get('isSale')?.setValue(true)
          this.graphFilterForm.get('withMargin')?.setValue(false)
          this.graphFilterForm.get('withVat')?.setValue(false)
        }
        if (this.selectedChartvalue == 'Pie Doughnut Chart' || this.selectedChartvalue == 'Pie Chart' || this.selectedChartvalue === 'ranking table') {
          this.isSeperate = false;
        } else {
          this.isSeperate = true;
        }
      }
    }
    if (type == 'edit') {
      if (this.data) {
        this.isBuy = this.data.data.isBuy;
        this.issale = this.data.data.isSale;
        this.iswithMargin = this.data.data.withMargin;
        this.iswithVat = this.data.data.withVAT;
        this.isSeperate = this.data.data.isBuySeparateChart;
        this.graphFilterForm.controls.withMargin?.setValue(this.data.data.withMargin);
        this.graphFilterForm.controls.withVat?.setValue(this.data.data.withVAT);
        this.graphFilterForm.controls.isBuy?.setValue(this.data.data.isBuy);
        this.graphFilterForm.controls.isSale?.setValue(this.data.data.isSale);
        this.graphFilterForm.controls.IsLowToHigh?.setValue(this.data.data.isLowToHigh);
        this.graphFilterForm.controls.isseperate?.setValue(this.data.data.isBuySeparateChart);
      }

    }
  }

  eventType(event: any, type?: string) {
    this.isBuy = false;
    this.issale = false;
    this.iswithMargin = false;
    this.iswithVat = false;
    this.graphFilterForm.controls.isBuy?.setValue(false);
    this.graphFilterForm.controls.isSale?.setValue(false);
    this.graphFilterForm.controls.withMargin?.setValue(false);
    this.graphFilterForm.controls.withVat?.setValue(false);
  }

  XDisplayTypevalue(event:any) {
    if (this.selectedChartvalue == 'Bar Chart') {
      if (event.value == "0") {
        this.graphFilterForm.get('isPieChartOrbarChart')?.setValue(true)
      } else if (event.value == "1") {
        const lenght = this.graphFilterForm.get('eventGraphId')?.value.lenght
        if (lenght != 0) {
          this.graphFilterForm.get('isPieChartOrbarChart')?.setValue(false)
        }
      } else if (event.value == "2") {
        const lenght = this.graphFilterForm.get('eventGraphId')?.value.lenght
        if (lenght != 0) {
          this.graphFilterForm.get('isPieChartOrbarChart')?.setValue(false)
        }
      } else if (event.value == "3") {
        const lenght = this.graphFilterForm.get('eventGraphId')?.value.lenght
        if (lenght != 0) {
          this.graphFilterForm.get('isPieChartOrbarChart')?.setValue(false)
        }
      }
    }else if(this.selectedChartvalue=='Vertical bar chart'){
      if (event.value == "0") {
        this.graphFilterForm.get('isPieChartOrbarChart')?.setValue(true)
      } else if (event.value == "1") {
        const lenght = this.graphFilterForm.get('eventGraphId')?.value.lenght
        if (lenght != 0) {
          this.graphFilterForm.get('isPieChartOrbarChart')?.setValue(false)
        }
      } else if (event.value == "2") {
        const lenght = this.graphFilterForm.get('eventGraphId')?.value.lenght
        if (lenght != 0) {
          this.graphFilterForm.get('isPieChartOrbarChart')?.setValue(false)
        }
      } else if (event.value == "3") {
        const lenght = this.graphFilterForm.get('eventGraphId')?.value.lenght
        if (lenght != 0) {
          this.graphFilterForm.get('isPieChartOrbarChart')?.setValue(false)
        }
      }
    }else if(this.selectedChartvalue=='Pivot Table'||this.selectedChartvalue=='ranking table'){
      if (event.value == "0") {
        this.graphFilterForm.get('isPieChartOrbarChart')?.setValue(true)
      } else if (event.value == "1") {
        const lenght = this.graphFilterForm.get('eventGraphId')?.value.lenght
        if (lenght != 0) {
          this.graphFilterForm.get('isPieChartOrbarChart')?.setValue(false)
        }
      } else if (event.value == "2") {
        const lenght = this.graphFilterForm.get('eventGraphId')?.value.lenght
        if (lenght != 0) {
          this.graphFilterForm.get('isPieChartOrbarChart')?.setValue(false)
        }
      } else if (event.value == "3") {
        const lenght = this.graphFilterForm.get('eventGraphId')?.value.lenght
        if (lenght != 0) {
          this.graphFilterForm.get('isPieChartOrbarChart')?.setValue(false)
        }
      }
    }
  }


  onChanged(value:any, type?: string) {
    let managementType = this.managementType.filter(s => s.name === (type !== 'load' ? value : value));
    this.selectedMgmt = managementType[0].value;
    console.log(this.selectedMgmt);
    if (this.isEvent) {
      this.eventSearchType = [{ name: 'Users' }, { name: 'Sites' }, { name: 'Contacts' }]
    } else {
      this.eventSearchType = [{ name: 'Users' }, { name: 'Sites' }, { name: 'Contacts' }, { name: 'Products' }]
    }
    switch (this.selectedMgmt) {
      case 'Users':
        if (this.isEvent) {
          this.eventSearchType = [{ name: 'Sites' }, { name: 'Contacts' }]
        } else {
          this.eventSearchType = [{ name: 'Sites' }, { name: 'Contacts' }, { name: 'Products' }]
        }
        break;
      case 'Sites':
        if (this.isEvent) {
          this.eventSearchType = [{ name: 'Users' }, { name: 'Contacts' }]
        } else {
          this.eventSearchType = [{ name: 'Users' }, { name: 'Contacts' }, { name: 'Products' }]
        }

        break;
      case 'Contacts':
        if (this.isEvent) {
          this.eventSearchType = [{ name: 'Sites' }, { name: 'Users' }]
        } else {
          this.eventSearchType = [{ name: 'Sites' }, { name: 'Users' }, { name: 'Products' }]
        }

        break;
      case 'Products':
        if (this.isEvent) {
          this.eventSearchType = [{ name: 'Sites' }, { name: 'Contacts' }]
        } else {
          this.eventSearchType = [{ name: 'Sites' }, { name: 'Contacts' }, { name: 'Users' }]
        }

        break;
      case 'Events':
        this.eventSearchType = [{ name: 'Sites' }, { name: 'Contacts' }, { name: 'Users' }]
        break;
      default:
        break;
    }
  }

  onEventChanged(event: any, type?: string) {
    if (event) {
      let searchType = this.eventSearchType.filter(s => s.name === (type !== 'load' ? event.value : event));
      this.selectedEventSearch = searchType[0].name;
      if (type === 'load') {
        this.graphFilterForm.get('eventGraph')?.setValue(this.selectedEventSearch);
      }
    }


  }

  apply() {
    localStorage.setItem('typeCHART', this.graphFilterForm.get('chartTypeId')?.value);
    let modalData: any;
    const charts = localStorage.getItem('CHARTS');
    if (charts) {
      modalData = JSON.parse(charts);
      if (modalData.indexOf(this.selectedChart) === -1) {
        modalData.push(this.selectedChart);
      }
      localStorage.setItem('CHARTS', JSON.stringify(modalData));
    } else {
      localStorage.setItem('CHARTS', JSON.stringify([this.selectedChart]));
    }
  }

  // ---------------- 
  remove(value: string) {
    const index = this.keywordlist.indexOf(value);
    if (index >= 0) {
      this.keywordlist.splice(index, 1);
    }
  }

  Selectedkeywprd(value:any) {
    this.keywordlist.push(value)
  }


  GroupToSingleconvert(group:any, type:any, name:any) {
    if (name == 'Users') {
      this.user(group, type)
    } else if (name == 'Products') {
      this.Products(group, type)
    } else if (name == 'Contacts') {
      this.Contacts(group, type)
    } else if (name == 'Sites') {
      this.Sites(group, type)
    }
  } 







  grouptosingleAdd(ids:any, type:any) {
    if (type == 'ActivityContent') {
      if (this.graphFilterForm.get('eventGraphId')?.value.length != 0) {
        let data = this.graphFilterForm.get('eventGraphId')?.value
        let data1 = ids
        let finalresult = data.concat(data1);
        console.log(finalresult)
        let unqIds = [...new Set(finalresult)];
        console.log(unqIds)
        this.graphFilterForm.get('eventGraphId')?.setValue(unqIds)
      } else {
        let unqIds = [...new Set(ids)];
        console.log(unqIds)
        this.graphFilterForm.get('eventGraphId')?.setValue(unqIds)
      }
    } else {
      if (this.graphFilterForm.get('detaileventGraphId')?.value.length != 0) {
        let data = this.graphFilterForm.get('detaileventGraphId')?.value
        let data1 = ids
        let finalresult = data.concat(data1);
        console.log(finalresult)
        let unqIds = [...new Set(finalresult)];
        console.log(unqIds)
        this.graphFilterForm.get('detaileventGraphId')?.setValue(unqIds)
      } else {
        let unqIds = [...new Set(ids)];
        console.log(unqIds)
        this.graphFilterForm.get('detaileventGraphId')?.setValue(unqIds)
      }
    }

  }


  user(group:any, type:any) {
    if (group.dynamicGroupId == null) {
      const GroupId = group.id;
      this.manageUsersService.getGroupUserService(GroupId).subscribe((data: any) => {
        if (data) {
          const ids:any= []
          data.forEach((element:any) => {
            ids.push(element.id)
          })
          this.grouptosingleAdd(ids, type)
        }
      });
    } else {
      const GroupId = group.dynamicGroupId;
      this.manageUsersService.getDynamicGroupUserService('Users', GroupId).subscribe((data: any) => {
        if (data) {
          const ids :any= []
          data.forEach((element:any) => {
            ids.push(element.id)
          })
          this.grouptosingleAdd(ids, type)
        }
      });
    }
  }

  Products(group:any, type:any) {
    if (group.dynamicGroupId == null) {
      const GroupId = group.id;
      this.manageProductsService.fetchProductGroupByIdService(GroupId).subscribe((data: any) => {
        if (data) {
          const ids:any = []
          data.forEach((element:any) => {
            ids.push(element.id)
          })
          this.grouptosingleAdd(ids, type)
        }
      });
    } else {
      const GroupId = group.dynamicGroupId;
      this.manageProductsService.getDynamicGroupService('Products', GroupId).subscribe((data: any) => {
        if (data) {
          const ids :any= []
          data.forEach((element:any) => {
            ids.push(element.id)
          })
          this.grouptosingleAdd(ids, type)
        }
      });
    }
  }

  Contacts(group:any, type:any) {
    if (group.dynamicGroupId == null) {
      const GroupId = group.id;
      this.manageContactsService.fetchContactGroupByIdService(GroupId).subscribe((data: any) => {
        if (data) {
          const ids:any = []
          data.forEach((element:any) => {
            ids.push(element.id)
          })
          this.grouptosingleAdd(ids, type)
        }
      });
    } else {
      const GroupId = group.dynamicGroupId;
      this.manageContactsService.getDynamicGroupService('Contacts', GroupId).subscribe((data: any) => {
        if (data) {
          const ids:any = []
          data.forEach((element:any) => {
            ids.push(element.id)
          })
          this.grouptosingleAdd(ids, type)
        }
      });
    }
  }

  Sites(group:any, type:any) {
    if (group.dynamicGroupId == null) {
      const GroupId = group.id;
      this.manageSitesService.fetchSiteGroupByIdService(GroupId).subscribe((data: any) => {
        if (data) {
          const ids :any= []
          data.forEach((element:any) => {
            ids.push(element.id)
          })
          this.grouptosingleAdd(ids, type)
        }
      });
    } else {
      const GroupId = group.dynamicGroupId;
      this.manageSitesService.getDynamicGroupService('Sites', GroupId).subscribe((data: any) => {
        if (data) {
          const ids:any = []
          data.forEach((element:any) => {
            ids.push(element.id)
          })
          this.grouptosingleAdd(ids, type)
        }
      });
    }
  }

  GetAllDropdown() {
    // All users 
    this.manageUsersService.findAllUsersDropdown().subscribe((res) => {
      this.users$ = res;
      this.users$.sort(function (a:any, b:any) {
        var textA = a.firstName.toUpperCase();
        var textB = b.firstName.toUpperCase();
        return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
      });
      this.filteredList1 = this.users$.slice()
    })
    // All contacts 
    this.manageContactsService.findAllContactsDropdown().subscribe((res) => {
      this.contacts$ = res;
      this.contacts$.sort(function (a:any, b:any) {
        var textA = a.firstName.toUpperCase();
        var textB = b.firstName.toUpperCase();
        return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
      });
      this.filteredList2 = this.contacts$.slice()
    })
    // All sites 
    this.manageSitesService.findAllSitesDropdown().subscribe((res) => {
      this.sites$ = res;
      this.sites$.sort(function (a:any, b:any) {
        var textA = a.companyName.toUpperCase();
        var textB = b.companyName.toUpperCase();
        return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
      });
      this.filteredList3 = this.sites$.slice()
    })
    // All products 
    this.manageProductsService.findAllProductsDropdown().subscribe((res) => {
      this.products$ = res;
      this.products$.sort(function (a:any, b:any) { 
        var textA = a.productName.toUpperCase();
        var textB = b.productName.toUpperCase();
        return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
      });
      this.filteredList7 = this.products$.slice()
    })
    // All user groups 
    this.manageUsersService.findAllUsersGroupDropdown().subscribe((res) => {
      this.userGroups$ = res;
      this.userGroups$.sort(function (a:any, b:any) {
        var textA = a.groupName.toUpperCase();
        var textB = b.groupName.toUpperCase();
        return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
      });
      this.filteredList4 = this.userGroups$.slice()
    }) 
    // All contact groups 
    this.manageContactsService.findAllContactsGroupDropdown().subscribe((res) => {
      this.contactGroups$ = res;
      this.contactGroups$.sort(function (a:any, b:any) {
        var textA = a.groupName.toUpperCase();
        var textB = b.groupName.toUpperCase();
        return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
      });
      this.filteredList5 = this.contactGroups$.slice()
    })
    // All site groups 
    this.manageSitesService.findAllSitesGroupDropdown().subscribe((res) => {
      this.siteGroups$ = res;
      this.siteGroups$.sort(function (a:any, b:any) {
        var textA = a.groupName.toUpperCase();
        var textB = b.groupName.toUpperCase();
        return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
      });
      this.filteredList6 = this.siteGroups$.slice()
    })
    // All products group 
    this.manageProductsService.findAllProductsGroupDropdown().subscribe((res) => {
      this.productGroups$ = res;
      this.productGroups$.sort(function (a:any, b:any) {
        var textA = a.groupName.toUpperCase();
        var textB = b.groupName.toUpperCase();
        return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
      });
      this.filteredList8 = this.productGroups$.slice()
    })
  }

}


