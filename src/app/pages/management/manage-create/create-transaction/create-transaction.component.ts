import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Observable } from 'rxjs'; 
import { User } from 'src/app/core/models/user.model';
import { Contact } from 'src/app/core/models/contact.model';
import { Product } from 'src/app/core/models/product.model';
import { Site } from 'src/app/core/models/site.model';
import { PaymentType } from 'src/app/core/models/payment-type.model';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ManageContactsService } from 'src/app/core/services/manage-contacts.service';
import { ManageUsersService } from 'src/app/core/services/manage-users.service';
import { ManageSitesService } from 'src/app/core/services/manage-sites.service';
import { ManageProductsService } from 'src/app/core/services/manage-products.service';
import { ManageTransactionsService } from 'src/app/core/services/manage-transactions.service';
import { Router } from '@angular/router';
import { MessageService } from 'src/app/core/services/message.service';
import { ManagetransactionService } from 'src/app/pages/management/manage-transactions/managetransaction.service';
import { ManageimportComponent } from '../../manageimport/manageimport.component';
import * as FileSaver from 'file-saver';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { saveAs } from 'file-saver';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { AddtagCommonComponent } from 'src/app/pages/commonForAll/addtag-common/addtag-common.component';
import { DeleteCommomComponent } from 'src/app/pages/commonForAll/delete-commom/delete-commom.component';
import { PermissionService } from 'src/app/core/services/permission.service';
import { PopupErrorMessageComponent } from 'src/app/popup-error-message/popup-error-message.component';
import { TranslateService } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';
import { ApiErrorMessagesComponent } from 'src/app/api-error-messages/api-error-messages.component';
import { GoogleValidationAddressService } from 'src/app/core/services/google-validation-address.service';

@Component({
  selector: 'app-create-transaction',
  templateUrl: './create-transaction.component.html',
})
export class CreateTransactionComponent implements OnInit {
  transactionForm: FormGroup;
  additionalFieldLines: any[] = [];
  discountList: any[] = [];
  lineCounter!: number;
  users$:any = [];
  filteredusers:any = [];
  contacts$:any = [];
  filteredcontacts:any = [];
  products$:any = [];
  filteredproducts:any = [];
  sites$:any = [];
  filteredsites:any = [];
  paymentTypes$:any = [];
  dropdown!: boolean;
  selectedradioval: any;

  viewtagmodel:any = {};
  showcheckbox!: boolean;
  selectednumeralval: any;
  tagarray:any = [];
  Freefeild:any = {};
  viewnumeral:any = {};
  showfreefeild!: boolean;
  value!: number;
  // auto chip for keyword
  separatorKeysCodes: number[] = [ENTER, COMMA];
  keywordlist: string[] = [];
  i = 1;
  tagViewModels:any = [];
  tags: any;
  dropdownvalue:any = [];
  dropdownfeild:any = {};
  datadelete: any;
  datadeleteindex: any;
  checked: any;
  selectedtagvalue:any;
  selectedvalue: any;
  discountDetails: any;
  ContactdiscountDetails:any = [];
  ProductdiscountDetails:any = [];
  SitediscountDetails:any = [];
  contactimg = '';
  Productimg = '';
  transacrtionDiscountIds:any = [];
  contactDiscountId :any= null;
  productDiscountId :any= null;
  siteDiscountId :any= null;
  UnutPrice!: number;
  FinalePrice!: number;
  Quantity!: number;
  SelactedproductDetails: any;
  possible = '098765432123456789009876543212345678';
  OrderIdCode = '';
  loginUserId: any;
  isbuytype = true;
  issaletype = true;
  AdminStatus: any;
  options = {
    types: ['geocode'],
    componentRestrictions: {},
  };
  FindUserDiscountLimit :any=0
  manuvaldicontprecentage=0
  constructor(
    private router: Router,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<CreateTransactionComponent>,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private manageContactsService: ManageContactsService,
    private manageUsersService: ManageUsersService,
    private manageSitesService: ManageSitesService,
    private manageProductssService: ManageProductsService,
    private manageTransactionsService: ManageTransactionsService,
    private managetransactionsservice: ManagetransactionService,
    private permissionService: PermissionService,
    private translate: TranslateService,
    public datepipe: DatePipe, 
    private googleAddress: GoogleValidationAddressService,
  ) {
    if (localStorage.getItem('lang')) {
      const lang:any=localStorage.getItem('lang')
      this.translate.use(lang);
    } else {
      this.translate.use('English');
    }
    this.loginUserId = localStorage.getItem('id');
    this.AdminStatus = localStorage.getItem('isAdmin');
    this.transactionForm = this.formBuilder.group({
      TransactionDate: ['', Validators.required],
      ProductsId: ['', Validators.required],
      SiteId: [''],
      Quantity: [0, Validators.required],
      TransactionTypeId: ['', Validators.required],
      TransactionTypeName: [''],
      OrderId: ['', Validators.required],
      FinalPrice: [0, Validators.required],
      UnitPrice: ['', Validators.required],
      baseUnitPrice: ['', Validators.required],
      PaymentTypeId: ['', Validators.required],
      CurrencyId: [1, Validators.required],
      ContactsId: [''],
      statusOfTransaction: [1, Validators.required],
      UserId: ['', Validators.required],
      ExpirationDate: ['', Validators.required],
      Comments: [''],
      ManuallyDddDiscount: [null],
      keyword: [''],
      Address: [''],
      Country: [''],
      ZipCode: [''],
      City: [''],
      latitude: ['0'],
      longitude: ['0'],
      TagViewModels: [this.tagViewModels || []],
      contactDiscountId: [null],
      productDiscountId: [null],
      siteDiscountId: [null],
      transacrtionDiscountIds: [null],
      ListOfDiscount: this.formBuilder.array([]),
      Addtages: this.formBuilder.array([]),
    });
  }

