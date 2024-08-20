import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { ManageContactsService } from 'src/app/core/services/manage-contacts.service';
import { TargetService } from 'src/app/core/services/target.service';

@Component({
  selector: 'app-advance-search-in-target',
  templateUrl: './advance-search-in-target.component.html',
  styleUrls: ['./advance-search-in-target.component.scss']
})
export class AdvanceSearchInTargetComponent implements OnInit {
  AdvanceSearchForm: FormGroup;
  // Statusvalue = ['Public', 'Private',   'Deligation' ]
  Statusvalue = [{ name: 'Public', icon: '' }]
  frequency!: string;
  monthsBool: boolean = false;
  max: any;
  min: any;
  availableYears: any[] = [];
  productTargetlength: any;
  targetOfCreatorNameList: any;
  EntityType!: string;
  Condition = [{ v1: '=', v2: 'equal' }, { v1: '!=', v2: 'not equal' }, { v1: '>', v2: 'greater than' }, { v1: '=>', v2: 'greater than or equal' },{ v1: '<', v2: 'less than' }, { v1: '<=', v2: 'less than or equal' }];
  Currency = [{ name: 'Euro', id: 1 }, { name: 'Dollar', id: 2 }]

  monthName :any=[
    { name: 'Jan', value: 'January' },
    { name: 'Feb', value: 'February' },
    { name: 'Mar', value: 'March' },
    { name: 'Apr', value: 'April' },
    { name: 'May', value: 'May' },
    { name: 'Jun', value: 'June' },
    { name: 'Jul', value: 'July' },
    { name: 'Aug', value: 'August' },
    { name: 'Sep', value: 'September' },
    { name: 'Oct', value: 'October' },
    { name: 'Nov', value: 'November' },
    { name: 'Dec', value: 'December' }
  ];
  KeywordsFromOrder = []
  // auto chip for keyword
  keywordlist: string[] = [];
  initialEntityValue:any;
  constructor(
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private manageContactsService: ManageContactsService,
    private matDialogRef: MatDialogRef<AdvanceSearchInTargetComponent>,
    private translate: TranslateService ,
    private targetService: TargetService,
  ) {
    if(localStorage.getItem('lang')){
      const lang:any=localStorage.getItem('lang')
      this.translate.use(lang);
    }else{
      this.translate.use('English');
    } 


  if (this.data.type === 'Users') {
    this.initialEntityValue = 1;
  } else if (this.data.type === 'Contacts') {
    this.initialEntityValue = 2;
  } else if (this.data.type === 'Sites') {
    this.initialEntityValue = 4;
  } else if (this.data.type === 'Products') {
    this.initialEntityValue = 3;
  } else {
    this.initialEntityValue = null;
  }


    this.AdvanceSearchForm = this.formBuilder.group({
      Entity: this.initialEntityValue,
      IsGroup: [false],
      StartDate: [],
      EndDate: [],
      Condition: [],
      IsPublic: [true],
      IsPrivate: [false],
      IsDelegate: [false],
      IsAchieved: [false],
      IsNotAchieved: [false],
      TargetType: [1],
      StatusOfTransaction:[3],
      ValueType: [],
      Value: [],
      Duration: ['']
    })
  }

  ngOnInit(): void {
    this.EntityType = this.data.type
    console.log(this.data)
    this.getYear()
    this.getCreatornameList()
    this.FindKeywordsFromOrder()
  }
  seletectdtransationstatus(event:any){
    this.AdvanceSearchForm.get('StatusOfTransaction')?.setValue(event.value)
    setTimeout(() => {
      this.FindKeywordsFromOrder()
    }, 10);
  }

  FindKeywordsFromOrder(){
    this.targetService.FindKeywordsFromOrder(this.AdvanceSearchForm.value.statusOfTransaction).subscribe((result:any)=>{
      if(result){
        this.KeywordsFromOrder=result
      }
    })
  }

  getYear() {
    this.max = new Date().getFullYear();
    this.min = this.max - 57;
    this.max = this.max + 1;
    this.availableYears = [];
    for (let i = this.min; i <= this.max; i++) {
      this.availableYears.push({
        id: i
      });
    }
  }

  advancesearchinTargetType(event:any) {
    const formArray: FormArray = this.AdvanceSearchForm.get('TargetTypeStatus') as FormArray;
    if (event.checked) {
      formArray.push(new FormControl(event.source.value));
    } else {
      let i: number = 0;
      formArray.controls.forEach((ctrl: any) => {
        if (ctrl.value == event.source.value) {
          // Remove the unselected element from the TransactionTypeId
          formArray.removeAt(i);
          return;
        }

        i++;
      });

    }
  }

  onTargetTypeChanged(event:any) {
    console.log(event)
    this.frequency = event
    if (event == 'Monthly') {
      this.getYear()
      this.monthsBool = true;
    } else {
      this.monthsBool = false;
      this.getYear()
    }
  }



  getCreatornameList() {
    this.manageContactsService.FindCreatorDropdownForTarget(this.EntityType).subscribe((result: any) => {
      if (result) {
        this.targetOfCreatorNameList = result
      }
    })
  }


  AdvanceSearch() {
    if(this.AdvanceSearchForm.value.IsGroup == true && this.data.type == 'Users') {
      this.initialEntityValue = 1
    } else if (this.AdvanceSearchForm.value.IsGroup == true && this.data.type == 'Conatcts') {
      this.initialEntityValue = 2
    } else if (this.AdvanceSearchForm.value.IsGroup == true && this.data.type == 'Sites') {
      this.initialEntityValue = 4
    } else if (this.AdvanceSearchForm.value.IsGroup == true && this.data.type == 'Products') {
      this.initialEntityValue = 3
    }

    this.AdvanceSearchForm.patchValue({
      Entity: this.initialEntityValue
  });
    console.log(this.AdvanceSearchForm.value)
    const result={
      data:this.AdvanceSearchForm.value,
      keywordlist:this.keywordlist
    }
    this.matDialogRef.close(result)
  }

  closedialogbox() {
    this.dialog.closeAll();
  }


   
  remove(value: string) {
    const index = this.keywordlist.indexOf(value);
    if (index >= 0) {
      this.keywordlist.splice(index, 1);
    }
  }

  Selectedkeywprd(value:any) {
    this.keywordlist.push(value)
  }

}
