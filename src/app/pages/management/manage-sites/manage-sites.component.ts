import { Component, OnInit, PipeTransform, TemplateRef, ViewChild, Inject, ChangeDetectorRef } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SelectionModel } from '@angular/cdk/collections';
import { CreateGroupComponent } from './create-group/create-group.component';
import { SiteDetailsComponent } from './site-details/site-details.component';
import { EditSiteGroupComponent } from './edit-site-group/edit-site-group.component';
import { Site } from 'src/app/core/models/site.model';
import { SiteGroup } from 'src/app/core/models/site-group.model';
import { ManageSitesService } from 'src/app/core/services/manage-sites.service';
import { SiteGroupTarget } from 'src/app/core/models/site-group-target.model';
import { MatTableDataSource } from '@angular/material/table';
import { mergeMap, toArray } from 'rxjs/operators';
import { AchievedAmount } from 'src/app/core/models/achieved-amount.model';
import { TargetYearComponent } from 'src/app/core/components/group-target/target-year/target-year.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarComponent } from 'src/app/core/components/snackbar/snackbar.component';
import { SpinnerService } from '../../../core/services/spinner.service';
import { ResizeService } from '../../../core/services/resize.service';
import { TargetCreateComponent } from 'src/app/core/components/group-target/target-create/target-create.component';
import { MessageService } from 'src/app/core/services/message.service';
import { FormBuilder, Validators, FormControl, FormGroup, FormArray } from '@angular/forms';
import { ManageContactsService } from 'src/app/core/services/manage-contacts.service';
import { Observable } from 'rxjs';
import { Contact } from 'src/app/core/models/contact.model';
import { ManageUsersService } from 'src/app/core/services/manage-users.service';
import { UserResponse } from '../manage-users/create-group/create-group.component';
import { map, startWith } from 'rxjs/operators';
import { User } from 'src/app/core/models/user.model';
import { TargetContacts, TargetContactsGroup, TargetSites, TargetSitesGroup } from 'src/app/core/components/group-target/target-create/target.create';
import { TargetService } from 'src/app/core/services/target.service';
// import * as _ from 'lodash';
import { ManagesiteService } from './managesite.service';
import { saveAs } from "file-saver";
import { AddFileComponent } from '../../files/components/add-file/add-file.component';
import { AddNotesComponent } from '../../files/components/add-notes/add-notes.component';
import { CreateEventComponent } from '../../calendar/create-event/create-event.component';
import { GraphFilterComponent } from '../../graph/components/graph-filter/graph-filter.component';
import { CreateStrategyComponent } from 'src/app/core/components/create-strategy/create-strategy.component';
import { ExportDataManageAllComponent } from '../manage-products/export-data-manage-all/export-data-manage-all.component';
import { DynamicGroupComponent } from '../manage-contacts/dynamic-group/dynamic-group.component';
import { AddOrderComponent } from '../manage-transactions/orderQuotes/add-order/add-order.component';
import { DynamicGroupComponentEditComponent } from '../manage-contacts/dynamic-group-component-edit/dynamic-group-component-edit.component';
import { AdvanceSearchInTargetComponent } from 'src/app/core/components/group-target/advance-search-in-target/advance-search-in-target.component';
import { SelectDiscountComponent } from '../manage-transactions/Discount/select-discount/select-discount.component';
import { DeleteCommomComponent } from '../../commonForAll/delete-commom/delete-commom.component';
import { ViewDiscountDetailsComponent } from '../manage-transactions/Discount/view-discount-details/view-discount-details.component';
import { CreateSiteComponent } from '../manage-create/create-site/create-site.component';
import { SingleToGroupConvertComponent } from './single-to-group-convert/single-to-group-convert.component';
import { GroupSharingComponent } from '../manage-users/group-sharing/group-sharing.component';
import { CheckOrganationTypeService } from 'src/app/core/services/check-organation-type.service';
import { PopupErrorMessageComponent } from 'src/app/popup-error-message/popup-error-message.component';
import { TranslateService } from '@ngx-translate/core';
import { MatomoService } from 'src/app/core/services/matomo-service.service';
import { ViewTargetComponent } from 'src/app/core/components/group-target/view-target/view-target';
import { AdvanceSearchInManagementSingleComponent } from '../advanceSearch/advance-search-in-management-single/advance-search-in-management-single.component';
import { AdvanceSearchInManagementGroupComponent } from '../advanceSearch/advance-search-in-management-group/advance-search-in-management-group.component';
import { DatePipe } from '@angular/common';
import { HttpParams } from '@angular/common/http';


