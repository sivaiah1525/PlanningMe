import { Component, OnInit, TemplateRef, ViewChild, PipeTransform, ChangeDetectorRef } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SelectionModel } from '@angular/cdk/collections';
import { CreateGroupComponent } from './create-group/create-group.component';
import { Product } from 'src/app/core/models/product.model';
import { ProductGroup } from 'src/app/core/models/product-group.model';
import { ManageProductsService } from 'src/app/core/services/manage-products.service';
import { ProductGroupTarget } from 'src/app/core/models/product-group-target.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarComponent } from 'src/app/core/components/snackbar/snackbar.component';
import { SpinnerService } from '../../../core/services/spinner.service';
import { ResizeService } from '../../../core/services/resize.service';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { EditProductGroupComponent } from './edit-product-group/edit-product-group.component';
import { mergeMap, toArray } from 'rxjs/operators';
import { AchievedAmount } from 'src/app/core/models/achieved-amount.model';
import { TargetYearComponent } from 'src/app/core/components/group-target/target-year/target-year.component';
import { TargetCreateComponent } from 'src/app/core/components/group-target/target-create/target-create.component';
import { MessageService } from 'src/app/core/services/message.service';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Measure } from 'src/app/core/models/measure.model';
import { Observable } from 'rxjs';
import { TargetProducts, TargetProductsGroup } from 'src/app/core/components/group-target/target-create/target.create';
import { TargetService } from 'src/app/core/services/target.service';
// import * as _ from 'lodash';
import { ManageproductService } from './manageproduct.service';
import { ManageContactsService } from 'src/app/core/services/manage-contacts.service';
import { saveAs } from "file-saver";
import { ManageUsersService } from 'src/app/core/services/manage-users.service';
import { AddFileComponent } from '../../files/components/add-file/add-file.component';
import { AddNotesComponent } from '../../files/components/add-notes/add-notes.component';
import { CreateEventComponent } from '../../calendar/create-event/create-event.component';
import { GraphFilterComponent } from '../../graph/components/graph-filter/graph-filter.component';
import { CreateStrategyComponent } from 'src/app/core/components/create-strategy/create-strategy.component';
import { ExportDataManageAllComponent } from './export-data-manage-all/export-data-manage-all.component';
import { CreateTransactionComponent } from '../manage-create/create-transaction/create-transaction.component';
import { DynamicGroupComponent } from '../manage-contacts/dynamic-group/dynamic-group.component';
import { DynamicGroupComponentEditComponent } from '../manage-contacts/dynamic-group-component-edit/dynamic-group-component-edit.component';
import { AdvanceSearchInTargetComponent } from 'src/app/core/components/group-target/advance-search-in-target/advance-search-in-target.component';
import { SelectDiscountComponent } from '../manage-transactions/Discount/select-discount/select-discount.component';
import { DeleteCommomComponent } from '../../commonForAll/delete-commom/delete-commom.component';
import { ViewDiscountDetailsComponent } from '../manage-transactions/Discount/view-discount-details/view-discount-details.component';
import { CreateProductComponent } from '../manage-create/create-product/create-product.component';
import { SingleToGroupConvertComponent } from '../manage-sites/single-to-group-convert/single-to-group-convert.component';
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
  selector: 'app-manage-products',
  templateUrl: './manage-products.component.html'
})
export class ManageProductsComponent implements OnInit, PipeTransform {
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  profilePick: any;
  profilePickid: any
  activeIndex:any;
  productColumns: string[] = [];
  size: any;
  color = 'primary';
  mode = 'indeterminate';
  value = 50;
  isMobileView: boolean | undefined;
  width: number | undefined;
  productDataSource: any;
  productSelection = new SelectionModel<Product>(true, []);
  productGroups: ProductGroup[] = [];
  productGroupsTarget: ProductGroupTarget[] = [];
  successMessage: string = '';
  productGroupTargetsDataSource: any;
  productGroupTargetsColumns: string[] = [];
  datadelete: any;
  id: any;
  datadeleteindex: any;
  productsdata: Product[] = [];
  tabledata: ProductGroupTarget[] = [];
  groupdata: any;
  groupindex: any;
  targetdatadelete: any;
  targetindex: any;
  year: any;
  isShown: boolean = false;
  productForm!: FormGroup;
  products: any;
  measures$!: Observable<Measure[]>;
  index: any;

  editgroupDialog!: MatDialogRef<EditProductGroupComponent>;
  editdynamicgroupDialog!: MatDialogRef<DynamicGroupComponentEditComponent>
  userDataLength: any;
  userList: any;

