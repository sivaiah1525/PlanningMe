import { Component, Inject, OnInit, TemplateRef } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder, FormArray } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ManageContactsService } from 'src/app/core/services/manage-contacts.service';
import { ManageTransactionsService } from 'src/app/core/services/manage-transactions.service';
import { SpinnerService } from 'src/app/core/services/spinner.service';
import { Observable } from 'rxjs';
import { Contact } from 'src/app/core/models/contact.model';
import { PaymentType } from 'src/app/core/models/payment-type.model';
import { ManageSitesService } from 'src/app/core/services/manage-sites.service';
import { Site } from 'src/app/core/models/site.model';
import { CreateTransactionComponent } from '../../../manage-create/create-transaction/create-transaction.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { User } from 'src/app/core/models/user.model';
import { ManageUsersService } from 'src/app/core/services/manage-users.service';
import { Product } from 'src/app/core/models/product.model';
import { ManageProductsService } from 'src/app/core/services/manage-products.service';
import { AddtagCommonComponent } from 'src/app/pages/commonForAll/addtag-common/addtag-common.component';
import { TranslateService } from '@ngx-translate/core';
import { PopupErrorMessageComponent } from 'src/app/popup-error-message/popup-error-message.component';
import { ApiErrorMessagesComponent } from 'src/app/api-error-messages/api-error-messages.component';
import { GoogleValidationAddressService } from 'src/app/core/services/google-validation-address.service';