@Component({
  selector: 'app-manage-sites',
  templateUrl: './manage-sites.component.html'
})
export class ManageSitesComponent implements OnInit, PipeTransform {
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  activeIndex:any;
  siteColumns!: string[];
  siteGroupTargetsColumns!: string[];
  AdvanceSearchindex = 0;
  size: any;
  color = 'primary';
  mode = 'indeterminate';
  value = 50;
  isMobileView!: boolean;
  width!: number;
  siteDataSource: any;
  siteGroupTargetsDataSource: any;
  siteSelection = new SelectionModel<Site>(true, []);
  siteGroups: SiteGroup[] = [];
  siteGroupsTarget: SiteGroupTarget[] = [];
  successMessage!: string;
  datadelete: any;
  datadeleteindex: any;
  id: any;
  sitedata!: Site[];
  tabledata: any;
  groupdata: any;
  groupindex: any;
  targetdatadelete: any;
  year: any;
  targetindex: any;
  isShown: boolean = false;
  index: any;
  siteForm!: FormGroup;
  siteiddata: any;
  contacts$!: Observable<Contact[]>;
  // allUsers : UserResponse[] = [];
  // lastFilter: string = '';
  // fliteredUsers : Observable<UserResponse[]>;
  // userControl = new FormControl();
  users$!: Observable<User[]>;
  AdvanceSearchForm!: FormGroup;

  editgroupDialog!: MatDialogRef<EditSiteGroupComponent>;
  editdynamicgroupDialog!: MatDialogRef<DynamicGroupComponentEditComponent>
  userDataLength: any;
  userList: any;

  targetCreateForm!: FormGroup;
  max: any;
  min: any;
  availableYears: any[] = [];
  productTargetlength: any;
  targetSite: TargetSites = new TargetSites();
  // targetProducts: TargetProducts = new TargetProducts();
  targetSiteGroup: TargetSitesGroup = new TargetSitesGroup();
  // targetContact: TargetContacts = new TargetContacts();
  // targetContactGroup: TargetContactsGroup = new TargetContactsGroup();
  monthsBool: boolean = false;
  frequency!: string;
  filterList: any[] = [];
  selectedOptionId: number = 0;
  targetrow: any;
  filterGroup!: any[];
  selectedVal: string = '';
  monthName!: Array<{ id: number, name: string, value: string }>;

  showicon!: boolean;
  // quicksearch: string;
  quickSearchValue = null;
  singleSearchValue = null;
  targetSearchValue = null;
  siglefilter = '';
  singlefilter = '';
  targetfilter = '';
  mapeventsubcription: any;
  sitegroupdata: any;
  siteDataLength: any;
  Freefeild = {};
  viewnumeral = {};
  dropdownfeild = {};
  tagViewModels = [];
  viewtagmodel = {};
  checked: any;
  selectedtagvalue: any;
  tabnumber!: number;
  allsites: any;
  discountForm!: FormGroup
  contactData: any;

