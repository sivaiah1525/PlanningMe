import { Component, OnInit, Inject, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Product } from 'src/app/core/models/product.model';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';;
import { ManageProductsService } from '../../../../core/services/manage-products.service';
import { ProductGroup } from 'src/app/core/models/product-group.model';
import { SpinnerService } from '../../../../core/services/spinner.service';
import { MessageService } from 'src/app/core/services/message.service';
import { Observable } from 'rxjs';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-edit-product-group',
  templateUrl: './edit-product-group.component.html',
  styleUrls: ['./edit-product-group.component.scss']
})
export class EditProductGroupComponent implements OnInit {
  // auto chip for keyword
  separatorKeysCodes: number[] = [ENTER, COMMA];
  keywordlist: string[] = [];
  editProductForm!: FormGroup;
  productIds: number[] = [];
  products: Product[] = [];
  id!: string;
  color = 'primary';
  mode = 'indeterminate';
  value = 50;
  productdata: any;
  productgroup: any;
  products$!: Observable<Product[]>;
  constructor(
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private manageProductssService: ManageProductsService,
    private matDialogRef: MatDialogRef<EditProductGroupComponent>,
    private manageProductsService: ManageProductsService,
    public spinner: SpinnerService,
    @Inject(MAT_DIALOG_DATA) public data: string,
    private translate: TranslateService ,
    ) {
      if(localStorage.getItem('lang')){
        const lang:any=localStorage.getItem('lang')
        this.translate.use(lang);
      }else{
        this.translate.use('English');
      }

   }

  ngOnInit(): void {
    this.productdata = this.data;
    console.log(this.productdata, 'this.productdata')
    this.productIds = [];
    this.editProductForm = this.formBuilder.group({
      id: ['', Validators.required],
      productGroupName: ['', Validators.required],
      description: [''],
      productId: [''],
      keywords: [''],
    });
    this.loadFormData();
    this.products$ = this.manageProductssService.findAllProductsDropdown();
  }
  loadFormData(): void {
    if (this.productdata?.getKeyword) {
      this.productdata?.getKeyword.forEach((e:any) => {
        this.keywordlist.push(e)
      })
    }
    this.manageProductsService.fetchProductGroupByIdService(this.productdata.id).subscribe((data:any) => {
      this.productgroup = data
      console.log(this.productgroup, ' this.productgroup')
      this.editProductForm.get('id')?.setValue(this.productdata.id);
      this.editProductForm.get('productGroupName')?.setValue(this.productdata.productGroupName);
      this.editProductForm.get('description')?.setValue(this.productdata.description);
      this.productgroup.forEach((product: Product) => {
        this.products.push(product);
        this.productIds.push(product.id);
      })
      this.editProductForm.get('productId')?.setValue(this.productIds);
    });
  }

  onChange(users:any) {
    console.log(users, 'users')
    var index = this.productIds.indexOf(users.id);
    if (index === -1) {
      this.products.push(users);
      this.productIds.push(users.id);
    }
    else {
      // val is found, removing from array
      this.products.splice(index, 1);
      this.productIds.splice(index, 1);
    }
  }

  onSubmit(): void {
    this.editProductForm.get('keywords')?.setValue(this.keywordlist.toString())
    this.manageProductsService.updateProductsGroupService(this.editProductForm.value).subscribe((data:any) => {
      this.manageProductsService.fetchProductGroupByIdService(this.productdata.id);
      this.messageService.showMessage(data['response'][0].message);
      this.matDialogRef.close();
    });
  }

  removeContact(product: Product): void {
    const id = product.id;
    for (let i = 0; i < this.products.length; i++) {
      const element = this.products[i];
      if (id === element.id) {
        this.products.splice(i, 1);
        break;
      }
    }
    for (let i = 0; i < this.productIds.length; i++) {
      if (id === this.productIds[i]) {
        this.productIds.splice(i, 1);
        break;
      }
    }
  }

  // ---------------- 
  // auto chip for keyword 
  // ----------- 
  add(event: MatChipInputEvent) {
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


}
