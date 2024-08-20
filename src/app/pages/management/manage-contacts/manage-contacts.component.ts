import { Component, OnInit, ViewChild, ValueSansProvider, TemplateRef, ElementRef, PipeTransform, ChangeDetectorRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CreateGroupComponent } from './create-group/create-group.component';
import { Contact } from 'src/app/core/models/contact.model';
import { ContactGroup } from 'src/app/core/models/contact-group.model';
import { ManageContactsService } from 'src/app/core/services/manage-contacts.service';
import { ContactGroupTarget } from 'src/app/core/models/contact-group-target.model';
import { mergeMap, toArray, filter, map, first } from 'rxjs/operators';
import { TargetYearComponent } from 'src/app/core/components/group-target/target-year/target-year.component';
import { AchievedAmount } from 'src/app/core/models/achieved-amount.model';
import { ContactDetailsComponent } from './contact-details/contact-details.component';
import { EditContactGroupComponent } from './edit-contact-group/edit-contact-group.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarComponent } from 'src/app/core/components/snackbar/snackbar.component';
import { SpinnerService } from '../../../core/services/spinner.service';
import { ResizeService } from '../../../core/services/resize.service';
import { TargetCreateComponent } from 'src/app/core/components/group-target/target-create/target-create.component';
import { MessageService } from 'src/app/core/services/message.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { ManageUsersService } from 'src/app/core/services/manage-users.service';
import { User } from 'src/app/core/models/user.model';
import { TargetContacts, TargetContactsGroup } from 'src/app/core/components/group-target/target-create/target.create';
import { TargetService } from 'src/app/core/services/target.service';
// import * as _ from 'lodash';
import { ManagecontactService } from './managecontact.service';
import { timeStamp } from 'console';
import { saveAs } from "file-saver";
import { AddFileComponent } from '../../files/components/add-file/add-file.component';
import { AddNotesComponent } from '../../files/components/add-notes/add-notes.component';
import { CreateEventComponent } from '../../calendar/create-event/create-event.component';
import { GraphFilterComponent } from '../../graph/components/graph-filter/graph-filter.component';
import { CreateStrategyComponent } from 'src/app/core/components/create-strategy/create-strategy.component';
import { ExportDataManageAllComponent } from '../manage-products/export-data-manage-all/export-data-manage-all.component';
import { DynamicGroupComponent } from './dynamic-group/dynamic-group.component';
import { DynamicGroupComponentEditComponent } from './dynamic-group-component-edit/dynamic-group-component-edit.component';
import { AdvanceSearchInTargetComponent } from 'src/app/core/components/group-target/advance-search-in-target/advance-search-in-target.component';
import { SelectDiscountComponent } from '../manage-transactions/Discount/select-discount/select-discount.component';
import { DeleteCommomComponent } from '../../commonForAll/delete-commom/delete-commom.component';
import { ViewDiscountDetailsComponent } from '../manage-transactions/Discount/view-discount-details/view-discount-details.component';
import { CreateContactComponent } from '../manage-create/create-contact/create-contact.component';
import { SingleToGroupConvertComponent } from '../manage-sites/single-to-group-convert/single-to-group-convert.component';
import { GroupSharingComponent } from '../manage-users/group-sharing/group-sharing.component';
import { CheckOrganationTypeService } from 'src/app/core/services/check-organation-type.service';
import { PopupErrorMessageComponent } from 'src/app/popup-error-message/popup-error-message.component';
import { TranslateService } from '@ngx-translate/core';
import { MatomoService } from 'src/app/core/services/matomo-service.service';
import { ProfilePickFormatService } from 'src/app/core/services/profile-pick-format.service';
import { AdvancefilterTargetService } from 'src/app/core/services/advancefilter-target.service';
import { TaskDependenciesComponent } from '../manage-tasks/manage-tasks/task-dependencies/task-dependencies.component';
import { SiteDetailsComponent } from '../manage-sites/site-details/site-details.component';
import { ViewTargetComponent } from 'src/app/core/components/group-target/view-target/view-target';
import { AdvanceSearchInManagementSingleComponent } from '../advanceSearch/advance-search-in-management-single/advance-search-in-management-single.component';
import { AdvanceSearchInManagementGroupComponent } from '../advanceSearch/advance-search-in-management-group/advance-search-in-management-group.component';
import { HttpParams } from '@angular/common/http';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-manage-contacts',
  templateUrl: './manage-contacts.component.html'
})
export class ManageContactsComponent implements OnInit, PipeTransform {
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild('fileName', { static: true }) fileName!: ElementRef;
  successMessage!: string;
  activeIndex:any;
  contactColumns!: string[];
  contactGroupTargetsColumns!: string[];
  profilePick: any;
  profilePickid: any
  size: any;
  color = 'primary';
  mode = 'indeterminate';
  value = 50;
  isMobileView!: boolean;
  width!: number;
  contactDataSource: any;
  contactGroupDummyData: any;
  contactGroupTargetsDataSource: any;
  contactSelection = new SelectionModel<Contact>(true, []);
  contactGroups: ContactGroup[] = [];
  contactGroupsTargets: ContactGroupTarget[] = [];
  datadelete: any;
  id: any;
  datadeleteindex: any;
  contactdata: any;
  contactGroupsdata: any;
  contactGroupstarget: any;
  tabledata: any;
  groupdata: any;
  groupindex: any;
  targetdatadelete: any;
  year: any;
  targetindex: any;
  contactForm!: FormGroup;
  isProspect: boolean = false;
  sites!: any[];
  contact$!: Observable<Contact>;
  contact!: Observable<Contact>;
  users$!: Observable<User[]>;
  fetchconact!: Contact;
  isShown: boolean = false;
  index: any;
  editgroupDialog!: MatDialogRef<EditContactGroupComponent>;
  editdynamicgroupDialog!: MatDialogRef<DynamicGroupComponentEditComponent>
  userDataLength: any;
  userList: any;
  targetCreateForm!: FormGroup;
  addMonthn!: FormGroup;
  max: any;
  min: any;
  availableYears: any[] = [];
  productTargetlength: any;
  targetContact: TargetContacts = new TargetContacts();
  targetContactGroup: TargetContactsGroup = new TargetContactsGroup();
  monthsBool: boolean = false;
  frequency!: string;
  filterList: any[] = [];
  selectedOptionId: number = 0;
  targetrow: any;
  filterGroup!: any[];
  selectedVal: string = '';
  monthName!: Array<{ id: number, name: string, value: string }>;
  usermonthlyAchievedAmount: any;
  showicon!: boolean;
  // quicksearch: string;
  quickSearchValue = null;
  singleSearchValue = null;
  targetSearchValue = null;
  siglefilter = '';
  singlefilter = '';
  targetfilter = '';
  mapeventsubcription: any;
  contactgroupdata: any;
  contactgroupLength: any;
  checked: any;
  selectedtagvalue:any;
  tabnumber!: number;
  allcontact!: any[];
  discountForm!: FormGroup
  contactData: any;
  discountDetails: any;
  conatctId: any;
  discountId: any;
  form!: FormGroup;
  user!: User;
  isEdit!: boolean;
  imageArray = [];
  contactIds = [];
  contactid: any;
  getDiscountData: any
  imageSrc!: string;
  AdminStatus: any;
  ContactCreateStatus: any;
  DemoOrganationstatus:boolean=false
  ListOftragetfiltervalues:any= [];
  transactionStatus: any;
  TargetLength: any;
  totalTargetValue: number = 0;
  achivedTargetValue: number =0 ;
  displayedItems: any[] = [];
  startIndex: number = 0;
  SearchResult: any = [];
  SearchGroupResult: any = [];

  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private targetService: TargetService,
    private changeDetectorRefs: ChangeDetectorRef,
    private manageUserContactsService: ManageContactsService,
    private formBuilder: FormBuilder,
    private manageContactsService: ManageContactsService,
    private manageUsersService: ManageUsersService,
    private messageService: MessageService,
    public spinner: SpinnerService,
    private _snackBar: MatSnackBar,
    private resizeService: ResizeService,
    private manageUserService: ManageUsersService,
    private managecontactsService: ManagecontactService,
    public OrgSrvice:CheckOrganationTypeService,
    private translate: TranslateService ,
    private matoService: MatomoService,
    private profilepickformat:ProfilePickFormatService,
    public AdvancefilterTarget:AdvancefilterTargetService,
    public datepipe: DatePipe,
  ){
    this.matoService.trackPageView('Management-Contact');
    if(localStorage.getItem('lang')){
      const lang:any=localStorage.getItem('lang')
      this.translate.use(lang);
    }else{
      this.translate.use('English');
    }
    if(localStorage.getItem('isTrailVersion')=='true'){
      this.popupforerrormessage('You are using trail account so you are able to create 10 contacts only','Contacts ')
  }

     if (this.OrgSrvice.checkOrganationType().DemoOrganation == 'true') {
      this.DemoOrganationstatus=true
      console.log(this.OrgSrvice.checkOrganationType());
      const data:any=this.OrgSrvice.messagesandheader('ManagementContact')
      this.popupforerrormessage(data.message, data.header);
    } 
    
    this.AdminStatus = localStorage.getItem("isAdmin");
    this.ContactCreateStatus = localStorage.getItem("ContactsCreation");


  }
  transform(value: any, ...args: any[]) {
    let ammount = value.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
    let ammount1 = ammount.replace(/,/g, ' ')
    return ammount1.replace('$', ' ')
  }
  getuserFLnames(value:any){
    return this.profilepickformat.getuserFLnames(value)
  }
  getColor(index:number) {
    return this.profilepickformat.getColor(index)
  } 

  ngOnInit(): void {
    this.mapeventsubcription = this.managecontactsService.managecontactcreate.subscribe((data) => {
      if (data == true) {
        this.loadContacts(20, 1, '');
      }
    });

    this.mapeventsubcription = this.managecontactsService.managecontactgroupcreate.subscribe((data) => {
      // console.log(data, 'subscribe data')
      if (data == true) {
        this.loadContactGroups(10, 1, '');
      }
    });
    this.mapeventsubcription = this.managecontactsService.managecontacttargetcreate.subscribe((data) => {
      console.log(data, 'subscribe data');
      if (data == true) {
        this.loadContactGroupsTarget(10, 1, '');
      }
    });

    this.monthName = [
      { id: 0, name: 'Jan', value: 'January' },
      { id: 1, name: 'Feb', value: 'February' },
      { id: 2, name: 'Mar', value: 'March' },
      { id: 3, name: 'Apr', value: 'April' },
      { id: 4, name: 'May', value: 'May' },
      { id: 4, name: 'Jun', value: 'June' },
      { id: 4, name: 'Jul', value: 'July' },
      { id: 4, name: 'Aug', value: 'August' },
      { id: 4, name: 'Sep', value: 'September' },
      { id: 4, name: 'Oct', value: 'October' },
      { id: 4, name: 'Nov', value: 'November' },
      { id: 4, name: 'Dec', value: 'December' }
    ];
    // resizing the screen table column changed
    this.resizeService.size$.subscribe(
      user => {
        this.size = user.size;
        if (this.size < 992) {
          this.contactColumns = ['contact', 'options'];
          this.contactGroupTargetsColumns = ['options', 'name', ];
          this.isMobileView = true;
        } else {
          this.contactColumns = ['options', 'image', 'name', 'email', 'phoneNumber', 'position', 'siteName'];
          this.contactGroupTargetsColumns = ['options', 'name', 'CreaterName', 'StartDate', 'EndDate', 'target', 'B', 'progress'];
          this.isMobileView = false;
        }
      }
    );
    this.width = window.innerWidth;
    if (!this.size && this.width < 992) {
      this.contactColumns = ['contact', 'options'];
      this.contactGroupTargetsColumns = ['options', 'name', ];
      this.isMobileView = true;
    } else if (!this.size && this.width > 992) {
      this.contactColumns = ['options', 'image', 'name', 'email', 'phoneNumber', 'position', 'siteName'];
      this.contactGroupTargetsColumns = ['options', 'name', 'CreaterName', 'StartDate', 'EndDate', 'target', 'B', 'progress'];
      this.isMobileView = false;
    }

    this.contactForm = this.formBuilder.group({
      'FirstName': [''],
      'id': [],
      'LastName': [''],
      'Position': [''],
      'Email': [''],
      'ContactType': [''],
      'SiteId': [''],
      'PhoneNumber': [''],
      'UserId': [[]],
      'ProfilePicture': [''],
      'isActive': [{ value: 'true', disabled: true }],
      'isProspect': [],
      'TagViewModels': [[]],
      'created': [''],
      'tagType': [''],
      'title': [''],
      'ischecked': [''],
      'numeralType': [''],
      'freefeildTitle': ['', Validators.pattern('^[a-zA-Z \-\']+')],
      'freefeildnumber': [''],
      'feildname': [''],
      'fieldvalue': [''],
      'freefeildvalue': [''],
      'dropdowntype': [''],
      'dropdown': ['']
    });

    this.loadContacts(20, 1, '');
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

  tabChange(tabIndex: number): void {
    this.showicon = false
    console.log(tabIndex);
    this.tabnumber = tabIndex
    if (tabIndex === 0) {
      this.loadContacts(20, 1, '');
    } else if (tabIndex === 1) {
      this.loadContactGroups(10, 1, '');
    } else if (tabIndex === 2) {
      this.loadContactGroupsTarget(10, 1, '');
    }

  }
  next(e:any, value:any) {
    if (value == 'single') {
      this.loadContacts(20, e.pageIndex + 1, this.siglefilter);
    }
    else {
      this.loadContactGroups(10, e.pageIndex + 1, this.singlefilter);
    }
  }

  nextt(e:any) {
    this.loadContactGroupsTarget(10, e.pageIndex + 1, this.targetfilter);
  }
  nexttAdvanceTarget(e:any) {
    this.TargetAdvanceFilter(this.ListOftragetfiltervalues, e.pageIndex + 1, 20);
  }

  loadContacts(size:any, pagenumber:any, siglefilter:any) {
    this.manageContactsService.fetchContacts(size, pagenumber, siglefilter).subscribe(
      (result: any) => {
        this.contactdata = result.data;
        this.contactDataSource = new MatTableDataSource(this.contactdata);
        this.contactDataSource.sort = this.sort;
        this.userDataLength = result.totalItems;
      });
  }

  loadContactGroups(size:any, pagenumber:any, singlefilter:any): void {
    this.manageContactsService.fetchContactGroups(size, pagenumber, singlefilter).subscribe(
      (result: any) => {
        this.contactgroupdata = result.data;
        this.contactGroups = this.contactgroupdata;
        this.contactgroupLength = result.totalItems;
      }
    );
  }

  loadContactGroupsTarget(size:any, pagenumber:any, targetfilter:any) {
    this.manageContactsService.fetchContactGroupsTargetService(size, pagenumber, targetfilter,2)
      .pipe(
        mergeMap(res => res.map(data => {
          data.screen = 'contacts';
          if(data.targetTypeName == 'Orders'){
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
        this.contactGroupsTargets = data;
        this.contactGroupTargetsDataSource = new MatTableDataSource(this.contactGroupsTargets);
        this.tabledata = data;
        //this.contactGroupTargetsDataSource.paginator = this.paginator;
        this.contactGroupTargetsDataSource.sort = this.sort;
      });
    this.manageContactsService.fetchContactGroupsTarget(size, pagenumber, targetfilter,2).subscribe(
      (data: any) => {
        console.log("then", data)
        this.productTargetlength = data.totalItems;
      }
    );
  }

  private calculatePerformanceGain(target: ContactGroupTarget): void {
    let currentYear = new Date().getFullYear();
    if (currentYear > Number(target.year) && target.percentage > 100) {
      target.performanceGain = Math.round((target.yearlyAchievedAmount - target.yearlyTarget) / target.yearlyTarget) * 100;
    }
  }

  assignCssClass(progress: number) {
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

  applyFilter(filterValue: string): void {
    this.siglefilter = filterValue;
    this.loadContacts(20, 1, this.siglefilter);
    this.showicon = true;
  }


  applyFiltersearch(filterValue: string) {
    this.singlefilter = filterValue;
    this.loadContactGroups(10, 1, this.singlefilter);
    this.showicon = true;
  }
  applytargetFiltergroup(filterValue: string) {
    this.targetfilter = filterValue;
    this.loadContactGroupsTarget(10, 1, this.targetfilter);
    this.showicon = true;
  }



  closesearch(value:any) {
    if (value == 'single') {
      this.showicon = false;
      this.singleSearchValue = null;
      this.SearchResult.splice(0, this.SearchResult.length);
      this.loadContacts(20, 1, '');
    } else if (value == 'multiple') {
      // console.log(value,'value')
      this.showicon = false;
      this.quickSearchValue = null;
      this.SearchGroupResult.splice(0, this.SearchGroupResult.length);
      this.loadContactGroups(10, 1, '');
    }
    else if (value == 'target') {
      this.showicon = false;
      this.targetSearchValue = null;
      this.ListOftragetfiltervalues.splice(0, this.ListOftragetfiltervalues.length);
      this.loadContactGroupsTarget(10, 1, '');
    }
  }

  masterToggle() {
    this.isAllContactsSelected() ?
      this.contactSelection.clear() :
      this.contactDataSource.data.forEach((row:any) => this.contactSelection.select(row));
  }

  isAllContactsSelected() {
    const numSelected = this.contactSelection.selected.length;
    const numRows = this.contactDataSource.data.length;
    return numSelected === numRows;
  }

  openContactDialog(row:any, type:any) {
    this.dialog.open(ContactDetailsComponent, {
      disableClose: true,
      data: { data: row, type: type },
      width: '500px'
    }); 
  }
  //create user group
  selactOptionGroup(templateRef: TemplateRef<any>) {
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
        data: this.contactSelection.selected
      });
    } else {
      this.dialog.closeAll()
      const DynamicGroup = this.dialog.open(DynamicGroupComponent, {
        disableClose: true,
        width: '500px',
        data: { type: 'Contacts' }
      });
      DynamicGroup.afterClosed().subscribe(result => {
        if (result) {
          this.ngOnInit()
        }
      });
    }
  }


  // edit Contact group

  editContactGroup(data: any) {
    if (data.conditionDtos) {
      this.editdynamicgroupDialog = this.dialog.open(DynamicGroupComponentEditComponent, { disableClose: true, data: { data, type: 'Contacts' }, width: '500px' });
      this.editdynamicgroupDialog.afterClosed().subscribe(result => {
        console.log(`Dialog result: ${result}`);
        this.loadContactGroups(10, 1, '');
      });
    } else {
      this.editgroupDialog = this.dialog.open(EditContactGroupComponent, { disableClose: true, data: data, width: '500px' });
      this.editgroupDialog.afterClosed().subscribe(result => {
        console.log(`Dialog result: ${result}`);
        this.loadContactGroups(10, 1, '');
      });
    }

  }

  deleteDialogConfirmation(data:any, type:any, entity:any) {
    const deleteorder = this.dialog.open(DeleteCommomComponent, { data: { data, type: type, entity: entity } });
    deleteorder.afterClosed().subscribe((result: any) => {
      if (result) {
        this.loadContacts(20, 1, '');
        this.loadContactGroups(10, 1, '');
        this.loadContactGroupsTarget(10, 1, '');
      }

    })
  }

  // openTargetMonths(target: ContactGroupTarget) {
  //   console.log(target);
  //   this.dialog.open(TargetMonthComponent, {
  //     disableClose: true,
  //     width: '500px',
  //     data: target
  //   });

  // }

 
  openTargetContacts(target: ContactGroupTarget) {
    console.log(target)
    if (target.dynamicGrpId == null) {
      const ids: any = target.childIds.join(',');
    this.manageContactsService.fetchContactsAchievedAmountService(ids, Number(target.year), false, '').subscribe((achievedYearly: AchievedAmount[]) => {
      if(achievedYearly){
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
      }
      });
    } else {
      const GroupId = target.dynamicGrpId;
      this.manageContactsService.getDynamicGroupService('Contacts', GroupId).subscribe((data:any) => {
        if (data) {
          const ids:any=[]
          data.forEach((element:any) => {
            ids.push(element.id)
          });
          this.manageContactsService.fetchContactsAchievedAmountService(ids, Number(target.year), false, '').subscribe((achievedYearly: AchievedAmount[]) => {
            if(achievedYearly){
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
            }
            });        }
      });
    }
  }



  closedialogbox() {
    this.dialog.closeAll();
    this.ngOnInit()
  }



  getContactGroups(row:any) {
    this.manageContactsService.getContactGroups(row.id).subscribe((result: any) => {
      if(result) {
        this.dialog.open(TargetYearComponent, {
          disableClose: true,
          width: '700px',
          data: {data: result, type: 'Contacts', target: row}
        });
      }
    })
  }


  updateContactDialog(row:any) {
    const createContactDialog = this.dialog.open(CreateContactComponent, {
      data: { screenType: 'UpdateContact', data: row },
      disableClose: true,
      width: '500px'
    });

    createContactDialog.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });

  }

  loadSites() {
    this.manageContactsService.fetchSite().subscribe((res) => {
      this.sites = res;
      // console.log(this.sites,'this.sites')
    });
  }
  loadUsers() {
    this.users$ = this.manageUsersService.findAllUsersDropdown();
  }
  get f() {
    return this.contactForm.controls;
  }

  onSubmit() {
    const formData = new FormData();
    formData.append('Id', this.contactForm.get('id')?.value);
    formData.append('FirstName', this.contactForm.get('FirstName')?.value);
    formData.append('LastName', this.contactForm.get('LastName')?.value);
    formData.append('Position', this.contactForm.get('Position')?.value);
    formData.append('Email', this.contactForm.get('Email')?.value);
    formData.append('ContactType', this.contactForm.get('ContactType')?.value);
    let userid = this.contactForm.get('UserId')?.value;
    for (var x = 0; x < userid.length; x++) {
      formData.append('UserId', userid[x]);
    }
    formData.append('SiteId', this.contactForm.get('SiteId')?.value);
    formData.append('PhoneNumber', this.contactForm.get('PhoneNumber')?.value);
    formData.append('Profile', 'null');
    formData.append('isActive', this.contactForm.get('isActive')?.value);
    formData.append('isProspect', this.contactForm.get('isProspect')?.value);
    formData.append('created', this.contactForm.get('created')?.value);
    // console.log(this.contactForm.get('TagViewModels')?.value)
    for (let i = 0; i < this.fetchconact.tagViewModels.length; i++) {
      formData.append('TagViewModels[' + i + '].fieldName', this.fetchconact.tagViewModels[i].fieldName);
      formData.append('TagViewModels[' + i + '].fieldType', this.fetchconact.tagViewModels[i].fieldType);
      formData.append('TagViewModels[' + i + '].tagTableId', this.fetchconact.tagViewModels[i].tagTableId);
      if (this.fetchconact.tagViewModels[i].fieldType == 'text' || this.fetchconact.tagViewModels[i].fieldType == 'number') {
        formData.append('TagViewModels[' + i + '].fieldValue', this.contactForm.get('freefeildvalue')?.value);
        formData.append('TagViewModels[' + i + '].dropdownValues', this.fetchconact.tagViewModels[i].dropdownValues);
      } else if (this.fetchconact.tagViewModels[i].fieldType == 'boolean' || this.fetchconact.tagViewModels[i].fieldType == 'Boolean') {
        formData.append('TagViewModels[' + i + '].fieldValue', this.checked || false);
        formData.append('TagViewModels[' + i + '].dropdownValues', this.fetchconact.tagViewModels[i].dropdownValues);
      }
      else if (this.fetchconact.tagViewModels[i].fieldType == 'dropdown') {
        formData.append('TagViewModels[' + i + '].fieldValue', this.fetchconact.tagViewModels[i].fieldValue);
        formData.append('TagViewModels[' + i + '].dropdownValues', this.selectedtagvalue);
      }

    }
    this.manageContactsService.updateContactService(formData).subscribe(
      (data:any) => {
        this.dialog.closeAll();
        this.messageService.showMessage(data['response'][0].message);
        // this.router.navigate(['/home/dash/management/m/contacts']);
        this.loadContacts(20, 1, '');
      }
    );
  }
  checkbox() {
    this.checked = true;
  }

  dropdowntagvalue(i:number) {
    console.log(i);
    this.selectedtagvalue = i;
  }



  toggleShow(i:number) {
    this.isShown = !this.isShown;
    this.index = i;
  }

  showContactList(group:any) {
    if (group.dynamicGroupId == null) {
      const GroupId = group.id;
      this.manageContactsService.fetchContactGroupByIdService(GroupId).subscribe((data) => {
        console.log(data, 'data');
        if (data) {
          this.userList = data;
        }
      });
    } else {
      const GroupId = group.dynamicGroupId;
      this.manageContactsService.getDynamicGroupService('Contacts', GroupId).subscribe((data) => {
        console.log(data, 'data');
        if (data) {
          this.userList = data;
        }
      });
    }

  }

  ngOnDestroy() {
    this.mapeventsubcription.unsubscribe();
  }

  openCreateContact() {
    const createContactDialog = this.dialog.open(CreateContactComponent, {
      data: { screenType: 'CreateContact' },
      disableClose: true,
      width: '500px'
    });

    createContactDialog.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  // exportData
  exportData() {
    this.dialog.open(ExportDataManageAllComponent, {
      disableClose: true,
      data: { type: 'Contacts' },
      width: '700px',
    });
  }


  getallcontact() {
    this.manageContactsService.findAllContactsDropdown().subscribe((result) => {
      this.allcontact = result;
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
        this.loadContacts(20, 1, '');
        this.loadContactGroups(10, 1, '');
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
        this.loadContacts(20, 1, '');
        this.loadContactGroups(10, 1, '');
      }
    });
  }

  GroupShare(data:any, name:any) {
    this.dialog.open(GroupSharingComponent, {
      width: '600px',
      autoFocus: false,
      disableClose: true,
      data: { data: data, Name: name },
    });
  }


  searchbox() {
    const AdvanceSearch = this.dialog.open(AdvanceSearchInTargetComponent, {
      disableClose: true,
      width: '500px',
      data: { type: 'Contacts' }
    });
    AdvanceSearch.afterClosed().subscribe((result: any) => {
      let data = result.data.map((data:any) => {
        data.screen = 'contacts';
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
      this.contactGroupsTargets = data;
      this.contactGroupTargetsDataSource = new MatTableDataSource(data);
      this.tabledata = data;
      this.contactGroupTargetsDataSource.paginator = this.paginator;
      this.contactGroupTargetsDataSource.sort = this.sort;
      this.showicon = true
    })

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
          this.loadContactGroupsTarget(10, 1, '');
        }, 100);
      }
    })
  }
  // AddFile
  AddFile(row:any, type:any) {
    this.dialog.open(AddFileComponent, {
      disableClose: true,
      data: {
        data: row,
        attachmentLevel: 'Contacts',
        ismanage: true,
        type: type
      },
      width: '500px',
      panelClass: ['addFiles']
    });
  }
  //  AddNote
  AddNote(row:any, type:any) {
    this.dialog.open(AddNotesComponent, {
      disableClose: true,
      data: {
        data: row,
        attachmentLevel: 'Contacts',
        ismanage: true,
        type: type
      },
      width: '600px',
      panelClass: ['addNotes']
    });
  }
  AddToGroupDialog(row:any) {
    this.dialog.open(SingleToGroupConvertComponent, {
      disableClose: true,
      data: { data: row, Entity: 'Contacts', },
      width: '500px',
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
      data: { data, Name: 'Contacts', single: value, management: true },

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

  showsitedetails(row:any){
    console.log(row)
    this.manageUsersService.getAllCountes('Contacts', row.id, 'Sites').subscribe((res:any) => {
      console.log(res)
      if(res){
        if(res.length>1){
      this.showlistofsuccessorandpredecessor(res,'siteslist')
        }else{
      this.ShowSiteDetails(res[0], 'site')
        }
      }

    });
  }
    // ShowSiteDetails
    ShowSiteDetails(row:any, type: string): void {
      this.dialog.open(SiteDetailsComponent, {
        disableClose: true,
        data: { data: row, type: type },
        width: '500px',
        position: { top: '150px', left: '700px' },
      });
    }

  showlistofsuccessorandpredecessor(data:any,type:any){
    this.dialog.open(TaskDependenciesComponent, {
      width: '500px',
      panelClass: ['files'],
      data: {data:data,type:type},
      disableClose: false,
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

  // Search
  AdvanceSearchSingle() {
    const AdvanceSearch = this.dialog.open(
      AdvanceSearchInManagementSingleComponent,
      {
        disableClose: true,
        data: { type: 'Contacts' },
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
        data: { type: 'Contacts' },
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
      width: '600px',
      data: { type: 'Contacts' },
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
    console.log("justnoww",data)
    const params = this.createtargetfilterparams(data,'Contacts',pagenumber,NumberOfRecord);
    this.manageContactsService.TargetAdvanceFilter(params) .subscribe((result: any) => {
        if (result) {
          let data = result.data.map((data:any) => {
            data.screen = 'contacts';
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
          this.contactGroupsTargets = data;
          this.contactGroupTargetsDataSource = new MatTableDataSource(this.contactGroupsTargets);
          this.tabledata = data;
          this.contactGroupTargetsDataSource.paginator = this.paginator;
          this.contactGroupTargetsDataSource.sort = this.sort;
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
        let data:any=this.datepipe.transform(element.value, 'dd-MMM-yyyy')
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
      this.loadContacts(20, 1, '');
    } else if(this.tabnumber == 1) {
      this.loadContactGroups(10, 1, '');
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
      this.loadContactGroupsTarget(10, 1, '');
    }
    if(this.isMobileView == false) {
      this.displayedItems = this.ListOftragetfiltervalues.slice(this.startIndex, this.startIndex + 5);
    } else if (this.isMobileView == true) {
      this.displayedItems = this.ListOftragetfiltervalues.slice(this.startIndex, this.startIndex + 1);
    }
  }

  calculateTotalTargetValue(): void {
    this.totalTargetValue = this.contactGroupsTargets.reduce((acc, obj) => acc + obj.targetValue, 0);
    this.achivedTargetValue = this.contactGroupsTargets.reduce((acc, obj) => acc + obj.totalAchievedValue, 0);
  }

  RoundAmount (value:any) {
    if(!Number.isNaN(value)) {
      return value.toFixed(2)
    } else {
      return 0;
    }
    
  }
}
