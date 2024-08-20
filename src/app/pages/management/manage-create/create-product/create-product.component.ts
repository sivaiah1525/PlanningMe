import { Component, OnInit, TemplateRef, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Measure } from 'src/app/core/models/measure.model';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ManageProductsService } from 'src/app/core/services/manage-products.service';
import { Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MessageService } from 'src/app/core/services/message.service';
import { ManageproductService } from 'src/app/pages/management/manage-products/manageproduct.service';
import { ManageimportComponent } from '../../manageimport/manageimport.component';
import { ManageContactsService } from 'src/app/core/services/manage-contacts.service';
import { saveAs } from "file-saver";
import { MatSnackBar } from '@angular/material/snack-bar';
import { AddtagCommonComponent } from 'src/app/pages/commonForAll/addtag-common/addtag-common.component';
import { DeleteCommomComponent } from 'src/app/pages/commonForAll/delete-commom/delete-commom.component';
import * as FileSaver from 'file-saver';
import { AddFileNotesComponent } from 'src/app/pages/files/components/add-file-notes/add-file-notes.component';
import { FilesAndNotesShareLinkComponent } from 'src/app/pages/files/components/files-and-notes-share-link/files-and-notes-share-link.component';
import { AddFileComponent } from 'src/app/pages/files/components/add-file/add-file.component';
import { AddNotesComponent } from 'src/app/pages/files/components/add-notes/add-notes.component';
import { FileService } from 'src/app/core/services/file.service';
import { ManageUsersService } from 'src/app/core/services/manage-users.service';
import { ViewNotesComponent } from 'src/app/pages/files/components/view-notes/view-notes.component';
import { FileandnotesformanagementComponent } from 'src/app/pages/commonForAll/fileandnotesformanagement/fileandnotesformanagement.component';
import { PopupErrorMessageComponent } from 'src/app/popup-error-message/popup-error-message.component';
import { TranslateService } from '@ngx-translate/core';
import { ApiErrorMessagesComponent } from 'src/app/api-error-messages/api-error-messages.component';

