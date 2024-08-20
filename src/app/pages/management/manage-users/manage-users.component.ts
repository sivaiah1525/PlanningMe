import {
  Component,
  OnInit,
  ViewChild,
  Input,
  HostListener,
  OnDestroy,
  ChangeDetectionStrategy,
  TemplateRef,
  InjectionToken,
  PipeTransform,
  ChangeDetectorRef,
} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ManageUsersService } from 'src/app/core/services/manage-users.service';
import { SelectionModel } from '@angular/cdk/collections';
import { User } from 'src/app/core/models/user.model';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { CreateGroupComponent } from './create-group/create-group.component';
import { EditUserGroupComponent } from './edit-user-group/edit-user-group.component';
import { UserGroup } from 'src/app/core/models/user-group.model';
import { UserDetailsComponent } from './user-details/user-details.component';
import { CalendarMonthViewBeforeRenderEvent } from 'angular-calendar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarComponent } from 'src/app/core/components/snackbar/snackbar.component';
import { SpinnerService } from '../../../core/services/spinner.service';
import { ResizeService } from '../../../core/services/resize.service';
import { MessageService } from 'src/app/core/services/message.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ManageuserService } from 'src/app/pages/management/manage-users/manageuser.service';
import { UserGroupTarget } from 'src/app/core/models/user-group-target.model';
import { Observable } from 'rxjs';
import { mergeMap, toArray } from 'rxjs/operators';
import { TargetCreateComponent } from 'src/app/core/components/group-target/target-create/target-create.component';
import { AchievedAmount } from 'src/app/core/models/achieved-amount.model';
import { TargetYearComponent } from 'src/app/core/components/group-target/target-year/target-year.component';
import { saveAs } from 'file-saver';
import { AddNotesComponent } from '../../files/components/add-notes/add-notes.component';
import { AddFileComponent } from '../../files/components/add-file/add-file.component';
import { CreateEventComponent } from '../../calendar/create-event/create-event.component';
import { GraphFilterComponent } from '../../graph/components/graph-filter/graph-filter.component';
import { CreateStrategyComponent } from 'src/app/core/components/create-strategy/create-strategy.component';
import { ExportDataManageAllComponent } from '../manage-products/export-data-manage-all/export-data-manage-all.component';
import { DynamicGroupComponent } from '../manage-contacts/dynamic-group/dynamic-group.component';
import { DynamicGroupComponentEditComponent } from '../manage-contacts/dynamic-group-component-edit/dynamic-group-component-edit.component';
import { AdvanceSearchInTargetComponent } from 'src/app/core/components/group-target/advance-search-in-target/advance-search-in-target.component';
import { DeleteCommomComponent } from '../../commonForAll/delete-commom/delete-commom.component';
import { CreateContactComponent } from '../manage-create/create-contact/create-contact.component';
import { CreateUserComponent } from '../manage-create/create-user/create-user.component';
import { PermissionApplyEditComponent } from '../../settings/permission/permission-apply-edit/permission-apply-edit.component';
import { PermissionService } from 'src/app/core/services/permission.service';
import { ProfilePickFormatService } from 'src/app/core/services/profile-pick-format.service';
import { SingleToGroupConvertComponent } from '../manage-sites/single-to-group-convert/single-to-group-convert.component';
import { GroupSharingComponent } from './group-sharing/group-sharing.component';
import { settings } from 'cluster';
import { AdvanceSearchInManagementSingleComponent } from '../advanceSearch/advance-search-in-management-single/advance-search-in-management-single.component';
import { AdvanceSearchInManagementGroupComponent } from '../advanceSearch/advance-search-in-management-group/advance-search-in-management-group.component';
import { CheckOrganationTypeService } from 'src/app/core/services/check-organation-type.service';
import { PopupErrorMessageComponent } from 'src/app/popup-error-message/popup-error-message.component';
import { TranslateService } from '@ngx-translate/core';
import { MatomoService } from 'src/app/core/services/matomo-service.service';
import { ManageContactsService } from 'src/app/core/services/manage-contacts.service';
import { ViewTargetComponent } from 'src/app/core/components/group-target/view-target/view-target';
import { AdvancefilterTargetService } from 'src/app/core/services/advancefilter-target.service';
import { listConversionFilters } from '@syncfusion/ej2-angular-richtexteditor';
import { HttpParams } from '@angular/common/http';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-manage-users',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './manage-users.component.html',
})
export class ManageUsersComponent implements OnInit, PipeTransform {
  @ViewChild('updateDialog', { static: true }) updateDialog!: TemplateRef<any>;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  size: any;
  width!: number;
  activeIndex:any;
  columns!: string[];
  userGroupTargetsColumns!: string[];
  data: any;
  profilePick: any;
  profilePickid: any;
  userDataSource: any;
  userSelection = new SelectionModel<User>(true, []);
  userGroups: any = [];
  successMessage!: string;
  color = 'primary';
  mode = 'indeterminate';
  value = 50;
  isMobileView!: boolean;
  userList: [] = [];
  datadelete: any;
  id: any;
  userdatadata: any;
  userdata!: User[];
  datadeleteindex: any;
  userGroupsdata: any;
  groupdata: any;
  groupindex: any;
  isShown: boolean = false;
  index: any;
  useriddata: any;
  users$: any;
  editgroupDialog!: MatDialogRef<EditUserGroupComponent>;
  editdynamicgroupDialog!: MatDialogRef<DynamicGroupComponentEditComponent>;
  userDataLength: any;
  showicon: boolean = false;
  // quicksearch: string;
  quickSearchValue = null;
  allusers: any;
  singleSearchValue = null;
  siglefilter = '';
  mapeventsubcription: any;
  usergroupdata: any;
  usergroupDataLength: any;
  singlefilter = '';
  checked: any;
  selectedtagvalue: any;
  tabnumber!: number;
  targetSearchValue = null;
  targetfilter = '';
  userGroupsTargets: UserGroupTarget[] = [];
  userGroupTargetsDataSource: any;
  tabledata: any;
  productTargetlength: any;
  userTargetlength: any;
  userIds = [];
  userid: any;
  userPermissiondata = [];
  ChooseOption = 'Users';
  showchooseOption = true;
  AdminStatus: any;
  UserCreationStatus: any;
  DemoOrganationstatus: boolean = false;
  Userid: any;
  ListOftragetfiltervalues:any= [];
  transactionStatus: any;
  SearchResult: any = [];
  TargetLength: any;
  totalTargetValue: number = 0;
  achivedTargetValue: number = 0;
  displayedItems: any[] = [];
  startIndex: number = 0;
  SearchGroupResult: any = [];

