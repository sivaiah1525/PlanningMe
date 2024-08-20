import { Component, OnInit, TemplateRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { StrategyService } from 'src/app/core/services/strategy.service';
import { CreateStrategyComponent } from '../../../core/components/create-strategy/create-strategy.component';
import { PageEvent } from '@angular/material/paginator';
import { MatTabGroup } from '@angular/material/tabs';
import { MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';
import { MessageService } from 'src/app/core/services/message.service';
import { DeleteCommomComponent } from '../../commonForAll/delete-commom/delete-commom.component';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-strategy',
  templateUrl: './strategy.component.html',
  styleUrls: ['./strategy.component.scss'],
})
export class StrategyComponent implements OnInit {
  result: any;
  resultsplit: any;
  count: any;
  datadelete: any;
  id: any;
  // MatPaginator Inputs
  length: any;
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];

  // MatPaginator Output
  pageEvent!: PageEvent;


  //update
  selectedIndex = 0;
  disabled!: boolean;
  tabs!: MatTabGroup;

  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;
  name!: string;
  values1 :any= ["Event", "Transaction"];
  actions :any= ["Notification", "e-Mail"];
  values2 :any= [];
  selected = -1;
  selected1 = -1;
  selected2 = -1;
  events :any= [];
  type :any= [];
  radiovalue!: number;
  zipcode!: number;

  additionalFieldLines: any[] = [];
  lineCounter: number = 0;
  strategyarray: any[] = [];
  data: any;
  strtegycondition: any;
  editdata: any;
  formdata;
  formdata2: FormGroup;


  constructor(
    public dialog: MatDialog,
    private strategyservice: StrategyService,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private translate: TranslateService,
    ){
      if(localStorage.getItem('lang')){
        const lang:any=localStorage.getItem('lang')
        this.translate.use(lang);
      }else{
        this.translate.use('English');
      }    this.firstFormGroup = this.formBuilder.group({
      1: [this.radiovalue],
      Notification: ['' || false],
      Mail: ['' || false]
    });
    this.secondFormGroup = this.formBuilder.group({
      conditionDropDownList: [''],
      conditionParameter: [''],
      conditionComparison: [''],
      value: ['']

    });
    this.thirdFormGroup = this.formBuilder.group({
      nameOfStrategy: ['', Validators.required],
      description: ['', Validators.required]
    });
    this.formdata = this.formBuilder.group({
      Notification: ['' || false],
      Mail: ['' || false]
    });
    this.formdata2 = this.formBuilder.group({
      name: [''],
      description: ['']
    });


  }

  ngOnInit(): void {
    this.viewstrategy();

  }
  createStrategyDialog(): void {
    const createStrategyDialog = this.dialog.open(CreateStrategyComponent, {
      width: '600px',
      data: { screenType: 'CreateStrategy' },
      autoFocus: false,
      disableClose: true
    });
    createStrategyDialog.afterClosed().subscribe(result => {
      this.viewstrategy();
    });
  }

  viewstrategy() {
    this.strategyservice.strategy().subscribe((res) => {
      this.resultsplit = res.data;
      this.length = this.resultsplit.length;
      this.result = this.resultsplit.slice(0, 12);
      this.count = this.result.forEach((element:any) => {
        const countvalue = element.strategyCondition;

      });

    })
  }


  onPageChange($event:any) {
    const pg = $event.pageIndex * $event.pageSize;
    const mx = $event.pageIndex * $event.pageSize + $event.pageSize;
    this.result = this.resultsplit.slice(pg, mx);
  }

  closedialogbox() {
    this.dialog.closeAll();
  }

  deleteDialogConfirmation(data:any, type:any) {
    const deleteorder = this.dialog.open(DeleteCommomComponent, { data: { data, type: type } });
    deleteorder.afterClosed().subscribe((result: any) => {
      if (result) {
        this.viewstrategy();
      }
    })
  }


  //update screen
  editstratergy(r:any) {
    const editstratergy = this.dialog.open(CreateStrategyComponent, {
      width: '500px',
      autoFocus: false,
      data: { data: r, screenType: 'editstratergy' },
      disableClose: true,
      panelClass: 'custom-dialog-container'
    });

    editstratergy.afterClosed().subscribe(result => {
      this.viewstrategy()
    });

    // this.dialog.open(templateRef, { width: '600px' });
    // this.editdata = r
    // if (this.editdata.strategyTypeName === 'Event') {
    //   this.values2 = ["Events", "Users", "User group", "Contacts", "Contact group", "Sites", "Site group"];
    // }
    // else {
    //   this.values2 = ["Transaction", "Users", "User group", "Contacts", "Contact group", "Sites", "Site group"];
    // }
    // this.id = r.id;
    // this.formdata.patchValue({
    //   Notification: this.editdata.notification,
    //   Mail: this.editdata.sendAnEmail
    // });
    // this.thirdFormGroup.patchValue({
    //   nameOfStrategy: this.editdata.name,
    //   description: this.editdata.description
    // });
  }


  isSelected(index: number): boolean {
    if (this.selectedIndex === index) {
      return false;
    } else {
      return true;
    }
  }
  onNext(e: Event, index:number): void {
    this.selectedIndex = index;
    this.isSelected(index);
  }

  onchange(val: any) {
    this.radiovalue = val
    if (val == 1) {
      this.values2 = ["Events", "Users", "User group", "Contacts", "Contact group", "Sites", "Site group"];
    }
    else if (val == 2) {
      this.values2 = ["Transaction", "Users", "User group", "Contacts", "Contact group", "Sites", "Site group"];
    }
    else {
      this.values2 = [];
    }
  }

  secondtab(value: any) {
    if (value == 'Events') {
      this.events = ["Title", "city", "country", "zipcode", "criticlevel", "periodicity", "file"]
    }
    else if (value == 'Transaction') {

      this.events = ["Product name", "Product Id", "Measure", "Transaction type", "Price", "Comments", "Order Id", "Quantity", "Final Price"]
    }
    else if (value != 'Events' || value != 'Transaction') {

      this.events = ["Name"]
    }
  }

  checktype(v: any) {
    if (v === 'criticlevel' || v === 'Price' || v === 'Order Id' || v === 'Final Price') {
      this.type = [{ v1: '=', v2: 'equal' }, { v1: '!=', v2: 'not equal' }, { v1: '>', v2: 'greater than' }, { v1: '<', v2: 'less than ' }];
    }
    else {
      this.type = [{ v1: '=', v2: 'equal' }];
    }
  }

  getcheckdetails(e: Event, firstFormGroup:any) {
  }
  getconditiondetails(e: Event, index:number) {
    console.log(this.secondFormGroup.value);
    this.strategyarray.push(this.secondFormGroup.value)
    console.log(this.strategyarray, 'value')
  }

  test(e: Event, index:number, thirdFormGroup:any): void {
    this.selectedIndex = index;
    this.isSelected(index);
    const data = {
      "strategy": {
        "id": this.id,
        "name": thirdFormGroup.value.nameOfStrategy,
        "description": thirdFormGroup.value.description,
        "notification": this.firstFormGroup.value.Notification,
        "sendAnEmail": this.firstFormGroup.value.Mail,
        "strategyType": this.radiovalue
      },
      "strategyConditions": this.strategyarray
    }
    console.log(data);
    this.strategyservice.updatestratergy(data).subscribe((res) => {
      console.log(res, 'res');
      this.closedialogbox();
      this.messageService.showMessage(res['response'][0].message);
      this.viewstrategy();
    });
  }

  addAdditionalFieldLine() {
    this.additionalFieldLines.push(this.lineCounter++);
    console.log(this.secondFormGroup.value);
    this.strategyarray.push(this.secondFormGroup.value)
  }

  deleteAdditionalFieldLine(index: number) {
    this.additionalFieldLines.splice(index, 1);
  }

  viewstratergy(templateRef: TemplateRef<any>, r:any) {
    this.dialog.open(templateRef, {
      width: '600px'
    });
    console.log(r, 'r');
    this.data = r;
    this.data.strategyCondition.forEach((element:any) => {
      console.log(element, 'element')
      this.strtegycondition = element;
    });
  }

}
