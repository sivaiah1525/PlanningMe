import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ManageUsersService } from 'src/app/core/services/manage-users.service';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { TranslateService } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-dynamic-group',
  templateUrl: './dynamic-group.component.html',
  styleUrls: ['./dynamic-group.component.scss']
})
export class DynamicGroupComponent implements OnInit {

  DynamicForm: FormGroup;
  type: any;
  DynamicGroupConditions: any;
  conditionDropDownList = ''
  stringoptions = [{ v1: '=', v2: 'equal' }, { v1: '!=', v2: 'not equal' }];
  numberoptions = [{ v1: '=', v2: 'equal' }, { v1: '!=', v2: 'not equal' }, { v1: '>', v2: 'greater than' }, { v1: '=>', v2: 'greater than or equal' }, { v1: '<', v2: 'less than ' }]
  textoptions = [{ v1: '=', v2: 'equal' }, { v1: '!=', v2: 'not equal' }]
  booleanoptions = [{ v1: '=', v2: 'equal' }]
  AllOption = [{ v1: '=', v2: 'equal' }, { v1: '!=', v2: 'not equal' }, { v1: '>', v2: 'greater than' },
  { v1: '<', v2: 'less than ' }, { v1: '=>', v2: 'greater than or equal' }, { v1: '<=', v2: 'less than or equal' }];
  selactValues = ['Users', 'Transactions', 'Events']
  selactValues1 = ['Sites', 'Transactions', 'Events']
  selactValues2= ['Contacts', 'Transactions', 'Events']
  selactValues3= ['Products', 'Transactions']
  ContactsValue: any[] = []
  ProductsValue: any[] = []  
  SitesValue: any[] = []
  UsersValue: any[] = []
  EventsValue: any[] = []
  TransationValue: any[] = []
  // auto chip for keyword
  separatorKeysCodes: number[] = [ENTER, COMMA];
  keywordlist: string[] = [];