  // ------------
  updateAddress(eve:any) {
    if (eve?.value == undefined) {
      this.transactionForm.get('Address')?.setValue('');
      this.transactionForm.get('ZipCode')?.setValue('');
      this.transactionForm.get('City')?.setValue('');
      this.transactionForm.get('Country')?.setValue('');
    } else {
      this.manageSitesService
        .fetchSiteByIdService(eve?.value)
        .subscribe((res) => {
          if (res) {
            this.transactionForm.get('Address')?.setValue(res.address);
            this.transactionForm.get('ZipCode')?.setValue(res.zipCode);
            this.transactionForm.get('City')?.setValue(res.city);
            this.transactionForm.get('Country')?.setValue(res.country);
          }
        });
    }
this.selectingPaymentType()
  }
    // ------------0000000000000
    handleAddressChange(place: object) {
      const data = this.googleAddress.getFullAddress(place);
      this.transactionForm.get('latitude')?.setValue(data.latitude);
      this.transactionForm.get('longitude')?.setValue(data.longitude);
      if (
        data.Address != undefined &&
        data.Address != null &&
        data.Address != 'undefined' &&
        data.Address != 'null'
      ) {
        this.transactionForm.get('Address')?.setValue(data.Address);
      } else {
        this.transactionForm.get('Address')?.setValue('');
      }
      if (
        data.pincode != undefined &&
        data.pincode != null &&
        data.pincode != 'undefined' &&
        data.pincode != 'null'
      ) {
        this.transactionForm.get('ZipCode')?.setValue(data.pincode);
      } else {
        this.transactionForm.get('ZipCode')?.setValue('');
      }
      if (
        data.city != undefined &&
        data.city != null &&
        data.city != 'undefined' &&
        data.city != 'null'
      ) {
        this.transactionForm.get('City')?.setValue(data.city);
      } else {
        this.transactionForm.get('City')?.setValue('');
      }
      if (
        data.country != undefined &&
        data.country != null &&
        data.country != 'undefined' &&
        data.country != 'null'
      ) {
        this.transactionForm.get('Country')?.setValue(data.country);
      } else {
        this.transactionForm.get('Country')?.setValue('');
      }
    }