  targetCreateForm!: FormGroup;
  max: any;
  min: any;
  availableYears: any[] = [];
  productTargetlength: any;
  targetProducts: TargetProducts = new TargetProducts();
  targetProductGroup: TargetProductsGroup = new TargetProductsGroup();
  monthsBool: boolean = false;
  frequency: string = '';
  filterList: any[] = [];
  selectedOptionId: number = 0;
  targetrow: any;
  filterGroup: any[] = [];
  selectedVal: string = '';
  monthName!: Array<{ id: number, name: string, value: string }>;

  showicon: boolean | undefined;
  // quicksearch: string;
  quickSearchValue = null;
  singleSearchValue = null;
  targetSearchValue = null;
  siglefilter = '';
  singlefilter = '';
  targetfilter = '';
  mapeventsubcription: any;
  productsgrpdata: any;
  siteDataLength: any;
  checked: any;
  selectedtagvalue: null | undefined;
  tabnumber: number | undefined;
  allproduct: any;

  discountForm: FormGroup | undefined
  contactData: any;

  // contactData: any;
  discountDetails: any;
  conatctId: any;
  discountId: any;
  ProductIds = [];
  Productid: any;
  getDiscountData: any;
  AdminStatus: any;
  ProductCreationStatus: any;
  DemoOrganationstatus:boolean=false
  ListOftragetfiltervalues:any= [];
  transactionStatus: any;
  totalTargetValue: number = 0;
  achivedTargetValue: number =0 ;
  SearchResult: any= [];
  StockQuantity: number = 0;
  StockTotalPrice: number = 0;
  TargetLength: any;
  displayedItems: any[] = [];
  startIndex: number = 0;
  SearchGroupResult: any = [];