  constructor(
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private manageUserService: ManageUsersService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<DynamicGroupComponent>,
    private translate: TranslateService ,
    public datepipe: DatePipe,
    ) {
      if(localStorage.getItem('lang')){
        const lang:any=localStorage.getItem('lang')
        this.translate.use(lang);
      }else{
        this.translate.use('English');
      }
    this.DynamicForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: [''],
      entity: [''],
      price: [null],
      dynamicGroupConditions: this.formBuilder.array([
        this.createConditionalBody() 
      ])
    });


  }
  getConditionsBody() {
    return this.DynamicForm.get('dynamicGroupConditions') as FormArray;
  }

  getConditionsFormArray(i: number) {
    return this.getConditionsBody().at(i).get('conditions') as FormArray;
  }

  getvalue(i: number) {
    return this.getConditionsBody().at(i).get('conditionDropDownList')?.value
  }


  addConditionalBody() {
    this.getConditionsBody().push(this.createConditionalBody())
  }

  createConditionalBody(): FormGroup {
    return this.formBuilder.group({
      conditionDropDownList: [this.data.type],
      conditionParameter: [''],
      conditionComparison: [''],
      value: [''],
      startDate: [''],
      endDate: [''],
      isTag: [''],
      dataType:'',
    })
  }

  removeConditionalBody(i: number) {
    this.getConditionsBody().removeAt(i);
  }
  selactdatatype(event:any,index:number) {
    console.log(event.dataType)
    this.conditionDropDownList = event.dataType
    this.getConditionsBody().at(index).get('dataType')?.setValue(event.dataType)
  }

  getdataType(index:number){
    const value =this.getConditionsBody().at(index).get('dataType')?.value
    return value
  }

  ngOnInit() {
    this.type = this.data.type
    this.getConditionsBody().at(0).get('conditionDropDownList')?.setValue(this.type);
    this.DynamicForm.get('entity')?.setValue(this.type)
    if (this.data.type == "Users") {
      this.FindImportColumnsUsers()
      this.FindImportColumnsEvents()
      this.FindImportColumnsTransactions()
    } else if (this.data.type == "Sites") {
      this.FindImportColumnsSites()
      this.FindImportColumnsEvents()
      this.FindImportColumnsTransactions()
    } else if (this.data.type == "Products") {
      this.FindImportColumnsProducts()
      this.FindImportColumnsTransactions()
    } else if (this.data.type == "Contacts") {
      this.FindImportColumnsContacts()
      this.FindImportColumnsEvents()
      this.FindImportColumnsTransactions()
    }
  }
  finddropdownname(value:any) {
    this.DynamicForm.get('entity')?.setValue(value)
  }
 
  onSubmit() {
    console.log(this.DynamicForm.value)
    let DynamicFormdata :any= {
      name: this.DynamicForm.value.name,
      description: this.DynamicForm.value.description,
      keyword: this.keywordlist.toString(),
      entity: this.DynamicForm.value.entity,
      isKeywordDynamicGroup:false,
      price: this.DynamicForm.value.price==null?0:this.DynamicForm.value.price,
      isPriceMatrix: false,
      dynamicGroupConditions: []
    }
    this.DynamicForm.value.dynamicGroupConditions.forEach((element:any) => {
      DynamicFormdata.dynamicGroupConditions.push({
        conditionDropDownList: element.conditionDropDownList,
        conditionParameter: element.conditionParameter.columnName.replaceAll(" ", ""),
        conditionComparison: element.conditionComparison,
        value: element.value,
        startDate:this.datepipe.transform(element.startDate, 'yyyy-MM-dd') ,
        endDate:this.datepipe.transform(element.endDate, 'yyyy-MM-dd') , 
        dataType: element.conditionParameter.dataType,
        isTag: element.conditionParameter.isTag
      })
    });
    this.manageUserService.CreateDynamicGroup(DynamicFormdata).subscribe((result: any) => {
      if (result) {
        this.snackBar.open(result.response[0].message, '', { duration: 2000, });
        this.dialogRef.close(result)
      }
    }, (err) => { this.snackBar.open(err.statusText, '', { duration: 2000, }); });

  }


  FindImportColumnsUsers() {
    let name = 'Users'
    this.manageUserService.FindParameters(name,true).subscribe((res: any) => {
      res.forEach((e: any) => {
        this.UsersValue.push(e)
      })
    })
  }

  FindImportColumnsContacts() {
    let name = 'Contacts'
    this.manageUserService.FindParameters(name,true).subscribe((res: any) => {
      res.forEach((e: any) => {
        this.ContactsValue.push(e)
      })
    })
  }
  FindImportColumnsSites() {
    let name = 'Sites'
    this.manageUserService.FindParameters(name,true).subscribe((res: any) => {
      res.forEach((e: any) => {
        this.SitesValue.push(e)
      })
    })
  }
  FindImportColumnsProducts() {
    let name = 'Products'
    this.manageUserService.FindParameters(name,true).subscribe((res: any) => {
      res.forEach((e: any) => {
        this.ProductsValue.push(e)
      })
    })
  }

  FindImportColumnsTransactions() {
    let name = 'Transactions'
    this.manageUserService.FindParameters(name,true).subscribe((res: any) => {
      res.forEach((e: any) => {
        this.TransationValue.push(e)
      })
    })
  }
  FindImportColumnsEvents() {
    let name = 'Events'
    this.manageUserService.FindParameters(name,true).subscribe((res: any) => {
      res.forEach((e: any) => {
        this.EventsValue.push(e)
      })
    })
  }









  dynamicGroupConditions(): FormArray {
    return this.DynamicForm.get("dynamicGroupConditions") as FormArray
  }

  newFile(): FormGroup {
    return this.formBuilder.group({
      conditionDropDownList: this.type,
      conditionParameter: ' ',
      conditionComparison: '',
      value: '',
    })
  }

  Addcondictuon() {
    this.dynamicGroupConditions().push(this.newFile());
  }
  Removecondictuon(i: number) {
    this.dynamicGroupConditions().removeAt(i);
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


