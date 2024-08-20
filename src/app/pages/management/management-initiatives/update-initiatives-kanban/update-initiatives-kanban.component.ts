import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CalendarService } from 'src/app/core/services/calendar.service';
import { ManageUsersService } from 'src/app/core/services/manage-users.service';
import { ChooseTaskOptionComponent } from '../create-initiatives/choose-task-option/choose-task-option.component';
import { CreateTaskComponent } from '../../manage-tasks/create-task/create-task.component';
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'app-update-initiatives-kanban',
  templateUrl: './update-initiatives-kanban.component.html',
  styleUrls: ['./update-initiatives-kanban.component.scss']
})
export class UpdateInitiativesKanbanComponent implements OnInit {
  taskForm: FormGroup;
  listofSteps: any;
  constructor(
    private dialogRef: MatDialogRef<UpdateInitiativesKanbanComponent>,
    private userService: ManageUsersService,
    public datepipe: DatePipe,
    private calendarService: CalendarService,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { 

    this.taskForm = this.formBuilder.group({
      pipelineID: [null],
      Pipelinename: [null],
      Allsteps: this.formBuilder.array([]),
    });
  }

  ngOnInit(): void {
    console.log(this.data)
    console.log(this.data.data.data)
    this.taskForm.get('pipelineID')?.setValue(this.data.data.id)
    this.onSelectionChange(this.data.data)
  }

    // allsteps 
    getAllsteps(): FormArray {
      return this.taskForm.get("Allsteps") as FormArray
    }
    newsteps(): FormGroup {
      return this.formBuilder.group({
        name: [''],
        id: [''],
        taskmodule: this.formBuilder.array([]),
      })
    }
    Addsteps() {
      this.getAllsteps().push(this.newsteps());
    }
    Removesteps(i: number) {
      this.getAllsteps().removeAt(i);
    }
    getsteptaskmodule(i:number) {
      return this.getAllsteps().at(i).get("taskmodule") as FormArray
    }
  
    addtaskforstep(i:number) {
      this.getsteptaskmodule(i).push(this.newtask())
    }

    getstepinsidetaskIsMileStone(i:number,k:number){
      return this.getsteptaskmodule(i).at(k).get('IsMileStone')?.value
    }

    
  newtask(): FormGroup {
    return this.formBuilder.group({
      Title: ['', [Validators.required]],
      IsPublic:[true],
      StartDate: [''],
      EndDate: [''],
      CriticityId: [3],
      id: [],
      UserId: [''],
      CategoryId: [131],
      Isparent: [true],
      Period: [0],
      Hours: [''],
      Minutes: [''],
      Address: [''],
      Zipcode: [''],
      City: [''],
      Country: [''],
      latitude: [0],
      longitude: [0],
      Description: [''],
      keyword: [''],
      IsTemplate: false,
      UserGroupsId: ['' || []],
      ContactId: [''],
      SelactCountry: ['France'],
      ContactGroupsId: ['' || []],
      SiteId: [''],
      Addtages:[''],
      HasStep:[true],
      PipeLinetype:['2'],
      StepsViewModel: this.formBuilder.array([]),
      pipelineID:[],
      Pipelinename:[],
      IsSavePipeline:[false],
      Stage:[],
      initiatives:[''],
      ListofSuccessor:[''],
      ListofPredecessor:[''],
      IsMileStone:[false]
    })
  }


  
  onSelectionChange(data:any) {
    data.forEach((element:any, index:number) => {
      this.Addsteps()
      this.getAllsteps().at(index).get('name')?.setValue(element.stepName)
      this.getAllsteps().at(index).get('id')?.setValue(element.step)
      if(element.initiatives.length!=0){
        
      }
    });
  }

  FindTaskOfInitiativeS(id:number,stepid:number,index:number){

  }


  ChooseTaskOption(i:number) {
    const ChooseTaskOption = this.dialog.open(ChooseTaskOptionComponent, {
      width: '400px',
      autoFocus: false,
      data: { data: '',type:'add-sub-task' },
      disableClose: true
    });
    ChooseTaskOption.afterClosed().subscribe((result: any) => {
      if (result) {
        this.addtaskforstep(i)
        this.getandsettaskdetails(i, result)
      }
    })
  }

// edittask 
edittask(i:number, m:number,type?:any) {
  var data:any = this.getsteptaskmodule(i).at(m)
  console.log(data)
  const dialogRef = this.dialog.open(CreateTaskComponent, {
    disableClose: true,
    data: { data: data.value, type:type?type:'edit-task-initiatives' },
    width: '500px'
  });

  dialogRef.afterClosed().subscribe((result: any) => {
    if (result) {
      console.log(result)
        this.getsteptaskmodule(i).at(m).get('Title')?.setValue(result?.Title)
        this.getsteptaskmodule(i).at(m).get('IsPublic')?.setValue(result?.IsPublic)
        this.getsteptaskmodule(i).at(m).get('StartDate')?.setValue(result?.StartDate)
        this.getsteptaskmodule(i).at(m).get('EndDate')?.setValue(result?.EndDate)
        this.getsteptaskmodule(i).at(m).get('CriticityId')?.setValue(result?.CriticityId)
        this.getsteptaskmodule(i).at(m).get('id')?.setValue(result?.id)
        this.getsteptaskmodule(i).at(m).get('UserId')?.setValue(result?.UserId)
        this.getsteptaskmodule(i).at(m).get('CategoryId')?.setValue(result?.CategoryId)
        this.getsteptaskmodule(i).at(m).get('Isparent')?.setValue(result?.Isparent)
        this.getsteptaskmodule(i).at(m).get('Period')?.setValue(result?.Period)
        this.getsteptaskmodule(i).at(m).get('Hours')?.setValue(result?.Hours)
        this.getsteptaskmodule(i).at(m).get('Minutes')?.setValue(result?.Minutes)
        this.getsteptaskmodule(i).at(m).get('Address')?.setValue(result?.Address)
        this.getsteptaskmodule(i).at(m).get('Zipcode')?.setValue(result?.ZipCode)
        this.getsteptaskmodule(i).at(m).get('City')?.setValue(result?.City)
        this.getsteptaskmodule(i).at(m).get('Country')?.setValue(result?.Country)
        this.getsteptaskmodule(i).at(m).get('latitude')?.setValue(result?.latitude)
        this.getsteptaskmodule(i).at(m).get('longitude')?.setValue(result?.longitude)
        this.getsteptaskmodule(i).at(m).get('Description')?.setValue(result?.Description)
        this.getsteptaskmodule(i).at(m).get('keyword')?.setValue(result?.keyword.toString())
        this.getsteptaskmodule(i).at(m).get('IsTemplate')?.setValue(result?.IsTemplate)
        this.getsteptaskmodule(i).at(m).get('UserGroupsId')?.setValue(result?.UserGroupsId)
        this.getsteptaskmodule(i).at(m).get('ContactId')?.setValue(result?.ContactId)
        this.getsteptaskmodule(i).at(m).get('SelactCountry')?.setValue(result?.SelactCountry)
        this.getsteptaskmodule(i).at(m).get('ContactGroupsId')?.setValue(result?.ContactGroupsId)
        this.getsteptaskmodule(i).at(m).get('HasStep')?.setValue(result?.HasStep)
        this.getsteptaskmodule(i).at(m).get('PipeLinetype')?.setValue(result?.PipeLinetype)
        this.getsteptaskmodule(i).at(m).get('StepsViewModel')?.setValue(result?.AddSteps)
        this.getsteptaskmodule(i).at(m).get('pipelineID')?.setValue(result?.pipelineID)
        this.getsteptaskmodule(i).at(m).get('Pipelinename')?.setValue(result?.Pipelinename)
        this.getsteptaskmodule(i).at(m).get('Stage')?.setValue(result?.Stage)
        this.getsteptaskmodule(i).at(m).get('initiatives')?.setValue(result?.initiatives)
        this.getsteptaskmodule(i).at(m).get('ListofSuccessor')?.setValue(result?.ListofSuccessor)
        this.getsteptaskmodule(i).at(m).get('ListofPredecessor')?.setValue(result?.ListofPredecessor)
        this.getsteptaskmodule(i).at(m).get('IsMileStone')?.setValue(result?.IsMileStone)
        this.getsteptaskmodule(i).at(m).get('Addtages')?.setValue(result?.Addtages)

        if(result?.HasStep==true){
          if(result?.PipeLinetype=='1'){
           this.getsteptaskmodule(i).at(m).get('IsSavePipeline')?.setValue(true)
          }else{
           this.getsteptaskmodule(i).at(m).get('IsSavePipeline')?.setValue(false)
          }
        }else{
         this.getsteptaskmodule(i).at(m).get('IsSavePipeline')?.setValue(false)
        }
    }
  })
}








  getandsettaskdetails(i:number, result:any) {
    this.getsteptaskmodule(i).at(this.getsteptaskmodule(i).value.length - 1).get('Title')?.setValue(result?.Title)
    this.getsteptaskmodule(i).at(this.getsteptaskmodule(i).value.length - 1).get('IsPublic')?.setValue(result?.IsPublic)
    this.getsteptaskmodule(i).at(this.getsteptaskmodule(i).value.length - 1).get('StartDate')?.setValue(result?.StartDate)
    this.getsteptaskmodule(i).at(this.getsteptaskmodule(i).value.length - 1).get('EndDate')?.setValue(result?.EndDate)
    this.getsteptaskmodule(i).at(this.getsteptaskmodule(i).value.length - 1).get('CriticityId')?.setValue(result?.CriticityId)
    this.getsteptaskmodule(i).at(this.getsteptaskmodule(i).value.length - 1).get('id')?.setValue(result?.id)
    this.getsteptaskmodule(i).at(this.getsteptaskmodule(i).value.length - 1).get('UserId')?.setValue(result?.UserId)
    this.getsteptaskmodule(i).at(this.getsteptaskmodule(i).value.length - 1).get('CategoryId')?.setValue(result?.CategoryId)
    this.getsteptaskmodule(i).at(this.getsteptaskmodule(i).value.length - 1).get('Isparent')?.setValue(result?.Isparent)
    this.getsteptaskmodule(i).at(this.getsteptaskmodule(i).value.length - 1).get('Period')?.setValue(result?.Period)
    this.getsteptaskmodule(i).at(this.getsteptaskmodule(i).value.length - 1).get('Hours')?.setValue(result?.Hours)
    this.getsteptaskmodule(i).at(this.getsteptaskmodule(i).value.length - 1).get('Minutes')?.setValue(result?.Minutes)
    this.getsteptaskmodule(i).at(this.getsteptaskmodule(i).value.length - 1).get('Address')?.setValue(result?.Address)
    this.getsteptaskmodule(i).at(this.getsteptaskmodule(i).value.length - 1).get('Zipcode')?.setValue(result?.ZipCode)
    this.getsteptaskmodule(i).at(this.getsteptaskmodule(i).value.length - 1).get('City')?.setValue(result?.City)
    this.getsteptaskmodule(i).at(this.getsteptaskmodule(i).value.length - 1).get('Country')?.setValue(result?.Country)
    this.getsteptaskmodule(i).at(this.getsteptaskmodule(i).value.length - 1).get('latitude')?.setValue(result?.latitude)
    this.getsteptaskmodule(i).at(this.getsteptaskmodule(i).value.length - 1).get('longitude')?.setValue(result?.longitude)
    this.getsteptaskmodule(i).at(this.getsteptaskmodule(i).value.length - 1).get('Description')?.setValue(result?.Description)
    this.getsteptaskmodule(i).at(this.getsteptaskmodule(i).value.length - 1).get('keyword')?.setValue(result?.keyword.toString())
    this.getsteptaskmodule(i).at(this.getsteptaskmodule(i).value.length - 1).get('IsTemplate')?.setValue(result?.IsTemplate)
    this.getsteptaskmodule(i).at(this.getsteptaskmodule(i).value.length - 1).get('UserGroupsId')?.setValue(result?.UserGroupsId)
    this.getsteptaskmodule(i).at(this.getsteptaskmodule(i).value.length - 1).get('ContactId')?.setValue(result?.ContactId)
    this.getsteptaskmodule(i).at(this.getsteptaskmodule(i).value.length - 1).get('SelactCountry')?.setValue(result?.SelactCountry)
    this.getsteptaskmodule(i).at(this.getsteptaskmodule(i).value.length - 1).get('ContactGroupsId')?.setValue(result?.ContactGroupsId)
    this.getsteptaskmodule(i).at(this.getsteptaskmodule(i).value.length - 1).get('SiteId')?.setValue(result?.SiteId)
    this.getsteptaskmodule(i).at(this.getsteptaskmodule(i).value.length - 1).get('HasStep')?.setValue(result?.HasStep)
    this.getsteptaskmodule(i).at(this.getsteptaskmodule(i).value.length - 1).get('PipeLinetype')?.setValue(result?.PipeLinetype)
    this.getsteptaskmodule(i).at(this.getsteptaskmodule(i).value.length - 1).get('StepsViewModel')?.setValue(result?.AddSteps)
    this.getsteptaskmodule(i).at(this.getsteptaskmodule(i).value.length - 1).get('pipelineID')?.setValue(result?.pipelineID)
    this.getsteptaskmodule(i).at(this.getsteptaskmodule(i).value.length - 1).get('Pipelinename')?.setValue(result?.Pipelinename)
    this.getsteptaskmodule(i).at(this.getsteptaskmodule(i).value.length - 1).get('Stage')?.setValue(result?.Stage)
    this.getsteptaskmodule(i).at(this.getsteptaskmodule(i).value.length - 1).get('initiatives')?.setValue(result?.initiatives)
    this.getsteptaskmodule(i).at(this.getsteptaskmodule(i).value.length - 1).get('ListofSuccessor')?.setValue(result?.ListofSuccessor)
    this.getsteptaskmodule(i).at(this.getsteptaskmodule(i).value.length - 1).get('ListofPredecessor')?.setValue(result?.ListofPredecessor)
    this.getsteptaskmodule(i).at(this.getsteptaskmodule(i).value.length - 1).get('IsMileStone')?.setValue(result?.IsMileStone)
    this.getsteptaskmodule(i).at(this.getsteptaskmodule(i).value.length - 1).get('Addtages')?.setValue(result?.Addtages)
    if(result?.HasStep==true){
      if(result?.PipeLinetype=='1'){
        this.getsteptaskmodule(i).at(this.getsteptaskmodule(i).value.length - 1).get('IsSavePipeline')?.setValue(true)
      }else{
        this.getsteptaskmodule(i).at(this.getsteptaskmodule(i).value.length - 1).get('IsSavePipeline')?.setValue(false)
      }
    }else{
      this.getsteptaskmodule(i).at(this.getsteptaskmodule(i).value.length - 1).get('IsSavePipeline')?.setValue(false)
    }
  }











  Applyinitiative(){

  }

}