  constructor(
    private dialog: MatDialog,
    private manageProductsService: ManageProductsService,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private manageproductsService: ManageProductsService,
    public spinner: SpinnerService,
    private targetService: TargetService,
    private resizeService: ResizeService,
    private Manageproductservice: ManageproductService,
    private manageContactsService: ManageContactsService,
    private manageUserService: ManageUsersService,
    private changeDetectorRefs: ChangeDetectorRef,
    public OrgSrvice:CheckOrganationTypeService,
    private translate: TranslateService ,
    private matoService: MatomoService,
    public datepipe: DatePipe,
  ){
    this.matoService.trackPageView('Management-Product');
    if(localStorage.getItem('lang')){
      const lang:any=localStorage.getItem('lang')
      this.translate.use(lang);
    }else{
      this.translate.use('English');
    }

    if(localStorage.getItem('isTrailVersion')=='true'){
      this.popupforerrormessage('You are using trail account so you are able to create 10 Products only','Products ')
  }
    if (this.OrgSrvice.checkOrganationType().DemoOrganation == 'true') {
      this.DemoOrganationstatus=true
      console.log(this.OrgSrvice.checkOrganationType());
      const data:any=this.OrgSrvice.messagesandheader('ManagementProduct')
      this.popupforerrormessage(data.message, data.header);
    }    this.AdminStatus = localStorage.getItem("isAdmin");
    this.ProductCreationStatus = localStorage.getItem("ProductsCreation");

  }
  transform(value: any, ...args: any[]) {
    let ammount = value.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
    let ammount1 = ammount.replace(/,/g, ' ')
    return ammount1.replace('$', ' ')
  }
  ngOnInit(): void {
    // resizing the screen table column changed
    this.resizeService.size$.subscribe(
      user => {
        this.size = user.size;
        if (this.size < 992) {
          this.productColumns = ['Product', 'options', 'navigate'];
          this.productGroupTargetsColumns = ['options', 'name'];
          this.isMobileView = true;
        } else {
          this.productColumns = ['options', 'image', 'name', 'productdescription', 'productReference', 'stockQuantity', 'stockTotalPrice',];
          this.productGroupTargetsColumns = ['options', 'name', 'CreaterName', 'StartDate', 'EndDate', 'target', 'B', 'progress'];
          this.isMobileView = false;
        }
      }
    );
    this.width = window.innerWidth;
    if (!this.size && this.width < 992) {
      this.productColumns = ['Product', 'options', 'navigate'];
      this.productGroupTargetsColumns = ['options', 'name'];
      this.isMobileView = true;
    } else if (!this.size && this.width > 992) {
      this.productColumns = ['options', 'image', 'name', 'productdescription', 'productReference', 'stockQuantity', 'stockTotalPrice',];
      this.productGroupTargetsColumns = ['options', 'name', 'CreaterName', 'StartDate', 'EndDate', 'target', 'B', 'progress'];
      this.isMobileView = false;
    }
    this.productForm = this.formBuilder.group({
      'ProductReference': ['', Validators.required],
      'ProductName': ['', [Validators.required]],
      'ProductDescription': ['', [Validators.required]],
      'MeasureId': ['', Validators.required],
      'StockQuantity': ['', Validators.required],
      'Comments': ['', Validators.required],
      // 'isActive': [{ value: 'true', disabled: true }],
      'TagViewModels': [[]],
      'profile': [''],
      'created': [''],
      'id': [],
      'isActive': [true],
      'UsersId': [[]],
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
    this.loadProducts(20, 1, '');
    this.mapeventsubcription = this.Manageproductservice.manageproductcreate.subscribe((data) => {
      // console.log(data, 'subscribe data')
      if (data == true) {
        this.loadProducts(20, 1, '');
      }
    });

    this.mapeventsubcription = this.Manageproductservice.manageproductgroupcreate.subscribe((data) => {
      console.log(data, 'subscribe data');
      if (data == true) {
        this.loadProductGroups(10, 1, '');
      }
    });

    this.mapeventsubcription = this.Manageproductservice.manageproducttargetcreate.subscribe((data) => {
      console.log(data, 'subscribe data');
      if (data == true) {
        this.loadProductGroupsTarget(10, 1, '');
      }
    });
    // this.productDataSource.paginator = this.paginator;
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
      this.loadProducts(20, 1, '');
    } else if (tabIndex === 1) {
      this.loadProductGroups(10, 1, '');
    } else if (tabIndex === 2) {
      this.loadProductGroupsTarget(10, 1, '');
    }

  }
  next(e:any, value:any) {
    // console.log(e, 'e')
    // console.log(e.pageIndex + 1)
    if (value == 'single') {
      this.loadProducts(20, e.pageIndex + 1, this.siglefilter);
    }
    else {
      this.loadProductGroups(10, e.pageIndex + 1, this.singlefilter);
    }
    // this.pageSize = 10;
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
  nextt(e:any) {
    // console.log(e, 'e')
    // console.log(e.pageIndex + 1)
    this.loadProductGroupsTarget(10, e.pageIndex + 1, this.targetfilter);
    // this.pageSize = 10;
  }

  nexttAdvanceTarget(e:any) {
    this.TargetAdvanceFilter(this.ListOftragetfiltervalues, e.pageIndex + 1, 20)
  }

  loadProducts(size:any, pagenumber:any, siglefilter:any) {
    this.manageproductsService.fetchProducts(size, pagenumber, siglefilter).subscribe(
      (result: any) => {
        console.log(result);
        this.productsdata = result.data;
        console.log("productsdata", this.productsdata)
        this.productDataSource = new MatTableDataSource(this.productsdata);
        this.productDataSource.sort = this.sort;
        this.userDataLength = result.totalItems;
        this.calculateListProduct()
      }
    );
  }
  loadProductGroups(size:any, pagenumber:any, singlefilter:any) {
    this.manageproductsService.fetchProductGroups(size, pagenumber, singlefilter).subscribe(
      (result: any) => {
        this.productsgrpdata = result.data;
        this.productGroups = this.productsgrpdata;
        this.siteDataLength = result.totalItems;
      }
    );
  }

  loadProductGroupsTarget(size:any, pagenumber:any, targetfilter:any) {
    this.manageContactsService.fetchContactGroupsTargetService(size, pagenumber, targetfilter, 3)
      .pipe(
        mergeMap(res => res.map(data => {
          data.screen = 'product';
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
        console.log(data, 'data');
        this.productGroupsTarget = data;
        this.productGroupTargetsDataSource = new MatTableDataSource(data);
        this.tabledata = data;
        this.changeDetectorRefs.detectChanges()
        this.productGroupTargetsDataSource.sort = this.sort;
      });


      this.manageContactsService.fetchContactGroupsTarget(size, pagenumber, targetfilter,3).subscribe(
      (data: any) => {
        this.productTargetlength = data.totalItems;
        this.changeDetectorRefs.detectChanges()

      }
    );
  }
  private calculatePerformanceGain(target: ProductGroupTarget) {
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
  // openTargetMonths(target: ProductGroupTarget): void {
  //   console.log(target);
  //   this.dialog.open(TargetMonthComponent, {
  //     disableClose: true,
  //     width: '500px',
  //     data: target
  //   });

  // }
  openTargetProducts(target: ProductGroupTarget) {
    const ids: string = target.childIds.join(',');
    this.manageproductsService.fetchProductsAchievedAmountService(ids, Number(target.year), false, '')
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


  applyFilter(filterValue: string): void {
    this.siglefilter = filterValue;
    this.loadProducts(10, 1, this.siglefilter);
    this.showicon = true;
  }

  applyFiltersearch(filterValue: string) {
    this.singlefilter = filterValue;
    this.loadProductGroups(10, 1, this.singlefilter);
    this.showicon = true;
  }


  applytargetFiltergroup(filterValue: string) {
    this.siglefilter = filterValue;
    this.loadProductGroupsTarget(10, 1, this.siglefilter);
    this.showicon = true;
  }
  closesearch(value:any) {
    if (value == 'single') {
      this.showicon = false;
      this.singleSearchValue = null;
      this.SearchResult.splice(0, this.SearchResult.length);
      this.loadProducts(20, 1, '');
    } else if (value == 'multiple') {
      console.log(value, 'value');
      this.showicon = false;
      this.quickSearchValue = null;
      this.SearchGroupResult.splice(0, this.SearchGroupResult.length);
      this.loadProductGroups(10, 1, '');

    }
    else if (value == 'target') {
      this.showicon = false;
      this.targetSearchValue = null;
      this.ListOftragetfiltervalues.splice(0, this.ListOftragetfiltervalues.length);
      this.loadProductGroupsTarget(10, 1, '');
    }
  }


  masterToggle() {
    this.isAllProductsSelected() ?
      this.productSelection.clear() :
      this.productDataSource.data.forEach((row:any) => this.productSelection.select(row));
  }

  isAllProductsSelected() {
    const numSelected = this.productSelection.selected.length;
    const numRows = this.productDataSource.data.length;
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
      this.dialog.closeAll()
      this.dialog.open(CreateGroupComponent, {
        width: '500px',
        disableClose: true,
        data: this.productSelection.selected
      });
    } else {
      this.dialog.closeAll()
      const DynamicGroup = this.dialog.open(DynamicGroupComponent, {
        disableClose: true,
        width: '500px',
        data: { type: 'Products' }
      });
      DynamicGroup.afterClosed().subscribe(result => {
        this.ngOnInit()
      });
    }
  }

  // edit product group

  editProductGroup(data: any): void {
    if (data.conditionDtos) {
      this.editdynamicgroupDialog = this.dialog.open(DynamicGroupComponentEditComponent, { disableClose: true, data: { data, type: 'Products' }, width: '500px' });
      this.editdynamicgroupDialog.afterClosed().subscribe(result => {
        console.log(`Dialog result: ${result}`);
        this.loadProductGroups(10, 1, '');
      });
    } else {
      this.editgroupDialog = this.dialog.open(EditProductGroupComponent, { disableClose: true, data: data, width: '500px' });
      this.editgroupDialog.afterClosed().subscribe(result => {
        console.log(`Dialog result: ${result}`);
        this.loadProductGroups(10, 1, '');
      });
    }

  }

  openProductDialog(row:any, type:any) {
    this.dialog.open(ProductDetailsComponent, {
      disableClose: true,
      data: { data: row, type: type },
      width: '500px'
    });
  }


  deleteDialogConfirmation(data:any, type:any, entity:any) {
    const deleteorder = this.dialog.open(DeleteCommomComponent, { data: { data, type: type, entity: entity } });
    deleteorder.afterClosed().subscribe((result: any) => {
      if (result) {
        this.loadProducts(20, 1, '');
        this.loadProductGroups(10, 1, '');
        this.loadProductGroupsTarget(10, 1, '');
      }
    })
  }

  closedialogbox() {
    this.dialog.closeAll();
    this.ngOnInit()
  }

  toggleShow(i:any) {
    this.isShown = !this.isShown;
    this.index = i;
  }

  get f() {
    return this.productForm.controls;
  }


  updateproductDialog(row:any) {
    const createProductDialog = this.dialog.open(CreateProductComponent, {
      data: { screenType: 'UpdateProduct', data: row },
      disableClose: true,
      width: '500px'
    });
    createProductDialog.afterClosed().subscribe(result => {
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

  showproductList(group:any) {
    if (group.dynamicGroupId == null) {
      const GroupId = group.id;
      this.manageProductsService.fetchProductGroupByIdService(GroupId).subscribe(data => {
        if (data) {
          this.userList = data;
        }
      });
    } else {
      const GroupId = group.id;
      this.manageProductsService.getDynamicGroupService('Products', GroupId).subscribe(data => {
        if (data) {
          this.userList = data;
        }
      });
    }

  }


  // exportData
  exportData() {
    this.dialog.open(ExportDataManageAllComponent, {
      disableClose: true,
      data: { type: 'Products', },
      width: '700px',
    });
  }

  openCreateProduct() {
    const createProductDialog = this.dialog.open(CreateProductComponent, {
      data: { screenType: 'Createproduct' },
      disableClose: true,
      width: '500px'
    });


    createProductDialog.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
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
        this.loadProducts(20, 1, '');
        this.loadProductGroups(10, 1, '');
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
        this.loadProducts(20, 1, '');
        this.loadProductGroups(10, 1, '');
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
      data: { type: 'Products' }
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
      this.productGroupsTarget = data;
      this.productGroupTargetsDataSource = new MatTableDataSource(data);
      this.tabledata = data;
      // this.productGroupTargetsDataSource.paginator = this.paginator;
      this.productGroupTargetsDataSource.sort = this.sort;
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
          this.loadProductGroupsTarget(10, 1, '');
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
        attachmentLevel: 'Products',
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
        attachmentLevel: 'Products',
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
      data: { data: row, Entity: 'Products', },
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
      data: { data, Name: 'Prodcuts', single: value, management: true },

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
  //  CreateTransaction
  CreateTransaction() {
    this.dialog.open(CreateTransactionComponent, {
      width: '500px',
      autoFocus: false,
      disableClose: true
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

  popupforerrormessage(message:any, header:any) {
    this.dialog.open(PopupErrorMessageComponent, {
      width: '600px',
      data: { message: message, header: header },
      autoFocus: false,
      disableClose: true,
    });
  }

  getProductGroup(row:any) {
    this.manageProductsService.getProductGroups(row.id).subscribe((result: any) => {
      console.log("u8serssss", result)
      if(result) {
        this.dialog.open(TargetYearComponent, {
          disableClose: true,
          width: '700px',
          data: {data: result, type: 'Products', target: row}
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
        data: { type: 'Products' },
        width: '500px',
      }
    );
    AdvanceSearch.afterClosed().subscribe((result: any) => {
      if (result) {
        this.SearchResult.push(result)
        console.log("searchh", this.SearchResult)
        this.showicon = true;
        this.applyFilter(result);
        this.calculateListProduct()
      }
    });
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
      this.loadProducts(20, 1, '');
    } else if(this.tabnumber == 1) {
      this.loadProductGroups(10, 1, '');
    }
  }

  // Group Search
  AdvanceSearchgroup() {
    const AdvanceSearch = this.dialog.open(
      AdvanceSearchInManagementGroupComponent,
      {
        disableClose: true,
        data: { type: 'Products' },
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
      data: { type: 'Products' },
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
    const params = this.createtargetfilterparams(data,'Products',pagenumber,NumberOfRecord);
    this.manageContactsService.TargetAdvanceFilter(params) .subscribe((result: any) => {
        if (result) {
          let data = result.data.map((data:any) => {
            data.screen = 'products';
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
        this.productGroupsTarget = data;
        this.productGroupTargetsDataSource = new MatTableDataSource(data);
        this.tabledata = data;
        this.productGroupTargetsDataSource.sort = this.sort;
        this.TargetLength = result.totalItems
          this.showicon = true;
          this.calculateTotalTargetValue()
          this.changeDetectorRefs.detectChanges()
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
        const date:any=this.datepipe.transform(element.value, 'dd-MMM-yyyy')
        params = params.set(element.name, date);
      }else{
      params = params.set(element.name, element.value);
      }
    });
    console.log(params.toString()); // Log the parameters for debugging
    return params;
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
      this.loadProductGroupsTarget(10, 1, '');
    }
    if(this.isMobileView == false) {
      this.displayedItems = this.ListOftragetfiltervalues.slice(this.startIndex, this.startIndex + 5);
    } else if (this.isMobileView == true) {
      this.displayedItems = this.ListOftragetfiltervalues.slice(this.startIndex, this.startIndex + 1);
    }
  }


  calculateTotalTargetValue(): void {
    this.totalTargetValue = this.productGroupsTarget.reduce((acc, obj:any) => acc + obj.targetValue, 0);
    this.achivedTargetValue = this.productGroupsTarget.reduce((acc, obj:any) => acc + obj.totalAchievedValue, 0);
  }

  calculateListProduct() {
    this.StockQuantity = this.productsdata.reduce((acc, obj) => acc + obj.stockQuantity, 0);
    console.log(this.StockQuantity)
    this.StockTotalPrice = this.productsdata.reduce((acc, obj) => acc + obj.stockTotalPrice, 0);
    console.log(this.StockTotalPrice)
  }

  RoundAmount (value:any) {
    if(!Number.isNaN(value)) {
      return value.toFixed(2)
    } else {
      return 0;
    }
    
  }
}