@Component({
  selector: 'app-add-order',
  templateUrl: './add-order.component.html',
  styleUrls: ['./add-order.component.scss']
})
export class AddOrderComponent implements OnInit {
  OrderId!: number;
  ides: any;
  orderForm: FormGroup;
  TransactionList: any;
  users$=[];
  filteredusers=[];
  contacts$=[];
  filteredcontacts=[];
  products$=[];
  filteredproducts=[];
  sites$=[];
  filteredsites=[];
  paymentTypes$!: Observable<PaymentType[]>;
  // auto chip for keyword
  separatorKeysCodes: number[] = [ENTER, COMMA];
  keywordlist:any = [];
  TransactionType = [{ name: 'Buy', id: 1 }, { name: 'Sale', id: 2 }] 
  Currency = [{ name: 'Euro', id: 1 }, { name: 'Dollar', id: 2 }]
  screenType: any;
  orderId: any;
  OrderData: any;
  gettransationbyIdData: any;
  possible = "123ABCD456EFD789XYZ0123LMNK";
  unqOrderId = ''
  loginUserId: any
  UnutPrice!: number
  FinalePrice!: number
  SelactedproductDetails: any;
  discountDetails: any;
  ContactdiscountDetails:any = [];
  ProductdiscountDetails:any = [];
  SitediscountDetails:any = [];
  contactimg = '';
  Productimg = '';
  transacrtionDiscountIds:any = [];
  contactDiscountId!: string;
  productDiscountId!: string;
  siteDiscountId!: string;
  orderFormdata:any;
  options = {
    types: ['geocode'],
    componentRestrictions: {},
  };
  manuvaldicontprecentage:number=0
  FindUserDiscountLimit :any=0
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private manageTransactionService: ManageTransactionsService,
    private manageContactsService: ManageContactsService,
    private manageSitesService: ManageSitesService,
    private manageUsersService: ManageUsersService,
    private manageProductssService: ManageProductsService,
    private snackBar: MatSnackBar,
    public spinner: SpinnerService,
    private dialog: MatDialog,
    public fb: FormBuilder,
    private matDialogRef: MatDialogRef<AddOrderComponent>,
    private translate: TranslateService ,
    private googleAddress: GoogleValidationAddressService,
    private manageTransactionsService: ManageTransactionsService
  ) {
    if(localStorage.getItem('lang')){
      const lang:any=localStorage.getItem('lang')
      this.translate.use(lang);
    }else{
      this.translate.use('English');
    }
     this.loginUserId = localStorage.getItem("id");
    this.orderForm = this.fb.group({
      id: [''],
      UserId: ['', Validators.required],
      clientId: ['', Validators.required],
      TransactionTypeId: ['', Validators.required],
      TransactionTypeName: [''],
      paymentTypeId: ['', Validators.required],
      issueDate: ['', Validators.required],
      dueDate: ['', Validators.required],
      SiteId: ['', Validators.required],
      comments: [''],
      currencyId: [1, Validators.required],
      statusOfTransaction: [1],
      orderId: ['', Validators.required],
      paymentDate: ['', Validators.required],
      keyword: [''],
      Address: [''],
      Country: [''],
      ZipCode: [''],
      City: [''],
      latitude: ['0'],
      longitude: ['0'],
      isOrder: [true],
      contactDiscountId: [null],
      siteDiscountId: [null],
      ListOfDiscount: this.fb.array([]),
      TransactionViewModel: this.fb.array([
        this.createtransactinBody()
      ])
    });
  }


  statusOfTransaction(value:any){
if(value=='Validated'){
this.orderForm.get('isOrder')?.setValue(true)
}else{
  this.orderForm.get('isOrder')?.setValue(false)
}
  }
  // transaction 
  createtransactinBody(): FormGroup {
    return this.fb.group({
      orderId: [''],
      UserId: [''],
      contactsId: [''],
      TransactionTypeId: [''],
      TransactionTypeName: [''],
      paymentTypeId: [''],
      SiteId: [''],
      comments: [''],
      currencyId: [1],
      statusOfTransaction: [1],
      ExpirationDate: [''],
      TransactionDate: [''],
      ProductsId: [''],
      Quantity: [0],
      UnitPrice: [''],
      baseUnitPrice: [''],
      FinalPrice: [''],
      keyword: [[]],
      productDiscountId: [null],
      transactionDiscountIds: [null],
      contactDiscountId: [null],
      siteDiscountId: [null],
      discount: this.fb.array([]),
      tagViewModels: this.fb.array([])
    })
  }

  ngOnInit() {
    this.manageTransactionsService.FindUserDiscountLimit().subscribe((result)=>{
      if(result){
        this.FindUserDiscountLimit=result
      }
    })
    console.log(this.data)
    this.screenType = this.data.screenType
    if (this.data.screenType == 'CreateOrder') {
      this.orderForm.get('UserId')?.setValue(this.loginUserId)
      this.makeRandom(6, this.possible);
    } else if (this.data.screenType == 'EditOrder') {
      this.getDetailsInOdersId()
    } else if (this.data.screenType == 'CreateduplicateOrder') {
      this.makeRandom(6, this.possible);
      this.getDetailsInOdersId()
    }
    this.dropDowenApis()
    this.getAllDiscounts()
  }
  // ------------
  updateAddress(eve:any) {
    if (eve.value == undefined) {
      this.orderForm.get('Address')?.setValue('');
      this.orderForm.get('ZipCode')?.setValue('');
      this.orderForm.get('City')?.setValue('');
      this.orderForm.get('Country')?.setValue('');
    } else {
      this.manageSitesService
        .fetchSiteByIdService(eve.value)
        .subscribe((res) => {
          if (res) {
            this.orderForm.get('Address')?.setValue(res.address);
            this.orderForm.get('ZipCode')?.setValue(res.zipCode);
            this.orderForm.get('City')?.setValue(res.city);
            this.orderForm.get('Country')?.setValue(res.country);
          }
        });
    }
  }
    // ------------0000000000000
    handleAddressChange(place: object) {
      const data = this.googleAddress.getFullAddress(place);
      this.orderForm.get('latitude')?.setValue(data.latitude.toString());
      this.orderForm.get('longitude')?.setValue(data.longitude.toString());
      if (
        data.Address != undefined &&
        data.Address != null &&
        data.Address != 'undefined' &&
        data.Address != 'null'
      ) {
        this.orderForm.get('Address')?.setValue(data.Address);
      } else {
        this.orderForm.get('Address')?.setValue('');
      }
      if (
        data.pincode != undefined &&
        data.pincode != null &&
        data.pincode != 'undefined' &&
        data.pincode != 'null'
      ) {
        this.orderForm.get('ZipCode')?.setValue(data.pincode);
      } else {
        this.orderForm.get('ZipCode')?.setValue('');
      }
      if (
        data.city != undefined &&
        data.city != null &&
        data.city != 'undefined' &&
        data.city != 'null'
      ) {
        this.orderForm.get('City')?.setValue(data.city);
      } else {
        this.orderForm.get('City')?.setValue('');
      }
      if (
        data.country != undefined &&
        data.country != null &&
        data.country != 'undefined' &&
        data.country != 'null'
      ) {
        this.orderForm.get('Country')?.setValue(data.country);
      } else {
        this.orderForm.get('Country')?.setValue('');
      }
    }

  getDetailsInOdersId() {
    this.manageContactsService.fetchOrderById(this.data.data.id).subscribe((data: any) => {
      console.log(data)
      this.gettransationbyIdData = data[0];
      this.orderForm.get('UserId')?.setValue(this.loginUserId)
      this.orderForm.get('id')?.setValue(this.gettransationbyIdData?.id);
      this.orderForm.get('currencyId')?.setValue(this.gettransationbyIdData?.currencyId);
      this.orderForm.get('orderId')?.setValue(this.gettransationbyIdData?.orderId);
      this.orderForm.get('clientId')?.setValue(this.gettransationbyIdData?.clientId);
      this.orderForm.get('SiteId')?.setValue(this.gettransationbyIdData?.siteId);
      this.orderForm.get('TransactionTypeId')?.setValue(this.gettransationbyIdData?.transactionTypeId);
      this.orderForm.get('paymentTypeId')?.setValue(this.gettransationbyIdData?.paymentTypeId);
      this.orderForm.get('isOrder')?.setValue(this.gettransationbyIdData?.isOrder);
      this.orderForm.get('comments')?.setValue(this.gettransationbyIdData?.comments);
      this.orderForm.get('Address')?.setValue(this.gettransationbyIdData?.clientAddress)
      this.orderForm.get('Country')?.setValue(this.gettransationbyIdData?.country)
      this.orderForm.get('ZipCode')?.setValue(this.gettransationbyIdData?.zipcode)
      this.orderForm.get('City')?.setValue(this.gettransationbyIdData?.city)
      this.orderForm.get('latitude')?.setValue(this.gettransationbyIdData?.latitude)
      this.orderForm.get('longitude')?.setValue(this.gettransationbyIdData?.longitude)
      this.orderForm.get('issueDate')?.setValue(this.gettransationbyIdData?.issueDate);
      this.orderForm.get('dueDate')?.setValue(this.gettransationbyIdData?.dueDate);
      this.orderForm.get('paymentDate')?.setValue(this.gettransationbyIdData?.dueDate);
      this.keywordlist=this.gettransationbyIdData?.keywords
      
    })
  }

  filterOptions(value: string,type:string): void {
    console.log(type)
    if(type==='users'){
      this.filteredusers = this.users$.filter((option:any) =>
        option.firstName.toLowerCase().includes(value.toLowerCase())
      );
    }else if(type==='Sites'){
      this.filteredsites = this.sites$.filter((option:any) =>
        option.companyName.toLowerCase().includes(value.toLowerCase())
      );
    }else if(type==='Contacts'){
      this.filteredcontacts = this.contacts$.filter((option:any) =>
        option.firstName.toLowerCase().includes(value.toLowerCase())
      );
    }else if(type==='Products'){
      this.filteredproducts = this.products$.filter((option:any) =>
        option.productName.toLowerCase().includes(value.toLowerCase())
      );
    }
  
  }

  getkeywordsfortransactin(i: number) {
    return this.gettransactionBody().at(i).get('keyword')?.value
  }
  gettransactionBody() {
    return this.orderForm.get('TransactionViewModel') as FormArray;
  }
  gettransactionBodyfordiscount(i: number) {
    return this.gettransactionBody().at(i).get('discount') as FormArray
  }
  addCondition() {
    this.gettransactionBody().push(this.createtransactinBody())
  }
  addConditionalBodyintransation(i: number) {
    this.gettransactionBodyfordiscount(i).push(this.createDiscountBody())
  }
  removeTransation(i: number) {
    this.gettransactionBody().removeAt(i);

  }
  removeDiscountfortransction(i: number, j: number) {
    this.gettransactionBodyfordiscount(i).removeAt(j)
  }


  // discount 
  getDiscountBody() {
    return this.orderForm.get('ListOfDiscount') as FormArray;
  }
  removeDiscount(index: number) {
    this.getDiscountBody().removeAt(index);
  }
  getDiscountTpye(index:number) {
    return this.getDiscountBody().at(index).get('type')?.value
  }
  getDiscountTpyeintransaction(i:number, j:number) {
    return this.gettransactionBodyfordiscount(i).at(j).get('type')?.value
  }
  addConditionalBody() {
    this.getDiscountBody().push(this.createDiscountBody())
  }

  createDiscountBody(): FormGroup {
    return this.fb.group({
      discountid: [],
      discountName: [],
      discountAmmount: [],
      Name: [],
      type: []
    })
  }

  // tage 
  gettransactionBodyfortag(i: number) {
    return this.gettransactionBody().at(i).get('tagViewModels') as FormArray
  }
  removetagfortransction(i: number, j: number) {
    this.gettransactionBodyfortag(i).removeAt(j)
  }
  addtageBody(i: number) {
    this.gettransactionBodyfortag(i).push(this.createtageBody())
  }
  fieldname(i: number, h: number) {
    return this.gettransactionBodyfortag(i).at(h).get('fieldName')?.value
  }
  dropdownvaluetotal(i: number, h: number) {
    return this.gettransactionBodyfortag(i).at(h).get('dropdownvaluetotal')?.value
  }

  fieldType(i: number, h: number) {
    return this.gettransactionBodyfortag(i).at(h).get('fieldType')?.value
  }
  createtageBody(): FormGroup {
    return this.fb.group({
      tagTableId: 0,
      fieldName: '',
      fieldType: '',
      fieldValue: '',
      dropdownValues: '',
      dropdownvaluetotal: []
    })
  }

  showdropdown(i:any, h:any) {
    const openAddEventDialog = this.dialog.open(AddtagCommonComponent, {
      width: '500px',
      autoFocus: false,
      disableClose: true,
      data: 'TransactionsfororderScreen',
    });
    openAddEventDialog.afterClosed().subscribe((result: any) => {
      if (result) {
        console.log(result)
        this.addtageBody(i)
        const count = this.gettransactionBodyfortag(i).length - 1
        this.gettransactionBodyfortag(i).at(count).get('fieldName')?.setValue(result?.title)
        this.gettransactionBodyfortag(i).at(count).get('fieldType')?.setValue(result?.tagType == 'Checkbox' ? 'Bool' : result?.tagType == 'Dropdown' ? 'Dropdown' : result?.tagType == 'Freefeild' ? result?.numeralType == 'Numerals' ? 'Number' : 'Text' : 'Text')
        this.gettransactionBodyfortag(i).at(count).get('fieldValue')?.setValue(result?.fieldValue)
        this.gettransactionBodyfortag(i).at(count).get('dropdownvaluetotal')?.setValue(result?.Adddropdownvalue)
      }
    })
  }





  changeDiscount(index: number, event:any) {
    this.getDiscountBody().at(index).get('discountid')?.setValue(event.id)
    this.getDiscountBody().at(index).get('discountAmmount')?.setValue(event.discountAmount + '%')
    console.log(index, event)
  }
  changeDiscountintransaction(i: number, j: number, event:any) {
    this.gettransactionBodyfordiscount(i).at(j).get('discountid')?.setValue(event.id)
    this.gettransactionBodyfordiscount(i).at(j).get('discountAmmount')?.setValue(event.discountAmount + '%')

  }

  getDiscountValue(event:any, i:number) {
    console.log(event)
    this.selectDiscountManually(event, i)
    this.SelactedproductDetails = event
    if(this.orderForm.value.TransactionTypeId==1||this.orderForm.value.TransactionTypeId=='1'){
      this.gettransactionBody().at(i).get('baseUnitPrice')?.setValue(event.sellingPrice)
      this.gettransactionBody().at(i).get('UnitPrice')?.setValue(event.sellingPrice)
    }else if(this.orderForm.value.TransactionTypeId!=null){
      this.gettransactionBody().at(i).get('baseUnitPrice')?.setValue(event.baseUnitPrice)
      this.gettransactionBody().at(i).get('UnitPrice')?.setValue(event.baseUnitPrice)
    }
  }

  selectDiscountManually(list:any, i:number) {
    console.log(i)
    console.log(list)
    if (list?.discountDropdownDtos&&list?.discountDropdownDtos.length!=0) {
      list.discountDropdownDtos.forEach((e: any) => {
        if (list?.productName) {
          const value = this.gettransactionBodyfordiscount(i)?.value.length
          this.ProductdiscountDetails.push(e)
          this.Productimg = list?.profilePicture;
          this.addConditionalBodyintransation(i)
          this.gettransactionBodyfordiscount(i).at(value).get('discountName')?.setValue(e.codeAndName)
          this.gettransactionBodyfordiscount(i).at(value).get('discountid')?.setValue(e.id)
          this.gettransactionBodyfordiscount(i).at(value).get('discountAmmount')?.setValue(e.discountAmount + '%')
          this.gettransactionBodyfordiscount(i).at(value).get('type')?.setValue('Product')
          this.gettransactionBodyfordiscount(i).at(value).get('Name')?.setValue(list?.productName)
        } else if (list?.companyName) {
          const index = this.getDiscountBody()?.value.length;
          this.SitediscountDetails.push(e)
          this.addConditionalBody()
          this.getDiscountBody().at(index).get('discountName')?.setValue(e.codeAndName)
          this.getDiscountBody().at(index).get('discountid')?.setValue(e.id)
          this.getDiscountBody().at(index).get('discountAmmount')?.setValue(e.discountAmount + '%')
          this.getDiscountBody().at(index).get('type')?.setValue('Site')
          this.getDiscountBody().at(index).get('Name')?.setValue(list?.companyName)
        } else if (list?.firstName) {
          const index = this.getDiscountBody()?.value.length;
          this.ContactdiscountDetails.push(e)
          this.contactimg = list?.profilePicture;
          this.addConditionalBody()
          this.getDiscountBody().at(index).get('discountName')?.setValue(e.codeAndName)
          this.getDiscountBody().at(index).get('discountid')?.setValue(e.id)
          this.getDiscountBody().at(index).get('discountAmmount')?.setValue(e.discountAmount + '%')
          this.getDiscountBody().at(index).get('type')?.setValue('Contact')
          this.getDiscountBody().at(index).get('Name')?.setValue(list?.firstName + list?.lastName)
        }
      })
    } else if(list?.codeAndName&&list?.codeAndName!=null) {
      const value = this.gettransactionBodyfordiscount(i)?.value.length
      this.addConditionalBodyintransation(i)
      this.gettransactionBodyfordiscount(i).at(value).get('discountid')?.setValue(list.id)
      this.gettransactionBodyfordiscount(i).at(value).get('discountName')?.setValue(list.codeAndName)
      this.gettransactionBodyfordiscount(i).at(value).get('discountAmmount')?.setValue(list.discountAmount + '%')
      this.gettransactionBodyfordiscount(i).at(value).get('Name')?.setValue('Manually add')
      this.gettransactionBodyfordiscount(i).at(value).get('type')?.setValue('Transation')
    }
  }


  getAllDiscounts() {
    this.manageContactsService.FindDiscountsForDropdown(false, false).subscribe((data: any) => {
      console.log(data)
      this.discountDetails = data

    })
  } 
  genrattingNewCode() {
    this.unqOrderId = '';
    this.makeRandom(6, this.possible);

  }
  makeRandom(lengthOfCode: number, possible: string) {
    for (let i = 0; i < lengthOfCode; i++) {
      this.unqOrderId = this.unqOrderId + possible.charAt(Math.floor(Math.random() * possible.length));
    }
  }



  closedialogbox() {
    this.dialog.closeAll();
  }

  checkOrderId(templateRef: TemplateRef<any>) {
    this.OrderId = this.orderForm.value.orderId;
    if (this.OrderId) {
      this.manageTransactionService.FindTransactionsByOrderId(this.OrderId).subscribe((res: any) => {
        this.ides = res.map((e:any) => {return e.id})
        this.TransactionList = res;
        if (this.TransactionList.length == 0) {
          this.dialog.open(templateRef)
        } else {
          this.orderForm.get('transactionIds')?.setValue(this.ides);
        }
      })
    }
  }



  // discount 
  getproductdetails(event:any, i: number) {
    console.log(i)
    // buy 
    if (this.orderForm.value.TransactionTypeId == 1) {
      this.gettransactionBody().at(i).get('UnitPrice')?.setValue(event?.baseUnitPrice)
    }
    // sell 
    else if (this.orderForm.value.TransactionTypeId == 2) {
      this.gettransactionBody().at(i).get('UnitPrice')?.setValue(event?.sellingPrice)
    }
    this.selectDiscountManually(event, i)
  }

  GetQuantity(event:any, i: number) {
    console.log(i)
    const unitprice = this.gettransactionBody().at(i).get('UnitPrice')?.value
    this.gettransactionBody().at(i).get('FinalPrice')?.setValue(event * unitprice)
  }
  
  GetUnitPrice(event:any, i: number) {
    console.log(i)
    const Quantity = this.gettransactionBody().at(i).get('Quantity')?.value
    this.gettransactionBody().at(i).get('FinalPrice')?.setValue(Quantity * event)
  }

  onSubmit() {
    console.log(this.orderForm.value) 
    this.manuvaldicontprecentage=0
    if(this.orderForm.value.ListOfDiscount){
      this.orderForm.value.ListOfDiscount.forEach((element:any) => {
        this.manuvaldicontprecentage=this.manuvaldicontprecentage+Number(element.discountAmmount.split('%')[0])
      });

    }
    if(this.orderForm.value.TransactionViewModel){
      this.orderForm.value.TransactionViewModel.forEach((elementA:any) => {
      let manuval=0
       const orginalfinalprice=elementA.Quantity*elementA.baseUnitPrice
       const discountcal=100-(elementA.FinalPrice/orginalfinalprice)*100
        elementA.discount.forEach((elementB:any) => {
          manuval=manuval+Number(elementB.discountAmmount.split('%')[0])
        });
        this.manuvaldicontprecentage=this.manuvaldicontprecentage+discountcal+manuval
      });
      console.log(this.manuvaldicontprecentage)
      const FindUserDiscountLimit=this.FindUserDiscountLimit
      console.log(this.FindUserDiscountLimit)
      if(FindUserDiscountLimit!=0){
        if((this.manuvaldicontprecentage==FindUserDiscountLimit)||(this.manuvaldicontprecentage<FindUserDiscountLimit)){
          this.onSubmit1()
        }else{
          this.APIerrormessage(`Discount limit exceeded. Your discount limit is ${FindUserDiscountLimit}% but order  has ${this.manuvaldicontprecentage}% discount`, 'Create Transactions');
        }
      }
    }
  }

  onSubmit1() {
    this.orderForm.get('keyword')?.setValue(this.keywordlist.toString())
    if (this.orderForm.get('TransactionTypeId')?.value === '1' || this.orderForm.get('TransactionTypeId')?.value === 1) {
      this.orderForm.get('TransactionTypeName')?.setValue('Buy')
    } else {
      this.orderForm.get('TransactionTypeName')?.setValue('Sale')
    }
    this.orderFormdata=this.orderForm.value
    this.getDiscountBody()?.value.forEach((element:any) => {
       if (element.type == 'Site') {
        this.siteDiscountId = element.discountid
      } else if (element.type == 'Contact') {
        this.contactDiscountId = element.discountid
      }
    })
    if(this.siteDiscountId!=null){
      this.orderForm.get('siteDiscountId')?.setValue(this.siteDiscountId)
    }
    if(this.contactDiscountId!=null){
      this.orderForm.get('contactDiscountId')?.setValue(this.contactDiscountId)
    }
    let transactionDiscountIds:any=[]
    this.orderFormdata.TransactionViewModel.forEach((element:any,index:number) => {
      transactionDiscountIds=[]
      this.gettransactionBody().at(index).get('TransactionTypeId')?.setValue(this.orderFormdata.TransactionTypeId)
      this.gettransactionBody().at(index).get('TransactionTypeName')?.setValue(this.orderFormdata.TransactionTypeName)
      this.gettransactionBody().at(index).get('paymentTypeId')?.setValue(this.orderFormdata.paymentTypeId)
      this.gettransactionBody().at(index).get('currencyId')?.setValue(this.orderFormdata.currencyId)
      this.gettransactionBody().at(index).get('UserId')?.setValue(this.orderFormdata.UserId)
      this.gettransactionBody().at(index).get('SiteId')?.setValue(this.orderFormdata.SiteId)
      this.gettransactionBody().at(index).get('contactsId')?.setValue(this.orderFormdata.clientId)
      this.gettransactionBody().at(index).get('orderId')?.setValue(this.orderFormdata.orderId)
      this.gettransactionBody().at(index).get('TransactionDate')?.setValue(this.orderFormdata.issueDate)
      this.gettransactionBody().at(index).get('ExpirationDate')?.setValue(this.orderFormdata.dueDate)
      this.gettransactionBody().at(index).get('comments')?.setValue(this.orderFormdata.comments)
      console.log(this.gettransactionBody().at(index).get('keyword')?.value)
      const keywords=this.gettransactionBody().at(index).get('keyword')?.value.toString()
      this.gettransactionBody().at(index).get('keyword')?.setValue(keywords)
      element.discount.forEach((A:any) => {
        if (A.type == 'Product') {
          this.gettransactionBody().at(index).get('productDiscountId')?.setValue(A.discountid)
        } else if (A.type == 'Manually add') {
          transactionDiscountIds.push(A.discountid)
       }
     })
     if(transactionDiscountIds.length!=0){
      this.gettransactionBody().at(index).get('transactionDiscountIds')?.setValue(transactionDiscountIds)
    }
     if(this.siteDiscountId!=null){
      this.gettransactionBody().at(index).get('siteDiscountId')?.setValue(this.siteDiscountId)
    }
    if(this.contactDiscountId!=null){
      this.gettransactionBody().at(index).get('contactDiscountId')?.setValue(this.contactDiscountId)
    }
    });
    if(this.screenType=='CreateOrder'||this.screenType=='CreateduplicateOrder'){
       this.creatorder()
    }else if(this.screenType=='EditOrder'){
        this.UpdateOrder()
    }
  }

  // creatorder 
  creatorder(){
    this.orderForm.removeControl("id")
    if (localStorage.getItem('DemoOrganation') === 'true') {
      this.popupforerrormessage(
        'This button allows you to add new Order',
        'Create order'
      );
    } else {
      this.manageContactsService.creatorder(this.orderForm.value).subscribe((res: any) => {
        console.log(res)
        if(res){
          if(res.response[0].code=='200'){
            this.matDialogRef.close(true)
            this.snackBar.open('Successfully create order', 'Undo', {duration: 3000});
          }else{
        this.snackBar.open('Failed to creat order', 'Undo', {duration: 3000});
        this.APIerrormessage(res.response[0].message,'Create Orders')


          }

        }
      },(error)=>{
        console.log(error)
        this.snackBar.open('Failed to creat order', 'Undo', {duration: 3000});
        if(error.status==429){
          this.APIerrormessage(error?.error,'Create Orders')
        }
      })
    }
  }
  // UpdateOrder 

  UpdateOrder(){
    if (localStorage.getItem('DemoOrganation') === 'true') {
      this.popupforerrormessage(
        'This button allows you to add Update Order',
        'Update order'
      );
    } else {
      this.manageContactsService.updateorder(this.orderForm.value).subscribe((res: any) => {
        this.matDialogRef.close(true)
        this.snackBar.open('successfully Update order', 'Undo', { duration: 3000 });
      },error=>{
        this.snackBar.open('Update Faild', 'Undo', { duration: 3000 });
      })
    }
  }


  // creatTransaction 
  creatTransaction() {
    const createOrderDialog = this.dialog.open(CreateTransactionComponent, {
      width: '500px',
      autoFocus: false,
      disableClose: true
    });
    createOrderDialog.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  // ---------------- 
  // auto chip for keyword 
  // ----------- 
  add(event: MatChipInputEvent) {
    console.log(event.value)
    const value = (event.value || '').trim();
    if (value) { this.keywordlist.push(value); }
    // Clear the input value
    event.input.value = ''

  }
  remove(value: string) {
    const index = this.keywordlist.indexOf(value);
    if (index >= 0) {
      this.keywordlist.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent) {
    this.keywordlist.push(event.option.viewValue);
    this.orderForm.get('keyword')?.setValue(null);
  }
  addkeywordfortransaction(event: MatChipInputEvent, i: number) {
    console.log(event.value)
    let keywords = []
    keywords = this.gettransactionBody().at(i).get('keyword')?.value
    const value = (event.value || '').trim();
    if (value) {
      console.log(value)
      keywords.push(value);
      this.gettransactionBody().at(i).get('keyword')?.setValue(keywords)
    }
    event.input.value = ''
  }

  removekeywordfortransaction(value: string, i: number) {
    let keywords = []
    keywords = this.gettransactionBody().at(i).get('keyword')?.value
    const index = keywords.indexOf(value);
    if (index >= 0) {
      keywords.splice(index, 1);
      this.gettransactionBody().at(i).get('keyword')?.setValue(keywords)
    }
  }








  dropDowenApis() {
    this.paymentTypes$ = this.manageTransactionService.fetchAllPaymentTypesService();
    this.manageContactsService.findAllContactsDropdown().subscribe((result)=>{
      if(result){
        this.contacts$=result
        this.filteredcontacts=result
      }
    });
     this.manageUsersService.findAllUsersDropdown().subscribe((result)=>{
      if(result){
        this.users$=result
        this.filteredusers=result
      }
    });
    this.manageProductssService.findAllProductsDropdown().subscribe((result)=>{
      if(result){
        this.products$=result
        this.filteredproducts=result
      }
    });
     this.manageSitesService.findAllSitesDropdown().subscribe((result)=>{
      if(result){
        this.sites$=result
        this.filteredsites=result

      }
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


  popupforerrormessage(message:any, header:any) {
    this.dialog.open(PopupErrorMessageComponent, {
      width: '550px',
      data: { message: message, header: header },
      autoFocus: false,
      disableClose: true,
    });
  }

}
