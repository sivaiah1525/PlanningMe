import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Product } from 'src/app/core/models/product.model';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ManageProductsService } from '../../../../core/services/manage-products.service';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MessageService } from 'src/app/core/services/message.service';
import { ManageproductService } from '../manageproduct.service';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { TranslateService } from '@ngx-translate/core';

export class ProductRes {
  comments!: string;
  created!: string;
  creatorId!: string;
  creatorName!: string;
  id!: number;
  isActive!: true
  isTarget!: false
  measureId!: number;
  measureName!: null
  organizationId!: number;
  organizationName!: string;
  picture!: string;
  productDescription!: string;
  productName!: string;
  productReference!: string;
  stockQuantity!: number;
  selected?: boolean;
}
@Component({
  selector: 'app-create-group',
  templateUrl: './create-group.component.html'
})
export class CreateGroupComponent implements OnInit {
  // auto chip for keyword
  separatorKeysCodes: number[] = [ENTER, COMMA];
  keywordlist: string[] = [];
  productCreateForm!: FormGroup;
  productIds!: number[];
  allProducts: ProductRes[] = [];
  filteredUsers!: Observable<ProductRes[]>;
  userControl = new FormControl();
  lastFilter: string = '';
  selectedUsers: ProductRes[] = new Array<ProductRes>();
  constructor(@Inject(MAT_DIALOG_DATA) public products: Product[],
    private formBuilder: FormBuilder,
    private manageProductsService: ManageProductsService, 
    private dialogRef: MatDialogRef<CreateGroupComponent>,
    private messageService: MessageService,
    private Manageproductservice: ManageproductService,
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
    this.productIds = [];
    this.productCreateForm = this.formBuilder.group({
      productGroupName: ['', Validators.required],
      description: [''],
      productId: [this.productIds],
      keywords: ['']
    });
    this.manageProductsService.findAllProductsDropdown().subscribe(
      data => {
        console.log(data);
        this.allProducts = data;
        this.filteredUsers = this.userControl.valueChanges.pipe(
          startWith<string | ProductRes[]>(''),
          map(value => typeof value === 'string' ? value : this.lastFilter),
          map(filter => this.filter(filter))
        );
      }
    )

  }
  onSubmit(): void {
    this.productCreateForm.get('keywords')?.setValue(this.keywordlist.toString())
    this.selectedUsers.forEach(product => this.productIds.push(product.id));
    console.log(this.productCreateForm.value);
    this.manageProductsService.createProductGroupService(this.productCreateForm.value).subscribe(
      data => {
        this.dialogRef.close();
        this.messageService.showMessage(data['response'][0].message);
        this.Manageproductservice.managegrpproduct$.next(true);
      }
    );
  }
  filter(filter: string): ProductRes[] {
    this.lastFilter = filter;
    if (filter) {
      return this.allProducts.filter(option => {
        return option.productName.toLowerCase().indexOf(filter.toLowerCase()) >= 0

      })
    } else {
      return this.allProducts.slice();
    }
  }
  optionClicked(event: Event, user: ProductRes) {

    event.stopPropagation();
    this.toggleSelection(user);
  }
  displayFn(value:any) {
    let displayValue: string;
    if (Array.isArray(value)) {
      value.forEach((user, index) => {
        if (index === 0) {
         return displayValue = user.productName;
        } else {
         return displayValue += ', ' + user.productName;
        }
      });
    } else {
     return displayValue = value;
    }
  }
  toggleSelection(user: ProductRes) {
    user.selected = !user.selected;
    if (user.selected) {
      this.selectedUsers.push(user);
    } else {
      const i = this.selectedUsers.findIndex(value => value.productName === user.productName);
      this.selectedUsers.splice(i, 1);
    }

    this.userControl.setValue(this.selectedUsers);
  }
  removeContact(product: Product): void {
    for (let i = 0; i < this.products.length; i++) {
      const element = this.products[i];
      if (product.id === element.id) {
        this.products.splice(i, 1);
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

  selected(event: MatAutocompleteSelectedEvent) {
    this.keywordlist.push(event.option.viewValue);
  }
}