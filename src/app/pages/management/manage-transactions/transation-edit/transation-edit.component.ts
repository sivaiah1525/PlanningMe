import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ManageTransactionsService } from 'src/app/core/services/manage-transactions.service';
import { PaymentType } from 'src/app/core/models/payment-type.model';
import { Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ManageProductsService } from 'src/app/core/services/manage-products.service';
import { Product } from 'src/app/core/models/product.model';
import { User } from 'src/app/core/models/user.model';
import { Contact } from 'src/app/core/models/contact.model'; 
import { Site } from 'src/app/core/models/site.model';
import { ManageContactsService } from 'src/app/core/services/manage-contacts.service';
import { ManageUsersService } from 'src/app/core/services/manage-users.service';
import { ManageSitesService } from 'src/app/core/services/manage-sites.service';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { AddtagCommonComponent } from 'src/app/pages/commonForAll/addtag-common/addtag-common.component';
import { DeleteCommomComponent } from 'src/app/pages/commonForAll/delete-commom/delete-commom.component';
import { ViewNotesComponent } from 'src/app/pages/files/components/view-notes/view-notes.component';
import { AddNotesComponent } from 'src/app/pages/files/components/add-notes/add-notes.component';
import { AddFileComponent } from 'src/app/pages/files/components/add-file/add-file.component';
import { FilesAndNotesShareLinkComponent } from 'src/app/pages/files/components/files-and-notes-share-link/files-and-notes-share-link.component';
import { FileService } from 'src/app/core/services/file.service';
import { FileandnotesformanagementComponent } from 'src/app/pages/commonForAll/fileandnotesformanagement/fileandnotesformanagement.component';
import * as FileSaver from 'file-saver';
import { TranslateService } from '@ngx-translate/core';
import { GoogleValidationAddressService } from 'src/app/core/services/google-validation-address.service';
import { ApiErrorMessagesComponent } from 'src/app/api-error-messages/api-error-messages.component';
import { PopupErrorMessageComponent } from 'src/app/popup-error-message/popup-error-message.component';

@Component({
  selector: 'app-transation-edit',
  templateUrl: './transation-edit.component.html',
  styleUrls: ['./transation-edit.component.scss']
})