  filterOptions(value: string, type: string): void {
    console.log(type);
    if (type === 'users') {
      this.filteredusers = this.users$.filter((option:any) =>
        option.firstName.toLowerCase().includes(value.toLowerCase())
      );
    } else if (type === 'Sites') {
      this.filteredsites = this.sites$.filter((option:any) =>
        option.companyName.toLowerCase().includes(value.toLowerCase())
      );
    } else if (type === 'Contacts') {
      this.filteredcontacts = this.contacts$.filter((option:any) =>
        option.firstName.toLowerCase().includes(value.toLowerCase())
      );
    } else if (type === 'Products') {
      this.filteredproducts = this.products$.filter((option:any) =>
        option.productName.toLowerCase().includes(value.toLowerCase())
      );
    }
  }

  ngOnInit(): void {
    this.manageTransactionsService.FindUserDiscountLimit().subscribe((result)=>{
      if(result){
        this.FindUserDiscountLimit=result
      }
    }) 
    this.makeRandom(6, this.possible);
    this.manageContactsService.findAllContactsDropdown().subscribe((result) => {
      if (result) {
        this.contacts$ = result;
        this.filteredcontacts = result;
      }
    });
    this.manageUsersService.findAllUsersDropdown().subscribe((result) => {
      if (result) {
        this.users$ = result;
        this.filteredusers = result;
      }
    });
    this.manageProductssService
      .findAllProductsDropdown()
      .subscribe((result) => {
        if (result) {
          this.products$ = result;
          this.filteredproducts = result;
        }
      });
    this.manageSitesService.findAllSitesDropdown().subscribe((result) => {
      if (result) {
        this.sites$ = result;
        this.filteredsites = result;
      }
    });
    this.manageTransactionsService
      .fetchAllPaymentTypesService()
      .subscribe((result) => {
        if (result) {
          this.paymentTypes$ = result;
        }
      });
    this.transactionForm.get('UserId')?.setValue(this.loginUserId);
    this.gettags();
    this.getAllDiscounts();
    if (this.AdminStatus != 'true') {
      this.getUserPermission();
    }
  }

