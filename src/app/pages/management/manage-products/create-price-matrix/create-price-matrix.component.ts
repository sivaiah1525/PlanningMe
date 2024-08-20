import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ManageProductsService } from 'src/app/core/services/manage-products.service';
import { ManageUsersService } from 'src/app/core/services/manage-users.service';
@Component({
  selector: 'app-create-price-matrix',
  templateUrl: './create-price-matrix.component.html',
  styleUrls: ['./create-price-matrix.component.scss']
})
export class CreatePriceMatrixComponent implements OnInit {

 // auto chip for keyword
 separatorKeysCodes: number[] = [ENTER, COMMA];
 keywordlist: string[] = [];
 addFileFormdata: any[] = [];
 Form: FormGroup;
 conditioncolumns :any= []
 conditionDropDownList = ''
 screenType=''
 matchValue:any = []
 TransactionType:any = [{ name: 'Buy'}, { name: 'Sale'}]
 PaymentType=[{ name: 'Cash'}, { name: 'Credit Card'},{ name: 'Money Transfer'},{ name: 'Paypal'},{ name: 'Check'}]
 TransactionStatus:any = [{ name: 'Validated'}, { name: 'pending'}]
 stringoptions:any = [{ v1: '=', v2: 'equal' }, { v1: '!=', v2: 'not equal' }];
 numberoptions:any = [{ v1: '=', v2: 'equal' }, { v1: '!=', v2: 'not equal' }, { v1: '>', v2: 'greater than' }, { v1: '=>', v2: 'greater than or equal' }, { v1: '<', v2: 'less than ' }]
 textoptions:any = [{ v1: '=', v2: 'equal' }, { v1: '!=', v2: 'not equal' }]
 booleanoptions:any = [{ v1: '=', v2: 'equal' }]
 AllOption:any = [{ v1: '=', v2: 'equal' }, { v1: '!=', v2: 'not equal' }, { v1: '>', v2: 'greater than' },
 { v1: '<', v2: 'less than ' }, { v1: '=>', v2: 'greater than or equal' }, { v1: '<=', v2: 'less than or equal' }];
 filteredList7:any;
 products$:any;

 constructor(
   private dialog: MatDialog,
   private formBuilder: FormBuilder,
   private matDialogRef: MatDialogRef<CreatePriceMatrixComponent>,
   public snackBar: MatSnackBar,
   @Inject(MAT_DIALOG_DATA) public data: any,
   private manageUserService: ManageUsersService,
   private manageProductsService: ManageProductsService,
 ) {
   this.Form = this.formBuilder.group({
     id: [''],
     name: ['', [Validators.required]],
     description: [''],
     price: [null],
     productId:[null],
     Conditions: this.formBuilder.array([]),
   });
   this.FindImportColumnsTransactions()
 }

 ngOnInit(): void {
   this.screenType=this.data.screenType 
   console.log(this.data.screenType )
   console.log(this.data )
   if(this.data.data.id){
    this.Form.get('productId')?.setValue(this.data.data.id)
   }
   if(this.data.screenType=='update'){
     console.log(this.data.data)
     this.Form.get('id')?.setValue(this.data.data.id)
     this.Form.get('name')?.setValue(this.data.data.name)
     this.Form.get('description')?.setValue(this.data.data.description)
     this.data.data.conditionDtos.forEach((e:any) => {
       this.getCondition().push(
         this.formBuilder.group({
           conditionDropDownList:'Transactions',
           conditionParameter: e?.conditionParameter,
           conditionComparison: e?.conditionComparison,
           value: e?.value,
           dataType: e?.dataType,
           isTag: e?.isTag,
         })
       )
     });
   }else{
     this.Addnewcondictuon()
   }


   this.manageProductsService.findAllProductsDropdown().subscribe((res) => {
    this.products$ = res;
    this.products$.sort(function (a:any, b:any) {
      var textA = a.productName.toUpperCase();
      var textB = b.productName.toUpperCase();
      return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
    });
    this.filteredList7 = this.products$.slice()
  })

 }

 getCondition(): FormArray {
   return this.Form.get('Conditions') as FormArray;
 }
 newCondition(): FormGroup {
   return this.formBuilder.group({
     conditionParameter: [null],
     conditionComparison: [null],
     value: [null],
     dataType:[''],
     isTag: [false]
   });
 }

 selactdatatype(x:any,index:number) {
   this.conditionDropDownList = x.dataType
   this.getCondition().at(index).get('dataType')?.setValue(x.dataType)
 }

 getdataType(index:number){
   const value = this.getCondition().at(index).get('dataType')?.value
   return value
 }
 gettagename(index:number){
   const value = this.getCondition().at(index).get('conditionParameter')?.value
   return value
 }

 Addnewcondictuon() {
   this.getCondition().push(this.newCondition());
 }
 Removecondictuon(i: number) {
   this.getCondition().removeAt(i);
 }

 FindImportColumnsTransactions() {
   this.manageUserService.FindParameters('Transactions',false).subscribe((res: any) => {
     res.forEach((e:any) => {
       this.conditioncolumns.push(e)
     })
   })
 }


  // ---------------- 
 // auto chip for keyword 
 // ----------- 
 add(event: MatChipInputEvent) {
   const value = (event.value || '').trim();
   if (value) { this.keywordlist.push(value); }
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





 onSubmit() {
   console.log(this.Form.value)
   if(this.screenType==='create'){
     let DynamicFormdata :any= {
       name: this.Form.value.name,
       description: this.Form.value.description,
       entity:'Transactions',
       isKeywordDynamicGroup:false,
       isPriceMatrix: true,
       price: this.Form.value.price==null?0:this.Form.value.price,
       productId: this.Form.value.productId==null?0:this.Form.value.productId,
       dynamicGroupConditions: []
     }
     this.Form.value.Conditions.forEach((element:any) => {
       DynamicFormdata.dynamicGroupConditions.push({
         conditionDropDownList:'Transactions',
         conditionParameter: element.conditionParameter.replaceAll(" ", ""),
         conditionComparison: element.conditionComparison,
         value: element.value,
         dataType: element.dataType,
         isTag: element.isTag,
       })
     });
     this.manageUserService.CreateDynamicGroup(DynamicFormdata).subscribe((result: any) => {
       if (result) {
         this.snackBar.open(result.response[0].message, '', { duration: 2000, });
         this.matDialogRef.close(result)
       }
     }, (err) => { this.snackBar.open(err.statusText, '', { duration: 2000, }); });

   }else{
     let DynamicFormdata :any= {
       id:this.Form.value.id,
       name: this.Form.value.name,
       description: this.Form.value.description,
       entity:'Transactions',
       isKeywordDynamicGroup:false,
       isPriceMatrix: true,
       price: this.Form.value.price==null?0:this.Form.value.price==null,
       dynamicGroupConditions: []
     }
     this.Form.value.Conditions.forEach((element:any) => {
       DynamicFormdata.dynamicGroupConditions.push({
         conditionDropDownList:'Transactions',
         conditionParameter: element.conditionParameter.replace(' ', ''),
         conditionComparison: element.conditionComparison,
         value: element.value,
         dataType: element.dataType,
       })
     });
     this.manageUserService.UpdateDynamicGroup(DynamicFormdata).subscribe((result: any) => {
       if (result) {
         this.snackBar.open(result.response[0].message, '', { duration: 2000, });
         this.matDialogRef.close(result)
       }
     }, (err) => { this.snackBar.open(err.statusText, '', { duration: 2000, }); });

   }
 }

}

