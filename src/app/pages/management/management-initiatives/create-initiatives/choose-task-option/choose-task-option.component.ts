import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CreateTaskComponent } from '../../../manage-tasks/create-task/create-task.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ManageUsersService } from 'src/app/core/services/manage-users.service';
import { CreateMilestoneComponent } from '../../../manage-tasks/create-milestone/create-milestone.component';

@Component({
  selector: 'app-choose-task-option',
  templateUrl: './choose-task-option.component.html',
  styleUrls: ['./choose-task-option.component.scss']
})
export class ChooseTaskOptionComponent implements OnInit {
  Existingtask=false;
  listofTasks:any;
  taskForm: FormGroup;
  listofTasksdetails=[]
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<ChooseTaskOptionComponent>,
    private formBuilder: FormBuilder,
    private userService: ManageUsersService, 

  ) {

    this.taskForm = this.formBuilder.group({
      taskLink: [''],
    })
   }

  ngOnInit(): void {
    console.log(this.data.data)
    console.log(this.data)
    this.listofTasks=this.data.data
  }



  radioChange(value:any) {
    if (value == 'Task') {
      this.createNewTask('','Create-task-initiatives')
    }else if (value == 'Milestone') {
      this.createNewMilestone('','Create-task-initiatives')
    } else if (value == 'Existing') {
         this.Existingtask=!this.Existingtask
    }else if(value=='template'){
      
    }
  }



  createNewMilestone(data:any,type:any){
    const dialogRef = this.dialog.open(CreateMilestoneComponent, {
      disableClose: true,
      data: { data: data,initiative:this.data.initiative, type:type  },
      width: '500px'
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if(result) {
        console.log(result)
        this.dialogRef.close([result])
      } 
    })
  }
  createNewTask(data:any,type:any){
    const dialogRef = this.dialog.open(CreateTaskComponent, {
      disableClose: true,
      data: { data: data,initiative:this.data.initiative, type:type  },
      width: '500px'
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if(result) {
        this.dialogRef.close([result])
      } 
    })
  }


  onSubmit(){
    if(this.taskForm.value.taskLink.length!=0){
      this.dialogRef.close(this.taskForm.value.taskLink)
    }

  }




}