  discountDetails: any;
  conatctId: any;
  discountId: any;
  SiteIds = [];
  Siteid: any;
  Statusvalue = ['Public', 'Private', 'Deligation']
  getDiscountData: any
  AdminStatus: any;
  siteCreationStatus: any;
  DemoOrganationstatus:boolean=false
  ListOftragetfiltervalues:any= [];
  transactionStatus: any;
  TargetLength: any;
  totalTargetValue: any;
  achivedTargetValue: any;
  displayedItems: any[] = [];
  startIndex: number = 0;
  SearchResult: any = [];
  SearchGroupResult: any = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog,
    private targetService: TargetService,
    private manageUsersService: ManageUsersService,
    private manageContactsService: ManageContactsService,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private managesitesService: ManageSitesService,
    private snackBar: MatSnackBar,
    public spinner: SpinnerService,
    private manageUserService: ManageUsersService,
    private resizeService: ResizeService,
    private managesiteservice: ManagesiteService,
    public OrgSrvice:CheckOrganationTypeService,
    private translate: TranslateService ,
    private matoService: MatomoService,
    private changeDetectorRefs: ChangeDetectorRef,
    public datepipe: DatePipe,
  ){
    this.matoService.trackPageView('Management-Site');
    if(localStorage.getItem('lang')){
      const lang:any=localStorage.getItem('lang')
      this.translate.use(lang);
    }else{
      this.translate.use('English');
    }

    if(localStorage.getItem('isTrailVersion')=='true'){
      this.popupforerrormessage('You are using trail account so you are able to create 10 Sites only','Sites ')
  }

    if (this.OrgSrvice.checkOrganationType().DemoOrganation == 'true') {
      this.DemoOrganationstatus=true
      console.log(this.OrgSrvice.checkOrganationType());
      const data:any=this.OrgSrvice.messagesandheader('ManagementSite')
      this.popupforerrormessage(data.message, data.header);
    } 
    
    this.AdminStatus = localStorage.getItem("isAdmin");
    this.siteCreationStatus = localStorage.getItem("SitesCreation");

  }
  transform(value: any, ...args: any[]) {
    let ammount = value?.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
    let ammount1 = ammount?.replace(/,/g, ' ')
    return ammount1?.replace('$', ' ')
  }
  ngOnInit(): void {
    // resizing the screen table column changed 
    this.resizeService.size$.subscribe(
      user => { 
        this.size = user.size;
        if (this.size < 992) {
          this.siteColumns = ['contact', 'options'];
          this.siteGroupTargetsColumns = ['options', 'name'];
          this.isMobileView = true;
        } else {
          this.siteColumns = ['options', 'company', 'address', 'state', 'country', 'pincode'];
          this.siteGroupTargetsColumns = ['options', 'name', 'CreaterName', 'StartDate', 'EndDate', 'target', 'B', 'progress'];
          this.isMobileView = false;
        }
      }
    );
    this.width = window.innerWidth;
    if (!this.size && this.width < 992) {
      this.siteColumns = ['contact', 'options'];
      this.siteGroupTargetsColumns = ['options', 'name'];
      this.isMobileView = true;
    } else if (!this.size && this.width > 992) {
      this.siteColumns = ['options', 'company', 'address', 'state', 'country', 'pincode'];
      this.siteGroupTargetsColumns = ['options', 'name', 'CreaterName', 'StartDate', 'EndDate', 'target', 'B', 'progress'];
      this.isMobileView = false;
    }
    this.loadSites(20, 1, '');
    this.siteForm = this.formBuilder.group({
      'CompanyName': ['', Validators.required],
      'RegistrationNumber': ['', [Validators.required, Validators.minLength(14), Validators.maxLength(14), Validators.pattern('[0-9]*')]],
      'Address': ['', Validators.required],
      'ZipCode': ['', Validators.required],
      'City': ['', [Validators.required]],
      'Country': ['', Validators.required],
      'ContactPhone': ['', [Validators.required, Validators.maxLength(16)]],
      'ActivityName': ['', Validators.required],
      // 'UserId': [[]],
      'ContactsId': [[]],
      // 'isActive': [{ value: 'true', disabled: true }],
      'created': [''],
      'id': [],
      'isActive': [true],
      'TagViewModels': [this.tagViewModels || []],
      'freefeildTitle': ['', Validators.pattern('^[a-zA-Z \-\']+')],
      'freefeildnumber': [''],
      'feildname': [''],
      'fieldvalue': [''],
      'freefeildvalue': [''],
      'dropdowntype': [''],
      'dropdown': [''],
      'tagType': [''],
      'title': [''],
      'ischecked': [''],
      'numeralType': [''],
    });
    this.mapeventsubcription = this.managesiteservice.managesitecreate.subscribe((data) => {
      if (data == true) {
        this.loadSites(20, 1, '');
      }
    });

    this.mapeventsubcription = this.managesiteservice.managesitegroupcreate.subscribe((data) => {
      if (data == true) {
        this.loadSiteGroups(10, 1, '');
      }
    });

    this.mapeventsubcription = this.managesiteservice.managesitetargetcreate.subscribe((data) => {
      if (data == true) {
        this.loadSiteGroupsTarget(10, 1, '');
      }
    });
    this.tabnumber = 0;
  }

  navigateItems(direction: string): void {
    if (direction === 'left') {
      if (this.startIndex > 0 && this.isMobileView == false) {
        this.startIndex -= 5;
      }
       else if (this.startIndex > 0  && this.isMobileView == true) {
        this.startIndex -= 1;
      }
    } else if (direction === 'right') {
      if (this.startIndex + 5 < this.ListOftragetfiltervalues.length && this.isMobileView == false) {
        this.startIndex += 5;
      } else if (this.startIndex + 1 < this.ListOftragetfiltervalues.length && this.isMobileView == true) {
        this.startIndex += 1;
      }
    }
    if(this.isMobileView == false) {
      this.displayedItems = this.ListOftragetfiltervalues.slice(this.startIndex, this.startIndex + 5);
    } else if (this.isMobileView == true) {
      this.displayedItems = this.ListOftragetfiltervalues.slice(this.startIndex, this.startIndex + 1);
    }
  }

  tabChange(tabIndex: number) {
    this.showicon = false
    console.log(tabIndex);
    this.tabnumber = tabIndex
    if (tabIndex === 0) {
      this.loadSites(20, 1, '');
    } else if (tabIndex === 1) {
      this.loadSiteGroups(10, 1, '');
    } else if (tabIndex === 2) {
      this.loadSiteGroupsTarget(10, 1, '');
    }

  }
  next(e:any, value:any) {
    if (value == 'single') {
      this.loadSites(20, e.pageIndex + 1, this.siglefilter);
    }
    else {
      this.loadSiteGroups(10, e.pageIndex + 1, this.singlefilter);
    }
  }

  nextt(e:any) {
    this.loadSiteGroupsTarget(10, e.pageIndex + 1, this.targetfilter);
  }

  nexttTargetAdvance(e:any) {
    this.TargetAdvanceFilter(this.ListOftragetfiltervalues, e.pageIndex + 1, 20)
  }

  loadSites(size:any, pagenumber:any, siglefilter:any) {
    this.managesitesService.fetchSites(size, pagenumber, siglefilter).subscribe(
      (result: any) => {

        this.sitedata = result.data;
        this.siteDataSource = new MatTableDataSource(this.sitedata);
        this.siteDataSource.sort = this.sort;
        this.userDataLength = result.totalItems;
      }
    );
  }

  loadSiteGroups(size:any, pagenumber:any, singlefilter:any) {
    this.managesitesService.fetchSiteGroups(size, pagenumber, singlefilter).subscribe(
      (result: any) => {
        this.sitegroupdata = result.data;
        this.siteGroups = this.sitegroupdata;
        this.siteDataLength = result.totalItems;
      }
    );
  }

  loadSiteGroupsTarget(size:any, pagenumber:any, targetfilter:any) {
    this.manageContactsService.fetchContactGroupsTargetService(size, pagenumber, targetfilter, 4)
      .pipe(
        mergeMap(res => res.map(data => {
          data.screen = 'sites';
          if(data.targetTypeName == 'Orders') {
            let percentage = Math.round((data.totalAchievedValue / data.targetValue) * 100);
            if (percentage > 100) {
              data.percentage = 100;
            } else {
              data.percentage = percentage;
            }
          } else {
            const timeStringToSeconds = (timeString: string): number => {
              const [hours, minutes, seconds] = timeString.split(':').map(parseFloat);
              return hours * 3600 + minutes * 60 + seconds;
            };
            const totalAchievedSeconds = timeStringToSeconds(data.totalAchievedDuration);

            // Convert targetDuration to total seconds
            const targetSecondsValue = timeStringToSeconds(data.targetDuration);
        
            // Calculate percentage
            let percentage = 0;
            if (targetSecondsValue !== 0) {
              percentage = Math.round((totalAchievedSeconds / targetSecondsValue) * 100);
            }
        
            // Cap percentage at 100 if it exceeds
            data.percentage = Math.min(percentage, 100);
          }
         
          data.cssClass = this.assignCssClass(data.percentage);
          this.calculatePerformanceGain(data);
          return data;
        })),
        toArray()
      ).subscribe(data => {
        this.siteGroupsTarget = data;
        this.siteGroupTargetsDataSource = new MatTableDataSource(this.siteGroupsTarget);
        this.tabledata = data;
        this.siteGroupTargetsDataSource.paginator = this.paginator;
        this.siteGroupTargetsDataSource.sort = this.sort;
      });

      this.manageContactsService.fetchContactGroupsTarget(size, pagenumber, targetfilter,4).subscribe(
      (data: any) => {
        this.productTargetlength = data.totalItems;
      }
    );
  }

  private calculatePerformanceGain(target: SiteGroupTarget) {
    let currentYear = new Date().getFullYear();
    if (currentYear > Number(target.year) && target.percentage > 100) {
      target.performanceGain = Math.round((target.yearlyAchievedAmount - target.yearlyTarget) / target.yearlyTarget) * 100;
    }
  }

  private assignCssClass(progress: number): string {
    let cssClass = '';
    if (progress >= 0 && progress <= 20) {
      cssClass = 'color-20';
    } else if (progress >= 21 && progress <= 50) {
      cssClass = 'color-50';
    } else if (progress >= 51 && progress <= 80) {
      cssClass = 'color-80';
    } else if (progress >= 81 && progress <= 90) {
      cssClass = 'color-90';
    } else if (progress >= 100) {
      cssClass = 'color-100';
    }
    return cssClass;
  }


  percentagecalucation(value:any){
    console.log(value)
    let percentage = 0;

    if (value.targetTypeName == 'Orders') {
      percentage = Math.round((value.totalAchievedValue / value.targetValue) * 100);
      if (percentage >= 100) {
        percentage = percentage % 100;
      }
    } else {
      const timeStringToSeconds = (timeString: string): number => {
        const [hours, minutes, seconds] = timeString.split(':').map(parseFloat);
        return hours * 3600 + minutes * 60 + seconds;
      };
      const totalAchievedSeconds = timeStringToSeconds(value.totalAchievedDuration);
      const targetSecondsValue = timeStringToSeconds(value.targetDuration);
  
      if (targetSecondsValue !== 0) {
        percentage = Math.round((totalAchievedSeconds / targetSecondsValue) * 100);
      }
      value.percentage = Math.min(percentage, 100);
    }
  
    console.log("perrrrr",percentage);
  
    return percentage;

  }

  applyFilter(filterValue: string): void {
    this.siglefilter = filterValue;
    this.loadSites(20, 1, this.siglefilter);
    this.showicon = true;
  }

  applyFiltersearch(filterValue: string) {
    this.singlefilter = filterValue;
    this.loadSiteGroups(10, 1, this.singlefilter);
    this.showicon = true;
  }

  applytargetFiltergroup(filterValue: string) {
    this.targetfilter = filterValue;
    this.loadSiteGroupsTarget(10, 1, this.targetfilter);
    this.showicon = true;
  }

  closesearch(value:any) {
    if (value == 'single') {
      this.showicon = false;
      this.singleSearchValue = null;
      this.SearchResult.splice(0, this.SearchResult.length);
      this.loadSites(20, 1, '');

    } else if (value == 'multiple') {

      this.showicon = false;
      this.quickSearchValue = null;
      this.SearchGroupResult.splice(0, this.SearchGroupResult.length);
      this.loadSiteGroups(10, 1, '');
    }
    else if (value == 'target') {
      this.showicon = false;
      this.targetSearchValue = null;
      this.ListOftragetfiltervalues.splice(0, this.ListOftragetfiltervalues.length);
      this.loadSiteGroupsTarget(10, 1, '');
    }
  }
  masterToggle() {
    this.isAllSitesSelected() ?
      this.siteSelection.clear() :
      this.siteDataSource.data.forEach((row:any) => this.siteSelection.select(row));
  }

  isAllSitesSelected() {
    const numSelected = this.siteSelection.selected.length;
    const numRows = this.siteDataSource.data.length;
    return numSelected === numRows;
  }
  tabChanged(event:any) {
    this.AdvanceSearchindex = event.index
  }

  searchbox() {
    const AdvanceSearch = this.dialog.open(AdvanceSearchInTargetComponent, {
      disableClose: true,
      width: '500px',
      data: { type: 'Sites' }
    });
    AdvanceSearch.afterClosed().subscribe((result: any) => {
      let data = result.data.map((data:any) => {
        data.screen = 'users';
        let percentage = Math.round((data.yearlyAchievedAmount / data.yearlyTarget) * 100);
        if (percentage > 100) {
          data.percentage = 100;
        } else {
          data.percentage = percentage;
        }
        data.cssClass = this.assignCssClass(data.percentage);
        this.calculatePerformanceGain(data);
        return data;
      })
      this.siteGroupsTarget = data;
      this.siteGroupTargetsDataSource = new MatTableDataSource(data);
      this.tabledata = data;
      this.siteGroupTargetsDataSource.paginator = this.paginator;
      this.siteGroupTargetsDataSource.sort = this.sort;
      this.showicon = true
    })

  }





  advancesearchinTargetType(event:any, x:any) {
    const formArray: FormArray = this.AdvanceSearchForm.get('TargetTypeStatus') as FormArray;
    if (event.checked) {
      formArray.push(new FormControl(x.value));
    } else {
      let i: number = 0;
      formArray.controls.forEach((ctrl:any) => {
        if (ctrl.value == x.value) {
          // Remove the unselected element from the StatusOfTransaction
          formArray.removeAt(i);
          return;
        }

        i++;
      });

    }
  }






  //create user group
  OptionGroup(templateRef: TemplateRef<any>) {
    this.dialog.open(templateRef, {
      width: '400px',
      disableClose: true,
    });
  }


  radioChange(type:any) {
    if (type == 'StaticGroup') {
      this.dialog.closeAll()
      this.dialog.open(CreateGroupComponent, {
        width: '500px',
        disableClose: true,
        data: this.siteSelection.selected
      });
    } else {
      this.dialog.closeAll()
      const DynamicGroup = this.dialog.open(DynamicGroupComponent, {
        disableClose: true,
        width: '500px',
        data: { type: 'Sites' }
      });
      DynamicGroup.afterClosed().subscribe(result => {
        this.ngOnInit()
      });
    }
  }
  AddToGroupDialog(row:any) {
    this.dialog.open(SingleToGroupConvertComponent, {
      disableClose: true,
      data: { data: row, Entity: 'Sites', },
      width: '500px',
    });
  }

  // openTargetMonths(target: SiteGroupTarget) {
  //   this.dialog.open(TargetMonthComponent, {
  //     disableClose: true,
  //     width: '500px',
  //     data: target
  //   });

  // }

  openTargetSites(target: SiteGroupTarget) {
    const ids: string = target.childIds.join(',');
    this.managesitesService.fetchSitesAchievedAmountService(ids, Number(target.year), false, '')
      .subscribe((achievedYearly: AchievedAmount[]) => {
        let data = {
          name: target.name,
          year: target.year,
          achievedAmountsYearly: achievedYearly
        };
        this.dialog.open(TargetYearComponent, {
          disableClose: true,
          width: '500px',
          data: data
        });
      });
  }
  // Create Site Group
  createSiteGroup(): void {
    this.dialog.open(CreateGroupComponent, {
      disableClose: true,
      data: this.siteSelection.selected
    });
  }


  editSiteGroup(data: any): void {
    if (data.conditionDtos) {
      this.editdynamicgroupDialog = this.dialog.open(DynamicGroupComponentEditComponent, { disableClose: true, data: { data, type: 'Sites' }, width: '500px' });
      this.editdynamicgroupDialog.afterClosed().subscribe(result => {
        console.log(`Dialog result: ${result}`);
        this.loadSiteGroups(10, 1, '');
      });
    } else {
      this.editgroupDialog = this.dialog.open(EditSiteGroupComponent, { disableClose: true, data: data, width: '500px' });
      this.editgroupDialog.afterClosed().subscribe(result => {
        console.log(`Dialog result: ${result}`);
        this.loadSiteGroups(10, 1, '');
      });
    }

  }

  openSiteDialog(row:any, type:any): void {
    this.dialog.open(SiteDetailsComponent, {
      disableClose: true,
      data: { data: row, type: type },
      width: '500px'
    });
  }
  deleteDialogConfirmation(data:any, type:any, entity:any) {
    const deleteorder = this.dialog.open(DeleteCommomComponent, { data: { data, type: type, entity: entity } });
    deleteorder.afterClosed().subscribe((result: any) => {
      if (result) {
        this.getallSite();
        this.loadSiteGroups(10, 1, '');
        this.loadSiteGroupsTarget(10, 1, '');
      }
      console.log(result)
    })
  }


  closedialogbox() {
    this.dialog.closeAll();
  }

  toggleShow(i:any) {
    this.isShown = !this.isShown;
    this.index = i;
  }
  get f() {
    return this.siteForm.controls;
  }

  updatesiteDialog(row:any) {
    const createSiteDialog = this.dialog.open(CreateSiteComponent, {
      data: { screenType: 'UpdateSite', data: row },
      disableClose: true,
      width: '500px'
    });
    createSiteDialog.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
  checkbox() {
    this.checked = true;
  }

  dropdowntagvalue(i:any) {
    console.log(i);
    this.selectedtagvalue = i;
  }

  showSiteList(group:any) {
    if (group.dynamicGroupId == null) {
      const GroupId = group.id;
      this.managesitesService.fetchSiteGroupByIdService(GroupId).subscribe(data => {
        if (data) {
          this.userList = data;
        }
      });
    } else {
      const GroupId = group.dynamicGroupId;
      this.managesitesService.getDynamicGroupService('Sites', GroupId).subscribe(data => {
        if (data) {
          this.userList = data;
        }
      });
    }

  }

  GroupShare(data:any, name:any) {
    this.dialog.open(GroupSharingComponent, {
      width: '600px',
      autoFocus: false,
      disableClose: true,
      data: { data: data, Name: name },
    });
  }
  getContactsList() {
    this.targetService.fetchContacts().subscribe((res) => {
      console.log(res);
      this.filterList = res;

    });
  }
  selectedOptionValue(eve:any) {
    console.log(eve);
    this.selectedOptionId = eve.option.value.id;
  }

  getMultipleContactsList() {
    this.targetService.fetchContactsGroup().subscribe((res) => {
      console.log(res);
      this.filterGroup = res;
    });
  }
  openCreateSite() {
    const createSiteDialog = this.dialog.open(CreateSiteComponent, {
      data: { screenType: 'CreateSite' },
      disableClose: true,
      width: '500px'
    });

    createSiteDialog.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  // exportData
  exportData() {
    this.dialog.open(ExportDataManageAllComponent, {
      disableClose: true,
      data: { type: 'Sites', },
      width: '700px',
    });
  }


  getallSite() {
    this.managesitesService.findAllSitesDropdown().subscribe((result) => {
      this.allsites = result;
    })
  }








  // AddDiscount 
  AddDiscount(row:any, name:any) {
    const AddDiscount = this.dialog.open(SelectDiscountComponent, {
      disableClose: true,
      data: { ManagenemtEntity: name, row, AddDiscount: true },
      width: '500px',
    });
    AddDiscount.afterClosed().subscribe(result => {
      if (result) {
        this.loadSites(20, 1, '');
        this.loadSiteGroups(10, 1, '');
      }
    });
  }
  // openDiscount 
  ViewListOfDiscount(data:any, name:any) {
    const viewdiscount = this.dialog.open(ViewDiscountDetailsComponent, {
      width: '600px',
      data: { data: data, type: 'viewdiscountTable', entity: name },
      autoFocus: false,
      disableClose: true,
    });
    viewdiscount.afterClosed().subscribe(result => {
      if (result) {
        this.loadSites(20, 1, '');
        this.loadSiteGroups(10, 1, '');
      }
    });

  }

  // three point icon 
  // createTarget
  createTarget(data:any, type:any, state:any, screenType:any) {
    this.closedialogbox()
    const createAndUpdateTarget = this.dialog.open(TargetCreateComponent, {
      disableClose: true,
      data: {
        data: data,
        type: type,
        state: state,
        screenType: screenType
      },
      width: '500px',
    });
    createAndUpdateTarget.afterClosed().subscribe((result: any) => {
      if (result) {
        setTimeout(() => {
          this.loadSiteGroupsTarget(10, 1, '');
        }, 100);
      }
    })
  }
  AddFile(row:any, type:any) {
    this.dialog.open(AddFileComponent, {
      data: {
        data: row,
        attachmentLevel: 'Sites',
        ismanage: true,
        type: type
      },
      disableClose: true,
      width: '500px',
      panelClass: ['addFiles']
    });
  }
  AddNote(row:any, type:any) {
    this.dialog.open(AddNotesComponent, {
      data: {
        data: row,
        attachmentLevel: 'Sites',
        ismanage: true,
        type: type
      },
      disableClose: true,
      width: '600px',
      panelClass: ['addNotes']
    });
  }
  // openAddEventDialog
  openAddEventDialog() {
    this.dialog.open(CreateEventComponent, {
      width: '500px',
      autoFocus: false,
      data: { screenType: 'CreateEvent' },
      disableClose: true,
      panelClass: 'custom-dialog-container'
    });
  }
  // ActivityReport
  ActivityReport(data:any, value:any) {
    this.dialog.open(GraphFilterComponent, {
      width: '500px',
      autoFocus: false,
      disableClose: true,
      data: { data, Name: 'Sites', single: value, management: true },

    });
  }
  // CreateStratergy
  CreateStratergy() {
    this.dialog.open(CreateStrategyComponent, {
      width: '500px',
      autoFocus: false,
      disableClose: true
    });
  }

  // CreateQuote
  CreateQuote() {
    this.dialog.open(AddOrderComponent, {
      disableClose: true,
      // data:data,
      width: '500px'
    });
  }

  // CreateInvoice
  CreateInvoice() {
    this.dialog.open(AddOrderComponent, {
      disableClose: true,
      // data:data,
      width: '500px'
    });
  }




  popupforerrormessage(message:any, header:any) {
    this.dialog.open(PopupErrorMessageComponent, {
      width: '600px',
      data: { message: message, header: header },
      autoFocus: false,
      disableClose: true,
    });
  }

  //view Target
  viewTarget(data:any) {
    this.closedialogbox()
    const createAndUpdateTarget = this.dialog.open(ViewTargetComponent, {
      disableClose: true,
      data: {
        data: data,
      },
      width: '500px',
    });
  }

  getUserGroups(row:any) {
    console.log("siteeee", row)
    this.managesitesService.getSiteGroups(row.id).subscribe((result: any) => {
      console.log("u8serssss", result)
      if(result) {
        this.dialog.open(TargetYearComponent, {
          disableClose: true,
          width: '700px',
          data: {data: result, type: 'Sites', target: row}
        });
      }
    })
  }

   // Search
   AdvanceSearchSingle() {
    const AdvanceSearch = this.dialog.open(
      AdvanceSearchInManagementSingleComponent,
      {
        disableClose: true,
        data: { type: 'Sites' },
        width: '500px',
      }
    );
    AdvanceSearch.afterClosed().subscribe((result: any) => {
      if (result) {
        this.SearchResult.push(result)
        this.showicon = true;
        this.applyFilter(result);
      }
    });
  }

  // Group Search
  AdvanceSearchgroup() {
    const AdvanceSearch = this.dialog.open(
      AdvanceSearchInManagementGroupComponent,
      {
        disableClose: true,
        data: { type: 'Sites' },
        width: '500px',
      }
    );
    AdvanceSearch.afterClosed().subscribe((result: any) => {
      if (result) {
        this.SearchGroupResult.push(result)
        this.applyFiltersearch(result);
        this.showicon = true;
      }
    });
  }

  searchboxTraget() {
    const AdvanceSearch = this.dialog.open(AdvanceSearchInTargetComponent, {
      disableClose: true,
      width: '500px',
      data: { type: 'Sites' },
    });
    AdvanceSearch.afterClosed().subscribe((result: any) => {
      console.log(result.data);
      const values = Object.entries(result.data).map(
        ([key, value]) => ({ [key]: value })
      );
      console.log(this.ListOftragetfiltervalues);
      // Transforming the data into the desired format
      const ListOftragetfiltervalues = values.map((obj) => {
        const key = Object.keys(obj)[0]; // Get the key of the object
        const value = obj[key]; // Get the value associated with that key
        return { name: key, value: value };
      });
let filteredArray = ListOftragetfiltervalues.filter(element => {
    // Check conditions for filtering
    if (element.value != null && element.value !== '' && element.value !== false && element.value !== undefined) {
        return true; // Include element in filtered result
    }
    
    return false; // Exclude element from filtered result
});
this.ListOftragetfiltervalues=filteredArray
      this.changeDetectorRefs.detectChanges();
      this.TargetAdvanceFilter(this.ListOftragetfiltervalues,  1, 20);
    });
  }

  TargetAdvanceFilter(data:any, pagenumber:any, NumberOfRecord:any) {
    const params = this.createtargetfilterparams(data,'Sites',pagenumber,NumberOfRecord);
    this.manageContactsService.TargetAdvanceFilter(params) .subscribe((result: any) => {
        if (result) {
          let data = result.data.map((data:any) => {
            data.screen = 'sites';
            if (data.targetTypeName == 'Orders') {
              let percentage = Math.round(
                (data.totalAchievedValue / data.targetValue) * 100
              );
              if (percentage > 100) {
                data.percentage = 100;
              } else {
                data.percentage = percentage;
              }
            } else {
              const timeStringToSeconds = (timeString: string): number => {
                const [hours, minutes, seconds] = timeString
                  .split(':')
                  .map(parseFloat);
                return hours * 3600 + minutes * 60 + seconds;
              };
              const totalAchievedSeconds = timeStringToSeconds(
                data.totalAchievedDuration
              );

              // Convert targetDuration to total seconds
              const targetSecondsValue = timeStringToSeconds(
                data.targetDuration
              );

              // Calculate percentage
              let percentage = 0;
              if (targetSecondsValue !== 0) {
                percentage = Math.round(
                  (totalAchievedSeconds / targetSecondsValue) * 100
                );
              }

              // Cap percentage at 100 if it exceeds
              data.percentage = Math.min(percentage, 100);
            }
            data.cssClass = this.assignCssClass(data.percentage);
            this.calculatePerformanceGain(data);
            return data;
          });
          this.siteGroupsTarget = data;
        this.siteGroupTargetsDataSource = new MatTableDataSource(this.siteGroupsTarget);
        this.tabledata = data;
        //this.siteGroupTargetsDataSource.paginator = this.paginator;
        this.siteGroupTargetsDataSource.sort = this.sort;
        this.TargetLength = result.totalItems
          this.showicon = true;
          this.calculateTotalTargetValue()
        }
        
        if(this.isMobileView == false) {
          this.displayedItems = this.ListOftragetfiltervalues.slice(this.startIndex, this.startIndex + 5);
        } else if (this.isMobileView == true) {
          this.displayedItems = this.ListOftragetfiltervalues.slice(this.startIndex, this.startIndex + 1);
        }
      });
  }

  createtargetfilterparams(data:any, EntityType:any, pagenumber:any, NumberOfRecord:any) {
    console.log(data);
    console.log(EntityType);
    let params = new HttpParams()
      .set('NumberOfRecord', NumberOfRecord)
      .set('PageNumber', pagenumber);
    data.forEach((element:any) => {
      if(element.name=='EndDate'||element.name=='StartDate'){
        const data:any=this.datepipe.transform(element.value, 'dd-MMM-yyyy')
        params = params.set(element.name, data);
      }else{
      params = params.set(element.name, element.value);
      }
    });
    console.log(params.toString()); // Log the parameters for debugging
    return params;
  }

  removeSearch(value:any, index:number) {
    this.SearchResult.splice(index, 1);
    this.SearchGroupResult.splice(index, 1);
    if(this.SearchResult.length!=0 && this.tabnumber == 0){
      this.AdvanceSearchSingle()
      this.changeDetectorRefs.detectChanges();
    } else if(this.SearchGroupResult.length!=0 && this.tabnumber == 1){
      this.AdvanceSearchgroup()
      this.changeDetectorRefs.detectChanges();
    }
    else{
      this.showicon = false;
    }

    if(this.tabnumber == 0) {
      this.loadSites(20, 1, '');
    } else if(this.tabnumber == 1) {
      this.loadSiteGroups(10, 1, '');
    }
  }

  removekeyword(value:any,index:number){
    if (value.name === 'StatusOfTransaction') {
      this.transactionStatus = 'None';
    }
    this.ListOftragetfiltervalues.splice(index, 1);
    if(this.ListOftragetfiltervalues.length!=0){
      this.TargetAdvanceFilter(this.ListOftragetfiltervalues,1,20)
      this.changeDetectorRefs.detectChanges();
    }else{
      this.loadSiteGroupsTarget(10, 1, this.targetfilter);
    }
    if(this.isMobileView == false) {
      this.displayedItems = this.ListOftragetfiltervalues.slice(this.startIndex, this.startIndex + 5);
    } else if (this.isMobileView == true) {
      this.displayedItems = this.ListOftragetfiltervalues.slice(this.startIndex, this.startIndex + 1);
    }
  }

  calculateTotalTargetValue(): void {
    this.totalTargetValue = this.siteGroupsTarget.reduce((acc, obj) => acc + obj.targetValue, 0);
    this.achivedTargetValue = this.siteGroupsTarget.reduce((acc, obj) => acc + obj.totalAchievedValue, 0);
  }

  RoundAmount (value:any) {
    if(!Number.isNaN(value)) {
      return value.toFixed(2)
    } else {
      return 0;
    }
    
  }
}
