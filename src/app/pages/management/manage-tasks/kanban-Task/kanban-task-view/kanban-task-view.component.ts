import { Component, Input, OnInit, PipeTransform } from '@angular/core';
import { KanbanCard } from '../kanban-task-view/model/kanban-card.model';
import {CdkDragDrop,moveItemInArray,transferArrayItem,
} from '@angular/cdk/drag-drop';
import { Board } from '../kanban-task-view/model/board.model';
import { Column } from '../kanban-task-view/model/column.model';
import { KanbanService } from './service/kanban.service';

@Component({
  selector: 'app-kanban-task-view',
  templateUrl: './kanban-task-view.component.html',
  styleUrls: ['./kanban-task-view.component.scss']
})

export class KanbanTaskViewComponent implements OnInit,PipeTransform {

  @Input() taskcardview: any=[];


  constructor(private kanbanDataService: KanbanService) {}
//   tasks1=[
//     {id: '2',
//     title: 'Task-2',
//     description: 'Description for Task 1',
//     budget:30,
//     status:'Assigned',
//     endDate:new Date(),
//     creatorFirstName:'siva',
//     creatorLastName:'Kumar ',
//     progress:20,
//     Milestone:false,
//     Duration:'4h 30mins',
//     Category:'Demo-leve-2',
//     bgcolor:'black',
//     color:'white',
//     isExpired:true,
//     isThreeDaysLeft:false,
//     isApproved:false,
//     Criticity:'Mandatory',
//     getKeywords:['test1','test2','test3']
//   },
//   {id: '2',
//   title: 'Task-2',
//   description: 'Description for Task 1',
//   budget:30,
//   status:'Failed',
//   endDate:new Date(),
//   creatorFirstName:'Ram',
//   creatorLastName:'Kumar ',
//   progress:40,
//   Milestone:true,
//   Category:'Demo-leve-1',
//   bgcolor:'blue',
//   color:'white',
//   isExpired:false,
//   isThreeDaysLeft:false,
//   isApproved:false,
//   Criticity:'Less Important',
//   getKeywords:['test1','test2','test3']
// }
//   ] 
//   tasks2=[
//     {id: '6',
//       title: 'Task-6',
//       description: 'Description for Task 1',
//       budget:20,
//       status:'Completed',
//       endDate:new Date(),
//       creatorFirstName:'siva',
//       creatorLastName:'Ram ',
//       progress:90,
//       Milestone:true,
//       Category:'Demo-leve-3',
//       bgcolor:'red',
//       color:'white',
//       isExpired:false,
//       isThreeDaysLeft:true,
//       isApproved:false,
//       Criticity:'Mandatory',
//       getKeywords:['test1','test2','test3']
//     },
//     {id: '7',
//     title: 'Task-7',
//     description: 'Description for Task 1',
//     budget:30,
//     status:'Assigned',
//     endDate:new Date(),
//     creatorFirstName:'siva',
//     creatorLastName:'Kumar ',
//     progress:60,
//     Milestone:false,
//     Duration:'4h 30mins',
//     Category:'Demo-leve-2',
//     bgcolor:'black',
//     color:'white',
//     isExpired:true,
//     isThreeDaysLeft:false,
//     isApproved:true,
//     Criticity:'Mandatory',
//     getKeywords:['test1','test2','test3']
//   },
//   ]
  ngOnInit() {
    // console.log(this.taskcardview)
    // this.taskcardview = new Board('Test Board', [
    //   new Column('In Progress', '32', this.tasks1),
    //   new Column('Done', '33', this.tasks2),
    // ]);

  }

  deleteCard(cardId: string) {}

  editCard(card: KanbanCard) {}
  transform(value: any, ...args: any[]) {
    if (typeof (value) == 'number') {
      let ammount = value.toLocaleString("en-US", { style: "currency", currency: "USD", });
      let ammount1 = ammount.replace(/,/g, ' ')
      let ammount2 = ammount1.replace('$', ' ')
      let ammount3 = ammount2.replace('.00', ' ')
      let ammount4 = ammount3 + ' ' + '€'
      return ammount4.toString()
    } else {
      return value
    }
  } 
  public dropGrid(event: CdkDragDrop<[]>) {
    moveItemInArray(
      this.taskcardview.columns,
      event.previousIndex,
      event.currentIndex
    );
  }

  public drop(event: CdkDragDrop<[]>) {
    if (event.previousContainer == event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex 
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }

  getTotalAMount(data:any) {
    console.log("cardddettaill", data)
    var totalAmount = 0;
    data.forEach((element:any) => {
      totalAmount = totalAmount + element.budget
    });
    return   this.transform(totalAmount);
  }




  getTotalInitiative(data:any) {
    var value=0
    data.forEach((element:any) => {
      if(element.isMilesStone==false){
        value=value+1
      }
    });
    return value
  }
  getTotalMilestone(data:any) {
    var value=0
    data.forEach((element:any) => {
      if(element.isMilesStone==true){
        value=value+1
      }
    });
    return value
  }

  getfirstTenCharacters(value:any){
    if(value.length > 30) {
      let firstTenCharacters = value.slice(0, 30);
      return firstTenCharacters +'...'
    } else {
      return value
    }
    
  }


}

