import { Component, Inject, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { ManageUsersService } from 'src/app/core/services/manage-users.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { User } from 'src/app/core/models/user.model';

@Component({
  selector: 'app-automation-actions-list',
  templateUrl: './automation-actions-list.component.html',
  styleUrls: ['./automation-actions-list.component.scss']
})
export class AutomationActionsListComponent implements OnInit {
  userDetails: any;
  tabnumber: number = 0
  Form: FormGroup;
  Form1: FormGroup;
  Form2: FormGroup;
  createplan: boolean = true
  scenarios: boolean = true
  Actions: boolean = true
  screnType = ''
  managementType = ['Users', 'Contacts', 'Sites', 'Products', 'Transactions'];
  timeOptions: string[] = ['Seconds', 'Minutes', 'Hours', 'Days', 'Weeks'];
  dayOccurrence = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday' ]
  ContactsValue: any[] = []
  ProductsValue: any[] = []
  SitesValue: any[] = []
  UsersValue: any[] = []
  EventsValue: any[] = []
  TransationValue: any[] = []
  stringoptions = [{ v1: '=', v2: 'equal' }, { v1: '!=', v2: 'not equal' }];
  numberoptions = [{ v1: '=', v2: 'equal' }, { v1: '!=', v2: 'not equal' }, { v1: '>', v2: 'greater than' }, { v1: '=>', v2: 'greater than or equal' }, { v1: '<', v2: 'less than ' }]
  textoptions = [{ v1: '=', v2: 'equal' }, { v1: '!=', v2: 'not equal' }]
  booleanoptions = [{ v1: '=', v2: 'equal' }]
  AllOption = [{ v1: '=', v2: 'equal' }, { v1: '!=', v2: 'not equal' }, { v1: '>', v2: 'greater than' },
  { v1: '<', v2: 'less than ' }, { v1: '=>', v2: 'greater than or equal' }, { v1: '<=', v2: 'less than or equal' }];
  // auto chip for keyword
  separatorKeysCodes: number[] = [ENTER, COMMA];
  keywordlist: string[] = [];
  entityvalue = 'Events' 
  maxValue: number = 60;
  selectedWaitDelay: string | undefined;

  constructor(
    private matDialogRef: MatDialogRef<AutomationActionsListComponent>,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private manageUserService: ManageUsersService,
    private authService: AuthService,
  ) {
    this.Form = this.formBuilder.group({
      Description: [''],
      Active: [true],
      Name: ['', [Validators.required]],
      Trigger: [null, [Validators.required]],
      dateTime: [''],
      waitDelay: [''],
      every: [''],
      dayOccur: [''],
      keyword:[''],
      Conditions1: this.formBuilder.array([])
    });
    this.Addcondition()
    this.Form1 = this.formBuilder.group({
      Description: [''],
      Active: [true],
      Name: ['', [Validators.required]],
      Trigger: [null, [Validators.required]],
      dateTime: [''],
      waitDelay: [''],
      every: [''],
      dayOccur: [''],
      keyword:[''],
      Conditions: this.formBuilder.array([])
    });
    this.Addcondictuon()
    this.Form2 = this.formBuilder.group({
      Active: [true],
      Name: ['', [Validators.required]],
      Description: [''],
      Entity: [''],
      Endponits: [''],
      keywords:['']
  
    });
  }
  Conditions(): FormArray {
    return this.Form1.get("Conditions") as FormArray
  }

  Conditions1(): FormArray {
    return this.Form.get("Conditions1") as FormArray
  }

  newFile(): FormGroup {
    return this.formBuilder.group({
      condition: [""],
      Comparison: [""],
      value: [''],
      isTag: [''],
      dataType: '',
    })
  }

  Addcondition(){
    this.Conditions1().push(this.newFile())
  }

  Removecondition(i: number) {
    this.Conditions1().removeAt(i);
  }

  Addcondictuon() {
    this.Conditions().push(this.newFile());
  }
  Removecondictuon(i: number) {
    this.Conditions().removeAt(i);
  }
  ngOnInit(): void {
    console.log(this.data)
    this.createplan = this.data.plancreate
    this.Actions = this.data.Actions
    this.screnType = this.data.type
    this.getAllColoumns();

    this.authService.getCurrentUser().subscribe((data) => {
      if (data) {
        this.userDetails = data;
      }
    });
  }

  getentityvalue() {
    return this.Form.get('Trigger')?.value
  }

  getentityvalue1() {
    return this.Form1.get('Trigger')?.value
  }

  getdataType(index:number) {
    const value = this.Conditions().at(index).get('dataType')?.value
    return value
  }

  getdataType1(index:number) {
    const value = this.Conditions1().at(index).get('dataType')?.value
    return value
  }
  
  Submit() {
    const data = {
      color: 'green',
      data: this.Form?.value,
      type: 'CreatePlan'
    }
    this.matDialogRef.close(data)
    console.log(this.Form?.value)

  }
  submit1() {
    const data = {
      color: 'Yellow',
      data: this.Form1?.value,
      type: 'CreateContiction'
    }
    this.matDialogRef.close(data)
    console.log(this.Form1?.value)
  }

  submit2() {
    const data = {
      color: 'blue',
      data: this.Form2?.value,
      type: 'CreateAction'
    }
    this.matDialogRef.close(data)
  }

  tabChange(tabIndex: number): void {
    this.tabnumber = tabIndex;
  }







  Deleteaction(value:any) {
    console.log(value)
  }




  updateValidation(event:any) {
    if (event === 'Seconds' || event === 'Minutes') {
      this.maxValue = 60;
      this.Form.get('every')?.setValue('60');
      this.Form1.get('every')?.setValue('60');
    } else if (event === 'Hours') {
      this.maxValue = 24;
      this.Form.get('every')?.setValue('24');
      this.Form1.get('every')?.setValue('24');
    } else {
      this.maxValue = Infinity;
    }
    
  }


  onInputChange(event: Event) {
    const inputValue = (event.target as HTMLInputElement)?.valueAsNumber;
    // if (this.maxValue === 60 && inputValue > 60) {
    //   (event.target as HTMLInputElement)?.value = '60'; 
    // }
    // if (this.maxValue === 24 && inputValue > 24) {
    //   (event.target as HTMLInputElement)?.value = '24'; 
    // }
  }


  // ---------------- 
  // auto chip for keyword 
  // ----------- 
  add(event: MatChipInputEvent) {
    const value = (event?.value || '').trim();
    if (value) { this.keywordlist.push(value); }
    // Clear the input value
    // event.input?.value = ''

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

getAllColoumns() {
  this.FindImportColumnsUsers()
  this.FindImportColumnsContacts()
  this.FindImportColumnsSites()
  this.FindImportColumnsProducts()
  this.FindImportColumnsTransactions()
  this.FindImportColumnsEvents()
}


  FindImportColumnsUsers() {
    let name = 'Users'
    this.manageUserService.FindParameters(name, false).subscribe((res: any) => {
      res.forEach((e: any) => {
        this.UsersValue.push(e)
      })
    })
  }

  FindImportColumnsContacts() {
    let name = 'Contacts'
    this.manageUserService.FindParameters(name, false).subscribe((res: any) => {
      res.forEach((e: any) => {
        this.ContactsValue.push(e)
      })
    })
  }
  FindImportColumnsSites() {
    let name = 'Sites'
    this.manageUserService.FindParameters(name, false).subscribe((res: any) => {
      res.forEach((e: any) => {
        this.SitesValue.push(e)
      })
    })
  }
  FindImportColumnsProducts() {
    let name = 'Products'
    this.manageUserService.FindParameters(name, false).subscribe((res: any) => {
      res.forEach((e: any) => {
        this.ProductsValue.push(e)
      })
    })
  }

  FindImportColumnsTransactions() {
    let name = 'Transactions'
    this.manageUserService.FindParameters(name, false).subscribe((res: any) => {
      res.forEach((e: any) => {
        this.TransationValue.push(e)
      })
    })
  }
  FindImportColumnsEvents() {
    let name = 'Events'
    this.manageUserService.FindParameters(name, false).subscribe((res: any) => {
      res.forEach((e: any) => {
        this.EventsValue.push(e)
      })
    })
  }

}
