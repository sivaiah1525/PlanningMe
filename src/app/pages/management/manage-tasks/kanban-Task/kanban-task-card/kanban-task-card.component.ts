import { Component, Input, Output, EventEmitter, OnInit, PipeTransform } from '@angular/core';
import { KanbanCard } from '../kanban-task-view/model/kanban-card.model';
import { MatDialog } from '@angular/material/dialog';
import { ViewTaskComponent } from '../../view-task/view-task.component';
import { ViewInitiativesComponent } from '../../../management-initiatives/view-initiatives/view-initiatives.component';
import { ManageUsersService } from 'src/app/core/services/manage-users.service';
import { TaskDependenciesComponent } from '../../manage-tasks/task-dependencies/task-dependencies.component';

@Component({
  selector: 'app-kanban-task-card',
  templateUrl: './kanban-task-card.component.html',
  styleUrls: ['./kanban-task-card.component.scss']
})
export class KanbanTaskCardComponent implements OnInit,PipeTransform{

  @Input() card: any;
  @Output() edit = new EventEmitter<KanbanCard>();
  @Output() delete = new EventEmitter<string>();
  progressValue =60;
  customColor = 'purple';
   progress: number = 60;
   radius: number = 40;  
  loader!: boolean;

   constructor(
    private dialog: MatDialog,
    private userService: ManageUsersService, 
    ) {

   }

 ngOnInit() {
  console.log("carddddd",this.card);
 }
  onEditClick(): void {
    this.edit.emit(this.card);
  }

  onDeleteClick(): void {
    this.delete.emit(this.card.id);
  }
  getStatusColorClass(status: string) {
    let value=''
    if (status == 'Not Started'||status=='NotAssigned') {
      value= 'Assign-color';
    }  else if (status == 'In Progress'||status=='Assigned') {
      value= 'InProgress-color';
    }  else if (status == 'Completed') {
      value= 'completed-color';
    }  else if (status == 'Canceled') {
      value= 'cancelled-color';
    } else if (status == 'Failed') {
      value= 'Failed-color';
    } 
    return value
  }

  getCriticityColorClass(status: string) {
    let value=''
    if (status == 'Mandatory'||status=='Mandatory') {
      value= 'Criticity-Medium';
    }  else if (status == 'Less Important'||status=='Less Important') {
      value= 'Criticity-low'; 
    } else if(status=='Important'){
      value= 'Criticity-Important'; 
    }
    return value
  }
   assignCssClass(progress: number): string {
    let cssClass = '';
    if (Number(progress) >= 0 && Number(progress) <= 20) {
      cssClass = 'color1-20';
    } else if (Number(progress) >= 21 && Number(progress) <= 50) {
      cssClass = 'color2-50';
    } else if (Number(progress) >= 51 && Number(progress) <= 80) {
      cssClass = 'color3-80';
    } else if (Number(progress) >= 81 && Number(progress) <= 90) {
      cssClass = 'color4-90';
    } else if (Number(progress) >= 100) {
      cssClass = 'color5-100';
    }
    return cssClass;
  }

  transform(value: any, ...args: any[]) {
    if (typeof (value) == 'number') {
      let ammount = value.toLocaleString("en-US", { style: "currency", currency: "USD", });
      let ammount1 = ammount.replace(/,/g, ' ')
      let ammount2 = ammount1.replace('$', ' ')
      let ammount3 = ammount2.replace('.00', ' ')
      let ammount4 = ammount3 
      return ammount4
    } else {
      return value
    }
  } 
 

  getKeywords(row:any){
    const data=row.split(',')
    console.log(data)
    return data
  }
  temformat(value:any) {
    const fractionalPart = Number(value) % 1;
    if (fractionalPart >= 0.5) {
      return Math.ceil(Number(value))+'%';
    } else if (value == 0) {
      return 0;
    } else {
      return Math.floor(Number(value))+'%';
    }
  }
  public circumference: number = 2 * Math.PI * this.radius;
  calculateDashoffset(progress:number) {
    const percent = progress > 100 ? 100 : progress < 0 ? 0 : progress;
    return this.circumference - (percent / 100) * this.circumference;
  }



  
  opentaskDialog(id:any) {
    this.dialog.open(ViewTaskComponent, {
      width: '500px',
      autoFocus: false,
      disableClose: true,
      data: id
    });
  }

  
  showinitiativesdetails(data:any) {
    const showInitiatives = this.dialog.open(ViewInitiativesComponent, {
      data: { data: data, },
      disableClose: true,
      width: '500px'
    });
    showInitiatives.afterClosed().subscribe(result => {
      if (result) {
        console.log(result);
      }
    });
  }

  getlinkedpredecessor(data:any,count:any){
    this.loader=true
    if(data.predecessorTaskcount!=0){
      this.userService.GetLinkedTasks(data.id,false,true).subscribe((result)=>{
        if(result){
          this.loader=false
          if(result.length==1){
            this.opentaskDialog(result[1].taskId)
          }else{
            this.showlistofsuccessorandpredecessor(result,'predecessor')
          }
        }
      },error=>{
        this.loader=false
      })
    }
  }

  getlinkedsuccessor(data:any,count:any){
    this.loader=true
    if(data.predecessorTaskcount!=0){
      this.userService.GetLinkedTasks(data.id,true,false).subscribe((result)=>{
        if(result){
          this.loader=false
          if(result.length==1){
            this.opentaskDialog(result[1].taskId)
          }else{
       this.showlistofsuccessorandpredecessor(result,'successor')
          }
        }
      },error=>{ 
        this.loader=false
      })
    }
  }
  showlistofsuccessorandpredecessor(data:any,type:any){
    const listofsuccessorandpredecessor = this.dialog.open(TaskDependenciesComponent, {
      width: '500px',
      panelClass: ['files'],
      data: {data:data,type:type},
      disableClose: false,
    });
    listofsuccessorandpredecessor.afterClosed().subscribe((result: any) => {
      if(result) {
        console.log(result)
        this.opentaskDialog(result)
      } 
    })
  } 
}