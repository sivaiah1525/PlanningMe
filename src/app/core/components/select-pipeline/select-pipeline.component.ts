import { Component, Inject, OnInit } from '@angular/core';
import { ManageUsersService } from '../../services/manage-users.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-select-pipeline',
  templateUrl: './select-pipeline.component.html',
  styleUrls: ['./select-pipeline.component.scss']
})
export class SelectPipelineComponent implements OnInit {
listofFindPipelines:any;
initiativeForm!: FormGroup; 
taskForm!: FormGroup; 
screenType=''
  filteredusers: any;
  users$: any;
  Condition :any= [{ v1: '=', v2: 'equal' }, { v1: '!=', v2: 'not equal' }, { v1: '>', v2: 'greater than' }, { v1: '=>', v2: 'greater than or equal' },{ v1: '<', v2: 'less than' }, { v1: '<=', v2: 'less than or equal' }];
  stepName: any;
  constructor(
    private userService: ManageUsersService, 
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<SelectPipelineComponent>,
    @Inject(MAT_DIALOG_DATA) public row: any,
  ) {
    this.initiativeForm = this.formBuilder.group({
      Title: [null],
      StartDate: [null], 
      EndDate: [null],
      budget:[null],
      CurrencyId:[null],
      InitiativeStatus:[null],
      IsPublic:this.row.type == 'initiativeKanbanscreen' ? [false] : [true],
      IsPrivate:[false],
      Condition: [],
      Keywords: [''],
      StepIds: [],
      PipelineId: [this.row?.selectedOption],
      TotalBudget: [null],
      ConditionForTotalBudget: [],
      LinkedUserIds: [null]
    });
    this.taskForm = this.formBuilder.group({ 
      AdvancedSearch: [null],
      Title: [null],
      StartDate: [null],
      EndDate: [null],
      Hours: [null],
      Minutes: [null],
      IsPredecessortask:[false],
      IsSuccessortask:[false],
      Status:[null],
      IsPublic: this.row.type == 'taskKanbanScreen' ? [false] : [true],
      IsPrivate:[false],
      UsersId:[null],
      Ischild:[false],
      Isparent:[false],
      Condition: [],
      Keywords: [''],
      StepIds: [],
      PipelineId: [this.row?.selectedOption]
    });
   }

  ngOnInit(): void {
    console.log(this.row)
    this.screenType=this.row.type
    if(this.screenType=='taskScreen'){
      this.taskForm.get('AdvancedSearch')?.setValue('Tasks');
    }
    
    this.getallusers()
    this.getStepsByPipeLineId()
  }

  getStepsByPipeLineId () {
    this.stepName = this.row.stepsByPipe
  }


  getallusers(){
    // get all users
    this.userService.findAllUsersDropdown().subscribe((result) => {
      if (result) {
        this.users$ = result;
        this.filteredusers = result;
      }
    });
  } 



  filterOptions(value: string, type: string): void {
    console.log(type);
      this.filteredusers = this.users$.filter((option:any) =>
        option.firstName.toLowerCase().includes(value.toLowerCase())
      );
  }


  submit(){
    
    if(this.screenType=='taskScreen' || this.screenType=='taskKanbanScreen'){
      this.dialogRef.close(this.taskForm.value)
    }else if(this.screenType=='initiativescreen' || this.screenType=='initiativeKanbanscreen'){
      this.dialogRef.close(this.initiativeForm.value)
    }
  }




}