@Component({
  selector: 'app-create-product',
  templateUrl: './create-product.component.html'
})
export class CreateProductComponent implements OnInit {
  productForm: FormGroup;
  measures$!: Observable<Measure[]>;
  dropdown!: boolean;
  selectedradioval: any;
  additionalFieldLines: any[] = [];
  lineCounter: number = 0;
  selectednumeralval: any;
  tagarray = [];
  Freefeild = {};
  viewnumeral = {};
  viewtagmodel = {};
  dropdownfeild = {};
  showfreefeild!: boolean;
  tagViewModels = [];
  showcheckbox!: boolean;
  tags: any;
  dropdownvalue = [];
  i = 1;
  value!: number;
  datadelete: any;
  datadeleteindex: any;
  selectedvalue: any;
  selectedtagvalue: any;
  checked: any;
  profilePick: any;
  profilePickid: any;
  products: any;
  ScreenType = ''
  AttachmentFileCount: any;
  AttachmentFileList: any;
  AttachmentNotesCount: any;
  AttachmentNotesList: any;
  ShowAttachmentFile = false
  ShowAttachmentNotes = false
  notesCount = 0;
  filesCount = 0;
  profileName:any;
  type=[
    {name:'Amount',value:false,image:'../../../../../assets/images/iconsForsvg/Ammount.svg'},
    {name:'Percentage',value:true,image:'../../../../../assets/images/iconsForsvg/Presentage.svg'},
  ]

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private router: Router,
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<CreateProductComponent>,
    private messageService: MessageService,
    private manageProductsService: ManageProductsService,
    private Manageproductservice: ManageproductService,
    private manageContactsService: ManageContactsService,
    private snackBar: MatSnackBar,
    private fileService: FileService,
    private userService: ManageUsersService,
    private translate: TranslateService ,
    ) {
      if(localStorage.getItem('lang')){
        const lang:any=localStorage.getItem('lang')
        this.translate.use(lang);
      }else{
        this.translate.use('English');
      }
       this.productForm = this.formBuilder.group({
      id: [''],
      created: [''],
      ProductReference: ['', Validators.required],
      ProductName: ['', [Validators.required]],
      ProductDescription: ['', [Validators.required]],
      MeasureId: ['', Validators.required],
      StockQuantity: [null, Validators.required],
      Baseprice: [Validators.required],
      Sellingprice: [Validators.required],
      Comments: [''],
      CurrencyId: [1, Validators.required],
      isActive: [{ value: 'true', disabled: true }],
      Profile: [''],
      profileName:[null],
      IsBaseUnitIsPercentage :[false],
      IsSellingPriceIsPercentage :[false],
      Addtages: this.formBuilder.array([])
    });
    this.gettags() 
  }

  // tag 
  createtageBody(): FormGroup {
    return this.formBuilder.group({
      tagTableId: 0,
      fieldName: '',
      fieldType: '',
      fieldValue: '',
      dropdownValues: '',
      dropdownvaluetotal: ''

    })
  }
  getIsBaseUnittype(){
    return this.productForm.value.IsBaseUnitIsPercentage
  }
  getIsSellingpricetype(){
    return this.productForm.value.IsSellingPriceIsPercentage
  }

  checkpresentagevalueforBaseprice(){
    if(this.productForm.value.IsBaseUnitIsPercentage==true){
      if(this.productForm.value.Baseprice>100||this.productForm.value.Baseprice==0){
        return true
      }else{
        return false
      }
    }else{
      return false
    }
  }
  checkpresentagevalueforSellingprice(){
    if(this.productForm.value.IsSellingPriceIsPercentage==true){
      if(this.productForm.value.Sellingprice>100||this.productForm.value.Sellingprice==0){
        return true
      }else{
        return false
      }
    }else{
      return false
    }
  }
  gettageBody() {
    return this.productForm.get('Addtages') as FormArray;
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

  ngOnInit(): void {
    console.log(this.data)
    this.ScreenType = this.data.screenType
    if (this.ScreenType == 'Createproduct') {

    } else {
      this.updateproductDialog()
    }
    this.measures$ = this.manageProductsService.fetchAllMeasuresService();
  }





  updateproductDialog() {
    this.manageProductsService.fetchProductByIdService(this.data.data.id).subscribe((data: any) => {
      console.log(data, 'data');
      this.products = data;
      this.filesCount = data?.filesCount
      this.notesCount = data?.notesCount
      this.profilePick = this.products.profilePicture
      this.profilePickid = this.products.id
      this.productForm.get('id')?.setValue(this.products.id);
      this.productForm.get('created')?.setValue(this.products.created);
      this.productForm.get('ProductReference')?.setValue(this.products.productReference);
      this.productForm.get('ProductName')?.setValue(this.products.productName);
      this.productForm.get('ProductDescription')?.setValue(this.products.productDescription);
      this.productForm.get('Comments')?.setValue(this.products.comments);
      this.productForm.get('StockQuantity')?.setValue(this.products.stockQuantity==null?0:this.products.stockQuantity);
      this.productForm.get('Baseprice')?.setValue(this.products.baseUnitPrice);
      this.productForm.get('Sellingprice')?.setValue(this.products.sellingPrice);
      this.productForm.get('MeasureId')?.setValue(this.products.measureId);
      this.profileName=this.products.profileNamee

      // this.productForm.get('fieldvalue')?.setValue(this.products.tagViewModels.fieldValue);
    });
  }





  onFileSelect(event:any) {
    if (this.ScreenType == 'Createproduct') {
      if (event.target.files.length > 0) {
        const file = event.target.files[0];
        this.profileName=file.name
        this.productForm.get('Profile')?.setValue(file);
        console.log(this.productForm, 'this.contactForm');
      }
      if (event.target.files) {
        var reader = new FileReader();
        reader.readAsDataURL(event.target.files[0]);
        reader.onload = (event: any) => {
          this.profilePick = event.target.result
        }
      }
    } else {
      var file = event.target.files[0];
      this.profileName=file.name
      const id = this.profilePickid
      var formData = new FormData();
      formData.append('Profile', file);
      this.manageProductsService.updateprofileproductId(id, formData).subscribe((res) => {
        console.log(res)

      })
      if (event.target.files) {
        var reader = new FileReader();
        reader.readAsDataURL(event.target.files[0]);
        reader.onload = (event: any) => {
          this.profilePick = event.target.result
        }
      }
      this.snackBar.open('successfully Update Profile', 'Undo', {
        duration: 4000
      });
    }
  }

  onSubmit() {
    const formData = new FormData();
    if (this.ScreenType == 'Createproduct') {
      formData.append('Profile', this.productForm.get('Profile')?.value);
    } else {
      formData.append('id', this.productForm.get('id')?.value);
      formData.append('profileName', this.profileName);


    }
    formData.append('ProductReference', this.productForm.get('ProductReference')?.value);
    formData.append('ProductName', this.productForm.get('ProductName')?.value);
    formData.append('ProductDescription', this.productForm.get('ProductDescription')?.value);
    formData.append('MeasureId', this.productForm.get('MeasureId')?.value);
    formData.append('StockQuantity', this.productForm.get('StockQuantity')?.value);
    formData.append('Comments', this.productForm.get('Comments')?.value);
    formData.append('isActive', this.productForm.get('isActive')?.value);
    formData.append('BaseUnitPrice', this.productForm.get('Baseprice')?.value);
    formData.append('SellingPrice', this.productForm.get('Sellingprice')?.value);
    formData.append('IsBaseUnitIsPercentage', this.productForm.get('IsBaseUnitIsPercentage')?.value);
    formData.append('IsSellingPriceIsPercentage', this.productForm.get('IsSellingPriceIsPercentage')?.value);
    this.productForm.value.Addtages.forEach((element:any, index:any) => {
      if (element?.fieldValue != null) {
        formData.append('TagViewModels[' + index + '].fieldName', element.fieldName);
        formData.append('TagViewModels[' + index + '].fieldType', element.fieldType);
        formData.append('TagViewModels[' + index + '].tagTableId', '');
        formData.append('TagViewModels[' + index + '].dropdownValues', element.dropdownValues);
        formData.append('TagViewModels[' + index + '].fieldValue', element?.fieldValue == null ? ' ' : element?.fieldValue);
      }
      if (element?.fieldType == 'Dropdown') {
        formData.append('TagViewModels[' + index + '].fieldName', element.fieldName);
        formData.append('TagViewModels[' + index + '].fieldType', element.fieldType);
        formData.append('TagViewModels[' + index + '].tagTableId', '');
        formData.append('TagViewModels[' + index + '].dropdownValues', element.dropdownValues.toString());
        formData.append('TagViewModels[' + index + '].fieldValue', element?.fieldValue == null ? ' ' : element?.fieldValue);
      }
    })

    if (this.ScreenType == 'Createproduct') {
      if (localStorage.getItem('DemoOrganation') === 'true') {
        this.popupforerrormessage(
          'This button allows you to add new Product',
          'Create Product'
        );
      } else {
      this.manageProductsService.createProductService(formData).subscribe((data:any) => {
        this.dialogRef.close();
        this.messageService.showMessage(data['response'][0].message);
        this.router.navigate(['/home/dash/management/m/products']);
        this.Manageproductservice.manageproduct$.next(true);
      },error=>{
        console.log(error)
        if(error.status==429){
          this.APIerrormessage(error?.error,'Create Products')
        }
      });
    }
    } else {
      if (localStorage.getItem('DemoOrganation') === 'true') {
        this.popupforerrormessage(
          'This button allows you to Update Product',
          'Update Product'
        );
      } else {
      this.manageProductsService.updateProductService(formData).subscribe((data: any) => {
        if (data) {
          if (this.products.baseUnitPrice != this.productForm.get('Baseprice')?.value) {
            this.updateProductprice(this.products.id, this.productForm.get('Baseprice')?.value, false)
          }
          if (this.products.sellingPrice != this.productForm.get('Sellingprice')?.value) {
            this.updateProductprice(this.products.id, this.productForm.get('Sellingprice')?.value, true)
          }
          this.dialogRef.close();
          this.messageService.showMessage(data['response'][0].message);
          this.router.navigate(['/home/dash/management/m/products']);
          this.Manageproductservice.manageproduct$.next(true);
        }
      });
    }
    }

  }




  updateProductprice(ProductId:any, price:any, IsSellingPrice:any) {
    this.manageProductsService.updateProductprice(ProductId, price, IsSellingPrice).subscribe((result) => {
      console.log(result)
    })
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
      data: 'Products',
    });
    openAddEventDialog.afterClosed().subscribe((result: any) => {
      if (result) {
        this.gettageBody().clear()
        this.gettags();
      }
    })
  }
  }

  deletetagDialog(i:any, type:any,) {
    const data = {
      id: this.tagTableId(i),
      type: 'Products'
    }
    const deleteorder = this.dialog.open(DeleteCommomComponent, { data: { data, type: type, entity: 'Products' } });
    deleteorder.afterClosed().subscribe((result: any) => {
      if (result) {
        this.gettageBody().clear()
        this.gettags();
      }
    })
  }





  gettags() {
    this.manageProductsService.gettag('Products').subscribe((data: any) => {
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


  closedialogbox() {
    this.dialog.closeAll();
  }

  importdata() {
    const openAddEventDialog = this.dialog.open(ManageimportComponent, {
      width: '500px',
      autoFocus: false,
      disableClose: true,
      data: 'Products',
    });
  }

  downloadTemplate() {
    const Name = 'Products'
    this.manageContactsService.downloadTemplate(Name).subscribe((result: Blob) => {
      const data: Blob = new Blob([result], {
        type: "text/csv;charset=utf-8"
      });
      saveAs(data, "Products.csv");
    })
  }


  // AddFile
  AddFile() {
    const addfile = this.dialog.open(AddFileComponent, {
      disableClose: true,
      width: '500px',
      data: {
        data: this.products,
        attachmentLevel: 'Products',
        ismanage: true,
        type: 'single'
      },
      panelClass: ['addFiles']
    });
    addfile.afterClosed().subscribe(result => {
      this.ShowAttachmentFile = true
      this.ShowAttachmentNotes = true
      this.updateproductDialog();
      this.findnotesLinked();
      this.findfilesLinked();
    });
  }

  // AddNote
  AddNote() {
    const addnote = this.dialog.open(AddNotesComponent, {
      disableClose: true,
      data: {
        data: this.products,
        attachmentLevel: 'Products',
        ismanage: true,
        type: 'single'
      },
      width: '600px',
      panelClass: ['addNotes']
    });
    addnote.afterClosed().subscribe(result => {
      this.ShowAttachmentFile = true
      this.ShowAttachmentNotes = true
      console.log(result);
      this.updateproductDialog();
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
    this.userService.getfile(this.products.id, 'Products').subscribe((res) => {
      this.AttachmentFileList = res;
      this.ShowAttachmentFile = !this.ShowAttachmentFile
    });
  }
  // findnotesLinked
  findnotesLinked() {
    this.userService.getnotes(this.products.id, 'Products').subscribe((res) => {
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
    if (localStorage.getItem('DemoOrganation') === 'true') {
      this.popupforerrormessage(
        'This button allows  to share File and Note',
        'share File and Note'
      );
    } else {
    const editFileDialog = this.dialog.open(FilesAndNotesShareLinkComponent, {
      width: '500px',
      data: data
    });
    editFileDialog.afterClosed().subscribe(result => {
      this.ShowAttachmentFile = true
      this.ShowAttachmentNotes = true
      this.updateproductDialog();
      this.findnotesLinked();
      this.findfilesLinked();
    });
  }
  }
  // EditNote 
  EditfileAndNote(name:any, id:any) {
    if (name == 'File') {
      if (localStorage.getItem('DemoOrganation') === 'true') {
        this.popupforerrormessage(
          'This button allows  to Edit File',
          'Edit File'
        );
      } else {
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
          this.updateproductDialog();
          this.findnotesLinked();
          this.findfilesLinked();
        });
      });
    }
    } else {
      if (localStorage.getItem('DemoOrganation') === 'true') {
        this.popupforerrormessage(
          'This button allows  to Edit File',
          'Edit File'
        );
      } else {
      this.fileService.getNote(id,1,10).subscribe(data => {
        const editFileDialog = this.dialog.open(AddNotesComponent, {
          width: '600px',
          data: {
            NoteEdit: true,
            data: data
          }
        });
        editFileDialog.afterClosed().subscribe(result => {
          this.ShowAttachmentFile = true
          this.ShowAttachmentNotes = true
          this.updateproductDialog();
          this.findnotesLinked();
          this.findfilesLinked();
        });
      });
    }
    }
  }


  Downloadfile(data:any) {
    if (localStorage.getItem('DemoOrganation') === 'true') {
      this.popupforerrormessage(
        'This button allows  to Download File',
        'download File'
      );
    } else {
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
  }

  // DeleteFileAreNote 
  deleteDialogConfirmation(data:any, type:any) {
    const deleteorder = this.dialog.open(DeleteCommomComponent, { data: { data, type: type } });
    deleteorder.afterClosed().subscribe((result: any) => {
      this.ShowAttachmentFile = true
      this.ShowAttachmentNotes = true
      this.updateproductDialog();
      this.findnotesLinked();
      this.findfilesLinked();
    })
  }
  // ViewNote content 
  ViewNoteContent(data:any) {
    if (localStorage.getItem('DemoOrganation') === 'true') {
      this.popupforerrormessage(
        'This button allows  to View Note',
        'View Note'
      );
    } else {
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
          this.updateproductDialog();
          this.findnotesLinked();
          this.findfilesLinked();
        }
      });
    });
  }
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

}