export class TransationEditComponent implements OnInit {
  transactionForm: FormGroup;
  transactiondetails!: any;
  paymentTypes$!: Observable<PaymentType[]>;
  products$!: Observable<Product[]>;
  sites$!: Observable<Site[]>;
  contacts$!: Observable<Contact[]>;
  users$!: Observable<User[]>;
  TransactionType = [{ name: 'Buy', id: 1 }, { name: 'Sale', id: 2 }]
  Currency = [{ name: 'Euro', id: 1 }, { name: 'Dollar', id: 2 }]
  // auto chip for keyword
  separatorKeysCodes: number[] = [ENTER, COMMA];
  keywordlist: string[] = [];
  tagViewModels:any = [];
  tags: any;
  dropdownvalue:any = [];
  dropdownfeild :any= {};
  datadelete: any;
  datadeleteindex: any;
  checked: any;
  selectedtagvalue: any;
  selectedvalue: any;
  discountDetails: any;
  ContactdiscountDetails:any = [];
  ProductdiscountDetails:any = [];
  SitediscountDetails:any = [];
  contactimg = '';
  Productimg = '';
  transacrtionDiscountIds:any = [];
  contactDiscountId!: any;
  productDiscountId!: any;
  siteDiscountId!: any;
  UnutPrice!: number
  FinalePrice!: number
  SelactedproductDetails: any;
  screenType: any;
  Freefeild = {};
  viewnumeral = {};
  viewtagmodel = {};
  possible = "098765432123456789009876543212345678";
  OrderIdCode = ''
  transationDetails: any;
  AttachmentFileCount: any;
  AttachmentFileList: any;
  AttachmentNotesCount: any;
  AttachmentNotesList: any;
  ShowAttachmentFile = false
  ShowAttachmentNotes = false
  notesCount = 0;
  filesCount = 0;
  options = {
    types: ['geocode'],
    componentRestrictions: {},
  };
  FindUserDiscountLimit :any=0
  manuvaldicontprecentage=0
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private manageTransactionService: ManageTransactionsService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private matDialogRef: MatDialogRef<TransationEditComponent>,
    private manageContactsService: ManageContactsService,
    private manageUsersService: ManageUsersService,
    private manageSitesService: ManageSitesService,
    private manageProductssService: ManageProductsService,
    private manageTransactionsService: ManageTransactionsService,
    private fileService: FileService,
    private userService: ManageUsersService,
    private translate: TranslateService ,
    private googleAddress: GoogleValidationAddressService,
  ) {
    if(localStorage.getItem('lang')){
      const lang:any=localStorage.getItem('lang')
      this.translate.use(lang);
    }else{
      this.translate.use('English');
    }
    this.transactionForm = this.fb.group({
      id: [''],
      OrderId: [''],
      TransactionDate: [''],
      transactionTypeId: [''],
      TransactionTypeName: [''],
      Quantity: [''],
      ExpirationDate: [''],
      FinalPrice: [''],
      baseUnitPrice: [''],
      UnitPrice: [''],
      Comments: [''],
      keyword: [''],
      Address: [''],
      Country: [''],
      ZipCode: [''],
      City: [''],
      latitude: ['0'],
      longitude: ['0'],
      ContactsId: [''],
      ProductsId: [''],
      siteId: [''],
      paymentTypeId: [''],
      currencyId: [''],
      userId: [''],
      statusOfTransaction: [1],
      ManuallyDddDiscount: [''],
      contactDiscountId: [''],
      productDiscountId: [''],
      siteDiscountId: [''],
      transacrtionDiscountIds: [''],
      ListOfDiscount: this.fb.array([]),
      Addtages: this.fb.array([])
    })
  }

  ngOnInit(): void {
    this.gettags();
    this.getAllDiscounts()
    console.log(this.data)
    this.transationDetails = this.data.data
    this.screenType = this.data.screenType
    if (this.data.screenType == 'UpdateTransation') {
      this.getDetailsById()
    } else if (this.data.screenType == 'CreateduplicateTransation') {
      this.getDetailsById()
      setTimeout(() => {
        this.makeRandom(6, this.possible);
        this.transactionForm.get('TransactionDate')?.setValue(new Date())
      }, 2000);
    }
    this.contacts$ = this.manageContactsService.findAllContactsDropdown();
    this.users$ = this.manageUsersService.findAllUsersDropdown();
    this.products$ = this.manageProductssService.findAllProductsDropdown();
    this.sites$ = this.manageSitesService.findAllSitesDropdown();
    this.paymentTypes$ = this.manageTransactionService.fetchAllPaymentTypesService();

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
          .subscribe((res:any) => {
            if (res) {
              this.transactionForm.get('Address')?.setValue(res.address);
              this.transactionForm.get('ZipCode')?.setValue(res.zipCode);
              this.transactionForm.get('City')?.setValue(res.city);
              this.transactionForm.get('Country')?.setValue(res.country);
            }
          });
      }
    }
      // ------------0000000000000
      handleAddressChange(place: object) {
        const data = this.googleAddress.getFullAddress(place);
        this.transactionForm.get('latitude')?.setValue(data.latitude.toString());
        this.transactionForm.get('longitude')?.setValue(data.longitude.toString());
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
  

  genrattingNewCode() {
    this.OrderIdCode = '';
    this.makeRandom(6, this.possible);

  }
  makeRandom(lengthOfCode: number, possible: string) {
    for (let i = 0; i < lengthOfCode; i++) {
      this.OrderIdCode = this.OrderIdCode + possible.charAt(Math.floor(Math.random() * possible.length));
      this.transactionForm.get('OrderId')?.setValue(this.OrderIdCode)
    }
  }


  getDetailsById() {
    this.manageTransactionService.fetchTransactionById(this.data.data.id).subscribe((res: any) => {
      if (res) {
        console.log(res)
        this.transationDetails = res
        this.keywordlist = res?.keywords
        this.filesCount = res?.filesCount
        this.notesCount = res?.notesCount
        this.transactionForm.get('OrderId')?.setValue(res?.orderId)
        this.transactionForm.get('TransactionDate')?.setValue(res?.transactionDate)
        this.transactionForm.get('ExpirationDate')?.setValue(res?.expirationDate)
        this.transactionForm.get('id')?.setValue(res?.id)
        this.transactionForm.get('transactionTypeId')?.setValue(res?.transactionTypeId.toString())
        this.transactionForm.get('Quantity')?.setValue(res?.quantity)
        this.transactionForm.get('FinalPrice')?.setValue(res?.finalPrice)
        this.transactionForm.get('baseUnitPrice')?.setValue(res?.unitPrice)
        this.transactionForm.get('UnitPrice')?.setValue(res?.unitPrice)
        this.transactionForm.get('Comments')?.setValue(res?.comments)
        this.transactionForm.get('keyword')?.setValue(res?.keyword)
        this.transactionForm.get('ContactsId')?.setValue(res?.contactId)
        this.transactionForm.get('ProductsId')?.setValue(res?.productId)
        this.transactionForm.get('siteId')?.setValue(res?.siteId)
        this.transactionForm.get('paymentTypeId')?.setValue(res?.paymentTypeId)
        this.transactionForm.get('currencyId')?.setValue(res?.currencyId)
        this.transactionForm.get('userId')?.setValue(res?.userId)
        this.transactionForm.get('Address')?.setValue(res?.address)
        this.transactionForm.get('Country')?.setValue(res?.country)
        this.transactionForm.get('ZipCode')?.setValue(res?.ZipCode)
        this.transactionForm.get('City')?.setValue(res?.city)
        this.transactionForm.get('latitude')?.setValue(res?.latitude)
        this.transactionForm.get('longitude')?.setValue(res?.longitude)
        if (res.statusName == 'Validated') {
          this.transactionForm.get('statusOfTransaction')?.setValue(1)
        } else {
          this.transactionForm.get('statusOfTransaction')?.setValue(0)
        }
      }
    })
    setTimeout(() => {
      this.contacts$.subscribe((data: any) => {
        if (data.length != 0) {
          data.forEach((element:any) => {
            if (this.transationDetails.contactId == element.id) {
              console.log('log-2 c')
              this.getDiscountValue(element, 'Contacts')
            }
          })
        }
      })
    });

    setTimeout(() => {
      this.products$.subscribe((data: any) => {
        if (data.length != 0) {
          data.forEach((element:any) => {
            if (this.transationDetails.productId == element.id) {
              console.log('log-2 p')
              this.getDiscountValue(element, 'Products')
            }
          })
        }
      })
    });
    setTimeout(() => {
      this.sites$.subscribe((data: any) => {
        if (data.length != 0) {
          data.forEach((element:any) => {
            if (this.transationDetails.siteId == element.id) {
              console.log('log-2 s')
              this.getDiscountValue(element, 'Sites')
            }
          })
        }
      })
    });
  }


  // tag 
  createtageBody(): FormGroup {
    return this.fb.group({
      tagTableId: 0,
      fieldName: '',
      fieldType: '',
      fieldValue: '',
      dropdownValues: '',
      dropdownvaluetotal: ''
    })
  }
  gettageBody() {
    return this.transactionForm.get('Addtages') as FormArray;
  }
  addtageBody() {
    this.gettageBody().push(this.createtageBody())
  }
  fieldname(i: number) {
    return this.gettageBody().at(i).get('fieldName')?.value
  }
  dropdownvaluetotal(i: number) {
    return this.gettageBody().at(i).get('dropdownvaluetotal')?.value.split(',')
  }

  fieldType(i: number) {
    return this.gettageBody().at(i).get('fieldType')?.value
  }
  tagTableId(i: number) {
    return this.gettageBody().at(i).get('tagTableId')?.value
  }
  removeConditionalBody(i: number) {
    this.gettageBody().removeAt(i);
  }


  GetQuantity(event:any) {
    this.FinalePrice = event * this.UnutPrice
  }


  // discount 
  getDiscountValue(event:any, name:any) {
    if (name == 'Products') {
      this.SelactedproductDetails = event
      this.selectDiscountManually(event)
    } else {
      this.selectDiscountManually(event)
    }
  }


  getTransactionType(event:any) {
    console.log(event)
    console.log(this.SelactedproductDetails)
    if (event == 'Sell'||event == 'Sale') {
      this.UnutPrice = this.SelactedproductDetails.sellingPrice
    } else {
      this.UnutPrice = this.SelactedproductDetails.baseUnitPrice
    }
    this.transactionForm.get('baseUnitPrice')?.setValue(this.UnutPrice)
    this.transactionForm.get('UnitPrice')?.setValue(this.UnutPrice)
  }

  removeDiscount(index: number) {
    this.getDiscountBody().removeAt(index);
  }
  changeDiscount(index: number, event:any) {
    this.getDiscountBody().at(index).get('discountid')?.setValue(event.id)
    this.getDiscountBody().at(index).get('discountAmmount')?.setValue(event.discountAmount + '%')
  }

  getAllDiscounts() {
    this.manageContactsService.FindDiscountsForDropdown(false, false).subscribe((data: any) => {
      this.discountDetails = data

    })
  }
  getDiscountBody() {
    return this.transactionForm.get('ListOfDiscount') as FormArray;
  }

  addConditionalBody() {
    this.getDiscountBody().push(this.createDiscountBody())
  }

  getDiscountTpye(index:any) {
    return this.getDiscountBody().at(index).get('type')?.value
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
  selectDiscountManually(list:any) {
    console.log(list)
    if (list?.discountDropdownDtos) {
      list.discountDropdownDtos.forEach((e: any) => {
        const index = this.getDiscountBody()?.value.length;
        this.addConditionalBody()
        this.getDiscountBody().at(index).get('discountName')?.setValue(e.codeAndName)
        this.getDiscountBody().at(index).get('discountid')?.setValue(e.id)
        this.getDiscountBody().at(index).get('discountAmmount')?.setValue(e.discountAmount + '%')
        if (list?.productName) {
          this.ProductdiscountDetails.push(e)
          this.Productimg = list?.profilePicture;
          this.getDiscountBody().at(index).get('type')?.setValue('Product')
          this.getDiscountBody().at(index).get('Name')?.setValue(list?.productName)
        } else if (list?.companyName) {
          this.SitediscountDetails.push(e)
          this.getDiscountBody().at(index).get('type')?.setValue('Site')
          this.getDiscountBody().at(index).get('Name')?.setValue(list?.companyName)
        } else if (list?.firstName) {
          this.ContactdiscountDetails.push(e)
          this.contactimg = list?.profilePicture;
          this.getDiscountBody().at(index).get('type')?.setValue('Contact')
          this.getDiscountBody().at(index).get('Name')?.setValue(list?.firstName + list?.lastName)
        }
      })
    } else {
      if (list.discountAmount && list.codeAndName) {
        console.log(list)
        const index = this.getDiscountBody()?.value.length
        this.addConditionalBody()
        this.getDiscountBody().at(index).get('discountid')?.setValue(list.id)
        this.getDiscountBody().at(index).get('discountName')?.setValue(list.codeAndName)
        this.getDiscountBody().at(index).get('discountAmmount')?.setValue(list.discountAmount + '%')
        this.getDiscountBody().at(index).get('Name')?.setValue('Manually add')
        this.getDiscountBody().at(index).get('type')?.setValue('Transation')
      }
    }
  }


  onSubmit(){
    if (localStorage.getItem('DemoOrganation') === 'true') {
      this.popupforerrormessage(
        'This button allows you to add new Transactions',
        'Create Transaction'
      );
    } else {
      if(this.transactionForm?.value.Quantity==0){
        this.ApplyTransation()

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
              this.ApplyTransation()
            }else{
              this.APIerrormessage(`Discount limit exceeded. Your discount limit is ${FindUserDiscountLimit}% but order  has ${finaldiscount}% discount`, 'Create Transactions');
            }
          }else{
            if((finaldiscount==(FindUserDiscountLimit-result))||(finaldiscount<(FindUserDiscountLimit-result))){
              this.ApplyTransation()
            }else{
              this.APIerrormessage(`Discount limit exceeded. Your discount limit is ${FindUserDiscountLimit-result}% but order  has ${finaldiscount}% discount`, 'Create Transactions');
            }
          }
          console.log(result)
      }))
    }
    }
  }



  ApplyTransation() {
    this.transacrtionDiscountIds=[]
    this.contactDiscountId=null
    this.siteDiscountId=null
    this.productDiscountId=null
    if (this.transactionForm.get('transactionTypeId')?.value ==='1' || this.transactionForm.get('transactionTypeId')?.value ===1) {
      this.transactionForm.get('TransactionTypeName')?.setValue('Buy')
    } else {
      this.transactionForm.get('TransactionTypeName')?.setValue('Sale') 
    }
    this.transactionForm.get('keyword')?.setValue(this.keywordlist.toString())
    this.getDiscountBody()?.value.forEach((element:any) => {
      if (element.type == 'Product') {
        this.productDiscountId = element.discountid
      } else if (element.type == 'Site') {
        this.siteDiscountId = element.discountid

      } else if (element.type == 'Contact') {
        this.contactDiscountId = element.discountid

      } else if (element.type == 'Transation') {
        this.transacrtionDiscountIds.push(element.discountid)
      }
    })

        // ------------------------ 
        if(this.transacrtionDiscountIds.length!=0){
          this.transactionForm.get('transacrtionDiscountIds')?.setValue(this.transacrtionDiscountIds)
        }else{
          this.transactionForm.get('transacrtionDiscountIds')?.setValue([])
        }
        if(this.siteDiscountId!=null){
          this.transactionForm.get('siteDiscountId')?.setValue(this.siteDiscountId)
        }else{
          this.transactionForm.get('siteDiscountId')?.setValue(null)
        }
        if(this.contactDiscountId!=null){
          this.transactionForm.get('contactDiscountId')?.setValue(this.contactDiscountId)
        }else{
          this.transactionForm.get('contactDiscountId')?.setValue(null)
        }
        if(this.productDiscountId!=null){
          this.transactionForm.get('productDiscountId')?.setValue(this.productDiscountId)
        }else{
          this.transactionForm.get('productDiscountId')?.setValue(null)
        }
    if (this.screenType == 'CreateduplicateTransation') {
      this.transactionForm.removeControl('id');
      this.manageTransactionService.createTransactionService(this.getapidataformat(this.transactionForm?.value)).subscribe((res: any) => {
        if (res) {
          if(res.response[0].code=='200'){
            this.matDialogRef.close(true)
            this.snackBar.open(res.response[0].message);
          }else{
            this.APIerrormessage(res.response[0].messag,'CreateduplicateTransation')
          }

        }
      })
    } else {
      this.manageTransactionService.updateTransactionService(this.getapidataformat(this.transactionForm?.value)).subscribe((res: any) => {
        if (res) {
          if(res.response[0].code=='200'){
            this.matDialogRef.close(true)
            this.snackBar.open(res.response[0].message);
          }else{
            this.APIerrormessage(res.response[0].message,'updateTransaction')
          }
        }
      });
    }
  }


  showdropdown() {
    const openAddEventDialog = this.dialog.open(AddtagCommonComponent, {
      width: '500px',
      autoFocus: false,
      disableClose: true,
      data: 'Transactions',
    });
    openAddEventDialog.afterClosed().subscribe((result: any) => {
      if (result) {
        this.gettageBody().clear()
        this.gettags();
      }
    })
  }
  deletetagDialog(i:any, type:any,) {
    const data = {
      id: this.tagTableId(i),
      type: 'Transactions'
    }
    const deleteorder = this.dialog.open(DeleteCommomComponent, { data: { data, type: type, entity: 'Transactions' } });
    deleteorder.afterClosed().subscribe((result: any) => {
      if (result) {
        this.gettageBody().clear()
        this.gettags();
      }
    })
  }


  getapidataformat(data:any){
    console.log(data)
    const finalformat:any={
      "id": data?.id,
      "transactionDate":data?.TransactionDate,
      "productsId": data?.ProductsId,
      "siteId": data?.siteId,
      "deliveryAddress":data?.Address,
      "country": data?.Country,
      "city": data?.City,
      "zipcode": data?.ZipCode,
      "latitude": data?.latitude?data?.latitude:'0',
      "longitude": data?.longitude?data?.longitude:'0',
      "quantity": data?.Quantity,
      "transactionTypeId": data?.transactionTypeId,
      "transactionTypeName": data?.TransactionTypeName,
      "orderId": data?.OrderId,
      "finalPrice": data?.FinalPrice,
      "baseUnitPrice": data?.baseUnitPrice,
      "unitPrice": data?.UnitPrice,
      "paymentTypeId": data?.paymentTypeId,
      "currencyId": data?.currencyId,
      "contactsId": data?.ContactsId,
      "userId": data?.userId,
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
    this.manageTransactionsService.gettag('Transactions').subscribe((data: any) => {
      if (data) {
        data.forEach((element:any, index:any) => {
          this.addtageBody()
          this.gettageBody().at(index).get('tagTableId')?.setValue(element?.tagTableId)
          this.gettageBody().at(index).get('fieldName')?.setValue(element?.fieldName)
          this.gettageBody().at(index).get('fieldType')?.setValue(element?.fieldType)
          this.gettageBody().at(index).get('fieldValue')?.setValue(element?.fieldValue)
          this.gettageBody().at(index).get('dropdownvaluetotal')?.setValue(element?.dropdownValues)
        });
      }
      this.tags = data;
    });
  }


  // AddFile
  AddFile() {
    const addfile = this.dialog.open(AddFileComponent, {
      disableClose: true,
      width: '500px',
      data: {
        data: this.transationDetails,
        attachmentLevel: 'Transactions',
        ismanage: true,
        type: 'single'
      },
      panelClass: ['addFiles']
    });
    addfile.afterClosed().subscribe(result => {
      this.ShowAttachmentFile = true
      this.ShowAttachmentNotes = true
      this.getDetailsById();
      this.findnotesLinked();
      this.findfilesLinked();
    });
  }

  // AddNote
  AddNote() {
    const addnote = this.dialog.open(AddNotesComponent, {
      disableClose: true,
      data: {
        data: this.transationDetails,
        attachmentLevel: 'Transactions',
        ismanage: true,
        type: 'single'
      },
      width: '600px',
      panelClass: ['addNotes']
    });
    addnote.afterClosed().subscribe(result => {
      this.ShowAttachmentFile = true
      this.ShowAttachmentNotes = true
      this.getDetailsById();
      this.findnotesLinked();
      this.findfilesLinked();
    });
  }

  addNewFileAndNote() {
    const addNewFileAndNote = this.dialog.open(FileandnotesformanagementComponent, {
      width: '500px',
    })
    addNewFileAndNote.afterClosed().subscribe(result => {
      if (result) {
        if (result == 'file') {
          this.AddFile()
        } else {
          this.AddNote()
        }
      }
    });
  }

  // findfilesLinked 
  findfilesLinked() {
    this.userService.getfile(this.transationDetails.id, 'Transactions').subscribe((res) => {
      this.AttachmentFileList = res;
      this.ShowAttachmentFile = !this.ShowAttachmentFile
    });
  }
  // findnotesLinked
  findnotesLinked() {
    this.userService.getnotes(this.transationDetails.id, 'Transactions').subscribe((res) => {
      this.AttachmentNotesList = res;
      console.log(this.AttachmentNotesList)
      this.ShowAttachmentNotes = !this.ShowAttachmentNotes
    });
  }
  // ViewLink 
  ViewLink(name:any, id:any) {
    if (name == 'File') {
      this.fileService.getFile(id).subscribe((res) => {
        console.log(res)
        if (res) {
          window.open(res.attachedFile, '_blank');
        }
      })
    } else {
      this.fileService.getNote(id,1,10).subscribe((res) => {
        console.log(res)
        if (res) {
          window.open(res.notes, '_blank');
        }
      })
    }
  }
  // sharefileAndNote 
  sharefileAndNote(name:any, data:any) {
    const editFileDialog = this.dialog.open(FilesAndNotesShareLinkComponent, {
      width: '500px',
      data: data
    });
    editFileDialog.afterClosed().subscribe(result => {
      console.log(result);
    });
  }
  // EditNote 
  EditfileAndNote(name:any, id:any) {
    if (name == 'File') {
      this.fileService.getFile(id).subscribe(data => {
        const editFileDialog = this.dialog.open(AddFileComponent, {
          width: '500px',
          data: {
            FileEdit: true,
            data: data
          }
        });
        editFileDialog.afterClosed().subscribe(result => {
          this.ShowAttachmentFile = true
          this.ShowAttachmentNotes = true
          this.getDetailsById();
          this.findnotesLinked();
          this.findfilesLinked();
        });
      });
    } else {
      this.fileService.getNote(id,1,10).subscribe(data => {
        const editFileDialog = this.dialog.open(AddNotesComponent, {
          width: '500px',
          data: {
            NoteEdit: true,
            data: data
          }
        });
        editFileDialog.afterClosed().subscribe(result => {
          this.ShowAttachmentFile = true
          this.ShowAttachmentNotes = true
          this.getDetailsById();
          this.findnotesLinked();
          this.findfilesLinked();
        });
      });
    }
  }


  Downloadfile(data:any) {
    console.log(data)
    this.fileService.downloadFile(data.id, data?.isPrivate == false ? true : false).subscribe((result) => {
      if (result) {
        const blob = new Blob([result], { type: result.type });
        FileSaver.saveAs(blob);
      }
    }, err => {
      console.log(err)
    })
  }

  // DeleteFileAreNote 
  deleteDialogConfirmation(data:any, type:any) {
    const deleteorder = this.dialog.open(DeleteCommomComponent, { data: { data, type: type } });
    deleteorder.afterClosed().subscribe((result: any) => {
      this.ShowAttachmentFile = true
      this.ShowAttachmentNotes = true
      this.getDetailsById()
      this.findnotesLinked();
      this.findfilesLinked();
    })
  }

  // ViewNote content 
  ViewNoteContent(data:any) {
    this.fileService.getNote(data.id,1,10).subscribe((Result: any) => {
      console.log(Result);
      const viewNoteDialog = this.dialog.open(ViewNotesComponent, {
        width: '500px',
        autoFocus: false,
        disableClose: true,
        data: { type: 'view', data: Result },
      });
      viewNoteDialog.afterClosed().subscribe(result => {
        if (result) {
          this.ShowAttachmentFile = true
          this.ShowAttachmentNotes = true
          this.getDetailsById();
          this.findnotesLinked();
          this.findfilesLinked();
        }
      });
    });
  }














  // ---------------- 
  // auto chip for keyword 
  // ----------- 
  add(event: MatChipInputEvent) {
    console.log(event?.value)
    const value = (event?.value || '').trim();
    if (value) { this.keywordlist.push(value); }
    // Clear the input value
    // event.input?.value = ''
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
