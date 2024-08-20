import {
  Component,
  OnInit,
  ViewChild,
  ViewEncapsulation,
  HostListener,
  TemplateRef,
  ChangeDetectorRef,
} from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { AuthService } from 'src/app/core/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { CreateUserComponent } from '../management/manage-create/create-user/create-user.component';
import { CreateContactComponent } from '../management/manage-create/create-contact/create-contact.component';
import { CreateSiteComponent } from '../management/manage-create/create-site/create-site.component';
import { CreateProductComponent } from '../management/manage-create/create-product/create-product.component';
import { CreateTransactionComponent } from '../management/manage-create/create-transaction/create-transaction.component';
import { ResizeService } from '../../core/services/resize.service';
import * as signalR from '@aspnet/signalr';
import { Subject } from 'rxjs';
import {
  HubConnection,
  HubConnectionBuilder,
  LogLevel,
} from '@microsoft/signalr';
import { HttpClient } from '@angular/common/http';
import { brotliCompress } from 'zlib';
import { TransactionDetailsComponent } from '../management/manage-transactions/transaction-details/transaction-details.component';
import { EventPopUpDialog } from 'src/app/core/components/event-lists/event-lists.component';
import { AddOrderComponent } from '../management/manage-transactions/orderQuotes/add-order/add-order.component';
import { CreateEventComponent } from '../calendar/create-event/create-event.component';
import { SignalRService } from 'src/app/core/services/signal-r.service';
import { ImportedDataResultComponent } from 'src/app/core/components/imported-data-result/imported-data-result.component';
import { TranslateService } from '@ngx-translate/core';
import { PopupErrorMessageComponent } from 'src/app/popup-error-message/popup-error-message.component';
import { CheckOrganationTypeService } from 'src/app/core/services/check-organation-type.service';
import { GlobalTranslationService } from 'src/app/core/services/global-translation.service';
import { ShowBannerLimitComponent } from 'src/app/core/components/show-banner-limit/show-banner-limit.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DashboardComponent implements OnInit {
  userDetails:any;
  connectionEstablished = new Subject<Boolean>();
  // locationCordinates = new Subject<Coordinate>();
  @ViewChild('drawer', { static: false })
  drawer!: MatSidenav;
  size: any;
  panelOpenState = false;
  width: number;
  isMobileView!: boolean;
  mode!: string;
  opened!: boolean;
  list: any = [];
  color = 'red';
  data:any= [];
  sideMenus: any;
  heading :any= 'Planning';
  subheading: any;
  icon = 'event';
  hubConnection: any;
  a: any;
  userId:any;
  sortBox = false;
  notificationdata: any;
  count = 0;
  actionid: any;
  showMore = false;
  showheadingevent = false;
  showheadingTransaction = false;
  actionname: any;
  PlanningCarteActivityReports = true;
  Settingsscreen = true;
  CreateTransaction = false;
  CreateProduct = false;
  CreateSite = false;
  CreateContact = false;
  CreateUser = false;
  Adminstatus: any;
  isManager:any;
  AdminUserId: any;
  language:any
  languages :any= [];
  ShowBanner=false
  ShowBannerdetails={
    days:0,
    hours:0,
    isExpired:false
  }
  constructor(
    private router: Router,
    private dialog: MatDialog,
    private authService: AuthService,
    private resizeService: ResizeService,
    private _httpClient: HttpClient,
    private activatedRoute: ActivatedRoute,
    private SignalRService: SignalRService,
    private changeDetectorRefs: ChangeDetectorRef,
    private translate: TranslateService,
    private globaltranslate: GlobalTranslationService,
    public OrgSrvice: CheckOrganationTypeService
  ) {
    this.languages=this.globaltranslate.getAlllanguages()
   this.language=this.globaltranslate.setselectedlanguage()
   if(localStorage.getItem('lang')){
    const lang:any=localStorage.getItem('lang')
    this.translate.use(lang);
  }else{
    this.translate.use('English');
  }
  if (localStorage.getItem('heading')) {
      this.heading = localStorage.getItem('heading');
    }  

    if(localStorage.getItem('isTrailVersion')==='true'){
      this.ShowBanner=localStorage.getItem('isTrailVersion')==='true'?true:false
      if(this.ShowBanner==true){
        this.GetExpiryDate()
      }
    }
    this.resizeService.size$.subscribe((user) => {
      this.size = user.size;
      if (this.size < 992) {
        this.isMobileView = true;
      } else {
        this.isMobileView = false;
      }
    });
    this.width = window.innerWidth;
    if (!this.size && this.width < 992) {
      this.isMobileView = true;
    } else if (!this.size && this.width > 992) {
      this.isMobileView = false;
    }
    this.authService.details.subscribe((data:any) => {
      console.log(data);
    });
    this.SignalRService.connectionEstablished.subscribe((data: any) => {
      if (data) {
        console.log(data);
        this.count = this.count + 1;
        this.changeDetectorRefs.detectChanges();
      }
    });
  }

  GetExpiryDate(){
    this.authService.GetExpiryDate().subscribe((result:any)=>{
      if(result){
        this.ShowBannerdetails=result
      }
    })
  }
  gotodashboard() {
    this.router.navigate(['/home/dash/Welcome-Page']);
  }
  ngOnInit(): void {
    console.log(this.count);
    this.getNotification();
    this.Adminstatus = localStorage.getItem('isAdmin');
    this.AdminUserId = localStorage.getItem('AdminUserId');
    this.isManager=localStorage.getItem("isManager");
    this.SignalRService.connect();
    if (this.Adminstatus == 'true'||this.isManager== 'true') {
      this.sideMenus = [
        {
          title: 'Management',
          icon: 'desktop_mac',
          subMenus: [
            { title: 'Users', url: 'users', icon: 'person', color: 'red' },
            {
              title: 'Contacts',
              url: 'contacts',
              icon: 'contacts',
              color: '#6495ed',
            },
            { title: 'Sites', url: 'sites', icon: 'business', color: 'green' },
            {
              title: 'Products',
              url: 'products',
              icon: 'business_center',
              color: 'red',
            },
            {
              title: 'Transactions',
              url: 'transactions',
              icon: 'shopping_cart',
              color: '#6495ed',
            },
            {
              title: 'Tasks',
              url: 'tasks',
              icon: 'assignment_turned_in',
              color: 'green',
            },
            {
              title: 'Initiatives',
              url: 'Initiatives',
              icon: 'ballot',
              color: 'red',
            },
          ],
        },
        // Planning
        {
          title: 'Planning',
          url: '/app/home/calendar',
          icon: 'event',
          color: 'red',
        },
        //  Carte
        { title: 'Map', url: '/app/home/carte', icon: 'map', color: '#6495ed' },
        // Activity Reports
        {
          title: 'Activity Reports',
          url: '/app/home/graph',
          icon: 'bar_chart',
          color: 'green',
        },
        //  Settings
        {
          title: 'Settings',
          icon: 'construction',
          settingMenus: [
            {
              title: 'Profile',
              url: 'general',
              icon: 'featured_play_list',
              color: 'red',
            },
            {
              title: 'Parameters',
              url: 'mapping',
              icon: 'settings',
              color: 'red',
            },
            {
              title: 'Audit Log',
              url: 'Auditlog',
              icon: 'find_in_page',
              color: '#6495ed',
            },
          ],
        },
        // iles and Notes
        {
          title: 'Files and Notes',
          url: '/app/home/files',
          icon: 'file_copy',
          color: '#6495ed',
        },
      ];
      this.creatScreensAdmin();
    } else {
      this.sideMenus = [ 
        {
          title: 'Management',
          icon: 'desktop_mac',
          subMenus: [
            { title: 'Users', url: 'users', icon: 'person', color: 'red' },
            {
              title: 'Contacts',
              url: 'contacts',
              icon: 'contacts',
              color: '#6495ed',
            },
            { title: 'Sites', url: 'sites', icon: 'business', color: 'green' },
            {
              title: 'Products',
              url: 'products',
              icon: 'business_center',
              color: 'red',
            },
            {
              title: 'Transactions',
              url: 'transactions',
              icon: 'shopping_cart',
              color: '#6495ed',
            },
            {
              title: 'Tasks',
              url: 'tasks',
              icon: 'assignment_turned_in',
              color: 'green',
            },
            {
              title: 'Initiatives',
              url: 'Initiatives',
              icon: 'ballot', 
              color: 'red',
            },
          ],
        },
        // Planning
        {
          title: 'Planning',
          url: '/app/home/calendar',
          icon: 'event',
          color: 'red',
        },
        //  Carte
        { title: 'Map', url: '/app/home/carte', icon: 'map', color: '#6495ed' },
        // Activity Reports
        {
          title: 'Activity Reports',
          url: '/app/home/graph',
          icon: 'bar_chart',
          color: 'green',
        },
        //  Settings
        {
          title: 'Settings',
          icon: 'construction',
          settingMenus: [
            {
              title: 'Profile',
              url: 'general',
              icon: 'featured_play_list',
              color: 'red',
            },
            {
              title: 'Parameters',
              url: 'mapping',
              icon: 'settings',
              color: 'red',
            },
          ],
        },
        // iles and Notes
        {
          title: 'Files and Notes',
          url: '/app/home/files',
          icon: 'file_copy',
          color: '#6495ed',
        },
      ];
      this.creatScreensnotAdmin();
    }
    this.authService.getCurrentUser().subscribe((data:any) => {
      if (data) {
        this.userDetails = data;
      }
    });
    this.resizeService.size$.subscribe((user) => {
      this.size = user.size;
      if (this.size < 992) {
        this.opened = false;
        this.mode = 'over';
      } else {
        this.opened = true;
        this.mode = 'side';
      }
    });
    this.width = window.innerWidth;
    if (!this.size && this.width < 992) {
      this.opened = false;
      this.mode = 'over';
    } else if (!this.size && this.width > 992) {
      this.opened = true;
      this.mode = 'side';
    }
  }

  logout() {1
    const cookiesstatus:any = localStorage.getItem('Cookies');
    const CookiesDate1:any=localStorage.getItem('CookiesDate')
    const CookiesDate = new Date(CookiesDate1);
    console.log(CookiesDate);

    if (localStorage.getItem('DemoOrganation') === 'true') {
      this.router.navigate(['/home/dash/login']);
    } else {
      this.router.navigate(['/app/login']);
    }
    localStorage.removeItem('access_token');
    localStorage.clear();
    this.dialog.closeAll();
    localStorage.setItem('Cookies', cookiesstatus);
    const dateString = CookiesDate.toISOString();
    localStorage.setItem('CookiesDate', dateString);
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

  openCreateContact() {
    const createContactDialog = this.dialog.open(CreateContactComponent, {
      data: { screenType: 'CreateContact' },
      disableClose: true,
      width: '500px',
    });

    createContactDialog.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }

  openCreateSite() {
    const createSiteDialog = this.dialog.open(CreateSiteComponent, {
      data: { screenType: 'CreateSite' },
      disableClose: true,
      width: '500px',
    });

    createSiteDialog.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }

  openCreateProduct() {
    const createProductDialog = this.dialog.open(CreateProductComponent, {
      data: { screenType: 'Createproduct' },
      disableClose: true,
      width: '500px',
    });
    createProductDialog.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }

  openCreateTransaction() {
    const createTransactionDialog = this.dialog.open(
      CreateTransactionComponent,
      {
        disableClose: true,
        width: '500px',
      }
    );

    createTransactionDialog.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }

  openCreateOrder() {
    const openCreateOrder = this.dialog.open(AddOrderComponent, {
      data: { screenType: 'CreateOrder' },
      disableClose: true,
      width: '500px',
    });

    openCreateOrder.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }

  openCreateEvent() {
    const openAddEventDialog = this.dialog.open(CreateEventComponent, {
      width: '500px',
      autoFocus: false,
      data: { screenType: 'CreateEvent' },
      disableClose: true,
      panelClass: 'custom-dialog-container',
    });

    openAddEventDialog.afterClosed().subscribe((result) => {
      this.ngOnInit();
    });
  }

  showheading(titleheading:any) {
    console.log(titleheading);
    this.showheadingevent = false;
    this.showheadingTransaction = false;
    this.icon = titleheading.icon;
    this.heading = titleheading.title;
    this.color = titleheading.color;
    localStorage.setItem('heading', titleheading.title);  
  }

  iconandtitlestyle(value:any) {
    let data:any
    if (value == 'title') {
      if (this.isMobileView == true) {
        data= 'navbartitleMobile';
      } else if (this.isMobileView == false) {
        data= 'navbartitleWeb';
      }
    } else if (value == 'icon') {
      data= 'navbaricon';
    }
    return data
  }

  managementlist(value:any) {
    if (value === 'Management') {
      if (this.OrgSrvice.checkOrganationType().DemoOrganation === 'true') {
        console.log(this.OrgSrvice.checkOrganationType());
        const data:any = this.OrgSrvice.messagesandheader('Management');
        console.log(data);
        this.popupforerrormessage(data.message, data.header);
      }
    }
  }
  showsubheading(titleheading:any) {
    this.showheadingevent = false;
    this.showheadingTransaction = false;
    this.subheading = titleheading.title;
  }

  getNotification() {
    this.authService.getnotification().subscribe((result) => {
      console.log(result);
      if (result) {
        this.count = result['count'];
        this.notificationdata = result['notificationDtos'];
      }
    });
  }

  importtransationdetails(value:any) {
    if (value.actionName == 'Import') {
      this.authService
        .FindImportBackgroundResult(value.uniqueId)
        .subscribe((result: any) => {
          if (result) {
            this.importresult(result);
            console.log(result);
          }
        });
    }
  }

  importresult(data:any) {
    this.dialog.open(ImportedDataResultComponent, {
      disableClose: true,
      width: '500px',
      data: { data },
    });
  }

  updatenotification(data:any) {
    this.actionid = data.actionId;
    this.actionname = data.actionName;
    this.authService
      .updatenotification(this.actionname, this.actionid)
      .subscribe((result) => {});

    if (data.actionName === 'Event') {
      this.showheadingevent = true;
      this.showheadingTransaction = false;
      const dialogRef = this.dialog.open(EventPopUpDialog, {
        disableClose: true,
        width: '500px',
        data: { eventId: this.actionid },
      });
    } else if (data.actionName === 'Transaction') {
      this.showheadingTransaction = true;
      this.showheadingevent = false;
      // this.router.navigate(['/home/app/management/m/transactions']);
      this.dialog.open(TransactionDetailsComponent, {
        disableClose: true,
        data: this.actionid,
        width: '500px',
      });
    }
    this.getNotification();
  }

  logoutdialog(templateRef: TemplateRef<any>) {
    this.dialog.open(templateRef);
  }
  closedialogbox() {
    this.dialog.closeAll();
  }

  creatScreensAdmin() {
    this.CreateTransaction = true;
    this.CreateProduct = true;
    this.CreateSite = true;
    this.CreateContact = true;
    this.CreateUser = true;
  }
  creatScreensnotAdmin() {
    this.authService.FindAppliedUserDelegations().subscribe((result: any) => {
      if (result) {
        console.log(result);
        result.forEach((e:any) => {
          if (e.rightsName == 'Users Creation') {
            this.CreateUser = true;
            localStorage.setItem('UsersCreation', 'true');
          } else if (e.rightsName == 'Transactions Creation') {
            this.CreateTransaction = true;
            localStorage.setItem('TransactionsCreation', 'true');
          } else if (e.rightsName == 'Products Creation') {
            this.CreateProduct = true;
            localStorage.setItem('ProductsCreation', 'true');
          } else if (e.rightsName == 'Sites Creation') {
            this.CreateSite = true;
            localStorage.setItem('SitesCreation', 'true');
          } else if (e.rightsName == 'Contacts Creation') {
            this.CreateContact = true;
            localStorage.setItem('ContactsCreation', 'true');
          }
        });
      }
    });
  }

  selectLanguage(value: string) {
    this.language = this.languages.find((lang:any) => lang.value === value);
    localStorage.setItem('lang', this.language.value);
    window.location.reload();
  }

  popupforerrormessage(message:any, header:any) {
    this.dialog.open(PopupErrorMessageComponent, {
      width: '600px',
      data: { message: message, header: header },
      autoFocus: false,
      disableClose: true,
    });
  }


  

  showlimit(){
    this.dialog.open(ShowBannerLimitComponent, {
      width: '500px',
      autoFocus: false,
      disableClose: true,
    });
  }
}
