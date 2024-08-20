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
import { ManageUsersService } from 'src/app/core/services/manage-users.service';
@Component({
  selector: 'app-create-dynamic-keywords',
  templateUrl: './create-dynamic-keywords.component.html',
  styleUrls: ['./create-dynamic-keywords.component.scss']
})
export class CreateDynamicKeywordsComponent implements OnInit {
  // auto chip for keyword
  separatorKeysCodes: number[] = [ENTER, COMMA];
  keywordlist: string[] = [];
  addFileFormdata: any[] = [];
  Form: FormGroup;
  conditioncolumns:any = []
  conditionDropDownList = ''
  screenType=''
  matchValue = []
  TransactionType = [{ name: 'Buy'}, { name: 'Sale'}]
  PaymentType=[{ name: 'Cash'}, { name: 'Credit Card'},{ name: 'Money Transfer'},{ name: 'Paypal'},{ name: 'Check'}]
  TransactionStatus = [{ name: 'Validated'}, { name: 'pending'}]
  stringoptions = [{ v1: '=', v2: 'equal' }, { v1: '!=', v2: 'not equal' }];
  numberoptions = [{ v1: '=', v2: 'equal' }, { v1: '!=', v2: 'not equal' }, { v1: '>', v2: 'greater than' }, { v1: '=>', v2: 'greater than or equal' }, { v1: '<', v2: 'less than ' }]
  textoptions = [{ v1: '=', v2: 'equal' }, { v1: '!=', v2: 'not equal' }]
  booleanoptions = [{ v1: '=', v2: 'equal' }]
  AllOption = [{ v1: '=', v2: 'equal' }, { v1: '!=', v2: 'not equal' }, { v1: '>', v2: 'greater than' },
  { v1: '<', v2: 'less than ' }, { v1: '=>', v2: 'greater than or equal' }, { v1: '<=', v2: 'less than or equal' }];
  constructor(
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private matDialogRef: MatDialogRef<CreateDynamicKeywordsComponent>,
    public snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private manageUserService: ManageUsersService,
  ) {
    this.Form = this.formBuilder.group({
      id: [''],
      name: ['', [Validators.required]],
      description: [''],
      price: [null],
      Conditions: this.formBuilder.array([]),
    });
    this.FindImportColumnsTransactions()
  }

  ngOnInit(): void {
    this.screenType=this.data.screenType 
    console.log(this.data.screenType )
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

  selactdatatype(x:any,index:any) {
    this.conditionDropDownList = x.dataType
    this.getCondition().at(index).get('dataType')?.setValue(x.dataType)
  }

  getdataType(index:any){
    const value = this.getCondition().at(index).get('dataType')?.value
    return value
  }
  gettagename(index:any){
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
      let DynamicFormdata:any = {
        name: this.Form.value.name,
        description: this.Form.value.description,
        entity:'Transactions',
        isKeywordDynamicGroup:true,
        isPriceMatrix: false,
        price: this.Form.value.price==null?0:this.Form.value.price,
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
      let DynamicFormdata:any = {
        id:this.Form.value.id,
        name: this.Form.value.name,
        description: this.Form.value.description,
        entity:'Transactions',
        isKeywordDynamicGroup:true,
        isPriceMatrix: false,
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
