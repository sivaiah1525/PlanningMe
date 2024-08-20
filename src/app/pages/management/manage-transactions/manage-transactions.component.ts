import {
  Component,
  OnInit,
  Inject,
  ViewChild,
  ChangeDetectionStrategy,
  TemplateRef,
  ChangeDetectorRef,
  PipeTransform,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';
import { Transaction } from '../../../core/models/transaction.model';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ManageTransactionsService } from '../../../core/services/manage-transactions.service';
import { MatTableDataSource } from '@angular/material/table';
import { TransactionDetailsComponent } from './transaction-details/transaction-details.component';
import { SpinnerService } from '../../../core/services/spinner.service';
import { ResizeService } from '../../../core/services/resize.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MessageService } from 'src/app/core/services/message.service';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ManageContactsService } from 'src/app/core/services/manage-contacts.service';
import { ManageUsersService } from 'src/app/core/services/manage-users.service';
import { ManageSitesService } from 'src/app/core/services/manage-sites.service';
import { ManageProductsService } from 'src/app/core/services/manage-products.service';
import { Observable } from 'rxjs';
import { User } from 'src/app/core/models/user.model';
import { Contact } from 'src/app/core/models/contact.model';
import { Product } from 'src/app/core/models/product.model';
import { Site } from 'src/app/core/models/site.model';
import { PaymentType } from 'src/app/core/models/payment-type.model';
import { ManagetransactionService } from './managetransaction.service';
import { ViewdetailsComponent } from './orderQuotes/viewdetails/viewdetails.component';
import { AddOrderComponent } from './orderQuotes/add-order/add-order.component';
import { StrategyService } from 'src/app/core/services/strategy.service';
import { PdfViewComponent } from './orderQuotes/pdf-view/pdf-view.component';
import { CreateStrategyComponent } from 'src/app/core/components/create-strategy/create-strategy.component';
import { GraphFilterComponent } from '../../graph/components/graph-filter/graph-filter.component';
import { CreateEventComponent } from '../../calendar/create-event/create-event.component';
import { AddNotesComponent } from '../../files/components/add-notes/add-notes.component';
import { AddFileComponent } from '../../files/components/add-file/add-file.component';
import { CreateDiscountComponent } from './Discount/create-discount/create-discount.component';
import { SelectDiscountComponent } from './Discount/select-discount/select-discount.component';
import { ExportDataManageAllComponent } from '../manage-products/export-data-manage-all/export-data-manage-all.component';
import { ViewDiscountDetailsComponent } from './Discount/view-discount-details/view-discount-details.component';
import { DeleteCommomComponent } from '../../commonForAll/delete-commom/delete-commom.component';
import { CreateTransactionComponent } from '../manage-create/create-transaction/create-transaction.component';
import { TransationEditComponent } from './transation-edit/transation-edit.component';
import { DiscountHistoryComponent } from './Discount/discount-history/discount-history.component';
import { CheckOrganationTypeService } from 'src/app/core/services/check-organation-type.service';
import { PopupErrorMessageComponent } from 'src/app/popup-error-message/popup-error-message.component';
import { TranslateService } from '@ngx-translate/core';
import { MatomoService } from 'src/app/core/services/matomo-service.service';
import { DynamicKeywordsComponent } from 'src/app/core/components/keywords/dynamic-keywords/dynamic-keywords.component';
import { AdvanceSearchInManagementSingleComponent } from '../advanceSearch/advance-search-in-management-single/advance-search-in-management-single.component';
@Component({
  selector: 'app-manage-transactions',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './manage-transactions.component.html',
})
export class ManageTransactionsComponent implements OnInit, PipeTransform {
  @ViewChild(MatPaginator, { static: true })
  paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true })
  sort!: MatSort;
  // @ViewChild('MatSort', { static: true }) el: MatSort;
  TransactionType = [
    { name: 'Buy', id: 1 },
    { name: 'Sale', id: 2 },
  ];
  Currency = [
    { name: 'Euro', id: 1 },
    { name: 'Dollar', id: 2 },
  ];
  transactionColumns!: any;
  datadelete: any;
  id: any;
  datadeleteindex: any;
  transactionsdata: any;
  transactionsGroups: any;
  isShown: boolean = false;
  index: any;
  traniddata: any;
  users$!: Observable<User[]>;
  contacts$!: Observable<Contact[]>;
  products$!: Observable<Product[]>;
  sites$!: Observable<Site[]>;
  paymentTypes$!: Observable<PaymentType[]>;
  userDataLength = 0;
  TransationDataLength = 0;
  singleSearchValue = null;
  orderSearchValue = null;
  siglefilter = '';
  multiplefilter = '';
  showicon: boolean = false;
  mapeventsubcription: any;
  Freefeild = {};
  viewnumeral = {};
  dropdownfeild = {};
  tagViewModels = [];
  viewtagmodel = {};
  checked: any;
  selectedtagvalue: any;
  tabnumber!: number;

  discountDetails: any;
  discountDataSource: any;
  discountColumns!: string[];
  // order&quotes
  OrderQuotedata: any;
  OrderQuotedataSource: any;
  ordercolumns: any;
  orderuserDataLength = 0;
  orderdataId: any;
  orderindex: any;
  typecheck: boolean = false;
  search = null;
  NumberOfRecord: number = 20;
  PageNumber: any = 1;
  discountSearchValue: any;
  dicountdata: any;
  discountindex: any;
  discountCheck: any;
  // AdvanceSearchForm
  AdvanceSearchForm!: FormGroup;
  finalData = {};
  orderfilter: any;
  ordersearchfilter = '';
  searchselactvalue: any;
  QuoteToOrderChangeData: any;

  Statusvalue = [
    { name: 'Pending', value: 0 },
    { name: 'Validated', value: 1 },
    { name: 'Cancelled', value: 2 },
  ];
  TransactionTypevalue = [
    { name: 'Sale', value: 2 },
    { name: 'Buy', value: 1 },
  ];
  keywords: string[] = [];
  AdminStatus: any;
  transationCreateStatus: any;
  DemoOrganationstatus: boolean = false;
  SearchResult: any = [];
  StockQuantity: number = 0;
  StockTotalPrice: number = 0;
  SearchTransaction: any = [];
  SearchOrderResult: any = [];
  transactionLength: any;
  OrdersTotalPrice:  number = 0;
  startIndex: number = 0;
  displayedItems: any[] = [];
  PageType: any;
  isMobileView:any
  size:any
  width!:number
  transactionDataSource!: MatTableDataSource<unknown>;
  loadder!: boolean;

  constructor(
    // @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog,
    private manageContactsService: ManageContactsService,
    private manageUsersService: ManageUsersService,
    private manageSitesService: ManageSitesService,
    private manageProductssService: ManageProductsService,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private manageTransactionService: ManageTransactionsService,
    public snackBar: MatSnackBar,
    public spinner: SpinnerService,
    private strategyservice: StrategyService,
    private resizeService: ResizeService,
    private managetransactionsservice: ManagetransactionService,
    private changeDetectorRefs: ChangeDetectorRef,
    public OrgSrvice: CheckOrganationTypeService,
    private translate: TranslateService,
    private matoService: MatomoService
  ) {
    this.matoService.trackPageView('Management-Transactions');
    if(localStorage.getItem('lang')){
      const lang:any=localStorage.getItem('lang')
      this.translate.use(lang);
    }else{
      this.translate.use('English');
    }
    if (localStorage.getItem('isTrailVersion') == 'true') {
      this.popupforerrormessage(
        'You are using trail account so you are able to create 10 orders (max 10 transactions per order)',
        'Orders '
      );
    }
    if (this.OrgSrvice.checkOrganationType().DemoOrganation == 'true') {
      this.DemoOrganationstatus = true;
      console.log(this.OrgSrvice.checkOrganationType());
      const data :any= this.OrgSrvice.messagesandheader('Transactions');
      this.popupforerrormessage(data.message, data.header);
    }
    this.AdminStatus = localStorage.getItem('isAdmin');
    this.transationCreateStatus = localStorage.getItem('TransactionsCreation');
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
    // resizing the screen table column changed
    this.resizeService.size$.subscribe((user:any) => {
      this.size = user.size;
      if (this.size < 992) {
        this.isMobileView = true;
        this.transactionColumns = ['A', 'B', 'C', 'Discount', 'orderId'];
        this.ordercolumns = ['A', 'B', 'C', 'orderId'];
        this.discountColumns = ['options', 'DiscountName'];
      } else {
        this.isMobileView = false;
        this.transactionColumns = [
          'A',
          'B',
          'C',
          'Discount',
          'orderId',
          'quantity',
          'unitPrice',
          'finalPrice',
          'transactionDate',
          'siteName',
          'productName',
        ];
        this.ordercolumns = [
          'A',
          'B',
          'C',
          'orderId',
          'totalAmount',
          'issueDate',
          'dueDate',
          'siteName',
          'clinetName',
        ];
        this.discountColumns = [
          'options',
          'DiscountName',
          'Discountcode',
          'ExpiredDate',
          'createdDate',
          'DiscountDescription',
          'DiscountStatus',
        ];
      }
    });
    this.width = window.innerWidth;
    if (!this.size && this.width < 992) {
      this.isMobileView = true;
      this.transactionColumns = ['A', 'B', 'C', 'Discount', 'orderId'];
      this.ordercolumns = ['A', 'B', 'C', 'orderId'];
      this.discountColumns = ['options', 'DiscountName'];
    } else if (!this.size && this.width > 992) {
      this.isMobileView = false;
      this.transactionColumns = [
        'A',
        'B',
        'C',
        'Discount',
        'orderId',
        'quantity',
        'unitPrice',
        'finalPrice',
        'transactionDate',
        'siteName',
        'productName',
      ];
      this.ordercolumns = [
        'A',
        'B',
        'C',
        'orderId',
        'totalAmount',
        'issueDate',
        'dueDate',
        'siteName',
        'clinetName',
      ];
      this.discountColumns = [
        'options',
        'DiscountName',
        'Discountcode',
        'ExpiredDate',
        'createdDate',
        'DiscountDescription',
        'DiscountStatus',
      ];
    }
    this.loadtransactions(20, 1, '');
    this.mapeventsubcription =
      this.managetransactionsservice.managetransactioncreate.subscribe(
        (data) => {
          if (data == true) {
            this.loadtransactions(20, 1, '');
          }
        }
      );
    this.tabnumber = 0;
  }

  tabChange(tabIndex: number): void {
    console.log(tabIndex);
    this.tabnumber = tabIndex;
    this.closesearch(tabIndex);
    if (tabIndex === 0) {
      this.loadtransactions(20, 1, '');
    } else if (tabIndex === 1) {
      this.getOrderQuote(20, 1, '');
    } else if (tabIndex === 2) {
      this.getDiscounts('', 20, 1);
    }
  }
  nextTransation(e:any) {
    this.loadtransactions(20, e.pageIndex + 1, '');
  }
  nextorder(e:any) {
    this.getOrderQuote(20, e.pageIndex + 1, '');
  }
  nextDiscount(e:any) {
    this.getDiscounts('', 20, e.pageIndex + 1);
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
      if (this.startIndex + 5 < this.SearchTransaction.length && this.isMobileView == false) {
        this.startIndex += 5;
      } else if (this.startIndex + 1 < this.SearchTransaction.length && this.isMobileView == true) {
        this.startIndex += 1;
      }
    }
    if(this.isMobileView == false) {
     this.SearchTransaction.slice(this.startIndex, this.startIndex + 5);
    } else if (this.isMobileView == true) {
     this.SearchTransaction.slice(this.startIndex, this.startIndex + 1);
    }
  }

  // fetch transaction details
  loadtransactions(size:any, pagenumber:any, siglefilter:any) {
    this.loadder = true;
    this.manageTransactionService
      .fetchTransactionsServices(size, pagenumber, siglefilter)
      .subscribe((result: any) => {
        if (result) {
          this.loadder = false;
          this.transactionsdata = result.data;
          this.TransationDataLength = result.totalItems;
          this.transactionDataSource = new MatTableDataSource(
            this.transactionsdata
          );
          this.transactionDataSource.paginator = this.paginator;
          this.TransationDataLength = result.totalItems;
          this.transactionDataSource.sort = this.sort;
          this.TransationDataLength = result.totalItems;
        }
      });
  }

  // Search
  AdvanceSearchSingle() {
    const AdvanceSearch = this.dialog.open(
      AdvanceSearchInManagementSingleComponent,
      {
        disableClose: true,
        data: { type: 'Transaction' },
        width: '500px',
      }
    );
    AdvanceSearch.afterClosed().subscribe((result: any) => {
      if (result) {
        this.SearchResult.push(result);
        this.showicon = true;
        this.applyDiscountsFilter(result);
      }
    });
  }

  getOrderQuote(size:any, pagenumber:any, siglefilte:any) {
    this.loadder = true;
    this.manageContactsService
      .getOrderQuote(size, pagenumber, siglefilte)
      .subscribe((data: any) => {
        if (data) {
          this.loadder = false;
          this.OrderQuotedata = data.data;
          this.orderuserDataLength = data.totalItems;
          this.OrderQuotedataSource = new MatTableDataSource(
            this.OrderQuotedata
          );
          this.OrderQuotedataSource.paginator = this.paginator;
          this.changeDetectorRefs.detectChanges();
          this.OrderQuotedataSource.sort = this.sort;
        }
      });
  }

  applyFilter(filterValue: string): void {
    this.siglefilter = filterValue;
    this.loadtransactions(20, 1, this.siglefilter);
    this.showicon = true;
  }
  applyDiscountsFilter(filterValue: string) {
    this.multiplefilter = filterValue;
    this.getDiscounts(this.multiplefilter, 20, 1);
    this.showicon = true;
  }

  closesearch(value:any) {
    this.showicon = false;
    console.log(value);
    if (value == 'single') {
      this.singleSearchValue = null;
      this.SearchTransaction.splice(0, this.SearchTransaction.length);
      this.loadtransactions(20, 1, '');
    } else if (value == 'orders') {
      this.orderSearchValue = null;
      this.SearchOrderResult.splice(0, this.SearchOrderResult.length);
      this.getOrderQuote(20, 1, '');
    } else if (value == 'multiple') {
      this.discountSearchValue = null;
      this.SearchResult.splice(0, this.SearchResult.length);
      this.getDiscounts('', 20, 1);
    }
  }

  viewdiscountForTransation(transaction:any, value1:any, value2:any, value3:any) {
    if (this.tabnumber == 0) {
      this.dialog.open(TransactionDetailsComponent, {
        disableClose: true,
        data: {
          data: transaction,
          public: value1,
          private: value2,
          external: value3,
          type: 'discounttable',
        },
        width: '600px',
      });
    } else if (this.tabnumber == 1) {
      this.dialog.open(ViewdetailsComponent, {
        disableClose: true,
        data: {
          data: transaction,
          public: value1,
          private: value2,
          external: value3,
          type: 'discounttable',
        },
        width: '600px',
      });
    }
  }

  // user detail & user group detail
  openTransactionDialog(data:any): void {
    this.dialog.open(TransactionDetailsComponent, {
      disableClose: true,
      data: { data: data, type: 'transation' },
      width: '500px',
    });
  }

  VieworderDialog(data: any): void {
    this.dialog.open(ViewdetailsComponent, {
      disableClose: true,
      data: { data: data, type: 'OrderQuote' },
      width: '500px',
    });
  }
  CreateduplicateOrder(data: any) {
    const createOrder = this.dialog.open(AddOrderComponent, {
      data: { data: data, screenType: 'CreateduplicateOrder' },
      width: '500px',
    });
    createOrder.afterClosed().subscribe((result) => {
      if (result) {
        this.getOrderQuote(20, 1, this.ordersearchfilter);
      }
    });
  }

  EditorderDialog(data: any): void {
    const UpdateOrder = this.dialog.open(AddOrderComponent, {
      data: { data: data, screenType: 'EditOrder' },
      width: '500px',
    });
    UpdateOrder.afterClosed().subscribe((result) => {
      if (result) {
        this.getOrderQuote(20, 1, this.ordersearchfilter);
      }
    });
  }
  addorder(): void {
    const createOrder = this.dialog.open(AddOrderComponent, {
      disableClose: true,
      data: { screenType: 'CreateOrder' },
      width: '500px',
    });
    createOrder.afterClosed().subscribe((result) => {
      if (result) {
        this.getOrderQuote(20, 1, this.ordersearchfilter);
      }
    });
  }
  ViewPdf(row:any) {
    this.dialog.open(PdfViewComponent, {
      disableClose: true,
      data: row,
      width: '800px',
    });
  }

  AddFile(row:any, type:any) {
    this.dialog.open(AddFileComponent, {
      disableClose: true,
      data: {
        data: row,
        attachmentLevel: 'Orders',
        ismanage: true,
        type: type,
      },
      width: '500px',
      panelClass: ['addFiles'],
    });
  }
  AddNote(row:any, type:any) {
    this.dialog.open(AddNotesComponent, {
      disableClose: true,
      data: {
        data: row,
        attachmentLevel: 'Orders',
        ismanage: true,
        type: type,
      },
      width: '600px',
      panelClass: ['addNotes'],
    });
  }
  // openAddEventDialog
  openAddEventDialog() {
    this.dialog.open(CreateEventComponent, {
      width: '500px',
      height: '500px',
      autoFocus: false,
      disableClose: true,
    });
  }
  // ActivityReport
  ActivityReport() {
    this.dialog.open(GraphFilterComponent, {
      width: '500px',
      height: '500px',
      autoFocus: false,
      disableClose: true,
    });
  }
  // CreateStratergy
  CreateStratergy() {
    this.dialog.open(CreateStrategyComponent, {
      width: '500px',
      autoFocus: false,
      disableClose: true,
    });
  }

  toggleShow(i:number) {
    this.isShown = !this.isShown;
    this.index = i;
  }

  updatetransactionDialog(data:any) {
    const Createduplicatefortranction = this.dialog.open(
      TransationEditComponent,
      {
        width: '500px',
        data: { data: data, screenType: 'UpdateTransation' },
        autoFocus: false,
        disableClose: true,
      }
    );
    Createduplicatefortranction.afterClosed().subscribe((result) => {
      if (result) {
        this.loadtransactions(20, 1, this.siglefilter);
      }
    });
  }
  checkbox() {
    this.checked = true;
  }

  dropdowntagvalue(i:number) {
    console.log(i);
    this.selectedtagvalue = i;
  }
  ngOnDestroy() {
    this.mapeventsubcription.unsubscribe();
  }

  closedialogbox() {
    this.dialog.closeAll();
    this.ngOnInit();
  }

  ShowDiscountHistory(row:any) {
    const discountHistory = this.dialog.open(DiscountHistoryComponent, {
      data: { data: row, screenType: 'DiscountHistory' },
      width: '900px',
      autoFocus: false,
      disableClose: true,
    });
    discountHistory.afterClosed().subscribe((result) => {
      if (result) {
        this.getDiscounts('', 20, 1);
        console.log(result);
      }
    });
  }

  ShowDiscountMatrix(row:any) {
    const discountHistory = this.dialog.open(DiscountHistoryComponent, {
      data: { data: row, screenType: 'DiscountMatrix' },
      width: '900px',
      autoFocus: false,
      disableClose: true,
    });
    discountHistory.afterClosed().subscribe((result) => {
      if (result) {
        this.getDiscounts('', 20, 1);
        console.log(result);
      }
    });
  }

  createDiscount() {
    const createDiscount = this.dialog.open(CreateDiscountComponent, {
      data: { Create: true },
      width: '500px',
      autoFocus: false,
      disableClose: true,
    });
    createDiscount.afterClosed().subscribe((result) => {
      if (result) {
        this.getDiscounts('', 20, 1);
        console.log(result);
      }
    });
  }
  createNewTransation() {
    const createNewTransation = this.dialog.open(CreateTransactionComponent, {
      data: { Create: true },
      width: '500px',
      autoFocus: false,
      disableClose: true,
    });
    createNewTransation.afterClosed().subscribe((result) => {
      if (result) {
        this.loadtransactions(20, 1, this.siglefilter);
      }
    });
  }

  AddDiscount(row:any, name:any, type:any) {
    const AddDiscount = this.dialog.open(SelectDiscountComponent, {
      disableClose: true,
      data: { type: type, ManagenemtEntity: name, row },
      width: '500px',
    });
    AddDiscount.afterClosed().subscribe((result) => {
      if (result) {
        this.getDiscounts('', 20, 1);
      }
    });
  }

  // AddDiscount
  AddDiscount1(row:any, name:any) {
    const AddDiscount = this.dialog.open(SelectDiscountComponent, {
      disableClose: true,
      data: { ManagenemtEntity: name, row, AddDiscount: true },
      width: '500px',
    });
    AddDiscount.afterClosed().subscribe((result) => {
      if (result) {
        this.ngOnInit();
      }
    });
  }

  getDiscounts(Search:any, NumberOfRecord:any, PageNumber:any) {
    this.loadder = true;
    this.manageContactsService
      .getDiscounts(Search, NumberOfRecord, PageNumber)
      .subscribe((data: any) => {
        if (data) {
          this.loadder = false;
          this.discountDetails = data.data;
          this.userDataLength = data.totalItems;
          this.discountDataSource = new MatTableDataSource(
            this.discountDetails
          );
          this.changeDetectorRefs.detectChanges();
          this.discountDataSource.sort = this.sort;
        }
      });
  }

  filterDiscount() {
    this.showicon = true;
    if (this.discountSearchValue.trim().toLowerCase().length > 0) {
      let arr = this.discountDetails;
      arr = this.discountDetails.filter((item:any) => {
        return (
          item.name
            .toLowerCase()
            .indexOf(this.discountSearchValue.toLowerCase()) > -1 ||
          item.description
            .toLowerCase()
            .indexOf(this.discountSearchValue.toLowerCase()) > -1
        );
      });
      this.discountDataSource = arr;
    } else if (this.discountSearchValue.trim().toLowerCase().length === 0) {
      this.discountDataSource = new MatTableDataSource(this.discountDetails);
      this.changeDetectorRefs.detectChanges();
    }
  }

  // openDiscount
  openDiscount(data:any) {
    this.dialog.open(ViewDiscountDetailsComponent, {
      width: '500px',
      data: { data: data, type: 'viewdiscountdetails' },
      autoFocus: false,
      disableClose: true,
    });
  }
  // UpdateDiscount
  UpdateDiscount(data:any) {
    const UpdateDiscount = this.dialog.open(CreateDiscountComponent, {
      width: '500px',
      data: { data: data, Edit: true },
      autoFocus: false,
      disableClose: true,
    });
    UpdateDiscount.afterClosed().subscribe((result) => {
      if (result) {
        this.getDiscounts('', 20, 1);
        console.log(result);
      }
    });
  }

  // OrderQuote
  openDialogorder(templateRef: TemplateRef<any>, data:any) {
    this.dialog.open(templateRef, data);
    this.dicountdata = data;
  }

  // exportData
  exportData(name:any) {
    this.dialog.open(ExportDataManageAllComponent, {
      disableClose: true,
      data: { type: name },
      width: '700px',
    });
  }

  deleteDialogConfirmation(data:any, type:any) {
    const deleteorder = this.dialog.open(DeleteCommomComponent, {
      data: { data, type: type },
    });
    deleteorder.afterClosed().subscribe((result: any) => {
      if (result) {
        this.ngOnInit();
      }
    });
  }

  QuoteToOrderChange(templateRef: TemplateRef<any>, data:any) {
    this.dialog.open(templateRef, data);
    this.QuoteToOrderChangeData = data;
  }
  ChangeQuoteToOrder() {
    console.log(this.QuoteToOrderChangeData);
    let data = {
      id: this.QuoteToOrderChangeData.id,
      OrderQuoteStatus: 1,
    };
    this.manageTransactionService
      .updatestatusforOrderAndQuote(data)
      .subscribe((result) => {
        if (result) {
          this.getOrderQuote(20, 1, '');
          this.closedialogbox();
        }
      });
  }

  Searchfilter() {
    this.getOrderQuote(20, 1, this.orderSearchValue);
    this.showicon = true;
  }

  download(row:any) {
    this.strategyservice.data(row);
    this.snackBar.open(' PDF Loding......', ' ', {
      duration: 3000,
      panelClass: 'my-custom-snackbar',
    });
  }

  searchbox(templateRef: TemplateRef<any>, type:any) {
    this.PageType = type
    this.dialog.open(templateRef);
    this.AdvanceSearchForm = this.formBuilder.group({
      Search: [''],
      PageNumber: [1],
      NumberOfRecord: [20],
      TransactionTypeId: new FormArray([]),
      StatusOfTransaction: new FormArray([]),
    });
  }
  advancesearchtransaction(event:any, x:any) {
    const formArray: FormArray = this.AdvanceSearchForm.get(
      'TransactionTypeId'
    ) as FormArray;
    if (event.checked) {
      formArray.push(new FormControl(x.value));
    } else {
      let i: number = 0;
      formArray.controls?.forEach((ctrl: any) => {
        if (ctrl.value == x.value) {
          // Remove the unselected element from the TransactionTypeId
          formArray.removeAt(i);
          return;
        }

        i++;
      });
    }
  }

  advancesearchinpaymentStatus(event:any, x:any) {
    const formArray: FormArray = this.AdvanceSearchForm.get(
      'StatusOfTransaction'
    ) as FormArray;
    if (event.checked) {
      formArray.push(new FormControl(x.value));
    } else {
      let i: number = 0;
      formArray.controls.forEach((ctrl: any) => {
        if (ctrl.value == x.value) {
          // Remove the unselected element from the StatusOfTransaction
          formArray.removeAt(i);
          return;
        }

        i++;
      });
    }
  }

  AdvanceSearch() {
    if (this.tabnumber == 0) {
      const values = Object.entries(this.AdvanceSearchForm.value).map(
        ([key, value]) => ({ [key]: value })
      );

      // Transforming the data into the desired format
      const unwantedNames = ['PageNumber', 'NumberOfRecord'];
      const ListOftragetfiltervalues = values
        .map((obj) => {
          const key = Object.keys(obj)[0];
          const value = obj[key];
          return { name: key, value: value };
        })
        .filter(
          (item) =>
            !unwantedNames.includes(item.name) &&
            !(Array.isArray(item.value) && item.value.length === 0)
        );

      console.log(ListOftragetfiltervalues);
      let filteredArray = ListOftragetfiltervalues.filter((element:any) => {
        // Check conditions for filtering
        if ( element.value != null ||element.value != false || element.value != undefined
        ) {
          return true; // Include element in filtered result
        }

        return false;
      });

      this.SearchTransaction = filteredArray;
      let filtersObject :any= {};

      this.SearchTransaction.forEach((item:any) => {
        filtersObject[item.name] = item.value;
      });
      this.manageTransactionService
        .fetchTransactionsServiceForAdvanceSearch(20, 1, filtersObject)
        .subscribe((result: any) => {
          if (result) {
            this.dialog.closeAll();
            this.showicon = true;
            this.transactionsdata = result.data;
            this.transactionDataSource = new MatTableDataSource(
              this.transactionsdata
            );
            this.transactionDataSource.sort = this.sort;
            this.transactionLength = result.totalItems;
            this.calculateListTransaction();
            this.changeDetectorRefs.detectChanges();
          }
        });
        if(this.isMobileView == false) {
          this.SearchTransaction.slice(this.startIndex, this.startIndex + 5);
         } else if (this.isMobileView == true) {
          this.SearchTransaction.slice(this.startIndex, this.startIndex + 1);
         }
    } else if (this.tabnumber == 1) {
      const values = Object.entries(this.AdvanceSearchForm.value).map(
        ([key, value]) => ({ [key]: value })
      );

      // Transforming the data into the desired format
      const unwantedNames = ['PageNumber', 'NumberOfRecord'];
      const ListOftragetfiltervalues = values
        .map((obj) => {
          const key = Object.keys(obj)[0]; // Get the key of the object
          const value = obj[key]; // Get the value associated with that key
          return { name: key, value: value };
        })
        .filter(
          (item) =>
            !unwantedNames.includes(item.name) &&
            !(Array.isArray(item.value) && item.value.length === 0)
        );

      console.log(ListOftragetfiltervalues);
      let filteredArray = ListOftragetfiltervalues.filter((element:any) => {
        // Check conditions for filtering
        if (
          element.value != null ||
          element.value != '' ||
          element.value != false ||
          element.value != undefined
        ) {
          return true; // Include element in filtered result
        }

        return false;
      });
      this.SearchOrderResult = filteredArray;
      let filtersObjects :any= {};

      this.SearchOrderResult.forEach((item:any) => {
        filtersObjects[item.name] = item.value;
      });
      this.manageTransactionService
        .fetchOrderQuoteForAdvanceSearch(20, 1, filtersObjects)
        .subscribe((result: any) => {
          if (result) {
            this.dialog.closeAll();
            this.showicon = true;
            this.OrderQuotedata = result.data;
            this.OrderQuotedataSource = new MatTableDataSource(
              this.OrderQuotedata
            );

            this.OrderQuotedataSource.sort = this.sort;
            this.orderuserDataLength = result.totalItems;
            this.calculateListTransaction()
            this.changeDetectorRefs.detectChanges();
          }
        });
    }
  }

  CreateduplicateTransation(data:any) {
    const Createduplicatefortranction = this.dialog.open(
      TransationEditComponent,
      {
        width: '500px',
        data: { data: data, screenType: 'CreateduplicateTransation' },
        autoFocus: false,
        disableClose: true,
      }
    );
    Createduplicatefortranction.afterClosed().subscribe((result) => {
      if (result) {
        this.loadtransactions(20, 1, this.siglefilter);
      }
    });
  }
  keyWords(event: any, type?: string) {
    let value = type !== 'load' ? event : event;
    if (value) {
      this.keywords = value.split(',');
    } else {
      this.keywords = [];
    }
    console.log(this.keywords);
  }

  popupforerrormessage(message:any, header:any) {
    this.dialog.open(PopupErrorMessageComponent, {
      width: '600px',
      data: { message: message, header: header },
      autoFocus: false,
      disableClose: true,
      panelClass: 'custom-dialog',
    });
  }

  Createdynamickeywords() {
    const Createdynamickeywords = this.dialog.open(DynamicKeywordsComponent, {
      width: '100%',
      data: { screenType: 'create' },
      autoFocus: false,
      disableClose: true,
    });

    Createdynamickeywords.afterClosed().subscribe((result) => {
      if (result) {
        console.log(result);
      }
    });
  }

  removeSearch(value:any, index:any) {
    this.SearchTransaction.splice(index, 1);
    this.SearchOrderResult.splice(index, 1);
    console.log(this.SearchTransaction);

    if (this.SearchTransaction.length != 0 && this.tabnumber == 0) {
      let filtersObject :any= {};
      this.SearchTransaction.forEach((item:any) => {
        filtersObject[item.name] = item.value;
      });
      this.manageTransactionService
        .fetchTransactionsServiceForAdvanceSearch(20, 1, filtersObject)
        .subscribe((result: any) => {
          if (result) {
            console.log('resulttt', result);
            this.dialog.closeAll();
            this.showicon = true;
            this.transactionsdata = result.data;
            console.log('transactionssss', this.transactionsdata);
            this.transactionDataSource = new MatTableDataSource(
              this.transactionsdata
            );
            this.transactionDataSource.sort = this.sort;
            this.transactionLength = result.totalItems;
            console.log(this.transactionLength);
            this.calculateListTransaction();
            this.changeDetectorRefs.detectChanges();
          }
        });
        if(this.isMobileView == false) {
          this.SearchTransaction.slice(this.startIndex, this.startIndex + 5);
         } else if (this.isMobileView == true) {
          this.SearchTransaction.slice(this.startIndex, this.startIndex + 1);
         }
    } else if (this.SearchOrderResult.length != 0) {
      let filtersObjects :any= {};
      this.SearchOrderResult.forEach((item:any) => {
        filtersObjects[item.name] = item.value;
      });
      this.manageTransactionService
        .fetchOrderQuoteForAdvanceSearch(20, 1, filtersObjects)
        .subscribe((result: any) => {
          if (result) {
            console.log("resultttt", result)
            this.dialog.closeAll();
            this.showicon = true;
            this.OrderQuotedata = result.data;
            this.OrderQuotedataSource = new MatTableDataSource(
              this.OrderQuotedata
            );

            this.OrderQuotedataSource.sort = this.sort;
            this.orderuserDataLength = result.totalItems;
            this.calculateListTransaction()
            this.changeDetectorRefs.detectChanges();
          }
        });
    } else {
      this.showicon = false;
      if (this.tabnumber == 0) {
        this.loadtransactions(20, 1, '');
      } else if (this.tabnumber == 1) {
        this.getOrderQuote(20, 1, '');
      } else {
        this.getDiscounts('', 20, 1);
      }
    }

    
  }

  RoundAmount (value:any) {
    if(!Number.isNaN(value)) {
      return value.toFixed(2)
    } else {
      return 0;
    }
    
  }

  calculateListTransaction() {
    this.StockQuantity = this.transactionsdata?.reduce(
      (acc:any, obj:any) => acc + obj.quantity,
      0
    );
    this.StockTotalPrice = this.transactionsdata?.reduce(
      (acc:any, obj:any) => acc + obj.finalPrice,
      0
    );

    this.OrdersTotalPrice = this.OrderQuotedata?.reduce(
      (acc:any, obj:any) => acc + obj.totalAmount,
      0
    );
  }
}
