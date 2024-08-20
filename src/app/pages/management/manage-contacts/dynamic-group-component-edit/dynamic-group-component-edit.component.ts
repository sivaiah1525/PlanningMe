import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { es } from 'date-fns/locale';
import { ManageUsersService } from 'src/app/core/services/manage-users.service';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { TranslateService } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-dynamic-group-component-edit',
  templateUrl: './dynamic-group-component-edit.component.html',
  styleUrls: ['./dynamic-group-component-edit.component.scss']
})
export class DynamicGroupComponentEditComponent implements OnInit {
  separatorKeysCodes: number[] = [ENTER, COMMA];
  keywordlist :any= [];
  DynamicForm: FormGroup;
  type: any;
  showDate = false
  DynamicGroupConditions: any;
  conditionDropDownList = ''

  managementType :any= ['Users', 'Contacts', 'Sites', 'Products', 'Transactions', 'Evenvts'];
  matchValue :any= []
  stringoptions :any= [{ v1: '=', v2: 'equal' }, { v1: '!=', v2: 'not equal' }];
  numberoptions :any= [{ v1: '=', v2: 'equal' }, { v1: '!=', v2: 'not equal' }, { v1: '>', v2: 'greater than' }, { v1: '=>', v2: 'greater than or equal' }, { v1: '<', v2: 'less than ' }]
  textoptions :any= [{ v1: '=', v2: 'equal' }, { v1: '!=', v2: 'not equal' }]
  booleanoptions :any= [{ v1: '=', v2: 'equal' }]
  AllOption :any= [{ v1: '=', v2: 'equal' }, { v1: '!=', v2: 'not equal' }, { v1: '>', v2: 'greater than' },
  { v1: '<', v2: 'less than ' }, { v1: '=>', v2: 'greater than or equal' }, { v1: '<=', v2: 'less than or equal' }];


  constructor(
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private manageUserService: ManageUsersService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<DynamicGroupComponentEditComponent>,
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
      id: [''],
      name: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      price: [null],
      description: [''],
      dynamicGroupConditions: this.formBuilder.array([])
    });
  }

  ngOnInit() {
    this.type = this.data.data.conditionDtos[0].conditionDropDownList
    console.log(this.data)
    setTimeout(() => {
      if (this.type == "Users") {
        this.FindImportColumnsUsers()
      } else if (this.type == "Sites") {
        this.FindImportColumnsSites()
      } else if (this.type == "Products") {
        this.FindImportColumnsProducts()
      } else if (this.type == "Events") {
        this.showDate = true
        this.FindImportColumnsEvents()
      } else if (this.type == "Transactions") {
        this.showDate = true
        this.FindImportColumnsTransactions()
      } else if (this.type == "Contacts") {
        this.FindImportColumnsContacts()

      }
      if (this.data?.data?.getKeyword) {
        this.data?.data?.getKeyword.forEach((e:any) => {
          this.keywordlist.push(e)
        })
      }
      this.DynamicForm.get('name')?.setValue(this.data.data.siteGroupName || this.data.data.userGroupName || this.data.data.contactGroupName || this.data.data.productGroupName)
      this.DynamicForm.get('description')?.setValue(this.data.data.description)
      this.DynamicForm.get('id')?.setValue(this.data.data.dynamicGroupId)
      this.DynamicForm.get('endDate')?.setValue(this.data.data.endDate)
      this.DynamicForm.get('startDate')?.setValue(this.data.data.startDate)
      this.data.data.conditionDtos.forEach((e:any) => {
        this.dynamicGroupConditions().push(
          this.formBuilder.group({
            conditionDropDownList: this.type,
            conditionParameter: e.conditionParameter.replace(/([a-z])([A-Z])/g, '$1 $2'),
            conditionComparison: e.conditionComparison,
            value: e.value,
            dataType: e?.dataType,
          })
        )
      });
      
    },);

  }

  onSubmit() {
    console.log(this.DynamicForm.value)
    let Conditions = this.DynamicForm.value.dynamicGroupConditions.map((e: any) => {
      return {
        conditionDropDownList: e.conditionDropDownList,
        conditionParameter: e.conditionParameter.replaceAll(" ", ""),
        conditionComparison: e.conditionComparison,
        value: e.value,
        startDate:this.datepipe.transform(e.startDate, 'yyyy-MM-dd') ,
        endDate:this.datepipe.transform(e.endDate, 'yyyy-MM-dd') , 
        dataType: e.dataType,
        isTag: e.isTag
      }
    })
    const dynamicGroup = {
      id: this.DynamicForm.value.id,
      name: this.DynamicForm.value.name,
      description: this.DynamicForm.value.description,
      keyword: this.keywordlist.toString(),
      isKeywordDynamicGroup:false,
      isPriceMatrix: false,
      price: this.DynamicForm.value.price==null?0:this.DynamicForm.value.price,
      entity: this.type,
      dynamicGroupConditions: Conditions
    }

    this.manageUserService.UpdateDynamicGroup(dynamicGroup).subscribe((result: any) => {
      if (result) {
        this.snackBar.open(result.response[0].message, '', { duration: 2000, });
        this.dialog.closeAll()
        this.dialogRef.close(result)
      }
    }, (err) => { this.snackBar.open(err.statusText, '', { duration: 2000, }); });


  }



  FindImportColumnsUsers() {
    let name = 'Users'
    this.manageUserService.FindImportColumns(name).subscribe((res: any) => {
      res.forEach((e:any) => {
        this.matchValue.push(e)
      })
    })
  }

  FindImportColumnsContacts() {
    let name = 'Contacts'
    this.manageUserService.FindImportColumns(name).subscribe((res: any) => {
      res.forEach((e:any) => {
        this.matchValue.push(e)
      })
    })
  }
  FindImportColumnsSites() {
    let name = 'Sites'
    this.manageUserService.FindImportColumns(name).subscribe((res: any) => {
      res.forEach((e:any) => {
        this.matchValue.push(e)
      })
    })
  }
  FindImportColumnsProducts() {
    let name = 'Products'
    this.manageUserService.FindImportColumns(name).subscribe((res: any) => {
      res.forEach((e:any) => {
        this.matchValue.push(e)
      })
    }) 
  }

  FindImportColumnsTransactions() {
    let name = 'Transactions'
    this.manageUserService.FindImportColumns(name).subscribe((res: any) => {
      res.forEach((e:any) => {
        this.matchValue.push(e)
      })
    })
  }
  FindImportColumnsEvents() {
    let name = 'Events'
    this.manageUserService.FindImportColumns(name).subscribe((res: any) => {
      res.forEach((e:any) => {
        this.matchValue.push(e)
      })
      res.tagColumns.forEach((e:any) => {
        this.matchValue.push(e)

      })
    })
  }

  selactdatatype(x:any,index:any) {
    this.conditionDropDownList = x.dataType
    this.dynamicGroupConditions().at(index).get('dataType')?.setValue(x.dataType)
  }

  getdataType(index:any){
    const value =this.dynamicGroupConditions().at(index).get('dataType')?.value
    return value
  }

  dynamicGroupConditions(): FormArray {
    return this.DynamicForm.get("dynamicGroupConditions") as FormArray
  }

  newFile(): FormGroup {
    return this.formBuilder.group({
      conditionDropDownList: this.type,
      conditionParameter: '',
      conditionComparison: '',
      value: '',
      dataType:'',
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
    if (event.value) { this.keywordlist.push(event.value); }
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