  getUserPermission() {
    this.permissionService
      .getUserPermission(this.loginUserId)
      .subscribe((result: any) => {
        if (result) {
          result.forEach((element:any) => {
            if (element.tableName == 'Transactions') {
              this.issaletype = element.isSale;
              this.isbuytype = element.isBuy;
            }
          });
        }
      });
  }
  genrattingNewCode() {
    this.OrderIdCode = '';
    this.makeRandom(6, this.possible);
  }
  makeRandom(lengthOfCode: number, possible: string) {
    for (let i = 0; i < lengthOfCode; i++) {
      this.OrderIdCode =
        this.OrderIdCode +
        possible.charAt(Math.floor(Math.random() * possible.length));
    }
  }
  // tag
  createtageBody(): FormGroup {
    return this.formBuilder.group({
      tagTableId: 0,
      fieldName: null,
      fieldType: null,
      fieldValue: null,
      dropdownValues: null,
      dropdownvaluetotal: null,
    });
  }
  gettageBody() {
    return this.transactionForm.get('Addtages') as FormArray;
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

  fieldType(i: number) {
    return this.gettageBody().at(i).get('fieldType')?.value;
  }
  tagTableId(i: number) {
    return this.gettageBody().at(i).get('tagTableId')?.value;
  }
  removeConditionalBody(i: number) {
    this.gettageBody().removeAt(i);
  }

  GetQuantity(Quantity:any) {
    this.FinalePrice = Quantity * this.UnutPrice;
  }

  GetUnitPrice(UnutPrice:any) {
    this.FinalePrice = this.Quantity * UnutPrice;
  }

  // discount
  getDiscountValue(event:any, name:any) {
    console.log(event);
    this.SelactedproductDetails = event;
    this.selectDiscountManually(event);
  }

  getTransactionType(event:any) {
    if (event == 'Sell' || event == 'Sale') {
      console.log(this.SelactedproductDetails);
      this.UnutPrice = this.SelactedproductDetails.sellingPrice;
    } else {
      this.UnutPrice = this.SelactedproductDetails.baseUnitPrice;
    }
    this.transactionForm.get('baseUnitPrice')?.setValue(this.UnutPrice);
    this.transactionForm.get('UnitPrice')?.setValue(this.UnutPrice);
  }

  removeDiscount(index: number) {
    this.getDiscountBody().removeAt(index);
  }
  changeDiscount(index: number, event:any) {
    this.getDiscountBody().at(index).get('discountid')?.setValue(event.id);
    this.getDiscountBody()
      .at(index)
      .get('discountAmmount')
      ?.setValue(event.discountAmount + '%');
    console.log(index, event);
  }

  getAllDiscounts() {
    this.manageContactsService.FindDiscountsForDropdown(false, false).subscribe((data: any) => {
        console.log(data);
        this.discountDetails = data;
      });
  }
  getDiscountBody() {
    return this.transactionForm.get('ListOfDiscount') as FormArray;
  }

  addConditionalBody() {
    this.getDiscountBody().push(this.createDiscountBody());
  }

  getDiscountTpye(index:any) {
    return this.getDiscountBody().at(index).get('type')?.value;
  }
  createDiscountBody(): FormGroup {
    return this.formBuilder.group({
      discountid: [],
      discountName: [],
      discountAmmount: [],
      Name: [],
      type: [],
    });
  }

  selectDiscountManually(list:any) {
    console.log(list);
    if (list?.discountDropdownDtos) {
      list.discountDropdownDtos.forEach((e: any) => {
        const index = this.getDiscountBody()?.value.length;
        this.addConditionalBody();
        this.getDiscountBody()
          .at(index)
          .get('discountName')
          ?.setValue(e.codeAndName);
        this.getDiscountBody().at(index).get('discountid')?.setValue(e.id);
        this.getDiscountBody()
          .at(index)
          .get('discountAmmount')
          ?.setValue(e.discountAmount + '%');
        if (list?.productName) {
          this.ProductdiscountDetails.push(e);
          this.Productimg = list?.profilePicture;
          this.getDiscountBody().at(index).get('type')?.setValue('Product');
          this.getDiscountBody()
            .at(index)
            .get('Name')
            ?.setValue(list?.productName);
        } else if (list?.companyName) {
          this.SitediscountDetails.push(e);
          this.getDiscountBody().at(index).get('type')?.setValue('Site');
          this.getDiscountBody()
            .at(index)
            .get('Name')
            ?.setValue(list?.companyName);
        } else if (list?.firstName) {
          this.ContactdiscountDetails.push(e);
          this.contactimg = list?.profilePicture;
          this.getDiscountBody().at(index).get('type')?.setValue('Contact');
          this.getDiscountBody()
            .at(index)
            .get('Name')
            ?.setValue(list?.firstName + list?.lastName);
        }
      });
    } else {
      const index = this.getDiscountBody()?.value.length;
      this.addConditionalBody();
      this.getDiscountBody().at(index).get('discountid')?.setValue(list.id);
      this.getDiscountBody()
        .at(index)
        .get('discountName')
        ?.setValue(list.codeAndName);
      this.getDiscountBody()
        .at(index)
        .get('discountAmmount')
        ?.setValue(list.discountAmount + '%');
      this.getDiscountBody().at(index).get('Name')?.setValue('Manually add');
      this.getDiscountBody().at(index).get('type')?.setValue('Transation');
    }
this.selectingPaymentType()
  }


  onSubmit(){
    if (localStorage.getItem('DemoOrganation') === 'true') {
      this.popupforerrormessage(
        'This button allows you to add new Transactions',
        'Create Transaction'
      );
    } else {
      if(this.transactionForm?.value.Quantity==0){
        this.creattransation()

      }else{
        this.manuvaldicontprecentage=0
        this.transactionForm?.value.ListOfDiscount.forEach((element:any) => {
          this.manuvaldicontprecentage=this.manuvaldicontprecentage+Number(element.discountAmmount.split('%')[0])
        });
        const orginalfinalprice=this.transactionForm?.value.Quantity*this.transactionForm?.value.baseUnitPrice
        console.log(orginalfinalprice)
        console.log(this.transactionForm?.value.FinalPrice)
    
        const discountcal=100-(this.transactionForm?.value.FinalPrice/orginalfinalprice)*100
        console.log(discountcal)
        console.log(this.manuvaldicontprecentage);
        const finaldiscount=discountcal+this.manuvaldicontprecentage
        console.log(finaldiscount);
        console.log(this.FindUserDiscountLimit);
        const FindUserDiscountLimit=this.FindUserDiscountLimit
  
        this.manageTransactionsService.FindAppliedDiscountOfOrder(this.transactionForm?.value.OrderId).subscribe(((result:any)=>{
          console.log(result)
            if(result==0){
              if((finaldiscount==FindUserDiscountLimit)||(finaldiscount<FindUserDiscountLimit)){
                this.creattransation()
              }else{
                this.APIerrormessage(`Discount limit exceeded. Your discount limit is ${FindUserDiscountLimit}% but order  has ${finaldiscount}% discount`, 'Create Transactions');
              }
            }else{
              if((finaldiscount==(FindUserDiscountLimit-result))||(finaldiscount<(FindUserDiscountLimit-result))){
                this.creattransation()
              }else{
                this.APIerrormessage(`Discount limit exceeded. Your discount limit is ${FindUserDiscountLimit-result}% but order  has ${finaldiscount}% discount`, 'Create Transactions');
              }
            }
            console.log(result)
        }))
      }
    }
  }

  creattransation() {
    this.transacrtionDiscountIds=[]
    this.contactDiscountId=null
    this.siteDiscountId=null
    this.productDiscountId=null
     this.getTransactionTypeName()
      this.transactionForm.get('keyword')?.setValue(this.keywordlist.toString());
      this.getDiscountBody()?.value.forEach((element:any) => {
        if (element.type == 'Product') {
          this.productDiscountId = element.discountid;
        } else if (element.type == 'Site') {
          this.siteDiscountId = element.discountid;
        } else if (element.type == 'Contact') {
          this.contactDiscountId = element.discountid;
        } else if (element.type == 'Transation') {
          this.transacrtionDiscountIds.push(element.discountid);
        }
      });
      // ------------------------
      if (this.transacrtionDiscountIds.length != 0) {
        this.transactionForm.get('transacrtionDiscountIds')?.setValue(this.transacrtionDiscountIds);
      } else {
        this.transactionForm.get('transacrtionDiscountIds')?.setValue(null);
      }
      if (this.siteDiscountId != null) {
        this.transactionForm.get('siteDiscountId')?.setValue(this.siteDiscountId);
      } else {
        this.transactionForm.get('siteDiscountId')?.setValue(null);
      }
      if (this.contactDiscountId != null) {
        this.transactionForm.get('contactDiscountId')?.setValue(this.contactDiscountId);
      } else {
        this.transactionForm.get('contactDiscountId')?.setValue(null);
      }
      if (this.productDiscountId != null) {
        this.transactionForm.get('productDiscountId')?.setValue(this.productDiscountId);
      } else {
        this.transactionForm.get('productDiscountId')?.setValue(null);
      }
  

      this.transactionForm?.value.Addtages.forEach((element:any) => {
        if (element?.fieldValue != null) {
          this.viewtagmodel['tagTableId'] = '';
          this.viewtagmodel['fieldName'] = element.fieldName;
          this.viewtagmodel['fieldType'] = element.fieldType;
          this.viewtagmodel['fieldValue'] = element.fieldValue;
          this.viewtagmodel['dropdownValues'] = element.dropdownValues;
          this.tagViewModels.push(this.viewtagmodel);
        }
        if (element?.fieldType == 'Dropdown') {
          if (element?.fieldValue != null) {
            this.viewtagmodel['tagTableId'] = '';
            this.viewtagmodel['fieldName'] = element.fieldName;
            this.viewtagmodel['fieldType'] = element.fieldType;
            this.viewtagmodel['fieldValue'] =
              element?.fieldValue == null ? ' ' : element?.fieldValue;
            this.viewtagmodel['dropdownValues'] =
              element.dropdownValues.toString();
            this.tagViewModels.push(this.viewtagmodel);
          }
        }
      });


      console.log(this.transactionForm?.value);
      const TransactionDate = this.datepipe.transform(
        this.transactionForm?.value.TransactionDate,
        'yyyy-MM-dd'
      )
      const ExpirationDate = this.datepipe.transform(
        this.transactionForm?.value.ExpirationDate,
        'yyyy-MM-dd'
      );
      this.transactionForm.get('TransactionDate')?.setValue(TransactionDate);
      this.transactionForm.get('ExpirationDate')?.setValue(ExpirationDate);
  
      console.log(this.transactionForm?.value)
      this.manageTransactionsService.createTransactionService(this.getapidataformat(this.transactionForm?.value)).subscribe(
          (data:any) => {
            if (data) {
              if(data['response'][0].code=='200'||data['response'][0].code==200){
                this.dialogRef.close();
                this.router.navigate(['/home/dash/management/m/transactions']);
                this.managetransactionsservice.managetransaction$.next(true);
              this.messageService.showMessage(data['response'][0].message);
              }else{
              this.APIerrormessage(data['response'][0].message, 'Create Transactions');
              }
            }
          },
          (error) => {
            console.log(error);
            if (error.status == 429) {
              this.APIerrormessage(error?.error.manage, 'Create Transactions');
            }
          }
        );
    
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
        data: 'Transactions',
      });
      openAddEventDialog.afterClosed().subscribe((result: any) => {
        if (result) {
          this.gettageBody().clear();
          this.gettags();
        }
      });
    }
  }
  deletetagDialog(i:any, type:any) {
    const data = {
      id: this.tagTableId(i),
      type: 'Transactions',
    };
    const deleteorder = this.dialog.open(DeleteCommomComponent, {
      data: { data, type: type, entity: 'Transactions' },
    });
    deleteorder.afterClosed().subscribe((result: any) => {
      if (result) {
        this.gettageBody().clear();
        this.gettags();
      }
    });
  }
  getapidataformat(data:any){
    console.log(data)
    const finalformat:any={
      "id": data?.id,
      "transactionDate":data?.TransactionDate,
      "productsId": data?.ProductsId,
      "siteId": data?.SiteId,
      "deliveryAddress":data?.Address,
      "country": data?.Country,
      "city": data?.City,
      "zipcode": data?.ZipCode,
      "latitude": data?.latitude?data?.latitude:'0',
      "longitude": data?.longitude?data?.longitude:'0',
      "quantity": data?.Quantity,
      "transactionTypeId": data?.TransactionTypeId,
      "transactionTypeName": data?.TransactionTypeName,
      "orderId": data?.OrderId,
      "finalPrice": data?.FinalPrice,
      "baseUnitPrice": data?.baseUnitPrice,
      "unitPrice": data?.UnitPrice,
      "paymentTypeId": data?.PaymentTypeId,
      "currencyId": data?.CurrencyId,
      "contactsId": data?.ContactsId,
      "userId": data?.UserId,
      "expirationDate": data?.ExpirationDate,
      "keyword": data?.keyword,
      "comments": data?.Comments, 
      "statusOfTransaction": data?.statusOfTransaction,
      "contactDiscountId": data?.contactDiscountId?data?.contactDiscountId:null,
      "productDiscountId": data?.productDiscountId?data?.productDiscountId:null,
      "siteDiscountId":data?.siteDiscountId?data?.siteDiscountId:null,
      "transactionDiscountIds": data?.transacrtionDiscountIds?data?.transacrtionDiscountIds:[],
      "tagViewModels": []
    }

    if(data?.Addtages){
      data?.Addtages.forEach((element:any) => {
        if(element.fieldValue!=null){
          finalformat.tagViewModels.push(element)
        }
      });
    }
    return finalformat
  }

  gettags() {
    this.manageTransactionsService
      .gettag('Transactions')
      .subscribe((data: any) => {
        if (data) {
          data.forEach((element:any, index:any) => {
            this.addtageBody();
            this.gettageBody()
              .at(index)
              .get('tagTableId')
              ?.setValue(element?.tagTableId);
            this.gettageBody()
              .at(index)
              .get('fieldName')
              ?.setValue(element?.fieldName);
            this.gettageBody()
              .at(index)
              .get('fieldType')
              ?.setValue(element?.fieldType);
            this.gettageBody()
              .at(index)
              .get('fieldValue')
              ?.setValue(element?.fieldValue);
            this.gettageBody()
              .at(index)
              .get('dropdownvaluetotal')
              ?.setValue(element?.dropdownValues);
          });
        }
        this.tags = data;
      });
  }

  closedialogbox() {
    this.dialog.closeAll();
  }

  importdata() {
    const openAddEventDialog = this.dialog.open(ManageimportComponent, {
      width: '500px',
      autoFocus: false,
      disableClose: true,
      data: 'Transactions',
    });
  }
  downloadTemplate() {
    const name = 'Transactions';
    this.manageContactsService
      .downloadTemplate(name)
      .subscribe((result: Blob) => {
        const data: Blob = new Blob([result], {
          type: 'text/csv;charset=utf-8',
        });
        saveAs(data, 'Transaction.csv');
      });
  }

  // ----------------
  // auto chip for keyword
  // -----------
  add(event: MatChipInputEvent) {
    console.log(event?.value);
    const value = (event?.value || '').trim();
    if (value) {
      this.keywordlist.push(value);
    }
    // Clear the input value
    // event.input?.value = '';
    this.transactionForm.get('keyword')?.setValue(null);
  }
  remove(value: string) {
    const index = this.keywordlist.indexOf(value);
    if (index >= 0) {
      this.keywordlist.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent) {
    this.keywordlist.push(event.option.viewValue);
    this.transactionForm.get('keyword')?.setValue(null);
  }

  popupforerrormessage(message:any, header:any) {
    this.dialog.open(PopupErrorMessageComponent, {
      width: '550px',
      data: { message: message, header: header },
      autoFocus: false,
      disableClose: true,
    });
  }

  APIerrormessage(message:any, header:any) {
    this.dialog.open(ApiErrorMessagesComponent, {
      width: '550px',
      data: { message: message, header: header },
      autoFocus: false,
      disableClose: true,
    });
  }





  selectingPaymentType(){
    this.getTransactionTypeName()
    console.log(this.transactionForm?.value)
    const data={
      // "transactionDate": this.transactionForm?.value.TransactionDate,
      "productsId": this.transactionForm?.value.ProductsId,
      "siteId": this.transactionForm?.value.SiteId,
      "deliveryAddress": this.transactionForm?.value.Address,
      "country": this.transactionForm?.value.Country,
      "city": this.transactionForm?.value.City,
      "zipcode": this.transactionForm?.value.ZipCode,
      "latitude": this.transactionForm?.value.latitude,
      "longitude": this.transactionForm?.value.longitude,
      "quantity": this.transactionForm?.value.Quantity,
      "transactionTypeId": this.transactionForm?.value.TransactionTypeId,
      "transactionTypeName": this.transactionForm?.value.TransactionTypeName,
      "orderId": this.transactionForm?.value.OrderId,
      "finalPrice": this.transactionForm?.value.FinalPrice==null?0:Number.isNaN(this.transactionForm?.value.FinalPrice)?0:this.transactionForm?.value.FinalPrice,
      "unitPrice": this.transactionForm?.value.UnitPrice,
      "baseUnitPrice": this.transactionForm?.value.baseUnitPrice,
      "paymentTypeId": this.transactionForm?.value.PaymentTypeId,
      "currencyId": this.transactionForm?.value.CurrencyId,
      "contactsId": this.transactionForm?.value.ContactsId,
      "userId": this.transactionForm?.value.UserId,
      // "expirationDate": this.transactionForm?.value.ExpirationDate,
      "keyword": this.transactionForm?.value.keyword,
      "comments": this.transactionForm?.value.Comments,
      "statusOfTransaction": this.transactionForm?.value.statusOfTransaction,
      // "tagViewModels": []
    }
    this.manageProductssService.FindProductPrices(data).subscribe((result)=>{
      if(result){
        console.log(result)
      }
    })
  }



getTransactionTypeName(){
  if (
    this.transactionForm.get('TransactionTypeId')?.value === '1' ||
    this.transactionForm.get('TransactionTypeId')?.value === 1
  ) {
    this.transactionForm.get('TransactionTypeName')?.setValue('Buy');
  } else {
    this.transactionForm.get('TransactionTypeName')?.setValue('Sale');
  }
}







}