  constructor(
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private manageUserService: ManageUsersService,
    private manageuserrservice: ManageuserService,
    public snackBar: MatSnackBar,
    public spinner: SpinnerService,
    private resizeService: ResizeService,
    private permissionService: PermissionService,
    private changeDetectorRefs: ChangeDetectorRef,
    public OrgSrvice: CheckOrganationTypeService,
    private translate: TranslateService,
    private matoService: MatomoService,
    private profilepickformat: ProfilePickFormatService,
    private manageContactsService: ManageContactsService,
    public AdvancefilterTarget: AdvancefilterTargetService,
    public datepipe: DatePipe,
  ) {
    this.matoService.trackPageView('Management-user');
    if (localStorage.getItem('lang')) {
      const lang:any=localStorage.getItem('lang')
      this.translate.use(lang);
    } else {
      this.translate.use('English');
    }

    if (localStorage.getItem('isTrailVersion') == 'true') {
      this.popupforerrormessage(
        'You are using trail account so you can able to Create 5 users only',
        'Users'
      );
    }
    if (this.OrgSrvice.checkOrganationType().DemoOrganation == 'true') {
      this.DemoOrganationstatus = true;
      console.log(this.OrgSrvice.checkOrganationType());
      const data :any= this.OrgSrvice.messagesandheader('ManagementUser');
      this.popupforerrormessage(data.message, data.header);
    }

    this.AdminStatus = localStorage.getItem('isAdmin');
    this.UserCreationStatus = localStorage.getItem('UsersCreation');
  }
  transform(value: any, ...args: any[]) {
    let ammount = value?.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
    });
    let ammount1 = ammount?.replace(/,/g, ' ');
    return ammount1?.replace('$', ' ');
  }
  ngOnInit(): void {
    this.resizeService.size$.subscribe((user) => {
      this.size = user.size;
      if (this.size < 992) {
        this.columns = ['user', 'options'];
        this.userGroupTargetsColumns = ['options', 'name'];
        this.isMobileView = true;
      } else {
        this.columns = [
          'options',
          'image',
          'name',
          'email',
          'gender',
          'position',
          'state',
          'country',
          'pincode',
        ];
        this.userGroupTargetsColumns = [
          'options',
          'name',
          'CreaterName',
          'StartDate',
          'EndDate',
          'target',
          'B',
          'progress',
        ];
        this.isMobileView = false;
      }
    });
    this.width = window.innerWidth;
    if (!this.size && this.width < 992) {
      this.columns = ['user', 'options'];
      this.userGroupTargetsColumns = ['options', 'name'];
      this.isMobileView = true;
    } else if (!this.size && this.width > 992) {
      this.columns = [
        'options',
        'image',
        'name',
        'email',
        'gender',
        'position',
        'state',
        'country',
        'pincode',
      ];
      this.userGroupTargetsColumns = [
        'options',
        'name',
        'CreaterName',
        'StartDate',
        'EndDate',
        'target',
        'B',
        'progress',
      ];
      this.isMobileView = false;
    }

    this.mapeventsubcription =
      this.manageuserrservice.manageusercreate.subscribe((data) => {
        if (data === true) {
          this.loadUsers(20, 1, '');
        }
      });
    this.mapeventsubcription =
      this.manageuserrservice.manageusergroupcreate.subscribe((data) => {
        if (data === true) {
          this.loadUserGroups(10, 1, '');
        }
      });
    this.mapeventsubcription =
      this.manageuserrservice.manageUserTargetCreate.subscribe((data) => {
        if (data === true) {
          this.loadUserGroupsTarget(10, 1, '');
        }
      });
    this.loadUsers(20, 1, '');
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
  tabChange(tabIndex: number): void {
    this.showicon = false;
    this.tabnumber = tabIndex;
    if (tabIndex === 0) {
      this.singleSearchValue = null;
      this.loadUsers(20, 1, '');
    } else if (tabIndex === 1) {
      this.quickSearchValue = null;
      this.loadUserGroups(10, 1, '');
    } else if (tabIndex === 2) {
      this.targetSearchValue = null;
      this.loadUserGroupsTarget(10, 1, '');
    }
  }
  next(e:any, value:any) {
    if (value === 'single') {
      this.loadUsers(20, e.pageIndex + 1, this.siglefilter);
    } else if (value === 'groups') {
      this.loadUserGroups(10, e.pageIndex + 1, this.singlefilter);
    } else if (value === 'target') {
      this.loadUserGroupsTarget(10, e.pageIndex + 1, this.targetfilter);
    }
  }

  nextAdvanceSearch(e:any, value:any) {
   if (value === 'target') {
      this.TargetAdvanceFilter(this.ListOftragetfiltervalues, e.pageIndex + 1, 10);
    }
  }
  // fetch user data
  loadUsers(size:any, pagenumber:any, siglefilter:any): void {
    this.manageUserService
      .fetchUsers(size, pagenumber, siglefilter)
      .subscribe((result: any) => {
        console.log(result)
        this.userdata = result.data;
        this.userDataLength = result.totalItems;
        this.userDataSource = new MatTableDataSource(this.userdata);
        this.changeDetectorRefs.detectChanges();
        this.userDataSource.sort = this.sort;
      });
  }
  //fetch  user group data
  loadUserGroups(size:any, pagenumber:any, singlefilter:any) {
    this.manageUserService
      .fetchUserGroups(size, pagenumber, singlefilter)
      .subscribe((result: any) => {
        this.usergroupdata = result.data;
        this.usergroupDataLength = result.totalItems;
        this.userGroups = this.usergroupdata;
      });
  }

  openCreateUser() {
    const createUserDialog = this.dialog.open(CreateUserComponent, {
      data: { screenType: 'CreateUser' },
      disableClose: true,
      width: '500px',
    });
    createUserDialog.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }

  loadUserGroupsTarget(size:any, pagenumber:any, targetfilter:any) {
    this.manageContactsService
      .fetchContactGroupsTargetService(size, pagenumber, targetfilter, 1)
      .pipe(
        mergeMap((res) =>
          res.map((data) => {
            data.screen = 'users';
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
          })
        ),
        toArray()
      )
      .subscribe((data) => {
        console.log('Dataaaanoww', data);
        this.userGroupsTargets = data;
        this.userGroupTargetsDataSource = new MatTableDataSource(
          this.userGroupsTargets
        );
        this.tabledata = data;
        //this.userGroupTargetsDataSource.paginator = this.paginator;
        this.userGroupTargetsDataSource.sort = this.sort;
        
      });
    this.manageContactsService
      .fetchContactGroupsTarget(size, pagenumber, targetfilter, 1)
      .subscribe((data: any) => {
        this.userTargetlength = data.totalItems;
      });
      this.changeDetectorRefs.detectChanges();
  }

  private calculatePerformanceGain(target: UserGroupTarget): void {
    let currentYear = new Date().getFullYear();
    if (currentYear > Number(target.year) && target.percentage > 100) {
      target.performanceGain =
        Math.round(
          (target.yearlyAchievedAmount - target.yearlyTarget) /
            target.yearlyTarget
        ) * 100;
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

  applyFilter(filterValue: string): void {
    this.siglefilter = filterValue;
    this.loadUsers(20, 1, this.siglefilter);
    this.showicon = true;
  }

  applyFiltersearch(filterValue: string) {
    this.singlefilter = filterValue;
    this.loadUserGroups(20, 1, this.singlefilter);
    this.showicon = true;
  }

  applytargetFiltergroup(filterValue: string) {
    this.targetfilter = filterValue;
    this.loadUserGroupsTarget(10, 1, this.targetfilter);
    this.showicon = true;
  }

  percentagecalucation(value: any) {
    console.log(value);
    let percentage = 0;

    if (value.targetTypeName == 'Orders') {
      percentage = Math.round(
        (value.totalAchievedValue / value.targetValue) * 100
      );
      if (percentage >= 100) {
        percentage = percentage % 100;
      }
    } else {
      const timeStringToSeconds = (timeString: string): number => {
        const [hours, minutes, seconds] = timeString.split(':').map(parseFloat);
        return hours * 3600 + minutes * 60 + seconds;
      };
      const totalAchievedSeconds = timeStringToSeconds(
        value.totalAchievedDuration
      );
      const targetSecondsValue = timeStringToSeconds(value.targetDuration);

      if (targetSecondsValue !== 0) {
        percentage = Math.round(
          (totalAchievedSeconds / targetSecondsValue) * 100
        );
      }
      value.percentage = Math.min(percentage, 100);
    }

    console.log('perrrrr', percentage);

    return percentage;
  }
  closesearch(value:any) {
    if (value == 'single') {
      this.showicon = false;
      this.singleSearchValue = null;
      this.SearchResult.splice(0, this.SearchResult.length);
      this.loadUsers(20, 1, '');
    } else if (value == 'multiple') {
      this.showicon = false;
      this.quickSearchValue = null;
      this.SearchGroupResult.splice(0, this.SearchGroupResult.length);
      this.loadUserGroups(10, 1, '');
    } else {
      this.showicon = false;
      this.targetSearchValue = null;
      this.ListOftragetfiltervalues.splice(0, this.ListOftragetfiltervalues.length);
      this.loadUserGroupsTarget(10, 1, '');
    }
  }

  masterUserToggle() {
    this.isAllUsersSelected()
      ? this.userSelection.clear()
      : this.userDataSource.data.forEach((row:any) =>
          this.userSelection.select(row)
        );
  }

  isAllUsersSelected(): boolean {
    const numSelected = this.userSelection.selected.length;
    const numRows = this.userDataSource.data.length;
    return numSelected === numRows;
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
      this.dialog.closeAll();
      this.dialog.open(CreateGroupComponent, {
        width: '500px',
        disableClose: true,
        data: this.userSelection.selected,
      });
    } else {
      this.dialog.closeAll();
      const DynamicGroup = this.dialog.open(DynamicGroupComponent, {
        disableClose: true,
        width: '500px',
        data: { type: 'Users' },
      });
      DynamicGroup.afterClosed().subscribe((result) => {
        this.ngOnInit();
      });
    }
  }
  // edit user group

  editGroup(data:any) {
    if (data.conditionDtos) {
      this.editdynamicgroupDialog = this.dialog.open(
        DynamicGroupComponentEditComponent,
        { disableClose: true, data: { data, type: 'Users' }, width: '500px' }
      );
      this.editdynamicgroupDialog.afterClosed().subscribe((result) => {
        console.log(`Dialog result: ${result}`);
        this.loadUserGroups(10, 1, '');
      });
    } else {
      this.editgroupDialog = this.dialog.open(EditUserGroupComponent, {
        disableClose: true,
        data: data,
        width: '500px',
      });
      this.editgroupDialog.afterClosed().subscribe((result) => {
        console.log(`Dialog result: ${result}`);
        this.loadUserGroups(10, 1, '');
      });
    }
  }
  // user detail & user group detail
  openUserDialog(id: number, row:any, type: string): void {
    this.dialog.open(UserDetailsComponent, {
      data: { data: row, type: type },
      disableClose: true,
      width: '500px',
    });
  }

  getuserFLnames(value:any) {
    return this.profilepickformat.getuserFLnames(value);
  }

  getColor(index:any) {
    return this.profilepickformat.getColor(index);
  }

  deleteDialogConfirmation(data:any, type:any) {
    const deleteorder = this.dialog.open(DeleteCommomComponent, {
      data: { data, type: type },
    });
    deleteorder.afterClosed().subscribe((result: any) => {
      this.loadUserGroups(10, 1, '');
      this.loadUsers(20, 1, '');
      this.loadUserGroupsTarget(10, 1, '');
    });
  }

  showUserList(group:any) {
    if (group.dynamicGroupId == null) {
      const GroupId = group.id;
      this.manageUserService.getGroupUserService(GroupId).subscribe((data) => {
        if (data) {
          this.userList = data;
        }
      });
    } else {
      const GroupId = group.dynamicGroupId;
      this.manageUserService .getDynamicGroupUserService('Users', GroupId) .subscribe((data) => {
          if (data) {
            this.userList = data;
          }
        });
    }
  } 

  toggleShow(i:any) {
    this.isShown = !this.isShown;
    this.index = i;
  }
  closedialogbox() {
    this.dialog.closeAll();
  }

  // openTargetMonths(target: UserGroupTarget) {
  //   this.dialog.open(TargetMonthComponent, {
  //     disableClose: true,
  //     width: '500px',
  //     data: {data: target}
  //   });

  // }
  getUserGroups(row:any) {
    this.manageUserService.getUserGroups(row.id).subscribe((result: any) => {
      console.log('u8serssss', result);
      if (result) {
        this.dialog.open(TargetYearComponent, {
          disableClose: true,
          width: '700px',
          data: { data: result, type: 'Users', target: row },
        });
      }
    });
  }

  openTargetUser(target: any) {
    console.log('target', target);
    const id = target.id;
    const entity = target.targetAssignee;
    const targetType = target.targetType;
    const valueType = target.targetValueType;
    const startdate = target.startDate;
    const enddate = target.endDate;

    this.manageUserService
      .fetchusersAchievedAmountService(
        entity,
        targetType,
        valueType,
        id,
        startdate,
        enddate
      )
      .subscribe((result: any) => {
        console.log(result);
        let data = { id, entity, targetType, valueType, startdate, enddate };
      });
  }

  updateuserDialog(row:any) {
    const UpdateUserDialog = this.dialog.open(CreateUserComponent, {
      data: { screenType: 'UpdateUser', data: row },
      disableClose: true,
      width: '500px',
    });
    UpdateUserDialog.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }

  checkbox() {
    this.checked = true;
  }

  dropdowntagvalue(i:any) {
    this.selectedtagvalue = i;
  }

  ngOnDestroy() {
    this.mapeventsubcription.unsubscribe();
  }

  // exportData
  exportData() {
    this.dialog.open(ExportDataManageAllComponent, {
      disableClose: true,
      data: { type: 'Users' },
      width: '700px',
    });
  }
  // Search
  AdvanceSearchSingle() {
    const AdvanceSearch = this.dialog.open(
      AdvanceSearchInManagementSingleComponent,
      {
        disableClose: true,
        data: { type: 'Users' },
        width: '600px',
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
        data: { type: 'Users' },
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
      data: { type: 'Users' },
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

 

  createtargetfilterparams(data:any, EntityType:any, pagenumber:any, NumberOfRecord:any) {
    console.log(data);
    console.log(EntityType);
    let params = new HttpParams()
      .set('NumberOfRecord', NumberOfRecord)
      .set('PageNumber', pagenumber);
    data.forEach((element:any) => {
      if(element.name=='EndDate'||element.name=='StartDate'){
        const date:any=this.datepipe.transform(element.value, 'dd-MMM-yyyy')
        params = params.set(element.name, date);
      }else{
      params = params.set(element.name, element.value);
      }
    });
    console.log(params.toString()); // Log the parameters for debugging
    return params;
  }

  removeSearch(value:any, index:any) {
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
      this.loadUsers(20, 1, '');
    } else if(this.tabnumber == 1) {
      this.loadUserGroups(20, 1, '');
    }
    
  }

  removekeyword(value:any,index:any){
    if (value.name === 'StatusOfTransaction') {
      this.transactionStatus = 'None';
    }
    this.ListOftragetfiltervalues.splice(index, 1);
    if(this.ListOftragetfiltervalues.length!=0){
      this.TargetAdvanceFilter(this.ListOftragetfiltervalues,1,20)
      this.changeDetectorRefs.detectChanges();
    }else{
      this.loadUserGroupsTarget(10, 1, '');
    }
    if(this.isMobileView == false) {
      this.displayedItems = this.ListOftragetfiltervalues.slice(this.startIndex, this.startIndex + 5);
    } else if (this.isMobileView == true) {
      this.displayedItems = this.ListOftragetfiltervalues.slice(this.startIndex, this.startIndex + 1);
    }
  }

  TargetAdvanceFilter(data:any, pagenumber:any, NumberOfRecord:any) {
    const params = this.createtargetfilterparams(data,'Users',pagenumber,NumberOfRecord);
    this.manageContactsService.TargetAdvanceFilter(params) .subscribe((result: any) => {
        if (result) {
          let data = result.data.map((data:any) => {
            data.screen = 'users';
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
          this.userGroupsTargets = data;
          this.userGroupTargetsDataSource = new MatTableDataSource(data);
          console.log("advanceee", this.userGroupsTargets)
          this.tabledata = data;
          this.userGroupTargetsDataSource.paginator = this.paginator;
          this.userGroupTargetsDataSource.sort = this.sort;
          this.showicon = true;
          this.TargetLength = result.totalItems
          this.calculateTotalTargetValue()
        }
        
        if(this.isMobileView == false) {
          this.displayedItems = this.ListOftragetfiltervalues.slice(this.startIndex, this.startIndex + 5);
        } else if (this.isMobileView == true) {
          this.displayedItems = this.ListOftragetfiltervalues.slice(this.startIndex, this.startIndex + 1);
        }
      });
  }

  // three point icon
  // createTarget
  createTarget(data:any, type:any, state:any, screenType:any) {
    this.closedialogbox();
    const createAndUpdateTarget = this.dialog.open(TargetCreateComponent, {
      disableClose: true,
      data: {
        data: data,
        type: type,
        state: state,
        screenType: screenType,
      },
      width: '500px',
    });
    createAndUpdateTarget.afterClosed().subscribe((result: any) => {
      if (result) {
        setTimeout(() => {
          this.loadUserGroupsTarget(10, 1, '');
        }, 100);
      }
    });
  }

  //view Target
  viewTarget(data:any) {
    this.closedialogbox();
    const createAndUpdateTarget = this.dialog.open(ViewTargetComponent, {
      disableClose: true,
      data: {
        data: data,
      },
      width: '500px',
    });
  }

  gettargetvalue() {
    setTimeout(() => {
      if (this.tabnumber === 0) {
        this.singleSearchValue = null;
        this.loadUsers(20, 1, '');
      } else if (this.tabnumber === 1) {
        this.quickSearchValue = null;
        this.loadUserGroups(10, 1, '');
      } else if (this.tabnumber === 2) {
        this.targetSearchValue = null;
        this.loadUserGroupsTarget(10, 1, '');
      }
    }, 10000);
  }

  // AddFile
  AddFile(row:any, type:any) {
    this.dialog.open(AddFileComponent, {
      disableClose: true,
      width: '500px',
      data: {
        data: row,
        attachmentLevel: 'Users',
        ismanage: true,
        type: type,
      },
      panelClass: ['addFiles'],
    });
  }
  // AddNote
  AddNote(row:any, type:any) {
    this.dialog.open(AddNotesComponent, {
      disableClose: true,
      data: {
        data: row,
        attachmentLevel: 'Users',
        ismanage: true,
        type: type,
      },
      width: '600px',
      panelClass: ['addNotes'],
    });
  }
  AddToGroupDialog(row:any) {
    this.dialog.open(SingleToGroupConvertComponent, {
      disableClose: true,
      data: { data: row, Entity: 'Users' },
      width: '500px',
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

  // openAddEventDialog
  openAddEventDialog() {
    this.dialog.open(CreateEventComponent, {
      width: '500px',
      autoFocus: false,
      data: { screenType: 'CreateEvent' },
      disableClose: true,
      panelClass: 'custom-dialog-container',
    });
  }
  // ActivityReport
  ActivityReport(data:any, value:any) {
    this.dialog.open(GraphFilterComponent, {
      width: '500px',
      autoFocus: false,
      disableClose: true,
      data: { data, Name: 'Users', single: value, management: true },
    });
  }
  // CreateStratergy
  CreateStratergy() {
    this.dialog.open(CreateStrategyComponent, {
      width: '600px',
      autoFocus: false,
      disableClose: true,
    });
  }

  // -----------------------------
  Editpermission(templateRef: TemplateRef<any>, data:any) {
    this.userdata = data;
    this.permissionService
      .getUserPermission(data.id)
      .subscribe((result: any) => {
        if (result.length == 0) {
          this.showchooseOption = false;
        } else {
          this.showchooseOption = true;
          this.userPermissiondata = result;
        }
      });
    this.dialog.open(templateRef, {
      width: '400px',
    });
  }
  UpdatePermissionForChooseOption() {
    this.dialog.open(PermissionApplyEditComponent, {
      width: '700px',
      autoFocus: false,
      disableClose: true,
      data: {
        data: this.userdata,
        type: this.ChooseOption,
        screenType: 'UpdatePermission',
      },
    });
    setTimeout(() => {
      this.ChooseOption = '';
    }, 1000);
  }

  popupforerrormessage(message:any, header:any) {
    this.dialog.open(PopupErrorMessageComponent, {
      width: '600px',
      data: { message: message, header: header },
      autoFocus: false,
      disableClose: true,
    });
  }

  calculateTotalTargetValue(): void {
    this.totalTargetValue = this.userGroupsTargets.reduce((acc, obj) => acc + obj.targetValue, 0);
    this.achivedTargetValue = this.userGroupsTargets.reduce((acc, obj) => acc + obj.totalAchievedValue, 0);
  }

  getListofassignes(data:any){
    return data.Listofassignes=data.Listofassignes+3
  }
  getassigned(value:any,data:any){
    if(value.Listofassignes==0){
      const firstThreeObjects = data.slice(0, 3);
      return firstThreeObjects
    }else if(value.Listofassignes==3){
      const secondThreeObjects = data.slice(3, 6);
      return secondThreeObjects
    }else if(value.Listofassignes==6){
      const thirdThreeObjects = data.slice(6, 9);
      return thirdThreeObjects
    }
  }

  RoundAmount (value:any) {
    if(!Number.isNaN(value)) {
      return value.toFixed(2)
    } else {
      return 0;
    }
    
  }
}
